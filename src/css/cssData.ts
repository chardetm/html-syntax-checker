import { Language } from '../types';

// Standard CSS Named Colors (140 colors + transparent + currentcolor)
export const NAMED_COLORS = new Set([
  'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple', 'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue', 'teal', 'aqua', 'orange',
  'aliceblue', 'antiquewhite', 'aquamarine', 'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse',
  'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
  'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
  'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen',
  'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
  'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink',
  'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 'magenta',
  'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
  'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab', 'orangered', 'orchid', 'palegoldenrod',
  'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'rosybrown', 'royalblue', 'saddlebrown',
  'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan',
  'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'whitesmoke', 'yellowgreen',
  'transparent', 'currentcolor'
]);

// CSS Properties that require units for non-zero values (lengths, times, angles, etc.)
export const PROPERTIES_REQUIRING_UNITS = new Set([
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'font-size', 'top', 'bottom', 'left', 'right',
  'border-width', 'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'outline-width', 'outline-offset',
  'letter-spacing', 'word-spacing', 'text-indent',
  'column-width', 'column-gap', 'row-gap', 'gap',
  'flex-basis',
  'grid-gap', 'grid-row-gap', 'grid-column-gap',
  'grid-template-columns', 'grid-template-rows',
  'background-position', 'background-size', 'background-position-x', 'background-position-y',
  'box-shadow', 'text-shadow',
  // shorthands
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'outline',
  'font',
  'transition', 'transition-duration', 'transition-delay',
  'animation', 'animation-duration', 'animation-delay'
]);

// Flexbox properties
export const FLEXBOX_PROPERTIES = new Set([
  'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'justify-content',
  'align-items', 'align-content', 'align-self', 'order', 'flex-grow',
  'flex-shrink', 'flex-basis'
]);

// Grid properties
export const GRID_PROPERTIES = new Set([
  'grid', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
  'grid-template', 'grid-column-gap', 'grid-row-gap', 'grid-gap',
  'justify-items', 'place-items', 'grid-auto-columns',
  'grid-auto-rows', 'grid-auto-flow', 'grid-column', 'grid-row', 'grid-area',
  'grid-column-start', 'grid-column-end', 'grid-row-start', 'grid-row-end'
]);

// Layout properties shared between grid and flexbox
export const SHARED_LAYOUT_PROPERTIES = new Set([
  'gap', 'row-gap', 'column-gap'
]);

// Properties that can contain colors (for validating allowedColorFormats)
export const COLOR_CONTAINING_PROPERTIES = new Set([
  'color', 'background-color', 'border-color', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'outline-color', 'text-decoration-color', 'column-rule-color',
  'background', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'outline', 'box-shadow', 'text-shadow'
]);

// Comprehensive list of standard CSS properties
export const KNOWN_CSS_PROPERTIES = new Set([
  'accent-color',
  'align-content',
  'align-items',
  'align-self',
  'alignment-baseline',
  'all',
  'anchor-name',
  'anchor-scope',
  'animation',
  'animation-composition',
  'animation-delay',
  'animation-direction',
  'animation-duration',
  'animation-fill-mode',
  'animation-iteration-count',
  'animation-name',
  'animation-play-state',
  'animation-range',
  'animation-range-end',
  'animation-range-start',
  'animation-timeline',
  'animation-timing-function',
  'animation-trigger',
  'appearance',
  'aspect-ratio',
  'backdrop-filter',
  'backface-visibility',
  'background',
  'background-attachment',
  'background-blend-mode',
  'background-clip',
  'background-color',
  'background-image',
  'background-origin',
  'background-position',
  'background-position-x',
  'background-position-y',
  'background-repeat',
  'background-size',
  'baseline-shift',
  'baseline-source',
  'block-size',
  'border',
  'border-block',
  'border-block-color',
  'border-block-end',
  'border-block-end-color',
  'border-block-end-style',
  'border-block-end-width',
  'border-block-start',
  'border-block-start-color',
  'border-block-start-style',
  'border-block-start-width',
  'border-block-style',
  'border-block-width',
  'border-bottom',
  'border-bottom-color',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-style',
  'border-bottom-width',
  'border-collapse',
  'border-color',
  'border-end-end-radius',
  'border-end-start-radius',
  'border-image',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',
  'border-image-source',
  'border-image-width',
  'border-inline',
  'border-inline-color',
  'border-inline-end',
  'border-inline-end-color',
  'border-inline-end-style',
  'border-inline-end-width',
  'border-inline-start',
  'border-inline-start-color',
  'border-inline-start-style',
  'border-inline-start-width',
  'border-inline-style',
  'border-inline-width',
  'border-left',
  'border-left-color',
  'border-left-style',
  'border-left-width',
  'border-radius',
  'border-right',
  'border-right-color',
  'border-right-style',
  'border-right-width',
  'border-shape',
  'border-spacing',
  'border-start-end-radius',
  'border-start-start-radius',
  'border-style',
  'border-top',
  'border-top-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-style',
  'border-top-width',
  'border-width',
  'bottom',
  'box-decoration-break',
  'box-shadow',
  'box-sizing',
  'break-after',
  'break-before',
  'break-inside',
  'caption-side',
  'caret',
  'caret-animation',
  'caret-color',
  'caret-shape',
  'clear',
  'clip',
  'clip-path',
  'clip-rule',
  'color',
  'color-interpolation-filters',
  'color-scheme',
  'column-count',
  'column-fill',
  'column-gap',
  'column-height',
  'column-rule',
  'column-rule-color',
  'column-rule-style',
  'column-rule-width',
  'column-span',
  'column-width',
  'column-wrap',
  'columns',
  'contain',
  'contain-intrinsic-block-size',
  'contain-intrinsic-height',
  'contain-intrinsic-inline-size',
  'contain-intrinsic-size',
  'contain-intrinsic-width',
  'container',
  'container-name',
  'container-type',
  'content',
  'content-visibility',
  'corner-block-end-shape',
  'corner-block-start-shape',
  'corner-bottom-left-shape',
  'corner-bottom-right-shape',
  'corner-bottom-shape',
  'corner-end-end-shape',
  'corner-end-start-shape',
  'corner-inline-end-shape',
  'corner-inline-start-shape',
  'corner-left-shape',
  'corner-right-shape',
  'corner-shape',
  'corner-start-end-shape',
  'corner-start-start-shape',
  'corner-top-left-shape',
  'corner-top-right-shape',
  'corner-top-shape',
  'counter-increment',
  'counter-reset',
  'counter-set',
  'cursor',
  'cx',
  'cy',
  'd',
  'direction',
  'display',
  'dominant-baseline',
  'dynamic-range-limit',
  'empty-cells',
  'field-sizing',
  'fill',
  'fill-opacity',
  'fill-rule',
  'filter',
  'flex',
  'flex-basis',
  'flex-direction',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-wrap',
  'float',
  'flood-color',
  'flood-opacity',
  'font',
  'font-family',
  'font-feature-settings',
  'font-kerning',
  'font-language-override',
  'font-optical-sizing',
  'font-palette',
  'font-size',
  'font-size-adjust',
  'font-stretch',
  'font-style',
  'font-synthesis',
  'font-synthesis-position',
  'font-synthesis-small-caps',
  'font-synthesis-style',
  'font-synthesis-weight',
  'font-variant',
  'font-variant-alternates',
  'font-variant-caps',
  'font-variant-east-asian',
  'font-variant-emoji',
  'font-variant-ligatures',
  'font-variant-numeric',
  'font-variant-position',
  'font-variation-settings',
  'font-weight',
  'font-width',
  'forced-color-adjust',
  'gap',
  'grid',
  'grid-area',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-auto-rows',
  'grid-column',
  'grid-column-end',
  'grid-column-gap',
  'grid-column-start',
  'grid-gap',
  'grid-row',
  'grid-row-end',
  'grid-row-gap',
  'grid-row-start',
  'grid-template',
  'grid-template-areas',
  'grid-template-columns',
  'grid-template-rows',
  'hanging-punctuation',
  'height',
  'hyphenate-character',
  'hyphenate-limit-chars',
  'hyphens',
  'image-orientation',
  'image-rendering',
  'image-resolution',
  'initial-letter',
  'initial-letter-align',
  'inline-size',
  'inset',
  'inset-block',
  'inset-block-end',
  'inset-block-start',
  'inset-inline',
  'inset-inline-end',
  'inset-inline-start',
  'interactivity',
  'interest-delay',
  'interest-delay-end',
  'interest-delay-start',
  'interpolate-size',
  'isolation',
  'justify-content',
  'justify-items',
  'justify-self',
  'left',
  'letter-spacing',
  'lighting-color',
  'line-break',
  'line-clamp',
  'line-height',
  'line-height-step',
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'margin',
  'margin-block',
  'margin-block-end',
  'margin-block-start',
  'margin-bottom',
  'margin-inline',
  'margin-inline-end',
  'margin-inline-start',
  'margin-left',
  'margin-right',
  'margin-top',
  'margin-trim',
  'marker',
  'marker-end',
  'marker-mid',
  'marker-start',
  'mask',
  'mask-border',
  'mask-border-mode',
  'mask-border-outset',
  'mask-border-repeat',
  'mask-border-slice',
  'mask-border-source',
  'mask-border-width',
  'mask-clip',
  'mask-composite',
  'mask-image',
  'mask-mode',
  'mask-origin',
  'mask-position',
  'mask-repeat',
  'mask-size',
  'mask-type',
  'math-depth',
  'math-shift',
  'math-style',
  'max-block-size',
  'max-height',
  'max-inline-size',
  'max-lines',
  'max-width',
  'min-block-size',
  'min-height',
  'min-inline-size',
  'min-width',
  'mix-blend-mode',
  'object-fit',
  'object-position',
  'object-view-box',
  'offset',
  'offset-anchor',
  'offset-distance',
  'offset-path',
  'offset-position',
  'offset-rotate',
  'opacity',
  'order',
  'orphans',
  'outline',
  'outline-color',
  'outline-offset',
  'outline-style',
  'outline-width',
  'overflow',
  'overflow-anchor',
  'overflow-block',
  'overflow-clip-margin',
  'overflow-inline',
  'overflow-wrap',
  'overflow-x',
  'overflow-y',
  'overlay',
  'overscroll-behavior',
  'overscroll-behavior-block',
  'overscroll-behavior-inline',
  'overscroll-behavior-x',
  'overscroll-behavior-y',
  'padding',
  'padding-block',
  'padding-block-end',
  'padding-block-start',
  'padding-bottom',
  'padding-inline',
  'padding-inline-end',
  'padding-inline-start',
  'padding-left',
  'padding-right',
  'padding-top',
  'page',
  'page-break-after',
  'page-break-before',
  'page-break-inside',
  'paint-order',
  'perspective',
  'perspective-origin',
  'place-content',
  'place-items',
  'place-self',
  'pointer-events',
  'position',
  'position-anchor',
  'position-area',
  'position-try',
  'position-try-fallbacks',
  'position-try-order',
  'position-visibility',
  'print-color-adjust',
  'quotes',
  'r',
  'reading-flow',
  'reading-order',
  'resize',
  'right',
  'rotate',
  'row-gap',
  'ruby-align',
  'ruby-merge',
  'ruby-overhang',
  'ruby-position',
  'rx',
  'ry',
  'scale',
  'scroll-behavior',
  'scroll-initial-target',
  'scroll-margin',
  'scroll-margin-block',
  'scroll-margin-block-end',
  'scroll-margin-block-start',
  'scroll-margin-bottom',
  'scroll-margin-inline',
  'scroll-margin-inline-end',
  'scroll-margin-inline-start',
  'scroll-margin-left',
  'scroll-margin-right',
  'scroll-margin-top',
  'scroll-marker-group',
  'scroll-padding',
  'scroll-padding-block',
  'scroll-padding-block-end',
  'scroll-padding-block-start',
  'scroll-padding-bottom',
  'scroll-padding-inline',
  'scroll-padding-inline-end',
  'scroll-padding-inline-start',
  'scroll-padding-left',
  'scroll-padding-right',
  'scroll-padding-top',
  'scroll-snap-align',
  'scroll-snap-stop',
  'scroll-snap-type',
  'scroll-target-group',
  'scroll-timeline',
  'scroll-timeline-axis',
  'scroll-timeline-name',
  'scrollbar-color',
  'scrollbar-gutter',
  'scrollbar-width',
  'shape-image-threshold',
  'shape-margin',
  'shape-outside',
  'shape-rendering',
  'speak-as',
  'stop-color',
  'stop-opacity',
  'stroke',
  'stroke-color',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-opacity',
  'stroke-width',
  'tab-size',
  'table-layout',
  'text-align',
  'text-align-last',
  'text-anchor',
  'text-autospace',
  'text-box',
  'text-box-edge',
  'text-box-trim',
  'text-combine-upright',
  'text-decoration',
  'text-decoration-color',
  'text-decoration-inset',
  'text-decoration-line',
  'text-decoration-skip',
  'text-decoration-skip-ink',
  'text-decoration-style',
  'text-decoration-thickness',
  'text-emphasis',
  'text-emphasis-color',
  'text-emphasis-position',
  'text-emphasis-style',
  'text-indent',
  'text-justify',
  'text-orientation',
  'text-overflow',
  'text-rendering',
  'text-shadow',
  'text-size-adjust',
  'text-spacing-trim',
  'text-transform',
  'text-underline-offset',
  'text-underline-position',
  'text-wrap',
  'text-wrap-mode',
  'text-wrap-style',
  'timeline-scope',
  'timeline-trigger',
  'timeline-trigger-activation-range',
  'timeline-trigger-activation-range-end',
  'timeline-trigger-activation-range-start',
  'timeline-trigger-active-range',
  'timeline-trigger-active-range-end',
  'timeline-trigger-active-range-start',
  'timeline-trigger-name',
  'timeline-trigger-source',
  'top',
  'touch-action',
  'transform',
  'transform-box',
  'transform-origin',
  'transform-style',
  'transition',
  'transition-behavior',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'translate',
  'trigger-scope',
  'unicode-bidi',
  'user-select',
  'vector-effect',
  'vertical-align',
  'view-timeline',
  'view-timeline-axis',
  'view-timeline-inset',
  'view-timeline-name',
  'view-transition-class',
  'view-transition-name',
  'view-transition-scope',
  'visibility',
  'white-space',
  'white-space-collapse',
  'widows',
  'width',
  'will-change',
  'word-break',
  'word-spacing',
  'word-wrap',
  'writing-mode',
  'x',
  'y',
  'z-index',
  'zoom'
]);

export const LENGTH_PERCENTAGE_REGEXP = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc|lh|rlh|cqw|cqh|cqi|cqb|cqmin|cqmax)$/i;

export function splitTerms(valueStr: string): string[] {
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

export function splitByCommas(str: string): string[] {
  const parts: string[] = [];
  let current = '';
  let pDepth = 0;
  let bDepth = 0;
  let quote = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (quote) {
      current += char;
      if (char === quote) quote = '';
    } else if (char === '"' || char === "'") {
      quote = char;
      current += char;
    } else if (char === '(') {
      pDepth++;
      current += char;
    } else if (char === ')') {
      if (pDepth > 0) pDepth--;
      current += char;
    } else if (char === '[') {
      bDepth++;
      current += char;
    } else if (char === ']') {
      if (bDepth > 0) bDepth--;
      current += char;
    } else if (char === ',' && pDepth === 0 && bDepth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }
  return parts;
}

function parseSpaceOrCommaArgs(argStr: string, lang: Language, allowCommas: boolean, expectedBaseCount: number = 3): { valid: boolean; parts?: string[]; reason?: string } {
  if (argStr.includes(',')) {
    if (!allowCommas) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'Syntaxe avec virgules non autorisée pour cette fonction de couleur.'
          : 'Comma-separated syntax is not allowed for this color function.'
      };
    }
    if (argStr.includes('/')) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'Les barres obliques ne sont pas autorisées dans la syntaxe avec virgules.'
          : 'Slashes are not allowed in comma-separated syntax.'
      };
    }
    const rawParts = splitByCommas(argStr);
    const parts: string[] = [];
    for (const p of rawParts) {
      const trimmed = p.trim();
      if (trimmed.includes(' ') || trimmed.includes('\t')) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Impossible de mélanger les séparateurs virgule et espace.'
            : 'Cannot mix comma and space separators.'
        };
      }
      parts.push(trimmed);
    }
    return { valid: true, parts };
  } else {
    // Space-separated
    let baseStr = argStr;
    let alphaPart: string | undefined = undefined;
    if (argStr.includes('/')) {
      const slashParts = argStr.split('/');
      if (slashParts.length > 2) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Une seule barre oblique est autorisée avant la valeur alpha.'
            : 'Only one slash is allowed before the alpha value.'
        };
      }
      baseStr = slashParts[0].trim();
      alphaPart = slashParts[1].trim();
      if (alphaPart.split(/\s+/).length > 1) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Valeur alpha non valide.'
            : 'Invalid alpha value.'
        };
      }
    }
    const baseParts = baseStr.split(/\s+/).filter(Boolean);
    if (!alphaPart && baseParts.length === expectedBaseCount + 1) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'La syntaxe avec espaces nécessite une barre oblique « / » avant la valeur alpha.'
          : 'Space-separated syntax requires a slash "/" before the alpha value.'
      };
    }
    const parts = [...baseParts];
    if (alphaPart) {
      parts.push(alphaPart);
    }
    return { valid: true, parts };
  }
}

function validateRgbOrRgba(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, true);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 3 && parts.length !== 4) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel rgb() attend 3 ou 4 arguments, mais en a reçu ${parts.length}.`
        : `rgb() expects 3 or 4 arguments, but got ${parts.length}.`
    };
  }
  const componentRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/i;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isNone = part.toLowerCase() === 'none';
    if (!isNone && !componentRegex.test(part)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'Les composants de rgb() doivent être des nombres, des pourcentages ou « none ».'
          : 'rgb() components must be numbers, percentages, or "none".'
      };
    }
  }
  return { valid: true };
}

function validateHslOrHsla(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, true);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 3 && parts.length !== 4) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel hsl() attend 3 ou 4 arguments, mais en a reçu ${parts.length}.`
        : `hsl() expects 3 or 4 arguments, but got ${parts.length}.`
    };
  }

  const hue = parts[0];
  const isHueNone = hue.toLowerCase() === 'none';
  const hueRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad|grad|turn)?$/i;
  if (!isHueNone && !hueRegex.test(hue)) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? 'La teinte de hsl() doit être un nombre, un angle (deg, rad, grad, turn) ou « none ».'
        : 'hsl() hue must be a number, angle (deg, rad, grad, turn), or "none".'
    };
  }

  const sat = parts[1];
  const light = parts[2];
  const pctRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%$/;
  if ((sat.toLowerCase() !== 'none' && !pctRegex.test(sat)) || (light.toLowerCase() !== 'none' && !pctRegex.test(light))) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? 'La saturation et la luminosité de hsl() doivent être des pourcentages ou « none ».'
        : 'hsl() saturation and lightness must be percentages or "none".'
    };
  }

  if (parts.length === 4) {
    const alpha = parts[3];
    const isAlphaNone = alpha.toLowerCase() === 'none';
    const alphaRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/;
    if (!isAlphaNone && !alphaRegex.test(alpha)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? "L'alpha de hsl() doit être un nombre, un pourcentage ou « none »."
          : 'hsl() alpha must be a number, percentage, or "none".'
      };
    }
  }

  return { valid: true };
}

function validateHwb(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, false);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 3 && parts.length !== 4) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel hwb() attend 3 ou 4 arguments, mais en a reçu ${parts.length}.`
        : `hwb() expects 3 or 4 arguments, but got ${parts.length}.`
    };
  }

  const hue = parts[0];
  const isHueNone = hue.toLowerCase() === 'none';
  const hueRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad|grad|turn)?$/i;
  if (!isHueNone && !hueRegex.test(hue)) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? 'La teinte de hwb() doit être un nombre, un angle (deg, rad, grad, turn) ou « none ».'
        : 'hwb() hue must be a number, angle (deg, rad, grad, turn), or "none".'
    };
  }

  const w = parts[1];
  const b = parts[2];
  const pctRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%$/;
  if ((w.toLowerCase() !== 'none' && !pctRegex.test(w)) || (b.toLowerCase() !== 'none' && !pctRegex.test(b))) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? 'La blancheur et la noirceur de hwb() doivent être des pourcentages ou « none ».'
        : 'hwb() whiteness and blackness must be percentages or "none".'
    };
  }

  if (parts.length === 4) {
    const alpha = parts[3];
    const isAlphaNone = alpha.toLowerCase() === 'none';
    const alphaRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/;
    if (!isAlphaNone && !alphaRegex.test(alpha)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? "L'alpha de hwb() doit être un nombre, un pourcentage ou « none »."
          : 'hwb() alpha must be a number, percentage, or "none".'
      };
    }
  }

  return { valid: true };
}

function validateLabOrOklab(fnName: string, argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, false);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 3 && parts.length !== 4) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel ${fnName}() attend 3 ou 4 arguments, mais en a reçu ${parts.length}.`
        : `${fnName}() expects 3 or 4 arguments, but got ${parts.length}.`
    };
  }
  const componentRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/i;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.toLowerCase() !== 'none' && !componentRegex.test(part)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Les composants de ${fnName}() doivent être des nombres, des pourcentages ou « none ».`
          : `${fnName}() components must be numbers, percentages, or "none".`
      };
    }
  }
  return { valid: true };
}

function validateLchOrOklch(fnName: string, argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, false);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 3 && parts.length !== 4) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel ${fnName}() attend 3 ou 4 arguments, mais en a reçu ${parts.length}.`
        : `${fnName}() expects 3 or 4 arguments, but got ${parts.length}.`
    };
  }

  const numRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/i;
  if ((parts[0].toLowerCase() !== 'none' && !numRegex.test(parts[0])) || (parts[1].toLowerCase() !== 'none' && !numRegex.test(parts[1]))) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `Les composants de ${fnName}() doivent être des nombres, des pourcentages ou « none ».`
        : `${fnName}() components must be numbers, percentages, or "none".`
    };
  }

  const hue = parts[2];
  const isHueNone = hue.toLowerCase() === 'none';
  const hueRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:deg|rad|grad|turn)?$/i;
  if (!isHueNone && !hueRegex.test(hue)) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `La teinte de ${fnName}() doit être un nombre, un angle (deg, rad, grad, turn) ou « none ».`
        : `${fnName}() hue must be a number, angle (deg, rad, grad, turn), or "none".`
    };
  }

  if (parts.length === 4) {
    const alpha = parts[3];
    if (alpha.toLowerCase() !== 'none' && !numRegex.test(alpha)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `L'alpha de ${fnName}() doit être un nombre, un pourcentage ou « none ».`
          : `${fnName}() alpha must be a number, percentage, or "none".`
      };
    }
  }

  return { valid: true };
}

function validateColorFn(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const parsed = parseSpaceOrCommaArgs(argStr, lang, false, 4);
  if (!parsed.valid) return { valid: false, reason: parsed.reason };
  const parts = parsed.parts!;
  if (parts.length !== 4 && parts.length !== 5) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `L'appel color() attend un espace de couleur et 3 coordonnées (plus optionnellement l'alpha), mais en a reçu ${parts.length}.`
        : `color() expects a color space and 3 coordinates (plus optional alpha), but got ${parts.length}.`
    };
  }

  const space = parts[0].toLowerCase();
  const spaces = new Set(['srgb', 'srgb-linear', 'display-p3', 'a98-rgb', 'prophoto-rgb', 'rec2020', 'xyz', 'xyz-d50', 'xyz-d65']);
  if (!spaces.has(space)) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `Espace de couleur non reconnu : « ${parts[0]} ».`
        : `Unrecognized color space: "${parts[0]}".`
    };
  }

  const componentRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%?$/i;
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    if (part.toLowerCase() !== 'none' && !componentRegex.test(part)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'Les coordonnées de color() doivent être des nombres, des pourcentages ou « none ».'
          : 'color() coordinates must be numbers, percentages, or "none".'
      };
    }
  }

  return { valid: true };
}

function validateColorMix(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const rawParts = splitByCommas(argStr);
  if (rawParts.length !== 3) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `color-mix() attend exactement 3 arguments séparés par des virgules, mais en a reçu ${rawParts.length}.`
        : `color-mix() expects exactly 3 comma-separated arguments, but got ${rawParts.length}.`
    };
  }

  const arg1 = rawParts[0].trim();
  const match = arg1.match(/^in\s+([a-zA-Z0-9_-]+)(?:\s+(shorter|longer|increasing|decreasing|specified)\s+hue)?$/i);
  if (!match) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `Le premier argument de color-mix() doit spécifier un espace de couleur valide (ex : « in srgb »).`
        : `First argument of color-mix() must specify a valid color space (e.g., "in srgb").`
    };
  }
  const space = match[1].toLowerCase();
  const spaces = new Set(['srgb', 'srgb-linear', 'lab', 'lch', 'oklab', 'oklch', 'xyz', 'xyz-d50', 'xyz-d65', 'hsl', 'hwb']);
  if (!spaces.has(space)) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `Espace de couleur non valide dans color-mix() : « ${match[1]} ».`
        : `Invalid color space in color-mix(): "${match[1]}".`
    };
  }

  for (let i = 1; i <= 2; i++) {
    const arg = rawParts[i].trim();
    const terms = splitTerms(arg);
    if (terms.length === 0) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Argument ${i + 1} vide dans color-mix().`
          : `Argument ${i + 1} is empty in color-mix().`
      };
    }
    const lastTerm = terms[terms.length - 1];
    const pctRegex = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%$/;
    let colorPart = arg;
    if (pctRegex.test(lastTerm)) {
      colorPart = terms.slice(0, -1).join(' ').trim();
    }
    const colorRes = isValidColor(colorPart, lang);
    if (!colorRes.valid) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Couleur non valide « ${colorPart} » dans l'argument ${i + 1} de color-mix() : ${colorRes.reason}`
          : `Invalid color "${colorPart}" in argument ${i + 1} of color-mix(): ${colorRes.reason}`
      };
    }
  }

  return { valid: true };
}

function validateLightDark(argStr: string, lang: Language): { valid: boolean; reason?: string } {
  const rawParts = splitByCommas(argStr);
  if (rawParts.length !== 2) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? `light-dark() attend exactement 2 arguments séparés par des virgules, mais en a reçu ${rawParts.length}.`
        : `light-dark() expects exactly 2 comma-separated arguments, but got ${rawParts.length}.`
    };
  }
  for (let i = 0; i < 2; i++) {
    const colorPart = rawParts[i].trim();
    const colorRes = isValidColor(colorPart, lang);
    if (!colorRes.valid) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Couleur non valide « ${colorPart} » dans l'argument ${i + 1} de light-dark() : ${colorRes.reason}`
          : `Invalid color "${colorPart}" in argument ${i + 1} of light-dark(): ${colorRes.reason}`
      };
    }
  }
  return { valid: true };
}

export function isValidColor(val: string, lang: Language): { valid: boolean; reason?: string } {
  const trimmed = val.trim();
  const lower = trimmed.toLowerCase();

  if (/^(?:inherit|initial|unset|revert|revert-layer)$/i.test(trimmed)) {
    return { valid: true };
  }

  if (NAMED_COLORS.has(lower)) {
    return { valid: true };
  }

  if (trimmed.startsWith('#')) {
    if (!/^#[0-9a-fA-F]+$/.test(trimmed)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'La couleur hexadécimale contient des caractères non valides.'
          : 'Hex color contains invalid characters.'
      };
    }
    const len = trimmed.length;
    if (len !== 4 && len !== 5 && len !== 7 && len !== 9) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? 'La couleur hexadécimale doit comporter 3, 4, 6 ou 8 chiffres hexadécimaux (ex : #f00, #ff0000).'
          : 'Hex color must be 3, 4, 6, or 8 hexadecimal digits (e.g., #f00, #ff0000).'
      };
    }
    return { valid: true };
  }

  const fnMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\((.*)\)$/s);
  if (fnMatch) {
    const fnName = fnMatch[1].toLowerCase();
    const argStr = fnMatch[2].trim();

    const recognizedFuncs = new Set(['rgb', 'rgba', 'hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'color', 'color-mix', 'light-dark']);
    if (!recognizedFuncs.has(fnName)) {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Fonction de couleur non reconnue « ${fnName}() ».`
          : `Unrecognized color function "${fnName}()".`
      };
    }

    if (fnName === 'rgb' || fnName === 'rgba') {
      return validateRgbOrRgba(argStr, lang);
    }
    if (fnName === 'hsl' || fnName === 'hsla') {
      return validateHslOrHsla(argStr, lang);
    }
    if (fnName === 'hwb') {
      return validateHwb(argStr, lang);
    }
    if (fnName === 'lab' || fnName === 'oklab') {
      return validateLabOrOklab(fnName, argStr, lang);
    }
    if (fnName === 'lch' || fnName === 'oklch') {
      return validateLchOrOklch(fnName, argStr, lang);
    }
    if (fnName === 'color') {
      return validateColorFn(argStr, lang);
    }
    if (fnName === 'color-mix') {
      return validateColorMix(argStr, lang);
    }
    if (fnName === 'light-dark') {
      return validateLightDark(argStr, lang);
    }
  }

  return {
    valid: false,
    reason: lang === 'fr'
      ? 'Format de couleur non valide.'
      : 'Invalid color format.'
  };
}

function isBorderWidth(term: string): boolean {
  const lower = term.toLowerCase();
  return new Set(['thin', 'medium', 'thick']).has(lower) || term === '0' || LENGTH_PERCENTAGE_REGEXP.test(term);
}

function isBorderStyle(term: string): boolean {
  const lower = term.toLowerCase();
  return new Set(['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset']).has(lower);
}

function isOutlineStyle(term: string): boolean {
  const lower = term.toLowerCase();
  return new Set(['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'auto']).has(lower);
}

function validateBorderShorthand(val: string, lang: Language): { valid: boolean; reason?: string } {
  const terms = splitTerms(val);
  if (terms.length === 0 || terms.length > 3) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? 'Une bordure doit comporter entre 1 et 3 composants (largeur, style, couleur).'
        : 'A border must have 1 to 3 components (width, style, color).'
    };
  }
  let hasWidth = false;
  let hasStyle = false;
  let hasColor = false;
  for (const term of terms) {
    if (isBorderWidth(term)) {
      if (hasWidth) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Plusieurs valeurs de largeur trouvées dans la bordure.'
            : 'Multiple width values found in border.'
        };
      }
      hasWidth = true;
    } else if (isBorderStyle(term)) {
      if (hasStyle) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Plusieurs valeurs de style trouvées dans la bordure.'
            : 'Multiple style values found in border.'
        };
      }
      hasStyle = true;
    } else {
      const colorRes = isValidColor(term, lang);
      if (colorRes.valid) {
        if (hasColor) {
          return {
            valid: false,
            reason: lang === 'fr'
              ? 'Plusieurs valeurs de couleur trouvées dans la bordure.'
              : 'Multiple color values found in border.'
          };
        }
        hasColor = true;
      } else {
        return {
          valid: false,
          reason: lang === 'fr'
            ? `Composant de bordure inconnu ou couleur non valide « ${term} ».`
            : `Unknown border component or invalid color "${term}".`
        };
      }
    }
  }
  return { valid: true };
}

function validateOutlineShorthand(val: string, lang: Language): { valid: boolean; reason?: string } {
  const terms = splitTerms(val);
  if (terms.length === 0 || terms.length > 3) {
    return {
      valid: false,
      reason: lang === 'fr'
        ? "Un contour (outline) doit comporter entre 1 et 3 composants (largeur, style, couleur)."
        : 'An outline must have 1 to 3 components (width, style, color).'
    };
  }
  let hasWidth = false;
  let hasStyle = false;
  let hasColor = false;
  for (const term of terms) {
    if (isBorderWidth(term)) {
      if (hasWidth) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Plusieurs valeurs de largeur trouvées dans le contour.'
            : 'Multiple width values found in outline.'
        };
      }
      hasWidth = true;
    } else if (isOutlineStyle(term)) {
      if (hasStyle) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'Plusieurs valeurs de style trouvées dans le contour.'
            : 'Multiple style values found in outline.'
        };
      }
      hasStyle = true;
    } else {
      const colorRes = isValidColor(term, lang);
      if (colorRes.valid) {
        if (hasColor) {
          return {
            valid: false,
            reason: lang === 'fr'
              ? 'Plusieurs valeurs de couleur trouvées dans le contour.'
              : 'Multiple color values found in outline.'
          };
        }
        hasColor = true;
      } else {
        return {
          valid: false,
          reason: lang === 'fr'
            ? `Composant de contour inconnu ou couleur non valide « ${term} ».`
            : `Unknown outline component or invalid color "${term}".`
        };
      }
    }
  }
  return { valid: true };
}

function validateBackgroundShorthand(val: string, lang: Language): { valid: boolean; reason?: string } {
  const terms = splitTerms(val);
  if (terms.length === 0) return { valid: true };

  const bgKeywords = new Set([
    'auto', 'scroll', 'fixed', 'local', 'repeat', 'no-repeat', 'repeat-x', 'repeat-y', 'space', 'round',
    'top', 'bottom', 'left', 'right', 'center', 'cover', 'contain', 'border-box', 'padding-box', 'content-box', 'text', 'none'
  ]);
  const bgFuncRegex = /^(?:url|linear-gradient|radial-gradient|conic-gradient|repeating-linear-gradient|repeating-radial-gradient|repeating-conic-gradient|image-set)\(/i;

  let hasColor = false;
  for (const term of terms) {
    const lower = term.toLowerCase();
    if (term === '/' || term.includes('/') || term === '0' || LENGTH_PERCENTAGE_REGEXP.test(term)) {
      continue;
    }
    if (bgKeywords.has(lower)) {
      continue;
    }
    if (bgFuncRegex.test(term)) {
      continue;
    }
    const looksLikeColor = term.startsWith('#') || NAMED_COLORS.has(lower) || /^(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color|color-mix|light-dark)\(/i.test(term);
    if (looksLikeColor) {
      if (hasColor) {
        return {
          valid: false,
          reason: lang === 'fr'
            ? 'La propriété background ne peut contenir qu’une seule couleur.'
            : 'background shorthand can only contain at most one color.'
        };
      }
      const colorRes = isValidColor(term, lang);
      if (!colorRes.valid) {
        return { valid: false, reason: colorRes.reason };
      }
      hasColor = true;
    } else {
      return {
        valid: false,
        reason: lang === 'fr'
          ? `Composant de background inconnu ou couleur non valide « ${term} ».`
          : `Unknown background component or invalid color "${term}".`
      };
    }
  }
  return { valid: true };
}

export interface ValueValidator {
  validate: (value: string, lang: Language) => { valid: boolean; expected?: string; reason?: string };
}

const colorValidator: ValueValidator = {
  validate: (val, lang) => {
    const res = isValidColor(val, lang);
    return {
      valid: res.valid,
      reason: res.reason,
      expected: lang === 'fr'
        ? 'une couleur valide (ex : #ff0000, rgb(255,0,0), red, transparent)'
        : 'a valid color (e.g., #ff0000, rgb(255,0,0), red, transparent)'
    };
  }
};

const displayKeywords = new Set([
  'block', 'inline', 'inline-block', 'flex', 'inline-flex', 'grid', 'inline-grid', 'none', 'flow-root', 'contents',
  'table', 'table-row', 'table-cell', 'table-column', 'table-column-group', 'table-header-group', 'table-footer-group',
  'table-row-group', 'list-item', 'run-in'
]);
const displayValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: displayKeywords.has(val.toLowerCase()),
    expected: 'block, inline, inline-block, flex, grid, none, flow-root, table, list-item, etc.'
  })
};

const positionKeywords = new Set(['static', 'relative', 'absolute', 'fixed', 'sticky']);
const positionValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: positionKeywords.has(val.toLowerCase()),
    expected: 'static, relative, absolute, fixed, or sticky'
  })
};

const visibilityKeywords = new Set(['visible', 'hidden', 'collapse']);
const visibilityValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: visibilityKeywords.has(val.toLowerCase()),
    expected: 'visible, hidden, or collapse'
  })
};

const floatKeywords = new Set(['left', 'right', 'none', 'inline-start', 'inline-end']);
const floatValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: floatKeywords.has(val.toLowerCase()),
    expected: 'left, right, none, inline-start, or inline-end'
  })
};

const clearKeywords = new Set(['left', 'right', 'both', 'none', 'inline-start', 'inline-end']);
const clearValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: clearKeywords.has(val.toLowerCase()),
    expected: 'left, right, both, none, inline-start, or inline-end'
  })
};

const textAlignKeywords = new Set(['left', 'right', 'center', 'justify', 'start', 'end']);
const textAlignValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: textAlignKeywords.has(val.toLowerCase()),
    expected: 'left, right, center, justify, start, or end'
  })
};

const boxSizingKeywords = new Set(['content-box', 'border-box']);
const boxSizingValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: boxSizingKeywords.has(val.toLowerCase()),
    expected: 'content-box or border-box'
  })
};

const flexDirKeywords = new Set(['row', 'row-reverse', 'column', 'column-reverse']);
const flexDirValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: flexDirKeywords.has(val.toLowerCase()),
    expected: 'row, row-reverse, column, or column-reverse'
  })
};

const flexWrapKeywords = new Set(['nowrap', 'wrap', 'wrap-reverse']);
const flexWrapValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: flexWrapKeywords.has(val.toLowerCase()),
    expected: 'nowrap, wrap, or wrap-reverse'
  })
};

const justifyKeywords = new Set(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end', 'left', 'right', 'stretch']);
const justifyValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: justifyKeywords.has(val.toLowerCase()),
    expected: 'flex-start, flex-end, center, space-between, space-around, space-evenly, etc.'
  })
};

const alignSelfItemsKeywords = new Set(['stretch', 'flex-start', 'flex-end', 'center', 'baseline', 'start', 'end', 'self-start', 'self-end']);
const alignItemsValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: alignSelfItemsKeywords.has(val.toLowerCase()),
    expected: 'stretch, flex-start, flex-end, center, baseline, start, end, etc.'
  })
};

const alignContentKeywords = new Set(['stretch', 'flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly', 'start', 'end']);
const alignContentValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: alignContentKeywords.has(val.toLowerCase()),
    expected: 'stretch, flex-start, flex-end, center, space-between, space-around, space-evenly, etc.'
  })
};

const overflowKeywords = new Set(['visible', 'hidden', 'clip', 'scroll', 'auto']);
const overflowValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: overflowKeywords.has(val.toLowerCase()),
    expected: 'visible, hidden, clip, scroll, or auto'
  })
};

const whiteSpaceKeywords = new Set(['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line', 'break-spaces']);
const whiteSpaceValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: whiteSpaceKeywords.has(val.toLowerCase()),
    expected: 'normal, nowrap, pre, pre-wrap, pre-line, or break-spaces'
  })
};

const textTransformKeywords = new Set(['none', 'capitalize', 'uppercase', 'lowercase', 'full-width', 'full-size-kana']);
const textTransformValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: textTransformKeywords.has(val.toLowerCase()),
    expected: 'none, capitalize, uppercase, lowercase, full-width, or full-size-kana'
  })
};

const fontStyleKeywords = new Set(['normal', 'italic', 'oblique']);
const fontStyleValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: fontStyleKeywords.has(val.toLowerCase()),
    expected: 'normal, italic, or oblique'
  })
};

const fontWeightKeywords = new Set(['normal', 'bold', 'bolder', 'lighter']);
const fontWeightValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: fontWeightKeywords.has(val.toLowerCase()) || /^\d+$/.test(val),
    expected: 'normal, bold, bolder, lighter, or a numeric weight (e.g., 400, 700)'
  })
};

const widthHeightKeywords = new Set(['auto', 'fit-content', 'min-content', 'max-content']);
const widthHeightValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val === '0' || LENGTH_PERCENTAGE_REGEXP.test(val) || widthHeightKeywords.has(val.toLowerCase()),
    expected: lang === 'fr'
      ? 'une longueur (ex : 100px, 10%, 2rem), 0, auto, fit-content, min-content ou max-content'
      : 'a length (e.g., 100px, 10%, 2rem), 0, auto, fit-content, min-content, or max-content'
  })
};

const topBottomLeftRightValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val === '0' || LENGTH_PERCENTAGE_REGEXP.test(val) || val.toLowerCase() === 'auto',
    expected: lang === 'fr'
      ? 'une longueur (ex : 10px, 2rem), 0 ou auto'
      : 'a length (e.g., 10px, 2rem), 0, or auto'
  })
};

const marginSideValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val === '0' || LENGTH_PERCENTAGE_REGEXP.test(val) || val.toLowerCase() === 'auto',
    expected: lang === 'fr'
      ? 'une longueur (ex : 10px, 2rem), 0 ou auto'
      : 'a length (e.g., 10px, 2rem), 0, or auto'
  })
};

const marginValidator: ValueValidator = {
  validate: (val, lang) => {
    const terms = splitTerms(val);
    const valid = terms.length >= 1 && terms.length <= 4 && terms.every(v => v === '0' || LENGTH_PERCENTAGE_REGEXP.test(v) || v.toLowerCase() === 'auto');
    return {
      valid,
      expected: lang === 'fr'
        ? '1 à 4 longueurs (ex : 10px, 2rem, 50%), 0 ou auto séparés par des espaces'
        : '1 to 4 lengths (e.g., 10px, 2rem, 50%), 0, or auto separated by spaces'
    };
  }
};

const paddingSideValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val === '0' || LENGTH_PERCENTAGE_REGEXP.test(val),
    expected: lang === 'fr'
      ? 'une longueur (ex : 10px, 2rem) ou 0'
      : 'a length (e.g., 10px, 2rem), or 0'
  })
};

const paddingValidator: ValueValidator = {
  validate: (val, lang) => {
    const terms = splitTerms(val);
    const valid = terms.length >= 1 && terms.length <= 4 && terms.every(v => v === '0' || LENGTH_PERCENTAGE_REGEXP.test(v));
    return {
      valid,
      expected: lang === 'fr'
        ? '1 à 4 longueurs (ex : 10px, 2rem, 50%) ou 0 séparés par des espaces'
        : '1 to 4 lengths (e.g., 10px, 2rem, 50%) or 0 separated by spaces'
    };
  }
};

const borderSideWidthKeywords = new Set(['thin', 'medium', 'thick']);
const borderWidthValidator: ValueValidator = {
  validate: (val, lang) => {
    const terms = splitTerms(val);
    const singleValidator = (v: string) => v === '0' || LENGTH_PERCENTAGE_REGEXP.test(v) || borderSideWidthKeywords.has(v.toLowerCase());
    const valid = terms.length >= 1 && terms.length <= 4 && terms.every(singleValidator);
    return {
      valid,
      expected: lang === 'fr'
        ? '1 à 4 largeurs (ex : thin, medium, thick, 2px) séparées par des espaces'
        : '1 to 4 widths (e.g., thin, medium, thick, 2px) separated by spaces'
    };
  }
};
const borderSideWidthValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val === '0' || LENGTH_PERCENTAGE_REGEXP.test(val) || borderSideWidthKeywords.has(val.toLowerCase()),
    expected: lang === 'fr'
      ? 'thin, medium, thick, une longueur ou 0'
      : 'thin, medium, thick, a length, or 0'
  })
};

const zIndexValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: val.toLowerCase() === 'auto' || /^[+-]?\d+$/.test(val),
    expected: lang === 'fr'
      ? 'un entier ou auto'
      : 'an integer or auto'
  })
};

const opacityValidator: ValueValidator = {
  validate: (val, lang) => {
    const isPct = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)%$/.test(val);
    const isNum = /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(val);
    let valid = isPct || isNum;
    if (isNum) {
      const num = parseFloat(val);
      valid = !isNaN(num);
    }
    return {
      valid,
      expected: lang === 'fr'
        ? 'un nombre (ex : 0.5) ou un pourcentage (ex : 50%)'
        : 'a number (e.g., 0.5) or a percentage (e.g., 50%)'
    };
  }
};

const flexGrowShrinkValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: /^\d+(?:\.\d+)?$/.test(val),
    expected: lang === 'fr'
      ? 'un nombre non négatif'
      : 'a non-negative number'
  })
};

const orderValidator: ValueValidator = {
  validate: (val, lang) => ({
    valid: /^[+-]?\d+$/.test(val),
    expected: lang === 'fr'
      ? 'un entier'
      : 'an integer'
  })
};

const gapValidator: ValueValidator = {
  validate: (val, lang) => {
    const terms = splitTerms(val);
    const singleValidator = (v: string) => v.toLowerCase() === 'normal' || v === '0' || LENGTH_PERCENTAGE_REGEXP.test(v);
    const valid = terms.length >= 1 && terms.length <= 2 && terms.every(singleValidator);
    return {
      valid,
      expected: lang === 'fr'
        ? 'normal, ou 1 à 2 longueurs / pourcentages'
        : 'normal, or 1 to 2 lengths / percentages'
    };
  }
};

const borderValidator: ValueValidator = {
  validate: (val, lang) => {
    const res = validateBorderShorthand(val, lang);
    return {
      valid: res.valid,
      reason: res.reason,
      expected: lang === 'fr'
        ? 'une largeur, un style et une couleur (ex : 1px solid red)'
        : 'a width, a style, and a color (e.g., 1px solid red)'
    };
  }
};

const outlineValidator: ValueValidator = {
  validate: (val, lang) => {
    const res = validateOutlineShorthand(val, lang);
    return {
      valid: res.valid,
      reason: res.reason,
      expected: lang === 'fr'
        ? 'une largeur, un style et une couleur (ex : 2px dashed black)'
        : 'a width, a style, and a color (e.g., 2px dashed black)'
    };
  }
};

const backgroundValidator: ValueValidator = {
  validate: (val, lang) => {
    const res = validateBackgroundShorthand(val, lang);
    return {
      valid: res.valid,
      reason: res.reason,
      expected: lang === 'fr'
        ? 'des composants de fond valides (couleur, image, position, répétition, etc.)'
        : 'valid background components (color, image, position, repeat, etc.)'
    };
  }
};

export const COMMON_PROPERTY_VALIDATORS: Record<string, ValueValidator> = {
  'color': colorValidator,
  'background-color': colorValidator,
  'border-color': {
    validate: (val, lang) => {
      const terms = splitTerms(val);
      const valid = terms.length >= 1 && terms.length <= 4 && terms.every(t => isValidColor(t, lang).valid);
      return {
        valid,
        expected: lang === 'fr'
          ? '1 à 4 couleurs séparées par des espaces'
          : '1 to 4 colors separated by spaces'
      };
    }
  },
  'border-top-color': colorValidator,
  'border-right-color': colorValidator,
  'border-bottom-color': colorValidator,
  'border-left-color': colorValidator,
  'outline-color': colorValidator,
  'text-decoration-color': colorValidator,
  'column-rule-color': colorValidator,

  'display': displayValidator,
  'position': positionValidator,
  'visibility': visibilityValidator,
  'float': floatValidator,
  'clear': clearValidator,
  'text-align': textAlignValidator,
  'box-sizing': boxSizingValidator,
  'flex-direction': flexDirValidator,
  'flex-wrap': flexWrapValidator,
  'justify-content': justifyValidator,
  'align-items': alignItemsValidator,
  'align-self': alignItemsValidator,
  'align-content': alignContentValidator,
  'overflow': overflowValidator,
  'overflow-x': overflowValidator,
  'overflow-y': overflowValidator,
  'white-space': whiteSpaceValidator,
  'text-transform': textTransformValidator,
  'font-style': fontStyleValidator,
  'font-weight': fontWeightValidator,

  'width': widthHeightValidator,
  'height': widthHeightValidator,
  'min-width': widthHeightValidator,
  'max-width': widthHeightValidator,
  'min-height': widthHeightValidator,
  'max-height': widthHeightValidator,

  'top': topBottomLeftRightValidator,
  'bottom': topBottomLeftRightValidator,
  'left': topBottomLeftRightValidator,
  'right': topBottomLeftRightValidator,

  'margin': marginValidator,
  'margin-top': marginSideValidator,
  'margin-right': marginSideValidator,
  'margin-bottom': marginSideValidator,
  'margin-left': marginSideValidator,

  'padding': paddingValidator,
  'padding-top': paddingSideValidator,
  'padding-right': paddingSideValidator,
  'padding-bottom': paddingSideValidator,
  'padding-left': paddingSideValidator,

  'border-width': borderWidthValidator,
  'border-top-width': borderSideWidthValidator,
  'border-right-width': borderSideWidthValidator,
  'border-bottom-width': borderSideWidthValidator,
  'border-left-width': borderSideWidthValidator,

  'z-index': zIndexValidator,
  'opacity': opacityValidator,
  'flex-grow': flexGrowShrinkValidator,
  'flex-shrink': flexGrowShrinkValidator,
  'order': orderValidator,
  'gap': gapValidator,
  'row-gap': gapValidator,
  'column-gap': gapValidator,

  'border': borderValidator,
  'border-top': borderValidator,
  'border-right': borderValidator,
  'border-bottom': borderValidator,
  'border-left': borderValidator,
  'outline': outlineValidator,
  'background': backgroundValidator
};

