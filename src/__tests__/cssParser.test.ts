import { describe, it, expect } from 'vitest';
import { checkCssSyntax, getCssErrorTypeName } from '../index';

describe('CSS Syntax Checker', () => {
  describe('Basic Syntax Parsing', () => {
    it('accepts valid CSS with zero errors', () => {
      const code = 'h1 { color: red; margin: 10px 0; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('detects unclosed CSS comment', () => {
      const code = 'h1 { color: red; } /* unclosed';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].message).toContain('CSS comment is not closed');
    });

    it('detects missing selector before opening brace', () => {
      const code = '{ color: red; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });

    it('detects missing property colon', () => {
      const code = 'h1 { color red; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].message).toContain('missing a colon');
    });

    it('detects unclosed curly braces block', () => {
      const code = 'h1 { color: red;';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].location?.start).toEqual({ line: 1, column: 4 });
      expect(errors[0].location?.end).toEqual({ line: 1, column: 4 });
    });
  });

  describe('Selector Control Options', () => {
    it('flags type selectors when allowTypeSelectors is false', () => {
      const code = 'h1 { color: red; }';
      const errors = checkCssSyntax(code, { allowTypeSelectors: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags class selectors when allowClassSelectors is false', () => {
      const code = '.title { color: red; }';
      const errors = checkCssSyntax(code, { allowClassSelectors: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags ID selectors when allowIdSelectors is false', () => {
      const code = '#header { color: red; }';
      const errors = checkCssSyntax(code, { allowIdSelectors: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags universal selector when allowUniversalSelector is false', () => {
      const code = '* { box-sizing: border-box; }';
      const errors = checkCssSyntax(code, { allowUniversalSelector: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags selector lists when allowSelectorLists is false', () => {
      const code = 'h1, h2 { color: red; }';
      const errors = checkCssSyntax(code, { allowSelectorLists: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags combinators when allowCombinators is false', () => {
      const code = 'div > p { color: red; }';
      const errors = checkCssSyntax(code, { allowCombinators: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags descendant combinator when allowCombinators is false', () => {
      const code = 'div p { color: red; }';
      const errors = checkCssSyntax(code, { allowCombinators: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags nested rules when allowNestedRules is false', () => {
      const code = 'div { p { color: red; } }';
      const errors = checkCssSyntax(code, { allowNestedRules: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags pseudo-classes when allowPeudoClasses is false', () => {
      const code = 'a:hover { color: red; }';
      const errors = checkCssSyntax(code, { allowPeudoClasses: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags pseudo-elements when allowPseudoElements is false', () => {
      const code = 'p::after { content: ""; }';
      const errors = checkCssSyntax(code, { allowPseudoElements: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });

    it('flags legacy single-colon pseudo-elements when allowPseudoElements is false', () => {
      const code = 'p:after { content: ""; }';
      const errors = checkCssSyntax(code, { allowPseudoElements: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });
  });

  describe('@keyframes and keyframe selectors', () => {
    it('allows valid keyframe selectors inside keyframes', () => {
      const code = '@keyframes slide { from { left: 0px; } to { left: 100px; } 50% { left: 50px; } }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('flags type selectors inside keyframes as invalid keyframe selector', () => {
      const code = '@keyframes slide { div { left: 0px; } }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Invalid keyframe selector');
    });

    it('flags percentage selector outside keyframes as invalid type selector if allowTypeSelectors is false', () => {
      const code = '50% { left: 50px; }';
      const errors = checkCssSyntax(code, { allowTypeSelectors: false });
      expect(errors.filter(e => e.type === 'CSS_SELECTOR_VIOLATION')).toHaveLength(1);
    });
  });

  describe('Properties and Values Restrictions', () => {
    it('flags !important by default', () => {
      const code = 'h1 { color: red !important; }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
    });

    it('allows !important when allowImportant is true', () => {
      const code = 'h1 { color: red !important; }';
      const errors = checkCssSyntax(code, { allowImportant: true });
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(0);
    });

    it('limits to allowedProperties whitelist', () => {
      const code = 'h1 { color: red; margin: 10px; }';
      const errors = checkCssSyntax(code, { allowedProperties: ['color'] });
      expect(errors.filter(e => e.type === 'CSS_PROPERTY_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Property "margin" is not allowed');
    });

    it('blocks forbiddenProperties blacklist', () => {
      const code = 'h1 { float: left; color: red; }';
      const errors = checkCssSyntax(code, { forbiddenProperties: ['float'] });
      expect(errors.filter(e => e.type === 'CSS_PROPERTY_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Property "float" is forbidden');
    });
  });

  describe('Colors and Units whitelists', () => {
    it('allows valid colors but flags unauthorized formats', () => {
      const code = 'h1 { color: #f00; background-color: rgb(0,0,0); border-color: red; }';
      const errors = checkCssSyntax(code, { allowedColorFormats: ['hex', 'rgb'] });
      // red is a named color keyword, which is not in ['hex', 'rgb']
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
    });

    it('allows authorized units and flags unauthorized ones', () => {
      const code = 'h1 { font-size: 2rem; width: 10px; }';
      const errors = checkCssSyntax(code, { allowedUnits: ['px'] });
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Unit "rem" is not allowed');
    });
  });

  describe('Layout Controls', () => {
    it('flags flexbox properties when allowFlexbox is false', () => {
      const code = 'div { display: flex; flex-direction: column; }';
      const errors = checkCssSyntax(code, { allowFlexbox: false });
      expect(errors).toHaveLength(2);
    });

    it('flags grid properties when allowGrid is false', () => {
      const code = 'div { display: grid; grid-template-columns: 1fr 1fr; }';
      const errors = checkCssSyntax(code, { allowGrid: false });
      expect(errors).toHaveLength(2);
    });

    it('flags layout properties like gap when both are false', () => {
      const code = 'div { gap: 10px; }';
      const errors = checkCssSyntax(code, { allowFlexbox: false, allowGrid: false });
      expect(errors.filter(e => e.type === 'CSS_PROPERTY_VIOLATION')).toHaveLength(1);
    });
  });

  describe('Casing Options', () => {
    it('flags mixedcase properties by default', () => {
      const code = 'h1 { Color: red; }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_CASE_VIOLATION')).toHaveLength(1);
    });

    it('allows mixedcase properties when enabled', () => {
      const code = 'h1 { Color: red; }';
      const errors = checkCssSyntax(code, { allowMixedcaseProperties: true });
      expect(errors.filter(e => e.type === 'CSS_CASE_VIOLATION')).toHaveLength(0);
    });
  });

  describe('Structural rules', () => {
    it('flags empty rules by default', () => {
      const code = 'h1 {}';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_STRUCTURE_VIOLATION')).toHaveLength(1);
    });

    it('flags duplicate properties by default', () => {
      const code = 'h1 { color: red; color: blue; }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_STRUCTURE_VIOLATION')).toHaveLength(1);
    });
  });

  describe('Unit requirement for non-zero values', () => {
    it('allows 0 without unit', () => {
      const code = 'h1 { margin: 0; padding: 0px 0; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('flags non-zero numbers without units for length properties', () => {
      const code = 'h1 { margin: 10; width: 100; }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(2);
    });

    it('does not flag unitless numbers on properties where it is allowed', () => {
      const code = 'h1 { opacity: 0.5; z-index: 10; flex: 1; line-height: 1.5; font-weight: 400; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('handles font size and unitless line-height shorthand correctly', () => {
      const code = 'h1 { font: 12px/1.5 Arial; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('flags unitless font size shorthand correctly', () => {
      const code = 'h1 { font: 12/1.5 Arial; }';
      const errors = checkCssSyntax(code);
      expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
    });
  });

  describe('Localization & Casing Errors Names', () => {
    it('gives translations in French', () => {
      const code = 'h1 { color: red !important; }';
      const errors = checkCssSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain("L'utilisation de «\u00A0!important\u00A0» n'est pas autorisée");
      expect(getCssErrorTypeName(errors[0].type, 'fr')).toBe('Erreur de valeur CSS');
    });
  });

  describe('Semicolon Missing & Single Property Per Line Validation', () => {
    it('detects missing semicolon between properties on the same line', () => {
      const code = 'p { color: red width: 100%; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].message).toContain('Missing semicolon ";" at the end of declaration for property "color"');
      expect(errors[0].location?.start).toEqual({ line: 1, column: 5 });
      expect(errors[0].location?.end).toEqual({ line: 1, column: 14 });
    });

    it('detects missing semicolon between properties on separate lines', () => {
      const code = `
        p {
          color: red
          width: 100%
        }
      `;
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].message).toContain('Missing semicolon ";" at the end of declaration for property "color"');
      expect(errors[0].location?.start).toEqual({ line: 3, column: 11 });
      expect(errors[0].location?.end).toEqual({ line: 3, column: 20 });
    });

    it('does not flag single property per line by default', () => {
      const code = 'p { color: red; width: 100%; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('flags multiple properties on the same line when allowMultiplePropertiesPerLine is false', () => {
      const code = 'p { color: red; width: 100%; }';
      const errors = checkCssSyntax(code, { allowMultiplePropertiesPerLine: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_STRUCTURE_VIOLATION');
      expect(errors[0].message).toContain('Each property must be on its own line');
    });

    it('allows multiple properties on different lines when allowMultiplePropertiesPerLine is false', () => {
      const code = `
        p {
          color: red;
          width: 100%;
        }
      `;
      const errors = checkCssSyntax(code, { allowMultiplePropertiesPerLine: false });
      expect(errors).toHaveLength(0);
    });

    it('supports French localization for missing semicolon and multiple properties per line', () => {
      const code = 'p { color: red width: 100%; }';
      const errors = checkCssSyntax(code, { allowMultiplePropertiesPerLine: false }, 'fr');
      expect(errors[0].message).toContain('Point-virgule «\u00A0;\u00A0» manquant');

      const code2 = 'p { color: red; width: 100%; }';
      const errors2 = checkCssSyntax(code2, { allowMultiplePropertiesPerLine: false }, 'fr');
      expect(errors2[0].message).toContain('Chaque propriété doit être sur sa propre ligne');
    });
  });

  describe('Strict Selector Validation', () => {
    it('flags invalid selector with double/dangling pseudo-elements/pseudo-classes', () => {
      const code1 = 'body:: {\n  font-family: sans-serif;\n}';
      const errors1 = checkCssSyntax(code1);
      expect(errors1).toHaveLength(1);
      expect(errors1[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors1[0].message).toContain('Invalid selector');

      const code2 = 'body: {\n  font-family: sans-serif;\n}';
      const errors2 = checkCssSyntax(code2);
      expect(errors2).toHaveLength(1);
      expect(errors2[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors2[0].message).toContain('Invalid selector');
    });

    it('flags invalid selector with dangling/unclosed brackets', () => {
      const code = 'body[ {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
      expect(errors[0].message).toContain('Invalid selector');
    });

    it('flags invalid selector with empty pseudo-class parenthesis', () => {
      const code = 'body:not() {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });

    it('flags invalid selector with misplaced parenthesis', () => {
      const code = 'body(div) {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });

    it('flags invalid selector with double/consecutive combinators', () => {
      const code = 'div > > p {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });

    it('flags invalid selector with trailing combinator', () => {
      const code = 'div > {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });

    it('flags invalid selector with empty items in selector lists', () => {
      const code = 'div,,span {\n  font-family: sans-serif;\n}';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PARSE_ERROR');
    });
  });

  describe('Unrecognized Properties Option', () => {
    it('flags unrecognized properties by default (allowUnrecognizedProperties: false)', () => {
      const code = 'h1 { color-x: red; }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CSS_PROPERTY_VIOLATION');
      expect(errors[0].message).toContain('is unrecognized');
    });

    it('allows unrecognized properties when allowUnrecognizedProperties is true', () => {
      const code = 'h1 { color-x: red; }';
      const errors = checkCssSyntax(code, { allowUnrecognizedProperties: true });
      expect(errors).toHaveLength(0);
    });

    it('always allows custom properties starting with --', () => {
      const code = 'h1 { --primary-color: red; color: var(--primary-color); }';
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('respects allowedProperties whitelist', () => {
      const code = 'h1 { color: red; margin: 10px; }';
      const errors = checkCssSyntax(code, { allowedProperties: ['color'], allowUnrecognizedProperties: false });
      expect(errors.filter(e => e.type === 'CSS_PROPERTY_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Property "margin" is not allowed');
    });

    it('respects forbiddenProperties blacklist', () => {
      const code = 'h1 { float: left; color: red; }';
      const errors = checkCssSyntax(code, { forbiddenProperties: ['float'], allowUnrecognizedProperties: false });
      expect(errors.filter(e => e.type === 'CSS_PROPERTY_VIOLATION')).toHaveLength(1);
      expect(errors[0].message).toContain('Property "float" is forbidden');
    });
  });

  describe('CSS Property Value Validation', () => {
    it('flags invalid value assignments for common properties', () => {
      const invalidCodes = [
        'h1 { width: red; }',
        'h1 { color: 10px; }',
        'h1 { position: block; }',
        'h1 { display: relative; }',
        'h1 { padding: auto; }',
        'h1 { z-index: 1.5; }',
        'h1 { flex-grow: -1; }',
        'h1 { order: 1.2; }',
        'h1 { opacity: abc; }'
      ];
      for (const code of invalidCodes) {
        const errors = checkCssSyntax(code);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
        expect(errors[0].message).toContain('Invalid value');
      }
    });

    it('allows valid value assignments for common properties', () => {
      const validCodes = [
        'h1 { width: 100px; }',
        'h1 { width: 50%; }',
        'h1 { width: auto; }',
        'h1 { width: 0; }',
        'h1 { color: #f00; }',
        'h1 { color: rgb(255 0 0); }',
        'h1 { position: absolute; }',
        'h1 { display: flex; }',
        'h1 { padding: 10px 20px; }',
        'h1 { z-index: 99; }',
        'h1 { flex-grow: 2; }',
        'h1 { opacity: 0.8; }'
      ];
      for (const code of validCodes) {
        const errors = checkCssSyntax(code);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(0);
      }
    });

    it('skips validation for CSS variables and mathematical functions', () => {
      const codes = [
        'h1 { width: var(--my-width); }',
        'h1 { width: calc(100% - 10px); }',
        'h1 { color: var(--theme-color); }',
        'h1 { color: calc(var(--x) * 2); }',
        'h1 { margin: clamp(1rem, 2vw, 3rem); }'
      ];
      for (const code of codes) {
        const errors = checkCssSyntax(code);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(0);
      }
    });

    it('performs comprehensive validation for colors and reports sequential errors', () => {
      const validColors = [
        '#f00', '#ff0000', '#f00f', '#ff0000ff',
        'rgb(255, 99, 71)', 'rgba(255, 99, 71, 0.5)',
        'rgb(255 99 71)', 'rgb(255 99 71 / 0.5)', 'rgba(255 99 71 / 50%)',
        'hsl(120, 100%, 50%)', 'hsla(120, 100%, 50%, 0.3)',
        'hsl(120deg 100% 50% / 0.3)', 'hsl(none none none)',
        'hwb(120 10% 20% / 0.5)', 'lab(50% 40 30)', 'lch(50% 40 120deg)',
        'oklab(0.5 0.1 -0.1)', 'oklch(0.5 0.1 120 / 0.5)',
        'color(display-p3 1 0.5 0)', 'color-mix(in srgb, red 30%, blue)',
        'light-dark(white, black)'
      ];
      for (const color of validColors) {
        const errors = checkCssSyntax(`h1 { color: ${color}; }`);
        expect(errors).toHaveLength(0);
      }

      const testCases = [
        { color: '#f00g', reason: 'characters' },
        { color: '#f0', reason: 'digits' },
        { color: 'rgb(255, 0 0)', reason: 'mix' },
        { color: 'rgb(255 0 0 0.5)', reason: 'slash' },
        { color: 'rgb(255, 0, 0 / 0.5)', reason: 'slash' },
        { color: 'rgb(255, 0)', reason: 'arguments' },
        { color: 'hsl(120, 100, 50%)', reason: 'percentage' },
        { color: 'hwb(120, 10%, 20%)', reason: 'comma' },
        { color: 'color-mix(in srgb, red, blue, green)', reason: 'arguments' },
        { color: 'color-mix(in invalid-space, red, blue)', reason: 'space' },
        { color: 'light-dark(white)', reason: 'arguments' }
      ];
      for (const tc of testCases) {
        const errors = checkCssSyntax(`h1 { color: ${tc.color}; }`);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
        expect(errors[0].message).toContain('Invalid value');
        expect((errors[0].advice || "").toLowerCase()).toContain(tc.reason.toLowerCase());
      }
    });

    it('validates common shorthand properties (border, outline, background)', () => {
      const validShorthands = [
        'h1 { border: 1px solid red; }',
        'h1 { border: solid; }',
        'h1 { border: 2px #fff; }',
        'h1 { outline: thick dashed currentColor; }',
        'h1 { background: red; }',
        'h1 { background: url(bg.png) no-repeat center / cover; }',
        'h1 { background: url("bg.png") repeat-y padding-box border-box; }',
        'h1 { background: linear-gradient(red, blue) no-repeat center; }'
      ];
      for (const code of validShorthands) {
        const errors = checkCssSyntax(code);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(0);
      }

      const invalidShorthands = [
        { code: 'h1 { border: red green; }', reason: 'multiple color' },
        { code: 'h1 { border: 1px solid solid; }', reason: 'multiple style' },
        { code: 'h1 { border: 1px solid invalidColor; }', reason: 'unknown' },
        { code: 'h1 { outline: solid red blue; }', reason: 'multiple color' },
        { code: 'h1 { background: solid red; }', reason: 'unknown' },
        { code: 'h1 { background: red blue; }', reason: 'only' }
      ];
      for (const tc of invalidShorthands) {
        const errors = checkCssSyntax(tc.code);
        expect(errors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
        expect(errors[0].message).toContain('Invalid value');
        expect((errors[0].advice || "").toLowerCase()).toContain(tc.reason.toLowerCase());
      }
    });

    it('plays nice with other options (allowFlexbox, allowedColorFormats, allowedUnits)', () => {
      const flexCode = 'div { display: flex; }';
      const flexErrors = checkCssSyntax(flexCode, { allowFlexbox: false });
      expect(flexErrors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
      expect(flexErrors[0].message).toContain('Flexbox value');

      const rgbCode = 'div { color: rgb(255 0 0); }';
      const rgbErrors = checkCssSyntax(rgbCode, { allowedColorFormats: ['hex'] });
      expect(rgbErrors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
      expect(rgbErrors[0].message).toContain('Color format "rgb" is not allowed');

      const remCode = 'div { width: 10rem; }';
      const remErrors = checkCssSyntax(remCode, { allowedUnits: ['px'] });
      expect(remErrors.filter(e => e.type === 'CSS_VALUE_VIOLATION')).toHaveLength(1);
      expect(remErrors[0].message).toContain('Unit "rem" is not allowed');
    });

    it('handles French translations for values and advices', () => {
      const code = 'h1 { width: red; }';
      const errors = checkCssSyntax(code, {}, 'fr');
      expect(errors).toHaveLength(1);
      expect(errors[0].message).toContain('Valeur « red » non valide pour la propriété « width »');
      expect(errors[0].advice).toContain('Attendu');
    });
  });
});
