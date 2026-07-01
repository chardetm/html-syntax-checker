import { Token, Lexer } from './lexer';
import { HTMLCheckerOptions, HTMLCheckerError, Language } from '../types';
import { getMessage } from './messages';
import { checkCssSyntax } from '../css/parser';
import {
  STANDARD_TAGS,
  VOID_TAGS,
  DEPRECATED_TAGS,
  REQUIRED_ATTRIBUTES,
  GLOBAL_STANDARD_ATTRIBUTES,
  ELEMENT_STANDARD_ATTRIBUTES,
  DEPRECATED_ATTRIBUTES
} from './htmlData';

const DEFAULT_OPTIONS: Required<HTMLCheckerOptions> = {
  allowedTags: null,
  forbiddenTags: null,
  allowDeprecatedTags: true,
  allowCustomTags: false,
  xhtmlSelfClosing: 'allowed',
  allowLowercaseTags: true,
  allowUppercaseTags: true,
  allowMixedcaseTags: false,
  forbiddenAttributes: [],
  forceRequiredAttributes: true,
  allowDeprecatedAttributes: true,
  allowCustomAttributes: false,
  allowLowercaseAttributes: true,
  allowUppercaseAttributes: true,
  allowMixedcaseAttributes: false,
  checkFullStructure: false,
  checkCharset: false,
  checkTitle: false,
  requireFormControlsInForm: false,
  requireLabelForInteractiveControls: false,
  requireRadioButtonNameConsistency: false,
  requireExplicitButtonType: false,
  requireSelectHasOption: false,
  cssOptions: {}
};

export function checkHtml(tokens: Token[], userOptions: HTMLCheckerOptions = {}, lang: Language = 'en'): HTMLCheckerError[] {
  const errors: HTMLCheckerError[] = [];
  const seenIds = new Map<string, { line: number }>();

  // Form rule tracking variables
  const formNameUsages: Array<{
    name: string;
    tag: string;
    type?: string;
    token: Token;
    attrToken: Token;
  }> = [];

  const interactiveControls: Array<{
    tag: string;
    nestedInLabel: boolean;
    id: string | null;
    token: Token;
  }> = [];

  const labelFors = new Set<string>();

  const radioButtons: Array<{
    name: string | null;
    token: Token;
  }> = [];

  const selectElements: Array<{
    token: Token;
    optionCount: number;
  }> = [];

  const activeSelectStack: Array<{
    token: Token;
    optionCount: number;
  }> = [];

  // 1. Validate Options Compatibility
  if (userOptions.allowedTags && userOptions.forbiddenTags) {
    throw new Error(getMessage.incompatibleOptions(lang));
  }

  // 2. Resolve default options
  const options: Required<HTMLCheckerOptions> = { ...DEFAULT_OPTIONS, ...userOptions };

  // 3. Collect lex errors
  for (const token of tokens) {
    if (token.type === 'LEX_ERROR') {
      errors.push({
        type: 'PARSE_ERROR',
        message: token.message,
        advice: token.advice,
        location: {
          start: token.start,
          end: token.end
        }
      });
    }
  }

  const validTokens = tokens.filter(t => t.type !== 'LEX_ERROR');

  // 4. Doctype check (for structure)
  if (options.checkFullStructure) {
    const nonTriviaTokens = validTokens.filter(
      t => t.type !== 'COMMENT' && (t.type !== 'TEXT' || t.value.trim() !== '')
    );

    const firstToken = nonTriviaTokens[0];
    if (!firstToken || firstToken.type !== 'DOCTYPE') {
      const { message, advice } = getMessage.missingDoctype(lang);
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice
      });
    } else {
      const rawDoc = firstToken.raw.trim().toLowerCase();
      const normalizedDoc = rawDoc.replace(/\s+/g, ' ');
      if (normalizedDoc !== '<!doctype html>') {
        const { message, advice } = getMessage.invalidDoctype(lang, firstToken.raw);
        errors.push({
          type: 'DOCUMENT_STRUCTURE',
          message,
          advice,
          location: {
            start: firstToken.start,
            end: firstToken.end
          }
        });
      }
    }

    // Check for multiple DOCTYPE declarations
    const doctypeTokens = validTokens.filter(t => t.type === 'DOCTYPE');
    if (doctypeTokens.length > 1) {
      for (let i = 1; i < doctypeTokens.length; i++) {
        const doctypeToken = doctypeTokens[i];
        const { message, advice } = getMessage.multipleDoctypes(lang);
        errors.push({
          type: 'DOCUMENT_STRUCTURE',
          message,
          advice,
          location: {
            start: doctypeToken.start,
            end: doctypeToken.end
          }
        });
      }
    }
  }

  // 5. Main validation pass
  const stack: Array<{ name: string; token: Token }> = [];

  let htmlStartCount = 0;
  let htmlCloseCount = 0;
  let headStartCount = 0;
  let headCloseCount = 0;
  let bodyStartCount = 0;
  let bodyCloseCount = 0;
  const bodyTokens: Token[] = [];
  const htmlTokens: Token[] = [];
  const headTokens: Token[] = [];

  let hasCharset = false;
  let hasTitle = false;
  let titleHasContent = false;

  for (let i = 0; i < validTokens.length; i++) {
    const token = validTokens[i];

    if (token.type === 'TAG_OPEN') {
      const name = token.name;
      const tagLower = name.toLowerCase();
      const isStandard = STANDARD_TAGS.has(tagLower);
      const isDeprecated = DEPRECATED_TAGS.has(tagLower);
      const isCustom = !isStandard && !isDeprecated;

      const insideHtml = stack.some(x => x.name.toLowerCase() === 'html');
      const insideHead = stack.some(x => x.name.toLowerCase() === 'head');
      const insideBody = stack.some(x => x.name.toLowerCase() === 'body');
      const insideSvg = stack.some(x => x.name.toLowerCase() === 'svg');
      const isSvgTag = tagLower === 'svg';

      // A. Structure placement checks
      if (options.checkFullStructure && !insideSvg) {
        if (tagLower === 'html') {
          htmlStartCount++;
          htmlTokens.push(token);
        } else if (tagLower === 'head') {
          headStartCount++;
          headTokens.push(token);
          if (!insideHtml) {
            const { message, advice } = getMessage.headOutsideHtml(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
          if (insideBody) {
            const { message, advice } = getMessage.headNestedInBody(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        } else if (tagLower === 'body') {
          bodyStartCount++;
          bodyTokens.push(token);
          if (!insideHtml) {
            const { message, advice } = getMessage.bodyOutsideHtml(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
          if (insideHead) {
            const { message, advice } = getMessage.bodyNestedInHead(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        } else {
          // Other tags
          if (!insideHtml) {
            const { message, advice } = getMessage.tagOutsideHtml(lang, name);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          } else if (!insideHead && !insideBody) {
            const { message, advice } = getMessage.tagDirectChildOfHtml(lang, name);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          } else if (insideHead) {
            const allowedInHead = ['title', 'meta', 'link', 'style', 'script', 'noscript', 'base'];
            if (!allowedInHead.includes(tagLower)) {
              const { message, advice } = getMessage.tagNotAllowedInHead(lang, name);
              errors.push({
                type: 'DOCUMENT_STRUCTURE',
                message,
                advice,
                location: {
                  start: token.start,
                  end: token.end
                }
              });
            }
          } else if (insideBody) {
            if (tagLower === 'title') {
              const { message, advice } = getMessage.titleTagInBody(lang);
              errors.push({
                type: 'DOCUMENT_STRUCTURE',
                message,
                advice,
                location: {
                  start: token.start,
                  end: token.end
                }
              });
            }
          }
        }
      }

      // Form rules
      if (!insideSvg) {
        if (tagLower === 'form') {
          const isNestedForm = stack.some(x => x.name.toLowerCase() === 'form');
          if (isNestedForm) {
            const { message, advice } = getMessage.nestedForm(lang);
            errors.push({
              type: 'FORM_RULE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }

        if (options.requireFormControlsInForm) {
          const isFormControl = ['input', 'textarea', 'select'].includes(tagLower);
          if (isFormControl && !stack.some(x => x.name.toLowerCase() === 'form')) {
            const { message, advice } = getMessage.formControlOutsideForm(lang, name);
            errors.push({
              type: 'FORM_RULE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }

      // B. Allowed / Forbidden tags
      if (!insideSvg) {
        if (options.allowedTags) {
          const isAllowed = options.allowedTags.some(t => t.toLowerCase() === tagLower);
          if (!isAllowed) {
            const { message, advice } = getMessage.tagNotAllowed(lang, name);
            errors.push({
              type: 'ALLOWED_TAGS',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        } else if (options.forbiddenTags) {
          const isForbidden = options.forbiddenTags.some(t => t.toLowerCase() === tagLower);
          if (isForbidden) {
            const { message, advice } = getMessage.tagForbidden(lang, name);
            errors.push({
              type: 'ALLOWED_TAGS',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        } else {
          if (isDeprecated && options.allowDeprecatedTags === false) {
            const { message, advice } = getMessage.tagDeprecated(lang, name);
            errors.push({
              type: 'ALLOWED_TAGS',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
          if (isCustom && options.allowCustomTags === false) {
            const { message, advice } = getMessage.customTagNotAllowed(lang, name);
            errors.push({
              type: 'ALLOWED_TAGS',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }

      // C. Tag Casing check
      if (!insideSvg) {
        const isAllLower = name === name.toLowerCase();
        const isAllUpper = name === name.toUpperCase();
        const isMixed = !isAllLower && !isAllUpper;

        if (isAllLower && options.allowLowercaseTags === false) {
          const { message, advice } = getMessage.tagCaseLowercaseForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        } else if (isAllUpper && options.allowUppercaseTags === false) {
          const { message, advice } = getMessage.tagCaseUppercaseForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        } else if (isMixed && options.allowMixedcaseTags === false) {
          const { message, advice } = getMessage.tagCaseMixedForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        }
      }

      // D. XHTML self-closing on void / normal elements
      if (!insideSvg && !isSvgTag) {
        const isVoid = VOID_TAGS.has(tagLower);
        if (isVoid) {
          if (options.xhtmlSelfClosing === 'forced' && !token.isSelfClosing) {
            const { message, advice } = getMessage.voidElementMustSelfClose(lang, name);
            errors.push({
              type: 'XHTML_SELF_CLOSING',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          } else if (options.xhtmlSelfClosing === 'forbidden' && token.isSelfClosing) {
            const { message, advice } = getMessage.voidElementMustNotSelfClose(lang, name);
            errors.push({
              type: 'XHTML_SELF_CLOSING',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        } else {
          if (token.isSelfClosing) {
            const { message, advice } = getMessage.normalElementCannotSelfClose(lang, name);
            errors.push({
              type: 'INVALID_CLOSING_TAG',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }

      // E. Attributes
      const tagAttrs: Extract<Token, { type: 'ATTRIBUTE' }>[] = [];
      for (let j = i + 1; j < validTokens.length; j++) {
        if (validTokens[j].type === 'ATTRIBUTE') {
          tagAttrs.push(validTokens[j] as Extract<Token, { type: 'ATTRIBUTE' }>);
        } else {
          break;
        }
      }

      // Charset check
      if (insideHead && tagLower === 'meta') {
        const hasCharsetAttr = tagAttrs.some(a => a.name.toLowerCase() === 'charset');
        if (hasCharsetAttr) {
          hasCharset = true;
        }
      }

      // Title content check
      if (insideHead && tagLower === 'title') {
        hasTitle = true;
        if (i + 1 < validTokens.length) {
          const nextT = validTokens[i + 1];
          if (nextT.type === 'TEXT' && nextT.value.trim() !== '') {
            titleHasContent = true;
          }
        }
      }

      // Textarea cannot have value attribute
      if (tagLower === 'textarea' && !insideSvg) {
        const valueAttr = tagAttrs.find(a => a.name.toLowerCase() === 'value');
        if (valueAttr) {
          const { message, advice } = getMessage.textareaValueAttribute(lang);
          errors.push({
            type: 'FORM_RULE',
            message,
            advice,
            location: {
              start: valueAttr.start,
              end: valueAttr.end
            }
          });
        }
      }

      // Collect form elements with name attributes
      const isFormControl = ['input', 'textarea', 'select', 'button'].includes(tagLower);
      if (isFormControl && !insideSvg) {
        const nameAttr = tagAttrs.find(a => a.name.toLowerCase() === 'name');
        if (nameAttr && nameAttr.value !== null && nameAttr.value.trim() !== '') {
          const typeAttr = tagAttrs.find(a => a.name.toLowerCase() === 'type');
          const typeVal = typeAttr?.value?.toLowerCase();
          formNameUsages.push({
            name: nameAttr.value,
            tag: tagLower,
            type: typeVal,
            token,
            attrToken: nameAttr
          });
        }
      }

      // Label association collection
      if (options.requireLabelForInteractiveControls && !insideSvg) {
        const isInteractiveControl =
          tagLower === 'textarea' ||
          tagLower === 'select' ||
          (tagLower === 'input' && (() => {
            const typeAttr = tagAttrs.find(a => a.name.toLowerCase() === 'type');
            const typeVal = typeAttr?.value?.toLowerCase() || 'text';
            return !['submit', 'button', 'hidden'].includes(typeVal);
          })());

        if (isInteractiveControl) {
          const idAttr = tagAttrs.find(a => a.name.toLowerCase() === 'id');
          const nestedInLabel = stack.some(x => x.name.toLowerCase() === 'label');
          interactiveControls.push({
            tag: name,
            nestedInLabel,
            id: idAttr?.value ?? null,
            token
          });
        }
      }

      if (tagLower === 'label' && !insideSvg) {
        const forAttr = tagAttrs.find(a => a.name.toLowerCase() === 'for');
        if (forAttr && forAttr.value !== null && forAttr.value.trim() !== '') {
          labelFors.add(forAttr.value);
        }
      }

      // Radio button name consistency (check for missing name attribute)
      if (tagLower === 'input' && !insideSvg) {
        const typeAttr = tagAttrs.find(a => a.name.toLowerCase() === 'type');
        const typeVal = typeAttr?.value?.toLowerCase();
        if (typeVal === 'radio') {
          const nameAttr = tagAttrs.find(a => a.name.toLowerCase() === 'name');
          const nameVal = nameAttr?.value ?? null;
          if (options.requireRadioButtonNameConsistency) {
            if (nameVal === null || nameVal.trim() === '') {
              const { message, advice } = getMessage.radioButtonMissingName(lang);
              errors.push({
                type: 'FORM_RULE',
                message,
                advice,
                location: {
                  start: token.start,
                  end: token.end
                }
              });
            } else {
              radioButtons.push({
                name: nameVal,
                token
              });
            }
          }
        }
      }

      // Buttons inside a form explicit type check
      if (tagLower === 'button' && !insideSvg) {
        const insideForm = stack.some(x => x.name.toLowerCase() === 'form');
        if (insideForm && options.requireExplicitButtonType) {
          const typeAttr = tagAttrs.find(a => a.name.toLowerCase() === 'type');
          const typeVal = typeAttr?.value?.toLowerCase();
          if (!typeVal || !['submit', 'button', 'reset'].includes(typeVal)) {
            const { message, advice } = getMessage.buttonMissingType(lang);
            errors.push({
              type: 'FORM_RULE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }

      // Select element has at least one option tracking
      if (tagLower === 'select' && !insideSvg) {
        const selectEntry = { token, optionCount: 0 };
        selectElements.push(selectEntry);
        if (!token.isSelfClosing) {
          activeSelectStack.push(selectEntry);
        }
      }

      if (tagLower === 'option' && !insideSvg) {
        if (activeSelectStack.length > 0) {
          activeSelectStack[activeSelectStack.length - 1].optionCount++;
        }
      }

      // Duplicate ID Check
      for (const attr of tagAttrs) {
        if (attr.name.toLowerCase() === 'id' && attr.value !== null) {
          const idVal = attr.value;
          if (seenIds.has(idVal)) {
            const firstDef = seenIds.get(idVal)!;
            const { message, advice } = getMessage.duplicateId(lang, idVal, firstDef.line);
            errors.push({
              type: 'DUPLICATE_ID',
              message,
              advice,
              location: {
                start: attr.start,
                end: attr.end
              }
            });
          } else {
            seenIds.set(idVal, { line: attr.start.line });
          }
        }
      }

      if (!insideSvg && !isSvgTag) {
        for (const attr of tagAttrs) {
          if (attr.type !== 'ATTRIBUTE') continue;
          const attrName = attr.name;
          const attrNameLower = attrName.toLowerCase();

          // Skip general check for value attribute on textarea (handled by FORM_RULE check)
          if (tagLower === 'textarea' && attrNameLower === 'value') {
            continue;
          }

          // Casing
          const isAttrLower = attrName === attrName.toLowerCase();
          const isAttrUpper = attrName === attrName.toUpperCase();
          const isAttrMixed = !isAttrLower && !isAttrUpper;

          if (isAttrLower && options.allowLowercaseAttributes === false) {
            const { message, advice } = getMessage.attributeLowercaseForbidden(lang, attrName, name);
            errors.push({
              type: 'CASE',
              message,
              advice,
              location: {
                start: attr.nameStart,
                end: attr.nameEnd
              }
            });
          } else if (isAttrUpper && options.allowUppercaseAttributes === false) {
            const { message, advice } = getMessage.attributeUppercaseForbidden(lang, attrName, name);
            errors.push({
              type: 'CASE',
              message,
              advice,
              location: {
                start: attr.nameStart,
                end: attr.nameEnd
              }
            });
          } else if (isAttrMixed && options.allowMixedcaseAttributes === false) {
            const { message, advice } = getMessage.attributeMixedForbidden(lang, attrName, name);
            errors.push({
              type: 'CASE',
              message,
              advice,
              location: {
                start: attr.nameStart,
                end: attr.nameEnd
              }
            });
          }

          // Forbidden
          const isAttrForbidden = (options.forbiddenAttributes || []).some(a => a.toLowerCase() === attrNameLower);
          if (isAttrForbidden) {
            const { message, advice } = getMessage.attributeForbidden(lang, attrName, name);
            errors.push({
              type: 'ALLOWED_ATTRIBUTES',
              message,
              advice,
              location: {
                start: attr.start,
                end: attr.end
              }
            });
          } else {
            // Deprecated
            const isDeprecatedAttr = DEPRECATED_ATTRIBUTES.has(attrNameLower);
            if (isDeprecatedAttr && options.allowDeprecatedAttributes === false) {
              const { message, advice } = getMessage.attributeDeprecated(lang, attrName);
              errors.push({
                type: 'ALLOWED_ATTRIBUTES',
                message,
                advice,
                location: {
                  start: attr.start,
                  end: attr.end
                }
              });
            } else {
              // Custom
              const isGlobalStd = GLOBAL_STANDARD_ATTRIBUTES.has(attrNameLower);
              const isTagSpecificStd = ELEMENT_STANDARD_ATTRIBUTES[tagLower]?.includes(attrNameLower) ?? false;
              const isDataAttr = attrNameLower.startsWith('data-');
              const isAriaAttr = attrNameLower.startsWith('aria-');

              if (!isGlobalStd && !isTagSpecificStd && !isDataAttr && !isAriaAttr && !isDeprecatedAttr && options.allowCustomAttributes === false) {
                const { message, advice } = getMessage.attributeCustomNotAllowed(lang, attrName, name, attrNameLower);
                errors.push({
                  type: 'ALLOWED_ATTRIBUTES',
                  message,
                  advice,
                  location: {
                    start: attr.start,
                    end: attr.end
                  }
                });
              }
            }
          }
        }

        // Required Attributes
        if (options.forceRequiredAttributes) {
          const reqs = REQUIRED_ATTRIBUTES[tagLower];
          if (reqs) {
            for (const req of reqs) {
              const hasReq = tagAttrs.some(a => a.name.toLowerCase() === req);
              if (!hasReq) {
                const isImgAlt = tagLower === 'img' && req === 'alt';
                const { message, advice } = isImgAlt
                  ? getMessage.attributeImgAltRequired(lang)
                  : getMessage.attributeRequired(lang, req, name);
                errors.push({
                  type: 'MISSING_REQUIRED_ATTRIBUTE',
                  message,
                  advice,
                  location: {
                    start: token.start,
                    end: token.end
                  }
                });
              }
            }
          }
        }
      }

      // Push to stack
      const effectiveVoid = insideSvg ? false : VOID_TAGS.has(tagLower);
      if (!effectiveVoid && !token.isSelfClosing) {
        stack.push({ name, token });
      }

    } else if (token.type === 'TAG_CLOSE') {
      const name = token.name;
      const tagLower = name.toLowerCase();
      const insideSvg = stack.some(x => x.name.toLowerCase() === 'svg');

      if (tagLower === 'select' && !insideSvg) {
        activeSelectStack.pop();
      }
      const isSvgTag = tagLower === 'svg';
      const effectiveVoid = insideSvg ? false : VOID_TAGS.has(tagLower);

      if (options.checkFullStructure) {
        if (tagLower === 'html') htmlCloseCount++;
        else if (tagLower === 'head') headCloseCount++;
        else if (tagLower === 'body') bodyCloseCount++;
      }

      if (effectiveVoid) {
        const { message, advice } = getMessage.voidElementCannotClose(lang, name);
        errors.push({
          type: 'INVALID_CLOSING_TAG',
          message,
          advice,
          location: {
            start: token.start,
            end: token.end
          }
        });
        continue;
      }

      // Casing on closing
      if (!insideSvg || isSvgTag) {
        const isAllLower = name === name.toLowerCase();
        const isAllUpper = name === name.toUpperCase();
        const isMixed = !isAllLower && !isAllUpper;

        if (isAllLower && options.allowLowercaseTags === false) {
          const { message, advice } = getMessage.closingTagCaseLowercaseForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        } else if (isAllUpper && options.allowUppercaseTags === false) {
          const { message, advice } = getMessage.closingTagCaseUppercaseForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        } else if (isMixed && options.allowMixedcaseTags === false) {
          const { message, advice } = getMessage.closingTagCaseMixedForbidden(lang, name);
          errors.push({
            type: 'CASE',
            message,
            advice,
            location: {
              start: token.start,
              end: token.end
            }
          });
        }
      }

      // Stack match check
      if (stack.length === 0) {
        const { message, advice } = getMessage.closingTagMismatchNoOpen(lang, name);
        errors.push({
          type: 'INVALID_CLOSING_TAG',
          message,
          advice,
          location: {
            start: token.start,
            end: token.end
          }
        });
      } else {
        let matchIdx = -1;
        for (let j = stack.length - 1; j >= 0; j--) {
          if (stack[j].name.toLowerCase() === tagLower) {
            matchIdx = j;
            break;
          }
        }

        if (matchIdx !== -1) {
          // Found a match! Report nesting errors for unclosed tags inside it
          for (let j = stack.length - 1; j > matchIdx; j--) {
            const unclosed = stack[j];
            const { message, advice } = getMessage.closingTagMismatchInsideOpen(lang, unclosed.name, unclosed.token.start.line, name);
            errors.push({
              type: 'CLOSING_TAG_MISMATCH',
              message,
              advice,
              location: {
                start: unclosed.token.start,
                end: unclosed.token.end
              }
            });
          }
          stack.splice(matchIdx);
        } else {
          const top = stack[stack.length - 1];
          const topLower = top.name.toLowerCase();

          // Count how many elements currently on the stack have the name topLower
          let stackCount = 0;
          for (const s of stack) {
            if (s.name.toLowerCase() === topLower) {
              stackCount++;
            }
          }

          // Scan the remaining tokens to check if the top tag is closed later
          let count = stackCount;
          let topClosedLater = false;
          for (let j = i + 1; j < validTokens.length; j++) {
            const t = validTokens[j];
            if (t.type === 'TAG_OPEN' && t.name.toLowerCase() === topLower && !t.isSelfClosing) {
              count++;
            } else if (t.type === 'TAG_CLOSE' && t.name.toLowerCase() === topLower) {
              count--;
              if (count <= 0) {
                topClosedLater = true;
                break;
              }
            }
          }

          if (topClosedLater) {
            // Keep stack intact (assume current closing tag is extra/orphan)
            const { message, advice } = getMessage.closingTagMismatchNoOpen(lang, name);
            errors.push({
              type: 'INVALID_CLOSING_TAG',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          } else {
            // Pop the stack and report mismatch/typo
            stack.pop();
            const { message, advice } = getMessage.closingTagMismatchTopMismatch(lang, name, top.name, top.token.start.line);
            errors.push({
              type: 'CLOSING_TAG_MISMATCH',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }

    } else if (token.type === 'TEXT') {
      const topTagName = stack[stack.length - 1]?.name.toLowerCase();

      // CSS parsing for style blocks
      if (topTagName === 'style' && token.value.trim() !== '') {
        const cssErrors = checkCssSyntax(token.value, options.cssOptions, lang);
        for (const cssErr of cssErrors) {
          let mappedLoc: HTMLCheckerError['location'] = undefined;
          if (cssErr.location) {
            const cssStart = cssErr.location.start;
            const cssEnd = cssErr.location.end;
            
            const startLine = cssStart.line === 1
              ? token.start.line
              : token.start.line + cssStart.line - 1;
            const startCol = cssStart.line === 1
              ? token.start.column + cssStart.column - 1
              : cssStart.column;

            const endLine = cssEnd.line === 1
              ? token.start.line
              : token.start.line + cssEnd.line - 1;
            const endCol = cssEnd.line === 1
              ? token.start.column + cssEnd.column - 1
              : cssEnd.column;

            mappedLoc = {
              start: { line: startLine, column: startCol },
              end: { line: endLine, column: endCol }
            };
          }
          errors.push({
            type: cssErr.type,
            message: cssErr.message,
            advice: cssErr.advice,
            location: mappedLoc
          });
        }
      }

      if (token.value.trim() !== '') {
        const insideHtml = stack.some(x => x.name.toLowerCase() === 'html');
        const insideHead = stack.some(x => x.name.toLowerCase() === 'head');
        const insideBody = stack.some(x => x.name.toLowerCase() === 'body');
        const insideSvg = stack.some(x => x.name.toLowerCase() === 'svg');

        if (options.checkFullStructure && !insideSvg) {
          if (!insideHtml) {
            const hasNoTagsInStack = stack.length === 0;
            if (hasNoTagsInStack) {
              const { message, advice } = getMessage.visibleTextOutsideHtml(lang);
              errors.push({
                type: 'DOCUMENT_STRUCTURE',
                message,
                advice,
                location: {
                  start: token.start,
                  end: token.end
                }
              });
            }
          } else if (topTagName === 'html') {
            const { message, advice } = getMessage.visibleTextDirectChildOfHtml(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          } else if (topTagName === 'head') {
            const { message, advice } = getMessage.visibleTextInHead(lang);
            errors.push({
              type: 'DOCUMENT_STRUCTURE',
              message,
              advice,
              location: {
                start: token.start,
                end: token.end
              }
            });
          }
        }
      }
    }
  }

  // Any remaining tags in stack are unclosed
  for (const unclosed of stack) {
    const { message, advice } = getMessage.tagUnclosedAtEOF(lang, unclosed.name, unclosed.token.start.line);
    errors.push({
      type: 'CLOSING_TAG_MISMATCH',
      message,
      advice,
      location: {
        start: unclosed.token.start,
        end: unclosed.token.end
      }
    });
  }

  // 6. Post-pass full structure checks (missing html/head/body counts)
  if (options.checkFullStructure) {
    if (htmlStartCount === 0) {
      const { message, advice } = getMessage.missingHtmlTag(lang);
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice
      });
    } else if (htmlStartCount > 1) {
      const { message, advice } = getMessage.multipleHtmlTags(lang);
      const errorToken = htmlTokens[1] || htmlTokens[0];
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice,
        location: errorToken ? {
          start: errorToken.start,
          end: errorToken.end
        } : undefined
      });
    }

    if (headStartCount === 0) {
      const { message, advice } = getMessage.missingHeadSection(lang);
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice
      });
    } else if (headStartCount > 1) {
      const { message, advice } = getMessage.multipleHeadSections(lang);
      const errorToken = headTokens[1] || headTokens[0];
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice,
        location: errorToken ? {
          start: errorToken.start,
          end: errorToken.end
        } : undefined
      });
    }

    if (bodyStartCount === 0) {
      const { message, advice } = getMessage.missingBodySection(lang);
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice
      });
    } else if (bodyStartCount > 1) {
      const { message, advice } = getMessage.multipleBodySections(lang);
      const errorToken = bodyTokens[1] || bodyTokens[0];
      errors.push({
        type: 'DOCUMENT_STRUCTURE',
        message,
        advice,
        location: errorToken ? {
          start: errorToken.start,
          end: errorToken.end
        } : undefined
      });
    }
  }

  // 7. Charset and Title checks (missing checks)
  if (options.checkCharset && !hasCharset) {
    const { message, advice } = getMessage.missingCharset(lang);
    errors.push({
      type: 'MISSING_CHARSET',
      message,
      advice
    });
  }

  if (options.checkTitle && (!hasTitle || !titleHasContent)) {
    const { message, advice } = getMessage.missingTitle(lang);
    errors.push({
      type: 'MISSING_TITLE',
      message,
      advice
    });
  }

  // Form rule post-pass checks
  // Check Duplicate Form Element Names
  for (let k = 0; k < formNameUsages.length; k++) {
    const usage = formNameUsages[k];
    const prevUsages = formNameUsages.slice(0, k);
    const conflict = prevUsages.find(p => p.name === usage.name);
    if (conflict) {
      const bothRadios = (usage.tag === 'input' && usage.type === 'radio') && (conflict.tag === 'input' && conflict.type === 'radio');
      const bothCheckboxes = (usage.tag === 'input' && usage.type === 'checkbox') && (conflict.tag === 'input' && conflict.type === 'checkbox');
      if (!bothRadios && !bothCheckboxes) {
        const { message, advice } = getMessage.duplicateName(lang, usage.name, conflict.token.start.line);
        errors.push({
          type: 'FORM_RULE',
          message,
          advice,
          location: {
            start: usage.attrToken.start,
            end: usage.attrToken.end
          }
        });
      }
    }
  }

  // Label Association
  if (options.requireLabelForInteractiveControls) {
    for (const ctrl of interactiveControls) {
      let isAssociated = ctrl.nestedInLabel;
      if (!isAssociated && ctrl.id !== null && labelFors.has(ctrl.id)) {
        isAssociated = true;
      }
      if (!isAssociated) {
        const { message, advice } = getMessage.labelAssociationRequired(lang, ctrl.tag);
        errors.push({
          type: 'FORM_RULE',
          message,
          advice,
          location: {
            start: ctrl.token.start,
            end: ctrl.token.end
          }
        });
      }
    }
  }

  // Radio button name consistency (check for multiple radio buttons in group)
  if (options.requireRadioButtonNameConsistency) {
    const radioNameCounts = new Map<string, number>();
    for (const rb of radioButtons) {
      if (rb.name) {
        radioNameCounts.set(rb.name, (radioNameCounts.get(rb.name) || 0) + 1);
      }
    }
    for (const rb of radioButtons) {
      if (rb.name && (radioNameCounts.get(rb.name) || 0) < 2) {
        const { message, advice } = getMessage.radioButtonSingleInGroup(lang, rb.name);
        errors.push({
          type: 'FORM_RULE',
          message,
          advice,
          location: {
            start: rb.token.start,
            end: rb.token.end
          }
        });
      }
    }
  }

  // Select element must contain at least one option
  if (options.requireSelectHasOption) {
    for (const select of selectElements) {
      if (select.optionCount === 0) {
        const { message, advice } = getMessage.selectEmptyOptions(lang);
        errors.push({
          type: 'FORM_RULE',
          message,
          advice,
          location: {
            start: select.token.start,
            end: select.token.end
          }
        });
      }
    }
  }

  // 8. Sort errors by start position
  errors.sort((a, b) => {
    const aLine = a.location?.start.line ?? 0;
    const bLine = b.location?.start.line ?? 0;
    if (aLine !== bLine) {
      return aLine - bLine;
    }
    const aCol = a.location?.start.column ?? 0;
    const bCol = b.location?.start.column ?? 0;
    return aCol - bCol;
  });

  return errors;
}

export function checkHtmlSyntax(code: string, options?: HTMLCheckerOptions, lang?: Language): HTMLCheckerError[] {
  const chosenLang: Language = lang ?? 'en';
  const lexer = new Lexer(code, chosenLang);
  const tokens = lexer.tokenize();
  return checkHtml(tokens, options, chosenLang);
}
