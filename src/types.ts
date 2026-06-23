export interface Position {
  line: number;
  column: number;
}

export interface CheckerError {
  type: string;
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
