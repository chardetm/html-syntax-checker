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
