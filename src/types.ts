export interface Position {
  line: number;
  column: number;
}

export const CHECKER_ERROR_TYPES = [
  'PARSE_ERROR',
  'DOCUMENT_STRUCTURE',
  'ALLOWED_TAGS',
  'CASE',
  'XHTML_SELF_CLOSING',
  'INVALID_CLOSING_TAG',
  'ALLOWED_ATTRIBUTES',
  'MISSING_REQUIRED_ATTRIBUTE',
  'CLOSING_TAG_MISMATCH',
  'MISSING_CHARSET',
  'MISSING_TITLE'
] as const;

export type CheckerErrorType = (typeof CHECKER_ERROR_TYPES)[number];

export interface CheckerError {
  type: CheckerErrorType;
  message: string;
  advice?: string;
  start: Position;
  end: Position;
}

export type Language = 'en' | 'fr';

export interface CheckerOptions {
  allowedTags?: string[];
  forbiddenTags?: string[];
  allowDeprecated_tags?: boolean;
  allowCustomTags?: boolean;
  xhtmlSelfClosing?: 'allowed' | 'forced' | 'forbidden';
  allowLowercaseTags?: boolean;
  allowUppercaseTags?: boolean;
  allowMixedcaseTags?: boolean;
  forbiddenAttributes?: string[];
  forceRequiredAttributes?: boolean;
  allowDeprecatedAttributes?: boolean;
  allowCustomAttributes?: boolean;
  allowLowercaseAttributes?: boolean;
  allowUppercaseAttributes?: boolean;
  allowMixedcaseAttributes?: boolean;
  checkFullStructure?: boolean;
  checkCharset?: boolean;
  checkTitle?: boolean;
}
