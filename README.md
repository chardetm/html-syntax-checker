# HTML & CSS Syntax Checker

A lightweight, zero-dependency HTML and CSS syntax checker library written in TypeScript, specifically designed for students and beginners. It features beginner-friendly error messages and action-oriented debugging advice, available in both English and French.

The checker supports:
1. **HTML Validation** (lexical structure, tag hierarchy, tag/attribute constraints).
2. **Form Accessibility & Quality Rules** (missing labels, empty selects, duplicate field names, implicit button types).
3. **SVG Context Bypass** (automatically allows SVG tags, camelCase attributes, and self-closing syntax without casing/custom tag warnings).
4. **Embedded CSS Validation** (automatically validates CSS inside `<style>` blocks in HTML).
5. **Standalone CSS Validation** (validates `.css` sheets against selector, casing, color, and unit constraints).

## License

Copyright (c) 2026 Maverick Chardet. Licensed under the terms of the MIT license.

## Features

### HTML Checker
- **Lexical analysis**: Catches unclosed quotes, malformed tags, raw `<` signs, and tag-opening space typos (e.g. `< div>`).
- **Tag matching & hierarchy**: Validates tag nesting structure and suggestions (e.g. unclosed tags, mismatching closing tags).
- **Casing enforcement**: Allows strict lowercase, uppercase, or mixed-case control for tags and attributes.
- **Attributes checks**: Rejects deprecated attributes, flags custom attributes, restricts forbidden attributes, and requires vital attributes (e.g. `src` and `alt` on `<img>`).
- **Form rules**: Ensures labels are associated with interactive controls, buttons have explicit types inside forms, select elements contain options, radio button names are consistent within groups, and textareas do not contain `value` attributes.
- **Document structure**: Ensures DOCTYPE, html, head, title, meta charset, and body sections are present, unique, and contain correct children.

### CSS Checker (Embedded & Standalone)
- **CSS Parsing**: Detects unclosed comments, missing colons, invalid property-value formats, and unclosed blocks.
- **Selector restrictions**: Optionally restricts universal selector (`*`), ID selectors, class selectors, type selectors, combinators (`>`, `+`, `~`, spaces), pseudo-classes, pseudo-elements, and nested rules (`&`).
- **Properties & Values constraints**: Whitelists or blacklists allowed properties, forbids the use of `!important` as a crutch, and flags duplicate properties in the same block.
- **Colors & Units whitelists**: Enforces color formats (hex, rgb, rgba, hsl, hsla, oklch, oklab, hwb, named colors) and allowable units (e.g., px, em, rem).
- **Layout controls**: Toggles Flexbox and/or Grid properties on or off depending on the curriculum stage.

---

## Installation

```bash
npm install @chardetm/html-syntax-checker
```

---

## Usage

### 1. HTML Syntax Checking (including Embedded CSS)

```typescript
import { checkHtmlSyntax, HTMLCheckerOptions } from '@chardetm/html-syntax-checker';

const htmlCode = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My First Webpage</title>
    <style>
      body {
        margin: 0;
        background-color: rgb(255 255 255);
      }
      h1 { color: red !important; } /* Will flag !important under CSS strict options */
    </style>
  </head>
  <body>
    <form action="/submit">
      <input type="text" id="username"> <!-- Missing label association -->
      <button class="submit-btn">Submit</button> <!-- Missing explicit type -->
    </form>
  </body>
</html>
`;

const options: HTMLCheckerOptions = {
  checkFullStructure: true,
  checkCharset: true,
  checkTitle: true,
  requireLabelForInteractiveControls: true,
  requireExplicitButtonType: true,
  cssOptions: {
    allowImportant: false // strict CSS settings
  }
};

// Check syntax (English by default)
const errors = checkHtmlSyntax(htmlCode, options);

errors.forEach(err => {
  const lineInfo = err.location ? `Line ${err.location.start.line}:${err.location.start.column}` : "Unknown location";
  console.log(`[${err.type}] ${lineInfo} - ${err.message}`);
  if (err.advice) {
    console.log(`Advice: ${err.advice}`);
  }
});
```

### 2. Standalone CSS Syntax Checking

```typescript
import { checkCssSyntax, CSSCheckerOptions } from '@chardetm/html-syntax-checker';

const cssCode = `
.card {
  display: flex;
  margin: 10; /* Missing unit for non-zero margin */
  background-color: oklch(70% 0.12 145);
}
`;

const options: CSSCheckerOptions = {
  allowFlexbox: false, // restrict layout tools
  allowedColorFormats: ['hex', 'rgb'] // restrict modern color spaces
};

// Check CSS syntax (French output)
const errors = checkCssSyntax(cssCode, options, 'fr');

errors.forEach(err => {
  console.log(`[${err.type}] ${err.message}`);
});
```

---

## Configuration Reference

### HTML Checker Options (`HTMLCheckerOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `allowedTags` | `string[]` | `null` | Whitelist of allowed HTML tags (mutually exclusive with `forbiddenTags`). |
| `forbiddenTags` | `string[]` | `null` | Blacklist of forbidden HTML tags. |
| `allowDeprecatedTags` | `boolean` | `true` | Set to `false` to reject obsolete tags (like `<center>`, `<font>`). |
| `allowCustomTags` | `boolean` | `false` | Enables custom elements (non-standard tags). |
| `xhtmlSelfClosing` | `'allowed'\|'forced'\|'forbidden'` | `'allowed'` | Configuration of self-closing tag syntax. |
| `allowLowercaseTags` | `boolean` | `true` | Set to `false` to reject lowercase tags. |
| `allowUppercaseTags` | `boolean` | `true` | Set to `false` to reject uppercase tags. |
| `allowMixedcaseTags` | `boolean` | `false` | Set to `true` to allow mixed casing in tag names. |
| `forbiddenAttributes` | `string[]` | `null` | Blacklist of attribute names. |
| `forceRequiredAttributes` | `boolean` | `true` | Requires standard attributes (e.g. `alt` on `<img>`). |
| `allowDeprecatedAttributes` | `boolean` | `true` | Rejects obsolete attributes (e.g. `align` or `bgcolor`). |
| `allowCustomAttributes` | `boolean` | `false` | Allows non-standard attribute names. |
| `checkFullStructure` | `boolean` | `false` | Enforces standard DOCTYPE, html, head, and body layout. |
| `checkCharset` | `boolean` | `false` | Requires a `<meta charset="...">` tag in the `<head>`. |
| `checkTitle` | `boolean` | `false` | Requires a non-empty `<title>` tag in the `<head>`. |
| `requireFormControlsInForm` | `boolean` | `false` | Flags form controls that are placed outside of a `<form>`. |
| `requireLabelForInteractiveControls` | `boolean` | `false` | Requires a label association (explicit or nested) for inputs. |
| `requireRadioButtonNameConsistency` | `boolean` | `false` | Enforces name attribute presence and size >= 2 for radio groups. |
| `requireExplicitButtonType` | `boolean` | `false` | Requires `<button>` inside `<form>` to have explicit type attributes. |
| `requireSelectHasOption` | `boolean` | `false` | Rejects `<select>` tags that have no child `<option>` tags. |
| `cssOptions` | `CSSCheckerOptions` | `{}` | Nested options config passed to CSS parser for `<style>` blocks. |

### CSS Checker Options (`CSSCheckerOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `allowTypeSelectors` | `boolean` | `true` | Controls matching elements by tag name. |
| `allowClassSelectors` | `boolean` | `true` | Controls the use of classes (`.class`). |
| `allowIdSelectors` | `boolean` | `true` | Controls the use of IDs (`#id`) to discourage specificity traps. |
| `allowUniversalSelector` | `boolean` | `true` | Controls usage of the `*` selector. |
| `allowSelectorLists` | `boolean` | `true` | Set to `false` to restrict multi-selectors (comma-separated). |
| `allowCombinators` | `boolean` | `true` | Restricts combinators (`>`, `+`, `~`, spaces). |
| `allowNestedRules` | `boolean` | `true` | Allows rules nesting (including the `&` nesting selector). |
| `allowAtRules` | `boolean` | `true` | Allows at-rules such as `@media` and `@keyframes`. |
| `allowPeudoClasses` | `boolean` | `true` | Controls usage of pseudo-classes (e.g. `:hover`). |
| `allowPseudoElements` | `boolean` | `true` | Controls usage of pseudo-elements (e.g. `::before`). |
| `allowImportant` | `boolean` | `false` | Flags `!important` usage when set to `false`. |
| `allowedProperties` | `string[]` | `null` | Whitelist of allowed properties (e.g. only `color` and `margin`). |
| `forbiddenProperties` | `string[]` | `null` | Blacklist of forbidden properties (e.g. block `float` or `grid-area`). |
| `allowedColorFormats` | `string[]` | `null` | Whitelist of allowed color functions (hex, rgb, rgba, hsl, oklch, etc.). |
| `allowedUnits` | `string[]` | `null` | Whitelist of allowed units (px, em, rem, %, etc.). |
| `allowFlexbox` | `boolean` | `true` | Enables Flexbox properties. |
| `allowGrid` | `boolean` | `true` | Enables Grid properties. |
| `allowLowercaseProperties` | `boolean` | `true` | Set to `false` to reject lowercase properties. |
| `allowUppercaseProperties` | `boolean` | `true` | Set to `false` to reject uppercase properties. |
| `allowMixedcaseProperties` | `boolean` | `false` | Set to `true` to allow mixed casing in properties. |
| `allowEmptyRules` | `boolean` | `false` | Flags empty css selector blocks. |
| `allowDuplicateProperties` | `boolean` | `false` | Flags duplicate declarations of the same property in a block. |

---

## Localization Support

All errors and tips are bilingual. Set the language parameter to `'en'` (English) or `'fr'` (French):

```typescript
import { checkHtmlSyntax } from '@chardetm/html-syntax-checker';

// Returns messages in French, using proper French quotation marks (« and »)
const errors = checkHtmlSyntax(code, {}, 'fr');
```
