import { Token } from './lexer';
import { CheckerOptions, CheckerError, Language } from './types';
import { getMessage } from './messages';
import {
  STANDARD_TAGS,
  VOID_TAGS,
  DEPRECATED_TAGS,
  REQUIRED_ATTRIBUTES,
  GLOBAL_STANDARD_ATTRIBUTES,
  ELEMENT_STANDARD_ATTRIBUTES,
  DEPRECATED_ATTRIBUTES
} from './htmlData';

const DEFAULT_OPTIONS: Required<CheckerOptions> = {
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
  checkTitle: false
};

export function checkHtml(tokens: Token[], userOptions: CheckerOptions = {}, lang: Language = 'en'): CheckerError[] {
  const errors: CheckerError[] = [];

  // 1. Validate Options Compatibility
  if (userOptions.allowedTags && userOptions.forbiddenTags) {
    throw new Error(getMessage.incompatibleOptions(lang));
  }


  // 2. Resolve default options
  const options: Required<CheckerOptions> = { ...DEFAULT_OPTIONS, ...userOptions };

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

      // A. Structure placement checks
      if (options.checkFullStructure) {
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

      // B. Allowed / Forbidden tags
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

      // C. Tag Casing check
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

      // D. XHTML self-closing on void / normal elements
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

      for (const attr of tagAttrs) {
        if (attr.type !== 'ATTRIBUTE') continue;
        const attrName = attr.name;
        const attrNameLower = attrName.toLowerCase();

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

            if (!isGlobalStd && !isTagSpecificStd && !isDataAttr && !isDeprecatedAttr && options.allowCustomAttributes === false) {
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

      // Push to stack
      if (!isVoid && !token.isSelfClosing) {
        stack.push({ name, token });
      }

    } else if (token.type === 'TAG_CLOSE') {
      const name = token.name;
      const tagLower = name.toLowerCase();
      const isVoid = VOID_TAGS.has(tagLower);

      if (options.checkFullStructure) {
        if (tagLower === 'html') htmlCloseCount++;
        else if (tagLower === 'head') headCloseCount++;
        else if (tagLower === 'body') bodyCloseCount++;
      }

      if (isVoid) {
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
          const top = stack.pop()!;
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

    } else if (token.type === 'TEXT') {
      if (token.value.trim() !== '') {
        const topTagName = stack[stack.length - 1]?.name.toLowerCase();
        const insideHtml = stack.some(x => x.name.toLowerCase() === 'html');
        const insideHead = stack.some(x => x.name.toLowerCase() === 'head');
        const insideBody = stack.some(x => x.name.toLowerCase() === 'body');

        if (options.checkFullStructure) {
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
