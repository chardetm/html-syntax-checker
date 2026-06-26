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
  'MISSING_TITLE',
  'DUPLICATE_ID',
  'FORM_RULE',
  // CSS integrations in HTML
  'CSS_PARSE_ERROR',
  'CSS_SELECTOR_VIOLATION',
  'CSS_PROPERTY_VIOLATION',
  'CSS_VALUE_VIOLATION',
  'CSS_CASE_VIOLATION',
  'CSS_STRUCTURE_VIOLATION'
] as const;

export type HTMLCheckerErrorType = (typeof CHECKER_ERROR_TYPES)[number];

export interface HTMLCheckerError {
  type: HTMLCheckerErrorType;
  message: string;
  advice?: string;
  location?: {
    start: Position;
    end: Position;
  };
}

export type Language = 'en' | 'fr';

export interface CSSCheckerOptions {
  // Selector Control
  allowTypeSelectors?: boolean;           // Default: true. Match by tag name.
  allowClassSelectors?: boolean;          // Default: true.
  allowIdSelectors?: boolean;             // Default: true. Teachers often restrict IDs to discourage high-specificity traps.
  allowUniversalSelector?: boolean;       // Default: true. Controls the use of `*`.
  allowSelectorLists?: boolean;           // Default: true.
  allowCombinators?: boolean;             // Default: true. Child, descendent, sibling, ...
  allowNestedRules?: boolean;             // Default: true. Includes allowing the & nesting selector.
  allowAtRules?: boolean;                 // Default: true. Includes allowing keyframe selectors (which must be inside a @keyframes rule).
  allowPeudoClasses?: boolean;            // Default: true.
  allowPseudoElements?: boolean;          // Default: true.

  allowImportant?: boolean;               // Default: false. Crucial for beginners so they don't use !important as a crutch.

  // Properties & Values Whitelist/Blacklist (mutually exclusive)
  allowedProperties?: string[] | null;    // Default: null. Limit students to only the properties taught so far (e.g., color, margin).
  forbiddenProperties?: string[] | null;  // Default: null. Block advanced/confusing properties (e.g., float, grid-template-areas).

  // Colors & Units
  allowedColorFormats?: string[] | null;  // Default: null. Whitelist for color formats (hex, rgb, rgba, hsl, etc.) (all allowed if null).
  allowedUnits?: string[] | null;         // Default: null. Whitelist for units (all allowed if null).

  // Layout & Methods
  allowFlexbox?: boolean;                 // Default: true. Can be toggled off if teaching old-school layouts first.
  allowGrid?: boolean;                    // Default: true. 

  // Casing & Formatting
  allowLowercaseProperties?: boolean;     // Default: true.
  allowUppercaseProperties?: boolean;     // Default: true.
  allowMixedcaseProperties?: boolean;     // Default: false.

  // Structure & Empty Rules
  allowEmptyRules?: boolean;              // Default: false. Catches empty blocks like `h1 { }` left behind during coding.
  allowDuplicateProperties?: boolean;     // Default: false. Flags when a student accidentally writes `color: red;` twice in one block.
}

export type CSSCheckerErrorType =
  | 'CSS_PARSE_ERROR'
  | 'CSS_SELECTOR_VIOLATION'
  | 'CSS_PROPERTY_VIOLATION'
  | 'CSS_VALUE_VIOLATION'
  | 'CSS_CASE_VIOLATION'
  | 'CSS_STRUCTURE_VIOLATION';

export interface CSSCheckerError {
  type: CSSCheckerErrorType;
  message: string;
  advice?: string;
  location?: {
    start: Position;
    end: Position;
  };
}

export interface HTMLCheckerOptions {
  allowedTags?: string[] | null;
  forbiddenTags?: string[] | null;
  allowDeprecatedTags?: boolean;
  allowCustomTags?: boolean;
  xhtmlSelfClosing?: 'allowed' | 'forced' | 'forbidden';
  allowLowercaseTags?: boolean;
  allowUppercaseTags?: boolean;
  allowMixedcaseTags?: boolean;
  forbiddenAttributes?: string[] | null;
  forceRequiredAttributes?: boolean;
  allowDeprecatedAttributes?: boolean;
  allowCustomAttributes?: boolean;
  allowLowercaseAttributes?: boolean;
  allowUppercaseAttributes?: boolean;
  allowMixedcaseAttributes?: boolean;
  checkFullStructure?: boolean;
  checkCharset?: boolean;
  checkTitle?: boolean;
  requireFormControlsInForm?: boolean;
  requireLabelForInteractiveControls?: boolean;
  requireRadioButtonNameConsistency?: boolean;
  requireExplicitButtonType?: boolean;
  requireSelectHasOption?: boolean;
  cssOptions?: CSSCheckerOptions;
}
