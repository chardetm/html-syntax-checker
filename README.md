# HTML Syntax Checker

A lightweight, zero-dependency HTML syntax checker library written in TypeScript, specifically designed for beginners. 
The syntax errors and tips are returned in clear, accessible, and beginner-friendly language (English by default, French available).

## License

Copyright (c) 2026 Maverick Chardet

This project is licensed under the terms of the MIT license.

## Features

- **Lexical analysis**: Detects unclosed quotes, malformed tag syntax, unexpected symbols (e.g. raw `<`), and space formatting typos (e.g. `< div>`).
- **Tag matching**: Validates tag order and nesting (e.g., mismatched tags, closing void elements, unclosed tags at the end of the document) and suggests recovery tips.
- **Casing rules**: Enforces casing restrictions for tags and attributes (lowercase, uppercase, or mixedcase).
- **Attribute validation**: Checks for deprecated attributes, custom attributes, forbidden attributes, and missing required attributes (e.g., `alt` and `src` on `<img>`).
- **Full page structure**: Validates the presence of `<!DOCTYPE html>`, unique `<html>`, `<head>`, and `<body>` tags, and flags misplaced elements (e.g., visible elements in `<head>`, `<title>` in `<body>`, content outside `<html>`).
- **Head requirements**: Validates the presence of `<meta charset="...">` and `<title>...</title>` inside `<head>`.

## Installation

```bash
npm install html-syntax-checker
```

## Usage

```typescript
import { checkHtmlSyntax, CheckerOptions } from 'html-syntax-checker';

const htmlCode = `
<!DOCTYPE html>
<html>
  <head>
    <title>Ma page</title>
  </head>
  <body>
    <img src="logo.png">
  </body>
</html>
`;

const options: CheckerOptions = {
  forceRequiredAttributes: true,
  checkFullStructure: true
};

const errors = checkHtmlSyntax(htmlCode, options);

if (errors.length > 0) {
  errors.forEach(err => {
    console.log(`[${err.type}] Ligne ${err.start.line}, Col ${err.start.column} : ${err.message}`);
    if (err.advice) {
      console.log(`Conseil : ${err.advice}`);
    }
  });
} else {
  console.log("Aucune erreur détectée !");
}
```

## Configuration Options

The `checkHtmlSyntax` function takes an optional configuration object:

```typescript
export interface CheckerOptions {
  // Tags whitelist/blacklist (mutually exclusive)
  allowedTags?: string[];
  forbiddenTags?: string[];

  // Tag classification
  allowDeprecated_tags?: boolean; // Allowed by default. Set to false to reject tags like <center>, <font>, etc.
  allowCustomTags?: boolean;      // Allowed by default. Set to false to reject non-standard tags.

  // XHTML syntax
  xhtmlSelfClosing?: 'allowed' | 'forced' | 'forbidden'; // 'allowed' by default.

  // Tag casing
  allowLowercaseTags?: boolean;   // true by default
  allowUppercaseTags?: boolean;   // true by default
  allowMixedcaseTags?: boolean;   // true by default

  // Attributes
  forbiddenAttributes?: string[]; // Optional blacklist of attribute names
  forceRequiredAttributes?: boolean; // If true, checks if elements have required attributes (e.g. src & alt on img)
  allowDeprecatedAttributes?: boolean; // true by default. Set to false to reject attributes like align, bgcolor, etc.
  allowCustomAttributes?: boolean; // true by default. Set to false to reject non-standard attributes (not starting with data-).

  // Attribute casing
  allowLowercaseAttributes?: boolean; // true by default
  allowUppercaseAttributes?: boolean; // true by default
  allowMixedcaseAttributes?: boolean; // true by default

  // Structure
  checkFullStructure?: boolean; // If true, validates DOCTYPE, html, head, and body structure.
  checkCharset?: boolean;       // If true, requires <meta charset="..."> in <head>
  checkTitle?: boolean;         // If true, requires non-empty <title> in <head>
}
```

## Error Output Format

Each detected error has the following structure:

```typescript
export interface CheckerError {
  type: string;       // PARSE_ERROR, ALLOWED_TAGS, CASE, CLOSING_TAG_MISMATCH, INVALID_CLOSING_TAG, DOCUMENT_STRUCTURE, MISSING_REQUIRED_ATTRIBUTE, MISSING_CHARSET, MISSING_TITLE...
  message: string;    // Clear error message in French
  advice?: string;    // Optional tip/advice in French to fix the error
  start: Position;    // { line: number, column: number } (1-indexed)
  end: Position;      // { line: number, column: number } (1-indexed)
}
```

## Error Output Language

By default, the `checkHtmlSyntax` function returns error messages in English. You can change the language by passing the `lang` parameter (third parameter):

```typescript
import { checkHtmlSyntax } from 'html-syntax-checker';

const code = '<div><span></span></div>';

// English (explicitly)
const errorsEn = checkHtmlSyntax(code, {}, 'en');

// French
const errorsFr = checkHtmlSyntax(code, {}, 'fr');
```
