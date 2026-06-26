import { Position, Language } from '../types';
import { getMessage } from './messages';

export type Token =
  | { type: 'DOCTYPE'; raw: string; start: Position; end: Position }
  | { type: 'TAG_OPEN'; name: string; isSelfClosing: boolean; start: Position; end: Position }
  | { type: 'TAG_CLOSE'; name: string; start: Position; end: Position }
  | {
      type: 'ATTRIBUTE';
      name: string;
      value: string | null;
      raw: string;
      start: Position;
      end: Position;
      nameStart: Position;
      nameEnd: Position;
      valueStart?: Position;
      valueEnd?: Position;
      quoteType?: string; // '"', "'", or undefined
    }
  | { type: 'TEXT'; value: string; start: Position; end: Position }
  | { type: 'COMMENT'; value: string; start: Position; end: Position }
  | { type: 'LEX_ERROR'; message: string; advice?: string; start: Position; end: Position };

export class Lexer {
  private code: string;
  private index: number = 0;
  private posMap: Position[] = [];
  private lang: Language;

  constructor(code: string, lang: Language = 'en') {
    this.code = code;
    this.lang = lang;
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

  private peek(n: number = 0): string {
    if (this.index + n >= this.code.length) return '';
    return this.code[this.index + n];
  }

  private advance(n: number = 1) {
    this.index += n;
  }

  private isWhitespace(char: string): boolean {
    return char === ' ' || char === '\t' || char === '\n' || char === '\r' || char === '\f';
  }

  private skipWhitespace() {
    while (this.index < this.code.length && this.isWhitespace(this.peek())) {
      this.advance();
    }
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.index < this.code.length) {
      const startIdx = this.index;
      const char = this.peek();

      if (char === '<') {
        // Comment
        if (this.peek(1) === '!' && this.peek(2) === '-' && this.peek(3) === '-') {
          this.advance(4); // '<!--'
          const contentStart = this.index;
          let foundClose = false;
          while (this.index < this.code.length) {
            if (this.peek(0) === '-' && this.peek(1) === '-' && this.peek(2) === '>') {
              foundClose = true;
              break;
            }
            this.advance();
          }

          if (!foundClose) {
            const { message, advice } = getMessage.unclosedComment(this.lang);
            tokens.push({
              type: 'LEX_ERROR',
              message,
              advice,
              start: this.getPos(startIdx),
              end: this.getPos(this.code.length - 1),
            });
            break;
          }

          const contentEnd = this.index;
          this.advance(3); // '-->'
          tokens.push({
            type: 'COMMENT',
            value: this.code.slice(contentStart, contentEnd),
            start: this.getPos(startIdx),
            end: this.getPos(this.index - 1),
          });
          continue;
        }

        // Doctype
        if (this.peek(1) === '!' && this.code.slice(this.index, this.index + 9).toLowerCase() === '<!doctype') {
          const doctypeStart = this.index;
          let foundClose = false;
          while (this.index < this.code.length) {
            if (this.peek() === '>') {
              foundClose = true;
              break;
            }
            this.advance();
          }

          if (!foundClose) {
            const { message, advice } = getMessage.unclosedDoctype(this.lang);
            tokens.push({
              type: 'LEX_ERROR',
              message,
              advice,
              start: this.getPos(doctypeStart),
              end: this.getPos(this.code.length - 1),
            });
            break;
          }

          this.advance(); // '>'
          tokens.push({
            type: 'DOCTYPE',
            raw: this.code.slice(doctypeStart, this.index),
            start: this.getPos(doctypeStart),
            end: this.getPos(this.index - 1),
          });
          continue;
        }

        // Closing tag
        if (this.peek(1) === '/') {
          this.advance(2); // '</'
          this.skipWhitespace();
          const nameStart = this.index;
          while (this.index < this.code.length && /[a-zA-Z0-9:-]/.test(this.peek())) {
            this.advance();
          }
          const name = this.code.slice(nameStart, this.index);
          this.skipWhitespace();

          if (this.peek() !== '>') {
            let errEnd = this.index;
            while (this.index < this.code.length && this.peek() !== '>' && this.peek() !== '<') {
              this.advance();
              errEnd = this.index;
            }
            const hasClose = this.peek() === '>';
            if (hasClose) this.advance(); // consume '>'

            const { message, advice } = getMessage.malformedClosingTag(this.lang, name);
            tokens.push({
              type: 'LEX_ERROR',
              message,
              advice,
              start: this.getPos(startIdx),
              end: this.getPos(hasClose ? this.index - 1 : errEnd - 1),
            });
            continue;
          }

          this.advance(); // '>'
          tokens.push({
            type: 'TAG_CLOSE',
            name,
            start: this.getPos(startIdx),
            end: this.getPos(this.index - 1),
          });
          continue;
        }

        // Check for space after < (e.g. "< div>")
        // Must require a letter at the start of the tag name to avoid matching mathematical operators like "< 20"
        const spaceTagMatch = this.code.slice(this.index).match(/^<\s+([a-zA-Z][a-zA-Z0-9:-]*)/);
        if (spaceTagMatch) {
          const fullMatch = spaceTagMatch[0];
          const tagName = spaceTagMatch[1];
          const errEndIdx = this.index + fullMatch.length;
          const { message, advice } = getMessage.spaceAfterLessThan(this.lang, tagName);
          tokens.push({
            type: 'LEX_ERROR',
            message,
            advice,
            start: this.getPos(this.index),
            end: this.getPos(errEndIdx - 1),
          });
          this.advance(fullMatch.length);
          continue;
        }

        // Opening tag
        if (/[a-zA-Z]/.test(this.peek(1))) {
          this.advance(); // '<'
          const nameStart = this.index;
          while (this.index < this.code.length && /[a-zA-Z0-9:-]/.test(this.peek())) {
            this.advance();
          }
          const name = this.code.slice(nameStart, this.index);

          const tagAttributes: Token[] = [];
          let isSelfClosing = false;
          let tagUnclosed = false;
          let hasLexError = false;

          while (true) {
            this.skipWhitespace();

            if (this.index >= this.code.length) {
              tagUnclosed = true;
              break;
            }

            const nextChar = this.peek();

            if (nextChar === '>') {
              this.advance(); // '>'
              break;
            }

            if (nextChar === '/' && this.peek(1) === '>') {
              isSelfClosing = true;
              this.advance(2); // '/>'
              break;
            }

            if (nextChar === '<') {
              tagUnclosed = true;
              break;
            }

            // Parse attribute
            const attrStartIdx = this.index;
            const nameStartIdx = this.index;
            while (this.index < this.code.length && /[^\s/>="']/.test(this.peek())) {
              this.advance();
            }
            const attrName = this.code.slice(nameStartIdx, this.index);

            if (!attrName) {
              const errChar = this.peek();
              const { message, advice } = getMessage.unexpectedCharInTag(this.lang, errChar, name);
              tokens.push({
                type: 'LEX_ERROR',
                message,
                advice,
                start: this.getPos(this.index),
                end: this.getPos(this.index),
              });
              hasLexError = true;
              this.advance(); // skip to avoid infinite loop
              continue;
            }

            const nameEndIdx = this.index;
            this.skipWhitespace();

            let attrValue: string | null = null;
            let valStartIdx: number | undefined;
            let valEndIdx: number | undefined;
            let quoteType: string | undefined;

            if (this.peek() === '=') {
              this.advance(); // '='
              this.skipWhitespace();

              const nextValChar = this.peek();
              if (nextValChar === '"' || nextValChar === "'") {
                quoteType = nextValChar;
                this.advance(); // quote
                valStartIdx = this.index;
                while (this.index < this.code.length && this.peek() !== quoteType) {
                  this.advance();
                }

                if (this.index >= this.code.length) {
                  const { message, advice } = getMessage.unclosedAttributeQuote(this.lang, attrName, quoteType);
                  tokens.push({
                    type: 'LEX_ERROR',
                    message,
                    advice,
                    start: this.getPos(attrStartIdx),
                    end: this.getPos(this.code.length - 1),
                  });
                  tagUnclosed = true;
                  hasLexError = true;
                  break;
                }

                attrValue = this.code.slice(valStartIdx, this.index);
                valEndIdx = this.index;
                this.advance(); // quote
              } else {
                // Unquoted attribute value
                valStartIdx = this.index;
                while(
                  this.index < this.code.length &&
                  !this.isWhitespace(this.peek()) &&
                  this.peek() !== '>' &&
                  !(this.peek() === '/' && this.peek(1) === '>')
                ) {
                  this.advance();
                }
                attrValue = this.code.slice(valStartIdx, this.index);
                valEndIdx = this.index;
              }
            }

            tagAttributes.push({
              type: 'ATTRIBUTE',
              name: attrName,
              value: attrValue,
              raw: this.code.slice(attrStartIdx, this.index),
              start: this.getPos(attrStartIdx),
              end: this.getPos(this.index - 1),
              nameStart: this.getPos(nameStartIdx),
              nameEnd: this.getPos(nameEndIdx - 1),
              valueStart: valStartIdx !== undefined ? this.getPos(valStartIdx) : undefined,
              valueEnd: valEndIdx !== undefined ? this.getPos(valEndIdx - 1) : undefined,
              quoteType,
            });
          }

          if (tagUnclosed) {
            if (!hasLexError) {
              const { message, advice } = getMessage.unclosedOpeningTag(this.lang, name);
              tokens.push({
                type: 'LEX_ERROR',
                message,
                advice,
                start: this.getPos(startIdx),
                end: this.getPos(this.index - 1),
              });
            }
            continue; // Skip TAG_OPEN emission entirely if unclosed tag or quote lex error
          }

          tokens.push({
            type: 'TAG_OPEN',
            name,
            isSelfClosing,
            start: this.getPos(startIdx),
            end: this.getPos(this.index - 1),
          });

          tokens.push(...tagAttributes);
          continue;
        }

        // Just a raw '<'
        const { message, advice } = getMessage.unexpectedLessThan(this.lang);
        tokens.push({
          type: 'LEX_ERROR',
          message,
          advice,
          start: this.getPos(startIdx),
          end: this.getPos(startIdx),
        });
        this.advance();
        continue;
      }

      // Read text until '<'
      const textStart = this.index;
      while (this.index < this.code.length && this.peek() !== '<') {
        this.advance();
      }
      tokens.push({
        type: 'TEXT',
        value: this.code.slice(textStart, this.index),
        start: this.getPos(textStart),
        end: this.getPos(this.index - 1),
      });
    }

    return tokens;
  }
}
