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
  'template', 'slot', 'base', 'svg',
  'search', 'hgroup', 'math'
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
  'track': ['src', 'kind'],
};

// Standard HTML5 global event handler attributes
export const GLOBAL_EVENT_ATTRIBUTES = [
  'onabort', 'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onblur', 'oncanplay', 'oncanplaythrough',
  'onchange', 'onclick', 'oncontextmenu', 'oncopy', 'oncut', 'ondblclick', 'ondrag', 'ondragend',
  'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange',
  'onemptied', 'onended', 'onerror', 'onfocus', 'onhashchange', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress',
  'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmessage', 'onmousedown',
  'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel',
  'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpaste', 'onpause', 'onplay', 'onplaying',
  'onpopstate', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking',
  'onselect', 'onstalled', 'onstorage', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onunload',
  'onvolumechange', 'onwaiting', 'onwheel',
  'onauxclick', 'ongotpointercapture', 'onlostpointercapture', 'onpointerdown', 'onpointermove', 'onpointerup',
  'onpointercancel', 'onpointerover', 'onpointerout', 'onpointerenter', 'onpointerleave', 'onselectstart',
  'onselectionchange', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'ontransitionend',
  'onfocusin', 'onfocusout', 'onslotchange', 'onsearch', 'oncancel', 'onclose', 'onformdata'
];

// Global standard attributes (valid on all elements)
export const GLOBAL_STANDARD_ATTRIBUTES = new Set([
  'class', 'id', 'style', 'title', 'lang', 'dir', 'accesskey', 'tabindex',
  'contenteditable', 'draggable', 'hidden', 'spellcheck', 'translate', 'role', 'slot',
  'autocapitalize', 'autofocus', 'enterkeyhint', 'inputmode', 'is', 'itemid', 'itemprop',
  'itemref', 'itemscope', 'itemtype', 'nonce', 'part', 'popover', 'inert', 'exportparts',
  ...GLOBAL_EVENT_ATTRIBUTES
]);

// Standard attributes specific to tags
export const ELEMENT_STANDARD_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'target', 'rel', 'download', 'hreflang', 'type', 'ping', 'referrerpolicy'],
  'area': ['alt', 'coords', 'shape', 'href', 'target', 'download', 'rel', 'referrerpolicy'],
  'img': ['src', 'alt', 'width', 'height', 'srcset', 'sizes', 'loading', 'crossorigin', 'usemap', 'decoding', 'fetchpriority', 'ismap', 'referrerpolicy'],
  'input': [
    'type', 'name', 'value', 'placeholder', 'disabled', 'readonly', 'checked', 'required',
    'pattern', 'min', 'max', 'step', 'maxlength', 'minlength', 'multiple', 'accept',
    'autocomplete', 'autofocus', 'form', 'list', 'alt', 'capture', 'dirname', 'formaction',
    'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'height', 'size', 'src', 'width'
  ],
  'button': ['type', 'name', 'value', 'disabled', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'popovertarget', 'popovertargetaction'],
  'form': ['action', 'method', 'enctype', 'name', 'target', 'autocomplete', 'novalidate', 'accept-charset', 'rel'],
  'select': ['name', 'disabled', 'multiple', 'required', 'size', 'form', 'autocomplete', 'autofocus'],
  'option': ['value', 'selected', 'disabled', 'label'],
  'textarea': ['name', 'rows', 'cols', 'placeholder', 'disabled', 'readonly', 'required', 'maxlength', 'minlength', 'form', 'autocomplete', 'autofocus', 'dirname', 'wrap'],
  'link': ['href', 'rel', 'type', 'media', 'sizes', 'crossorigin', 'integrity', 'as', 'imagesrcset', 'imagesizes', 'referrerpolicy', 'disabled', 'fetchpriority'],
  'meta': ['name', 'content', 'charset', 'http-equiv', 'media'],
  'script': ['src', 'type', 'async', 'defer', 'crossorigin', 'integrity', 'nomodule', 'referrerpolicy', 'fetchpriority', 'blocking'],
  'iframe': ['src', 'srcdoc', 'name', 'width', 'height', 'sandbox', 'allow', 'allowfullscreen', 'loading', 'referrerpolicy', 'frameborder', 'allowpaymentrequest', 'csp', 'fetchpriority', 'allowusermedia'], // frameborder is deprecated but YouTube uses it when embedding a video
  'video': ['src', 'poster', 'preload', 'autoplay', 'loop', 'muted', 'controls', 'width', 'height', 'playsinline', 'crossorigin', 'controlslist', 'disablepictureinpicture', 'disableremoteplayback'],
  'audio': ['src', 'preload', 'autoplay', 'loop', 'muted', 'controls', 'crossorigin', 'controlslist', 'disableremoteplayback'],
  'source': ['src', 'type', 'srcset', 'sizes', 'media', 'height', 'width'],
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
  'label': ['for'],
  'base': ['href', 'target'],
  'canvas': ['width', 'height'],
  'data': ['value'],
  'del': ['cite', 'datetime'],
  'embed': ['src', 'type', 'width', 'height'],
  'ins': ['cite', 'datetime'],
  'meter': ['value', 'min', 'max', 'low', 'high', 'optimum', 'form'],
  'object': ['data', 'type', 'name', 'form', 'width', 'height'],
  'output': ['for', 'form', 'name'],
  'progress': ['max', 'value'],
  'q': ['cite'],
  'time': ['datetime']
};

// Deprecated/Obsolete attributes
export const DEPRECATED_ATTRIBUTES = new Set([
  'align', 'background', 'bgcolor', 'border', 'cellpadding', 'cellspacing',
  'char', 'charoff', 'clear', 'color', 'compact', 'frame',
  'hspace', 'vspace', 'marginheight', 'marginwidth', 'noshade', 'nowrap',
  'rules', 'scrolling', 'size', 'valign', 'vlink', 'alink', 'link', 'text'
  // 'frameborder' not included because YouTube uses it when embedding a video
]);

