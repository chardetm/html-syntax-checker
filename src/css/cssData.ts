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
  // Layout & positioning
  'display', 'position', 'top', 'bottom', 'left', 'right', 'z-index', 'float', 'clear', 'visibility', 'overflow', 'overflow-x', 'overflow-y', 'clip', 'clip-path', 'aspect-ratio',
  // Box model (margins, padding, sizing)
  'width', 'height', 'min-width', 'max-width', 'min-height', 'max-height',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'box-sizing',
  // Borders
  'border', 'border-width', 'border-style', 'border-color',
  'border-top', 'border-top-width', 'border-top-style', 'border-top-color',
  'border-right', 'border-right-width', 'border-right-style', 'border-right-color',
  'border-bottom', 'border-bottom-width', 'border-bottom-style', 'border-bottom-color',
  'border-left', 'border-left-width', 'border-left-style', 'border-left-color',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius',
  'border-collapse', 'border-spacing', 'border-image', 'border-image-source', 'border-image-slice', 'border-image-width', 'border-image-outset', 'border-image-repeat',
  // Outline
  'outline', 'outline-width', 'outline-style', 'outline-color', 'outline-offset',
  // Backgrounds & Borders
  'background', 'background-color', 'background-image', 'background-repeat', 'background-attachment', 'background-position', 'background-position-x', 'background-position-y', 'background-size', 'background-clip', 'background-origin', 'background-blend-mode',
  // Typography
  'color', 'font', 'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'font-stretch', 'line-height',
  'text-align', 'text-align-last', 'text-decoration', 'text-decoration-line', 'text-decoration-style', 'text-decoration-color', 'text-decoration-thickness',
  'text-transform', 'text-indent', 'letter-spacing', 'word-spacing', 'white-space', 'word-break', 'overflow-wrap', 'text-overflow', 'text-shadow', 'vertical-align', 'direction', 'unicode-bidi', 'writing-mode', 'text-rendering',
  // Flexbox & Grid
  'flex', 'flex-direction', 'flex-wrap', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-basis',
  'justify-content', 'align-items', 'align-content', 'align-self', 'order',
  'grid', 'grid-template', 'grid-template-columns', 'grid-template-rows', 'grid-template-areas',
  'grid-auto-columns', 'grid-auto-rows', 'grid-auto-flow',
  'grid-column', 'grid-column-start', 'grid-column-end',
  'grid-row', 'grid-row-start', 'grid-row-end',
  'grid-area', 'justify-items', 'place-items', 'place-content', 'place-self', 'justify-self',
  'gap', 'row-gap', 'column-gap', 'grid-gap', 'grid-row-gap', 'grid-column-gap',
  // Columns (Multi-column layout)
  'columns', 'column-count', 'column-width', 'column-gap', 'column-rule', 'column-rule-width', 'column-rule-style', 'column-rule-color', 'column-fill', 'column-span',
  // Visuals & Effects
  'opacity', 'box-shadow', 'filter', 'backdrop-filter', 'mix-blend-mode', 'isolation', 'image-rendering', 'object-fit', 'object-position',
  // Lists
  'list-style', 'list-style-type', 'list-style-position', 'list-style-image',
  // Tables
  'table-layout', 'empty-cells', 'caption-side',
  // UI & Interaction
  'cursor', 'pointer-events', 'user-select', 'resize', 'scroll-behavior', 'caret-color', 'accent-color', 'appearance', 'touch-action',
  // Transitions & Animations
  'transition', 'transition-property', 'transition-duration', 'transition-timing-function', 'transition-delay',
  'animation', 'animation-name', 'animation-duration', 'animation-timing-function', 'animation-delay', 'animation-iteration-count', 'animation-direction', 'animation-fill-mode', 'animation-play-state',
  'transform', 'transform-origin', 'transform-style', 'perspective', 'perspective-origin', 'backface-visibility',
  'rotate', 'scale', 'translate',
  // Logical Properties (standard and modern)
  'margin-block', 'margin-block-start', 'margin-block-end', 'margin-inline', 'margin-inline-start', 'margin-inline-end',
  'padding-block', 'padding-block-start', 'padding-block-end', 'padding-inline', 'padding-inline-start', 'padding-inline-end',
  'border-block', 'border-block-width', 'border-block-style', 'border-block-color', 'border-inline', 'border-inline-width', 'border-inline-style', 'border-inline-color',
  'inset', 'inset-block', 'inset-block-start', 'inset-block-end', 'inset-inline', 'inset-inline-start', 'inset-inline-end',
  'inline-size', 'block-size', 'min-inline-size', 'min-block-size', 'max-inline-size', 'max-block-size',
  // SVG styling
  'fill', 'fill-opacity', 'fill-rule', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linecap', 'stroke-linejoin', 'stroke-miterlimit', 'stroke-dasharray', 'stroke-dashoffset', 'clip-rule', 'mask', 'stop-color', 'stop-opacity',
  // Miscellaneous
  'content', 'counter-reset', 'counter-increment', 'counter-set', 'will-change', 'all', 'page-break-before', 'page-break-after', 'page-break-inside'
]);

