import { Position, CSSCheckerOptions, CSSCheckerError, Language } from '../types';
import { getCssMessage } from './messages';
import {
  NAMED_COLORS,
  PROPERTIES_REQUIRING_UNITS,
  FLEXBOX_PROPERTIES,
  GRID_PROPERTIES,
  SHARED_LAYOUT_PROPERTIES,
  COLOR_CONTAINING_PROPERTIES,
  KNOWN_CSS_PROPERTIES,
  COMMON_PROPERTY_VALIDATORS
} from './cssData';

const DEFAULT_CSS_OPTIONS: Required<CSSCheckerOptions> = {
  allowTypeSelectors: true,
  allowClassSelectors: true,
  allowIdSelectors: true,
  allowUniversalSelector: true,
  allowSelectorLists: true,
  allowCombinators: true,
  allowNestedRules: true,
  allowAtRules: true,
  allowPeudoClasses: true,
  allowPseudoElements: true,
  allowImportant: false,
  allowedProperties: null,
  forbiddenProperties: null,
  allowedColorFormats: null,
  allowedUnits: null,
  allowFlexbox: true,
  allowGrid: true,
  allowLowercaseProperties: true,
  allowUppercaseProperties: true,
  allowMixedcaseProperties: false,
  allowEmptyRules: false,
  allowDuplicateProperties: false,
  allowMultiplePropertiesPerLine: true,
  allowUnrecognizedProperties: false
};

interface CSSDeclaration {
  property: string;
  value: string;
  important: boolean;
  start: Position;
  end: Position;
  propertyStart: Position;
  propertyEnd: Position;
  valueStart: Position;
  valueEnd: Position;
}

interface CSSRule {
  type: 'style' | 'at-rule';
  name: string;
  start: Position;
  end: Position;
  declarations: CSSDeclaration[];
  nestedRules: CSSRule[];
}

export function splitValueIntoTerms(valueStr: string): string[] {
  const terms: string[] = [];
  let current = '';
  let parenDepth = 0;
  let bracketDepth = 0;
  let quote = '';

  for (let i = 0; i < valueStr.length; i++) {
    const char = valueStr[i];

    if (quote) {
      current += char;
      if (char === quote) {
        quote = '';
      }
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      if (parenDepth > 0) parenDepth--;
      current += char;
    } else if (char === '[') {
      bracketDepth++;
      current += char;
    } else if (char === ']') {
      if (bracketDepth > 0) bracketDepth--;
      current += char;
    } else if (parenDepth === 0 && bracketDepth === 0 && (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '\f')) {
      if (current) {
        terms.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  if (current) {
    terms.push(current);
  }
  return terms;
}

class CSSParser {
  private code: string;
  private index: number = 0;
  private posMap: Position[] = [];
  private lang: Language;
  private options: Required<CSSCheckerOptions>;
  private errors: CSSCheckerError[] = [];

  constructor(code: string, options: CSSCheckerOptions = {}, lang: Language = 'en') {
    this.code = code;
    this.lang = lang;
    this.options = { ...DEFAULT_CSS_OPTIONS, ...options };
    this.buildPositionMap();
  }

  private buildPositionMap() {
    let curLine = 1;
    let curCol = 1;
    for (let i = 0; i < this.code.length; i++) {
      this.posMap.push({ line: curLine, column: curCol });
      if (this.code[i] === '\n') {
        curLine++;
        curCol = 1;
      } else {
        curCol++;
      }
    }
    this.posMap.push({ line: curLine, column: curCol });
  }

  private getPos(idx: number): Position {
    if (idx < 0) return { line: 1, column: 1 };
    if (idx >= this.posMap.length) return this.posMap[this.posMap.length - 1];
    return this.posMap[idx];
  }

  private skipWhitespaceAndComments() {
    while (this.index < this.code.length) {
      const char = this.code[this.index];
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '\f') {
        this.index++;
      } else if (char === '/' && this.code[this.index + 1] === '*') {
        const commentStartIdx = this.index;
        this.index += 2; // skip '/*'
        let closed = false;
        while (this.index < this.code.length) {
          if (this.code[this.index] === '*' && this.code[this.index + 1] === '/') {
            this.index += 2;
            closed = true;
            break;
          }
          this.index++;
        }
        if (!closed) {
          const { message, advice } = getCssMessage.unclosedComment(this.lang);
          this.errors.push({
            type: 'CSS_PARSE_ERROR',
            message,
            advice,
            location: {
              start: this.getPos(commentStartIdx),
              end: this.getPos(this.code.length - 1)
            }
          });
        }
      } else {
        break;
      }
    }
  }

  private determineNextBlockElementType(): 'nested-rule' | 'declaration' | 'close-brace' | 'eof' | 'invalid' {
    this.skipWhitespaceAndComments();
    if (this.index >= this.code.length) return 'eof';
    if (this.code[this.index] === '}') return 'close-brace';
    if (this.code[this.index] === '@') return 'nested-rule';

    let idx = this.index;
    let parenDepth = 0;
    let quote = '';
    let hasColon = false;

    while (idx < this.code.length) {
      const char = this.code[idx];

      if (quote) {
        if (char === quote) {
          quote = '';
        }
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--;
      } else if (parenDepth === 0) {
        if (char === '{') {
          return 'nested-rule';
        }
        if (char === '}') {
          return hasColon ? 'declaration' : 'invalid';
        }
        if (char === ';') {
          return hasColon ? 'declaration' : 'invalid';
        }
        if (char === ':') {
          hasColon = true;
        }
      }
      idx++;
    }
    return hasColon ? 'declaration' : 'invalid';
  }

  private parseAtRule(insideKeyframes: boolean): CSSRule | null {
    const startIdx = this.index;
    this.index++; // skip '@'
    const nameStart = this.index;
    while (this.index < this.code.length && /[a-zA-Z0-9-]/.test(this.code[this.index])) {
      this.index++;
    }
    const atRuleName = this.code.slice(nameStart, this.index);

    if (!this.options.allowAtRules) {
      const { message, advice } = getCssMessage.atRuleForbidden(this.lang, atRuleName);
      this.errors.push({
        type: 'CSS_SELECTOR_VIOLATION',
        message,
        advice,
        location: {
          start: this.getPos(startIdx),
          end: this.getPos(this.index - 1)
        }
      });
    }

    let hasBlock = false;
    let closed = false;
    let openBraceIdx = -1;
    while (this.index < this.code.length) {
      this.skipWhitespaceAndComments();
      if (this.index >= this.code.length) break;
      const char = this.code[this.index];
      if (char === ';') {
        this.index++; // consume ';'
        closed = true;
        break;
      } else if (char === '{') {
        openBraceIdx = this.index;
        this.index++; // consume '{'
        hasBlock = true;
        closed = true;
        break;
      } else if (char === '}') {
        break;
      }
      this.index++;
    }

    const signature = this.code.slice(startIdx, this.index - (closed ? 1 : 0)).trim();
    const rule: CSSRule = {
      type: 'at-rule',
      name: signature,
      start: this.getPos(startIdx),
      end: this.getPos(this.index - 1),
      declarations: [],
      nestedRules: []
    };

    if (!closed) {
      const { message, advice } = getCssMessage.unclosedAtRule(this.lang, atRuleName);
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message,
        advice,
        location: {
          start: this.getPos(startIdx),
          end: this.getPos(this.index - 1)
        }
      });
      return rule;
    }

    if (hasBlock) {
      const isKeyframes = atRuleName.toLowerCase() === 'keyframes';
      const blockContent = this.parseBlock(openBraceIdx, true, isKeyframes);
      rule.declarations = blockContent.declarations;
      rule.nestedRules = blockContent.nestedRules;
      rule.end = this.getPos(this.index - 1);
    }

    return rule;
  }

  private parseStyleRule(isNested: boolean, insideKeyframes: boolean): CSSRule | null {
    const startIdx = this.index;
    let selectorEndIdx = this.index;
    let foundOpenBrace = false;

    while (this.index < this.code.length) {
      const char = this.code[this.index];
      if (char === '{') {
        selectorEndIdx = this.index;
        this.index++; // consume '{'
        foundOpenBrace = true;
        break;
      } else if (char === '}') {
        break;
      } else if (char === '/' && this.code[this.index + 1] === '*') {
        this.skipWhitespaceAndComments();
        continue;
      }
      this.index++;
    }

    if (!foundOpenBrace) {
      selectorEndIdx = this.index;
    }

    const selectorStr = this.code.slice(startIdx, selectorEndIdx).trim();

    if (!selectorStr && foundOpenBrace) {
      const { message, advice } = getCssMessage.missingSelector(this.lang);
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message,
        advice,
        location: {
          start: this.getPos(startIdx),
          end: this.getPos(selectorEndIdx)
        }
      });
    }

    const rule: CSSRule = {
      type: 'style',
      name: selectorStr,
      start: this.getPos(startIdx),
      end: this.getPos(this.index - 1),
      declarations: [],
      nestedRules: []
    };

    if (selectorStr) {
      this.validateSelector(selectorStr, startIdx, selectorEndIdx - 1, insideKeyframes, isNested);
    }

    if (!foundOpenBrace) {
      const isHtmlTag = /<[a-zA-Z/!?]/.test(selectorStr);
      if (!isHtmlTag) {
        const { message, advice } = getCssMessage.unclosedRule(this.lang, selectorStr);
        this.errors.push({
          type: 'CSS_PARSE_ERROR',
          message,
          advice,
          location: {
            start: this.getPos(startIdx),
            end: this.getPos(this.index - 1)
          }
        });
      }
      return rule;
    }

    const errorsBefore = this.errors.length;
    const blockContent = this.parseBlock(selectorEndIdx, true, insideKeyframes);
    rule.declarations = blockContent.declarations;
    rule.nestedRules = blockContent.nestedRules;
    rule.end = this.getPos(this.index - 1);

    const hasErrorInBlock = this.errors.length > errorsBefore;
    if (!this.options.allowEmptyRules && rule.declarations.length === 0 && rule.nestedRules.length === 0 && !hasErrorInBlock) {
      const { message, advice } = getCssMessage.emptyRulesForbidden(this.lang, selectorStr);
      this.errors.push({
        type: 'CSS_STRUCTURE_VIOLATION',
        message,
        advice,
        location: {
          start: rule.start,
          end: rule.end
        }
      });
    }

    if (!this.options.allowDuplicateProperties && rule.declarations.length > 1) {
      const seenProps = new Set<string>();
      for (const decl of rule.declarations) {
        const propLower = decl.property.toLowerCase();
        if (seenProps.has(propLower)) {
          const { message, advice } = getCssMessage.duplicatePropertyForbidden(this.lang, decl.property);
          this.errors.push({
            type: 'CSS_STRUCTURE_VIOLATION',
            message,
            advice,
            location: {
              start: decl.start,
              end: decl.end
            }
          });
        } else {
          seenProps.add(propLower);
        }
      }
    }

    return rule;
  }

  private parseBlock(openBraceIdx: number, isNested: boolean, insideKeyframes: boolean): { declarations: CSSDeclaration[]; nestedRules: CSSRule[] } {
    const declarations: CSSDeclaration[] = [];
    const nestedRules: CSSRule[] = [];
    let closed = false;

    while (this.index < this.code.length) {
      this.skipWhitespaceAndComments();
      if (this.index >= this.code.length) break;

      const nextType = this.determineNextBlockElementType();
      if (nextType === 'close-brace') {
        this.index++; // consume '}'
        closed = true;
        break;
      } else if (nextType === 'eof') {
        break;
      } else if (nextType === 'nested-rule') {
        const startRuleIdx = this.index;
        if (!this.options.allowNestedRules && !insideKeyframes && isNested) {
          const { message, advice } = getCssMessage.nestedRulesForbidden(this.lang);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: {
              start: this.getPos(startRuleIdx),
              end: this.getPos(startRuleIdx)
            }
          });
        }

        let rule: CSSRule | null = null;
        if (this.code[this.index] === '@') {
          rule = this.parseAtRule(insideKeyframes);
        } else {
          rule = this.parseStyleRule(true, insideKeyframes);
        }
        if (rule) {
          nestedRules.push(rule);
        }
      } else if (nextType === 'declaration') {
        const decl = this.parseDeclaration();
        if (decl) {
          declarations.push(decl);
        }
      } else {
        const errStart = this.index;
        while (this.index < this.code.length && this.code[this.index] !== ';' && this.code[this.index] !== '}') {
          this.index++;
        }
        const rawErr = this.code.slice(errStart, this.index).trim();
        const words = rawErr.split(/\s+/);
        if (words.length >= 2 && /^[a-zA-Z0-9-]+$/.test(words[0])) {
          const { message, advice } = getCssMessage.missingColon(this.lang, words[0]);
          this.errors.push({
            type: 'CSS_PARSE_ERROR',
            message,
            advice,
            location: {
              start: this.getPos(errStart),
              end: this.getPos(this.index - 1)
            }
          });
        } else {
          const { message, advice } = getCssMessage.invalidElement(this.lang, rawErr);
          this.errors.push({
            type: 'CSS_PARSE_ERROR',
            message,
            advice,
            location: {
              start: this.getPos(errStart),
              end: this.getPos(this.index - 1)
            }
          });
        }
        if (this.code[this.index] === ';') this.index++;
      }
    }

    if (!closed) {
      const { message, advice } = getCssMessage.unclosedBlock(this.lang);
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message,
        advice,
        location: {
          start: this.getPos(openBraceIdx),
          end: this.getPos(openBraceIdx)
        }
      });
    }

    if (!this.options.allowMultiplePropertiesPerLine && declarations.length > 1) {
      const linesSeen = new Map<number, CSSDeclaration>();
      for (const decl of declarations) {
        const line = decl.propertyStart.line;
        if (linesSeen.has(line)) {
          const { message, advice } = getCssMessage.multiplePropertiesPerLineForbidden(this.lang);
          this.errors.push({
            type: 'CSS_STRUCTURE_VIOLATION',
            message,
            advice,
            location: {
              start: decl.propertyStart,
              end: decl.propertyEnd
            }
          });
        } else {
          linesSeen.set(line, decl);
        }
      }
    }

    return { declarations, nestedRules };
  }

  private parseDeclaration(): CSSDeclaration | null {
    const startIdx = this.index;

    const propStart = this.index;
    while (this.index < this.code.length && this.code[this.index] !== ':') {
      this.index++;
    }
    const propertyName = this.code.slice(propStart, this.index).trim();
    const propEnd = this.index - 1;

    if (this.index >= this.code.length) {
      const { message, advice } = getCssMessage.missingColon(this.lang, propertyName);
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message,
        advice,
        location: {
          start: this.getPos(startIdx),
          end: this.getPos(this.index - 1)
        }
      });
      return null;
    }

    this.index++; // consume ':'

    const valStart = this.index;
    let parenDepth = 0;
    let quote = '';
    let foundDelimiter = false;

    while (this.index < this.code.length) {
      const char = this.code[this.index];
      if (quote) {
        if (char === quote) {
          quote = '';
        }
      } else if (char === '"' || char === "'") {
        quote = char;
      } else if (char === '(') {
        parenDepth++;
      } else if (char === ')') {
        if (parenDepth > 0) parenDepth--;
      } else if (parenDepth === 0) {
        if (char === ';') {
          foundDelimiter = true;
          break;
        }
        if (char === '}') {
          break;
        }
        if (char === ':') {
          // Found a colon in value! This indicates a missing semicolon.
          let backtrackIdx = this.index - 1;
          while (backtrackIdx > valStart && /\s/.test(this.code[backtrackIdx])) {
            backtrackIdx--;
          }
          const propNameEnd = backtrackIdx;
          while (backtrackIdx > valStart && /[a-zA-Z0-9-]/.test(this.code[backtrackIdx])) {
            backtrackIdx--;
          }
          const propNameStart = backtrackIdx + 1;

          if (propNameStart > valStart && propNameEnd >= propNameStart) {
            let valueEndIdx = propNameStart - 1;
            while (valueEndIdx > valStart && /\s/.test(this.code[valueEndIdx])) {
              valueEndIdx--;
            }
            const { message, advice } = getCssMessage.missingSemicolon(this.lang, propertyName);
            this.errors.push({
              type: 'CSS_PARSE_ERROR',
              message,
              advice,
              location: {
                start: this.getPos(propStart),
                end: this.getPos(valueEndIdx)
              }
            });
            this.index = propNameStart;
            break;
          }
        }
      }
      this.index++;
    }

    const rawValue = this.code.slice(valStart, this.index);
    const valEnd = this.index - 1;
    if (foundDelimiter) {
      this.index++; // consume ';'
    }

    let valueStr = rawValue.trim();
    let important = false;

    if (!valueStr) {
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message: this.lang === 'fr'
          ? `Valeur manquante pour la propriété « ${propertyName} ».`
          : `Missing value for property "${propertyName}".`,
        location: {
          start: this.getPos(valStart),
          end: this.getPos(valEnd)
        }
      });
    }

    if (valueStr.toLowerCase().endsWith('!important')) {
      important = true;
      valueStr = valueStr.slice(0, -10).trim();

      if (!this.options.allowImportant) {
        const { message, advice } = getCssMessage.importantForbidden(this.lang);
        this.errors.push({
          type: 'CSS_VALUE_VIOLATION',
          message,
          advice,
          location: {
            start: this.getPos(valStart),
            end: this.getPos(valEnd)
          }
        });
      }
    }

    const decl: CSSDeclaration = {
      property: propertyName,
      value: valueStr,
      important,
      start: this.getPos(startIdx),
      end: this.getPos(this.index - 1),
      propertyStart: this.getPos(propStart),
      propertyEnd: this.getPos(propEnd),
      valueStart: this.getPos(valStart),
      valueEnd: this.getPos(valEnd)
    };

    this.validateDeclaration(decl);

    return decl;
  }

  private validateDeclaration(decl: CSSDeclaration) {
    const prop = decl.property;
    const propLower = prop.toLowerCase();

    // Property casing checks
    const hasLower = /[a-z]/.test(prop);
    const hasUpper = /[A-Z]/.test(prop);
    if (hasLower && hasUpper) {
      if (!this.options.allowMixedcaseProperties) {
        const { message, advice } = getCssMessage.mixedCaseProperty(this.lang, prop);
        this.errors.push({
          type: 'CSS_CASE_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    } else if (hasLower) {
      if (!this.options.allowLowercaseProperties) {
        const { message, advice } = getCssMessage.lowercasePropertyForbidden(this.lang, prop);
        this.errors.push({
          type: 'CSS_CASE_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    } else if (hasUpper) {
      if (!this.options.allowUppercaseProperties) {
        const { message, advice } = getCssMessage.uppercasePropertyForbidden(this.lang, prop);
        this.errors.push({
          type: 'CSS_CASE_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    }

    // Whitelist / Blacklist property checks
    let isAllowed = true;
    if (this.options.allowedProperties) {
      const allowedSet = new Set(this.options.allowedProperties.map(p => p.toLowerCase()));
      if (!allowedSet.has(propLower)) {
        isAllowed = false;
        const { message, advice } = getCssMessage.propertyNotAllowed(this.lang, prop);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    }
    if (this.options.forbiddenProperties) {
      const forbiddenSet = new Set(this.options.forbiddenProperties.map(p => p.toLowerCase()));
      if (forbiddenSet.has(propLower)) {
        isAllowed = false;
        const { message, advice } = getCssMessage.propertyForbidden(this.lang, prop);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    }

    if (isAllowed && !this.options.allowUnrecognizedProperties) {
      const isCustomProp = propLower.startsWith('--');
      if (!isCustomProp && !KNOWN_CSS_PROPERTIES.has(propLower)) {
        const { message, advice } = getCssMessage.unrecognizedProperty(this.lang, prop);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    }

    // Flexbox checks
    if (!this.options.allowFlexbox) {
      if (FLEXBOX_PROPERTIES.has(propLower)) {
        const { message, advice } = getCssMessage.flexboxForbiddenProperty(this.lang, decl.property);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
      if (propLower === 'display' && (decl.value.toLowerCase().includes('flex') || decl.value.toLowerCase().includes('inline-flex'))) {
        const { message, advice } = getCssMessage.flexboxForbiddenValue(this.lang, decl.value);
        this.errors.push({
          type: 'CSS_VALUE_VIOLATION',
          message,
          advice,
          location: { start: decl.valueStart, end: decl.valueEnd }
        });
      }
    }

    // Grid checks
    if (!this.options.allowGrid) {
      if (GRID_PROPERTIES.has(propLower)) {
        const { message, advice } = getCssMessage.gridForbiddenProperty(this.lang, decl.property);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
      if (propLower === 'display' && (decl.value.toLowerCase().includes('grid') || decl.value.toLowerCase().includes('inline-grid') || decl.value.toLowerCase().includes('subgrid'))) {
        const { message, advice } = getCssMessage.gridForbiddenValue(this.lang, decl.value);
        this.errors.push({
          type: 'CSS_VALUE_VIOLATION',
          message,
          advice,
          location: { start: decl.valueStart, end: decl.valueEnd }
        });
      }
    }

    // Shared layout check
    if (!this.options.allowFlexbox && !this.options.allowGrid) {
      if (SHARED_LAYOUT_PROPERTIES.has(propLower)) {
        const { message, advice } = getCssMessage.layoutForbiddenProperty(this.lang, decl.property);
        this.errors.push({
          type: 'CSS_PROPERTY_VIOLATION',
          message,
          advice,
          location: { start: decl.propertyStart, end: decl.propertyEnd }
        });
      }
    }

    // Presence of units for non-zero values
    let hasMissingUnitError = false;
    if (PROPERTIES_REQUIRING_UNITS.has(propLower)) {
      let terms = splitValueIntoTerms(decl.value);
      if (propLower === 'font') {
        const newTerms: string[] = [];
        for (const term of terms) {
          if (term.includes('/')) {
            const parts = term.split('/');
            newTerms.push(parts[0]);
          } else {
            newTerms.push(term);
          }
        }
        terms = newTerms;
      }

      for (const term of terms) {
        if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(term)) {
          if (parseFloat(term) !== 0) {
            hasMissingUnitError = true;
            const { message, advice } = getCssMessage.missingUnit(this.lang, term, decl.property);
            this.errors.push({
              type: 'CSS_VALUE_VIOLATION',
              message,
              advice,
              location: { start: decl.valueStart, end: decl.valueEnd }
            });
          }
        }
      }
    }

    // Whitelist for units
    if (this.options.allowedUnits) {
      const allowedUnitsSet = new Set(this.options.allowedUnits.map(u => u.toLowerCase()));
      const terms = splitValueIntoTerms(decl.value);
      for (const term of terms) {
        const regex = /([+-]?(?:\d+(?:\.\d+)?|\.\d+))([a-zA-Z%]+)/g;
        let match;
        while ((match = regex.exec(term)) !== null) {
          const unit = match[2].toLowerCase();
          if (!allowedUnitsSet.has(unit)) {
            const { message, advice } = getCssMessage.unitForbidden(this.lang, match[2]);
            this.errors.push({
              type: 'CSS_VALUE_VIOLATION',
              message,
              advice,
              location: { start: decl.valueStart, end: decl.valueEnd }
            });
          }
        }
      }
    }

    // Whitelist for color formats
    if (this.options.allowedColorFormats && COLOR_CONTAINING_PROPERTIES.has(propLower)) {
      const allowedFormatsSet = new Set(this.options.allowedColorFormats.map(f => f.toLowerCase()));
      const terms = splitValueIntoTerms(decl.value);
      for (const term of terms) {
        const hexMatches = term.match(/#([0-9a-fA-F]{3,8})\b/g);
        if (hexMatches) {
          if (!allowedFormatsSet.has('hex')) {
            const { message, advice } = getCssMessage.colorFormatForbidden(this.lang, 'hex');
            this.errors.push({
              type: 'CSS_VALUE_VIOLATION',
              message,
              advice,
              location: { start: decl.valueStart, end: decl.valueEnd }
            });
          }
        }

        const funcMatches = [...term.matchAll(/(\w+)\(/g)];
        const colorFuncs = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix']);
        for (const fm of funcMatches) {
          const fnName = fm[1].toLowerCase();
          if (colorFuncs.has(fnName)) {
            if (!allowedFormatsSet.has(fnName)) {
              const { message, advice } = getCssMessage.colorFormatForbidden(this.lang, fm[1]);
              this.errors.push({
                type: 'CSS_VALUE_VIOLATION',
                message,
                advice,
                location: { start: decl.valueStart, end: decl.valueEnd }
              });
            }
          }
        }

        const words = term.toLowerCase().split(/[^\w-]/);
        for (const word of words) {
          if (NAMED_COLORS.has(word)) {
            if (!allowedFormatsSet.has('named') && !allowedFormatsSet.has('keyword')) {
              const { message, advice } = getCssMessage.colorNamedForbidden(this.lang, word);
              this.errors.push({
                type: 'CSS_VALUE_VIOLATION',
                message,
                advice,
                location: { start: decl.valueStart, end: decl.valueEnd }
              });
            }
          }
        }
      }
    }

    // Value validation checks (skip for variables / dynamic math)
    const valTrim = decl.value.trim();
    const hasDynamic = /\b(?:var|calc|min|max|clamp)\(/i.test(valTrim);
    if (!hasDynamic && !hasMissingUnitError) {
      const validator = COMMON_PROPERTY_VALIDATORS[propLower];
      if (validator) {
        const res = validator.validate(valTrim, this.lang);
        if (!res.valid) {
          let details = '';
          if (res.reason) {
            details = res.reason;
          } else if (res.expected) {
            details = this.lang === 'fr'
              ? `Attendu\u00A0: ${res.expected}.`
              : `Expected: ${res.expected}.`;
          }
          const { message, advice } = getCssMessage.invalidPropertyValue(this.lang, decl.value, decl.property, details);
          this.errors.push({
            type: 'CSS_VALUE_VIOLATION',
            message,
            advice,
            location: { start: decl.valueStart, end: decl.valueEnd }
          });
        }
      }
    }
  }

  private validateSelector(selectorStr: string, startIdx: number, endIdx: number, insideKeyframes: boolean, isNested: boolean) {
    // Split the selectorStr by comma at the top level to validate list items
    const parts: { str: string; start: number; end: number }[] = [];
    let lastIdx = 0;
    let pDepth = 0;
    let bDepth = 0;
    let q = '';

    for (let idx = 0; idx < selectorStr.length; idx++) {
      const char = selectorStr[idx];
      if (q) {
        if (char === q) {
          q = '';
        }
      } else if (char === '"' || char === "'") {
        q = char;
      } else if (char === '[') {
        bDepth++;
      } else if (char === ']') {
        if (bDepth > 0) bDepth--;
      } else if (char === '(') {
        pDepth++;
      } else if (char === ')') {
        if (pDepth > 0) pDepth--;
      } else if (char === ',' && pDepth === 0 && bDepth === 0) {
        parts.push({
          str: selectorStr.slice(lastIdx, idx),
          start: startIdx + lastIdx,
          end: startIdx + idx - 1
        });
        lastIdx = idx + 1;
      }
    }
    parts.push({
      str: selectorStr.slice(lastIdx),
      start: startIdx + lastIdx,
      end: startIdx + selectorStr.length - 1
    });

    let hasInvalid = false;
    if (q || pDepth > 0 || bDepth > 0) {
      hasInvalid = true;
    }

    if (!hasInvalid) {
      for (const part of parts) {
        const trimmed = part.str.trim();
        if (trimmed === '') {
          hasInvalid = true;
          break;
        }

        // Check starts/ends with combinator
        if (/[>+~]$/.test(trimmed)) {
          if (/<[a-zA-Z/!?]/.test(trimmed)) {
            // Let it fall through to character loop to get the specific HTML tag error
          } else {
            hasInvalid = true;
            break;
          }
        }
        if (!isNested && /^[>+~]/.test(trimmed)) {
          hasInvalid = true;
          break;
        }

        let i = 0;
        let partValid = true;
        while (i < trimmed.length) {
          const char = trimmed[i];
          if (char === '.' || char === '#' || char === ':') {
            let checkIdx = i;
            if (char === ':') {
              if (trimmed[i + 1] === ':') {
                checkIdx++;
              }
            }
            const nextChar = trimmed[checkIdx + 1];
            if (!nextChar || !/[a-zA-Z0-9_-]/.test(nextChar)) {
              partValid = false;
              break;
            }
            i = checkIdx + 1;
          } else if (char === '[') {
            let matchIdx = -1;
            let tempBDepth = 1;
            for (let j = i + 1; j < trimmed.length; j++) {
              if (trimmed[j] === '[') tempBDepth++;
              else if (trimmed[j] === ']') tempBDepth--;
              if (tempBDepth === 0) {
                matchIdx = j;
                break;
              }
            }
            if (matchIdx === -1) {
              partValid = false;
              break;
            }
            const content = trimmed.slice(i + 1, matchIdx).trim();
            const attrRegex = /^(?:[a-zA-Z0-9_-]+\|)?[a-zA-Z0-9_-]+\s*(?:[~|^$*]?=\s*(?:"[^"]*"|'[^']*'|[^'"\]\s]+))?\s*(?:[iIsS])?$/;
            if (!attrRegex.test(content)) {
              partValid = false;
              break;
            }
            i = matchIdx + 1;
          } else if (char === '(') {
            const beforeSub = trimmed.slice(0, i);
            if (!/:[a-zA-Z0-9_-]+$/.test(beforeSub)) {
              partValid = false;
              break;
            }
            let matchIdx = -1;
            let tempPDepth = 1;
            for (let j = i + 1; j < trimmed.length; j++) {
              if (trimmed[j] === '(') tempPDepth++;
              else if (trimmed[j] === ')') tempPDepth--;
              if (tempPDepth === 0) {
                matchIdx = j;
                break;
              }
            }
            if (matchIdx === -1) {
              partValid = false;
              break;
            }
            const content = trimmed.slice(i + 1, matchIdx).trim();
            if (content.length === 0) {
              partValid = false;
              break;
            }
            i = matchIdx + 1;
          } else if (char === '>' || char === '+' || char === '~') {
            let nextNonSpace = '';
            for (let j = i + 1; j < trimmed.length; j++) {
              if (!/\s/.test(trimmed[j])) {
                nextNonSpace = trimmed[j];
                break;
              }
            }
            if (!nextNonSpace || /[>+~]/.test(nextNonSpace)) {
              partValid = false;
              break;
            }
            i++;
          } else if (char === '<') {
            if (i + 1 < trimmed.length && /[a-zA-Z/!?]/.test(trimmed[i + 1])) {
              const { message, advice } = getCssMessage.htmlTagAsSelector(this.lang, trimmed);
              this.errors.push({
                type: 'CSS_PARSE_ERROR',
                message,
                advice,
                location: { start: this.getPos(part.start), end: this.getPos(part.end) }
              });
              return;
            } else {
              partValid = false;
              break;
            }
          } else if (char === '*' || char === '&') {
            i++;
          } else if (/[a-zA-Z0-9_-]/.test(char)) {
            i++;
          } else if (/\s/.test(char)) {
            i++;
          } else {
            if (char === '%') {
              i++;
            } else {
              partValid = false;
              break;
            }
          }
        }

        if (!partValid) {
          hasInvalid = true;
          break;
        }
      }
    }

    if (hasInvalid) {
      const { message, advice } = getCssMessage.invalidSelector(this.lang, selectorStr);
      this.errors.push({
        type: 'CSS_PARSE_ERROR',
        message,
        advice,
        location: { start: this.getPos(startIdx), end: this.getPos(endIdx) }
      });
      return;
    }

    if (!insideKeyframes && /\b\d+(?:\.\d+)?%/.test(selectorStr)) {
      const { message, advice } = getCssMessage.invalidKeyframeSelector(this.lang, selectorStr);
      this.errors.push({
        type: 'CSS_SELECTOR_VIOLATION',
        message: this.lang === 'fr'
          ? `Les sélecteurs de pourcentage (« ${selectorStr} ») ne sont autorisés qu'à l'intérieur de @keyframes.`
          : `Percentage selectors ("${selectorStr}") are only allowed inside @keyframes.`,
        advice,
        location: { start: this.getPos(startIdx), end: this.getPos(endIdx) }
      });
    }

    if (insideKeyframes) {
      const parts = selectorStr.split(',').map(s => s.trim());
      for (const part of parts) {
        if (part !== 'from' && part !== 'to' && !/^\d+(?:\.\d+)?%$/.test(part)) {
          const { message, advice } = getCssMessage.invalidKeyframeSelector(this.lang, part);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(startIdx), end: this.getPos(endIdx) }
          });
        }
      }
      return;
    }

    if (!this.options.allowSelectorLists && selectorStr.includes(',')) {
      const { message, advice } = getCssMessage.selectorListsForbidden(this.lang);
      this.errors.push({
        type: 'CSS_SELECTOR_VIOLATION',
        message,
        advice,
        location: { start: this.getPos(startIdx), end: this.getPos(endIdx) }
      });
    }

    let i = 0;
    let hasCombinator = false;

    while (i < selectorStr.length) {
      const char = selectorStr[i];
      const charIdx = startIdx + i;

      if (char === '*') {
        if (!this.options.allowUniversalSelector) {
          const { message, advice } = getCssMessage.universalSelectorForbidden(this.lang);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(charIdx), end: this.getPos(charIdx) }
          });
        }
        i++;
      } else if (char === '&') {
        if (!this.options.allowNestedRules) {
          const { message, advice } = getCssMessage.nestingSelectorForbidden(this.lang);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(charIdx), end: this.getPos(charIdx) }
          });
        }
        i++;
      } else if (char === '>' || char === '+' || char === '~') {
        hasCombinator = true;
        i++;
      } else if (char === '.') {
        const classStart = i;
        i++;
        while (i < selectorStr.length && /[a-zA-Z0-9_-]/.test(selectorStr[i])) {
          i++;
        }
        const className = selectorStr.slice(classStart, i);
        if (!this.options.allowClassSelectors) {
          const { message, advice } = getCssMessage.classSelectorForbidden(this.lang, className);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(startIdx + classStart), end: this.getPos(startIdx + i - 1) }
          });
        }
      } else if (char === '#') {
        const idStart = i;
        i++;
        while (i < selectorStr.length && /[a-zA-Z0-9_-]/.test(selectorStr[i])) {
          i++;
        }
        const idName = selectorStr.slice(idStart, i);
        if (!this.options.allowIdSelectors) {
          const { message, advice } = getCssMessage.idSelectorForbidden(this.lang, idName);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(startIdx + idStart), end: this.getPos(startIdx + i - 1) }
          });
        }
      } else if (char === ':') {
        const pseudoStart = i;
        i++;
        let isElement = false;
        if (selectorStr[i] === ':') {
          isElement = true;
          i++;
        }

        const nameStart = i;
        while (i < selectorStr.length && /[a-zA-Z0-9_-]/.test(selectorStr[i])) {
          i++;
        }
        const pseudoName = selectorStr.slice(nameStart, i).toLowerCase();

        if (!isElement && ['before', 'after', 'first-letter', 'first-line'].includes(pseudoName)) {
          isElement = true;
        }

        if (selectorStr[i] === '(') {
          let depth = 1;
          i++;
          while (i < selectorStr.length && depth > 0) {
            if (selectorStr[i] === '(') depth++;
            else if (selectorStr[i] === ')') depth--;
            i++;
          }
        }

        const fullPseudo = selectorStr.slice(pseudoStart, i);
        if (isElement) {
          if (!this.options.allowPseudoElements) {
            const { message, advice } = getCssMessage.pseudoElementForbidden(this.lang, fullPseudo);
            this.errors.push({
              type: 'CSS_SELECTOR_VIOLATION',
              message,
              advice,
              location: { start: this.getPos(startIdx + pseudoStart), end: this.getPos(startIdx + i - 1) }
            });
          }
        } else {
          if (!this.options.allowPeudoClasses) {
            const { message, advice } = getCssMessage.pseudoClassForbidden(this.lang, fullPseudo);
            this.errors.push({
              type: 'CSS_SELECTOR_VIOLATION',
              message,
              advice,
              location: { start: this.getPos(startIdx + pseudoStart), end: this.getPos(startIdx + i - 1) }
            });
          }
        }
      } else if (/[a-zA-Z]/.test(char)) {
        const typeStart = i;
        while (i < selectorStr.length && /[a-zA-Z0-9_-]/.test(selectorStr[i])) {
          i++;
        }
        const typeName = selectorStr.slice(typeStart, i);
        if (!this.options.allowTypeSelectors) {
          const { message, advice } = getCssMessage.typeSelectorForbidden(this.lang, typeName);
          this.errors.push({
            type: 'CSS_SELECTOR_VIOLATION',
            message,
            advice,
            location: { start: this.getPos(startIdx + typeStart), end: this.getPos(startIdx + i - 1) }
          });
        }
      } else if (/\s/.test(char)) {
        let prevIdx = i - 1;
        while (prevIdx >= 0 && /\s/.test(selectorStr[prevIdx])) prevIdx--;
        let nextIdx = i + 1;
        while (nextIdx < selectorStr.length && /\s/.test(selectorStr[nextIdx])) nextIdx++;

        if (prevIdx >= 0 && nextIdx < selectorStr.length) {
          const prevChar = selectorStr[prevIdx];
          const nextChar = selectorStr[nextIdx];
          if (prevChar !== ',' && prevChar !== '>' && prevChar !== '+' && prevChar !== '~' &&
              nextChar !== ',' && nextChar !== '>' && nextChar !== '+' && nextChar !== '~') {
            hasCombinator = true;
          }
        }
        i++;
      } else {
        i++;
      }
    }

    if (!this.options.allowCombinators && hasCombinator) {
      const { message, advice } = getCssMessage.combinatorsForbidden(this.lang);
      this.errors.push({
        type: 'CSS_SELECTOR_VIOLATION',
        message,
        advice,
        location: { start: this.getPos(startIdx), end: this.getPos(endIdx) }
      });
    }
  }

  public parse(): CSSCheckerError[] {
    while (this.index < this.code.length) {
      this.skipWhitespaceAndComments();
      if (this.index >= this.code.length) break;

      if (this.code[this.index] === '@') {
        this.parseAtRule(false);
      } else {
        this.parseStyleRule(false, false);
      }
    }

    this.errors.sort((a, b) => {
      const aLine = a.location?.start.line ?? 0;
      const bLine = b.location?.start.line ?? 0;
      if (aLine !== bLine) {
        return aLine - bLine;
      }
      const aCol = a.location?.start.column ?? 0;
      const bCol = b.location?.start.column ?? 0;
      return aCol - bCol;
    });

    return this.errors;
  }
}

export function checkCssSyntax(code: string, options?: CSSCheckerOptions, lang?: Language): CSSCheckerError[] {
  const chosenLang: Language = lang ?? 'en';
  const parser = new CSSParser(code, options, chosenLang);
  return parser.parse();
}
