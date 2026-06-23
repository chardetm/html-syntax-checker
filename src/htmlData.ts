// Standard HTML5 tags
export const STANDARD_TAGS = new Set([
  'html', 'head', 'body', 'title', 'meta', 'link', 'style', 'script', 'noscript',
  'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'main', 'nav', 'section',
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure', 'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul',
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'dfn', 'em', 'i', 'kbd', 'mark', 'q',
  'rp', 'rt', 'ruby', 's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
  'area', 'audio', 'img', 'map', 'track', 'video',
  'embed', 'iframe', 'object', 'picture', 'portal', 'source',
  'canvas', 'noscript', 'script',
  'del', 'ins',
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr',
  'button', 'datalist', 'fieldset', 'form', 'input', 'label', 'legend', 'meter', 'optgroup', 'option',
  'output', 'progress', 'select', 'textarea',
  'details', 'dialog', 'summary',
  'template', 'slot', 'base'
]);

// Void elements (must not have closing tags)
export const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'source', 'track', 'wbr'
]);

// Deprecated/Obsolete HTML tags
export const DEPRECATED_TAGS = new Set([
  'applet', 'acronym', 'bgsound', 'dir', 'frame', 'frameset', 'noframes',
  'isindex', 'keygen', 'listing', 'nextid', 'noembed', 'plaintext', 'strike',
  'tt', 'xmp', 'big', 'center', 'font', 'marquee', 'basefont', 'blink', 'spacers'
]);

// Required attributes per tag
export const REQUIRED_ATTRIBUTES: Record<string, string[]> = {
  'img': ['src', 'alt'],
  'iframe': ['src'],
  'link': ['rel'],
  'area': ['alt']
};

// Global standard attributes (valid on all elements)
export const GLOBAL_STANDARD_ATTRIBUTES = new Set([
  'class', 'id', 'style', 'title', 'lang', 'dir', 'accesskey', 'tabindex',
  'contenteditable', 'draggable', 'hidden', 'spellcheck', 'translate', 'role', 'slot'
]);

// Standard attributes specific to tags
export const ELEMENT_STANDARD_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'target', 'rel', 'download', 'hreflang', 'type'],
  'img': ['src', 'alt', 'width', 'height', 'srcset', 'sizes', 'loading', 'crossorigin', 'usemap'],
  'input': [
    'type', 'name', 'value', 'placeholder', 'disabled', 'readonly', 'checked', 'required',
    'pattern', 'min', 'max', 'step', 'maxlength', 'minlength', 'multiple', 'accept',
    'autocomplete', 'autofocus', 'form', 'list'
  ],
  'button': ['type', 'name', 'value', 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget'],
  'form': ['action', 'method', 'enctype', 'name', 'target', 'autocomplete', 'novalidate'],
  'select': ['name', 'disabled', 'multiple', 'required', 'size', 'form'],
  'option': ['value', 'selected', 'disabled', 'label'],
  'textarea': ['name', 'rows', 'cols', 'placeholder', 'disabled', 'readonly', 'required', 'maxlength', 'minlength', 'form'],
  'link': ['href', 'rel', 'type', 'media', 'sizes', 'crossorigin', 'integrity', 'as'],
  'meta': ['name', 'content', 'charset', 'http-equiv'],
  'script': ['src', 'type', 'async', 'defer', 'crossorigin', 'integrity', 'nomodule'],
  'iframe': ['src', 'srcdoc', 'name', 'width', 'height', 'sandbox', 'allow', 'allowfullscreen', 'loading'],
  'video': ['src', 'poster', 'preload', 'autoplay', 'loop', 'muted', 'controls', 'width', 'height', 'playsinline', 'crossorigin'],
  'audio': ['src', 'preload', 'autoplay', 'loop', 'muted', 'controls', 'crossorigin'],
  'source': ['src', 'type', 'srcset', 'sizes', 'media'],
  'track': ['src', 'kind', 'srclang', 'label', 'default'],
  'ol': ['reversed', 'start', 'type'],
  'li': ['value'],
  'td': ['colspan', 'rowspan', 'headers'],
  'th': ['colspan', 'rowspan', 'headers', 'scope', 'abbr'],
  'optgroup': ['label', 'disabled'],
  'details': ['open'],
  'dialog': ['open'],
  'map': ['name'],
  'col': ['span'],
  'colgroup': ['span'],
  'label': ['for']
};

// Deprecated/Obsolete attributes
export const DEPRECATED_ATTRIBUTES = new Set([
  'align', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing',
  'char', 'charoff', 'clear', 'color', 'compact', 'frame', 'frameborder',
  'hspace', 'vspace', 'marginheight', 'marginwidth', 'noshade', 'nowrap',
  'rules', 'scrolling', 'size', 'valign', 'vlink', 'alink', 'link', 'text'
]);
