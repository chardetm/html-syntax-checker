import { Lexer } from './html/lexer';
import { checkHtml } from './html/parser';
import { CheckerOptions, CheckerError, Language, CSSCheckerOptions, CSSCheckerError } from './types';
export { getErrorTypeName } from './html/messages';
export { checkCssSyntax } from './css/parser';
export { getCssErrorTypeName } from './css/messages';

export function checkHtmlSyntax(code: string, options?: CheckerOptions, lang?: Language): CheckerError[] {
  const chosenLang: Language = lang ?? 'en';
  const lexer = new Lexer(code, chosenLang);
  const tokens = lexer.tokenize();
  return checkHtml(tokens, options, chosenLang);
}

export * from './types';
export { Lexer } from './html/lexer';
