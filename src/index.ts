import { Lexer } from './lexer';
import { checkHtml } from './parser';
import { CheckerOptions, CheckerError, Language } from './types';

export function checkHtmlSyntax(code: string, options?: CheckerOptions, lang?: Language): CheckerError[] {
  const chosenLang: Language = lang ?? 'en';
  const lexer = new Lexer(code, chosenLang);
  const tokens = lexer.tokenize();
  return checkHtml(tokens, options, chosenLang);
}

export * from './types';
export { Lexer } from './lexer';
