import { checkHtmlSyntax, checkCssSyntax } from '../src/index';
import type { HTMLCheckerOptions, CSSCheckerOptions, Language } from '../src/types';

// State variables
let currentMode: 'html' | 'css' = 'html';
let currentLanguage: Language = 'en';

// DOM Elements
const modeBtnHtml = document.getElementById('mode-btn-html') as HTMLButtonElement;
const modeBtnCss = document.getElementById('mode-btn-css') as HTMLButtonElement;
const htmlSettings = document.getElementById('html-settings') as HTMLElement;
const cssSettings = document.getElementById('css-settings') as HTMLElement;
const codeTextarea = document.getElementById('code-textarea') as HTMLTextAreaElement;
const clearBtn = document.getElementById('clear-btn') as HTMLButtonElement;
const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
const dropZone = document.getElementById('drop-zone') as HTMLElement;
const langSelect = document.getElementById('lang-select') as HTMLSelectElement;

// Results elements
const statusPanel = document.getElementById('status-panel') as HTMLElement;
const statusHeading = document.getElementById('status-heading') as HTMLElement;
const statusSubheading = document.getElementById('status-subheading') as HTMLElement;
const errorCount = document.getElementById('error-count') as HTMLElement;
const noErrorsFallback = document.getElementById('no-errors-fallback') as HTMLElement;
const errorsList = document.getElementById('errors-list') as HTMLElement;

// Initialize Nested CSS Options in HTML settings by cloning standalone CSS options
function initNestedCssOptions() {
  const htmlCssContainer = document.getElementById('html-css-options-container');
  if (htmlCssContainer && cssSettings) {
    // Clone contents and rename IDs
    let nestedHtml = cssSettings.innerHTML;
    nestedHtml = nestedHtml.replaceAll('id="css-', 'id="html-css-');
    nestedHtml = nestedHtml.replaceAll('for="css-', 'for="html-css-');
    // Remove the header title
    nestedHtml = nestedHtml.replace(/<h2 class="section-title">.*?<\/h2>/, '');
    htmlCssContainer.innerHTML = nestedHtml;
  }
}

// Helper: Bind Accordion click listeners
function initAccordions() {
  // Setup click handlers for all headers including cloned ones
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      if (item) {
        item.classList.toggle('expanded');
      }
    });
  });
}

// Parse comma separated lists or return null if empty
function parseCommaList(id: string): string[] | null {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el || !el.value.trim()) return null;
  return el.value.split(',').map(s => s.trim()).filter(Boolean);
}

// Get boolean check state
function getBool(id: string): boolean {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el ? el.checked : false;
}

// Get select value
function getVal(id: string): string {
  const el = document.getElementById(id) as HTMLSelectElement | null;
  return el ? el.value : '';
}

// Collect Options for CSS from either Standalone or Nested HTML context
function collectCssOptions(prefix: 'css' | 'html-css'): CSSCheckerOptions {
  return {
    allowTypeSelectors: getBool(`${prefix}-allow-type`),
    allowClassSelectors: getBool(`${prefix}-allow-class`),
    allowIdSelectors: getBool(`${prefix}-allow-id`),
    allowUniversalSelector: getBool(`${prefix}-allow-universal`),
    allowSelectorLists: getBool(`${prefix}-allow-lists`),
    allowCombinators: getBool(`${prefix}-allow-combinators`),
    allowNestedRules: getBool(`${prefix}-allow-nested`),
    allowAtRules: getBool(`${prefix}-allow-atrules`),
    allowPeudoClasses: getBool(`${prefix}-allow-pseudo-classes`),
    allowPseudoElements: getBool(`${prefix}-allow-pseudo-elements`),
    allowImportant: getBool(`${prefix}-allow-important`),
    allowedProperties: parseCommaList(`${prefix}-allowed-properties`),
    forbiddenProperties: parseCommaList(`${prefix}-forbidden-properties`),
    allowedColorFormats: parseCommaList(`${prefix}-allowed-colors`),
    allowedUnits: parseCommaList(`${prefix}-allowed-units`),
    allowFlexbox: getBool(`${prefix}-allow-flexbox`),
    allowGrid: getBool(`${prefix}-allow-grid`),
    allowLowercaseProperties: getBool(`${prefix}-prop-lowercase`),
    allowUppercaseProperties: getBool(`${prefix}-prop-uppercase`),
    allowMixedcaseProperties: getBool(`${prefix}-prop-mixedcase`),
    allowEmptyRules: getBool(`${prefix}-allow-empty`),
    allowDuplicateProperties: getBool(`${prefix}-allow-duplicate`),
    allowMultiplePropertiesPerLine: getBool(`${prefix}-allow-multi-prop-line`),
    allowUnrecognizedProperties: getBool(`${prefix}-allow-unrecognized`),
  };
}

// Collect Options for HTML Checker
function collectHtmlOptions(): HTMLCheckerOptions {
  return {
    allowedTags: parseCommaList('html-allowed-tags'),
    forbiddenTags: parseCommaList('html-forbidden-tags'),
    allowDeprecatedTags: getBool('html-allow-deprecated'),
    allowCustomTags: getBool('html-allow-custom'),
    xhtmlSelfClosing: getVal('html-xhtml-closing') as 'allowed' | 'forced' | 'forbidden',
    allowLowercaseTags: getBool('html-tag-lowercase'),
    allowUppercaseTags: getBool('html-tag-uppercase'),
    allowMixedcaseTags: getBool('html-tag-mixedcase'),
    forbiddenAttributes: parseCommaList('html-forbidden-attrs'),
    forceRequiredAttributes: getBool('html-force-required'),
    allowDeprecatedAttributes: getBool('html-attr-deprecated'),
    allowCustomAttributes: getBool('html-attr-custom'),
    allowLowercaseAttributes: getBool('html-attr-lowercase'),
    allowUppercaseAttributes: getBool('html-attr-uppercase'),
    allowMixedcaseAttributes: getBool('html-attr-mixedcase'),
    checkFullStructure: getBool('html-check-structure'),
    checkCharset: getBool('html-check-charset'),
    checkTitle: getBool('html-check-title'),
    requireFormControlsInForm: getBool('html-req-form-controls'),
    requireLabelForInteractiveControls: getBool('html-req-labels'),
    requireRadioButtonNameConsistency: getBool('html-radio-consistency'),
    requireExplicitButtonType: getBool('html-button-type'),
    requireSelectHasOption: getBool('html-select-has-option'),
    cssOptions: collectCssOptions('html-css')
  };
}

// Main Perform Validation Function
function performValidation() {
  const code = codeTextarea.value;
  
  if (!code.trim()) {
    // Idle/empty state
    statusPanel.className = 'status-panel status-loading';
    statusHeading.textContent = currentLanguage === 'fr' ? 'En attente de saisie' : 'Awaiting Input';
    statusSubheading.textContent = currentLanguage === 'fr' 
      ? 'Collez du code ou importez un fichier pour commencer la validation.' 
      : 'Paste code or upload a file to begin syntax validation.';
    errorCount.textContent = '0';
    noErrorsFallback.classList.remove('hidden');
    errorsList.classList.add('hidden');
    errorsList.innerHTML = '';
    return;
  }

  let errors: Array<{ type: string; message: string; advice?: string; location?: { start: { line: number; column: number }; end: { line: number; column: number } } }> = [];

  try {
    if (currentMode === 'html') {
      const options = collectHtmlOptions();
      errors = checkHtmlSyntax(code, options, currentLanguage);
    } else {
      const options = collectCssOptions('css');
      errors = checkCssSyntax(code, options, currentLanguage);
    }
    
    // Update Results UI
    errorCount.textContent = errors.length.toString();
    
    if (errors.length === 0) {
      statusPanel.className = 'status-panel status-success';
      statusHeading.textContent = currentLanguage === 'fr' ? 'Validation réussie' : 'Syntax Check Passed';
      statusSubheading.textContent = currentLanguage === 'fr' 
        ? 'Aucune erreur détectée avec les paramètres actuels.' 
        : 'No syntax issues detected under active settings.';
      
      noErrorsFallback.classList.remove('hidden');
      errorsList.classList.add('hidden');
      errorsList.innerHTML = '';
    } else {
      statusPanel.className = 'status-panel status-error';
      statusHeading.textContent = currentLanguage === 'fr' 
        ? `${errors.length} problème(s) détecté(s)` 
        : `${errors.length} Syntax Error(s) Found`;
      statusSubheading.textContent = currentLanguage === 'fr' 
        ? 'Veuillez corriger les erreurs de syntaxe listées ci-dessous.' 
        : 'Please fix the syntax issues listed below.';
      
      noErrorsFallback.classList.add('hidden');
      errorsList.classList.remove('hidden');
      errorsList.innerHTML = '';
      
      errors.forEach(err => {
        const card = document.createElement('div');
        const isParseError = err.type.includes('PARSE_ERROR');
        card.className = `error-card ${isParseError ? 'parse-error' : ''}`;
        
        // Header
        const header = document.createElement('div');
        header.className = 'error-header';
        
        const titleGroup = document.createElement('div');
        titleGroup.className = 'error-title-group';
        
        const typeBadge = document.createElement('span');
        typeBadge.className = 'error-type';
        typeBadge.textContent = err.type;
        
        const msg = document.createElement('div');
        msg.className = 'error-msg';
        msg.textContent = err.message;
        
        titleGroup.appendChild(typeBadge);
        titleGroup.appendChild(msg);
        header.appendChild(titleGroup);
        
        // Location Badge
        if (err.location) {
          const loc = document.createElement('span');
          loc.className = 'error-location';
          loc.textContent = `L${err.location.start.line}:${err.location.start.column}`;
          header.appendChild(loc);
        }
        
        card.appendChild(header);
        
        // Advice
        if (err.advice) {
          const adviceDiv = document.createElement('div');
          adviceDiv.className = 'error-advice';
          
          const adviceHeading = document.createElement('strong');
          adviceHeading.textContent = currentLanguage === 'fr' ? 'Conseil: ' : 'Advice: ';
          
          adviceDiv.appendChild(adviceHeading);
          adviceDiv.appendChild(document.createTextNode(err.advice));
          card.appendChild(adviceDiv);
        }
        
        errorsList.appendChild(card);
      });
    }
  } catch (ex: any) {
    statusPanel.className = 'status-panel status-error';
    statusHeading.textContent = currentLanguage === 'fr' ? 'Erreur de validation' : 'Validation Crash';
    statusSubheading.textContent = ex.message || ex;
    errorCount.textContent = '!';
    noErrorsFallback.classList.add('hidden');
    errorsList.classList.add('hidden');
  }
}

// Switch Mode Function
function setMode(mode: 'html' | 'css') {
  currentMode = mode;
  
  if (mode === 'html') {
    modeBtnHtml.classList.add('active');
    modeBtnCss.classList.remove('active');
    htmlSettings.classList.remove('hidden');
    cssSettings.classList.add('hidden');
    codeTextarea.placeholder = currentLanguage === 'fr' 
      ? 'Collez votre code HTML ici pour vérifier la syntaxe...' 
      : 'Paste your HTML code here to check for syntax errors...';
  } else {
    modeBtnHtml.classList.remove('active');
    modeBtnCss.classList.add('active');
    htmlSettings.classList.add('hidden');
    cssSettings.classList.remove('hidden');
    codeTextarea.placeholder = currentLanguage === 'fr' 
      ? 'Collez votre code CSS ici pour vérifier la syntaxe...' 
      : 'Paste your CSS code here to check for syntax errors...';
  }
  
  performValidation();
}

// Bind Events for Inputs & Toggles
function bindOptionChangeEvents() {
  // Bind standard inputs
  const allInputs = document.querySelectorAll('.custom-input, .custom-select, input[type="checkbox"]');
  allInputs.forEach(input => {
    input.addEventListener('change', performValidation);
    input.addEventListener('input', performValidation);
  });
  
  // Real-time re-run when typing
  codeTextarea.addEventListener('input', performValidation);
  
  // Clear textarea
  clearBtn.addEventListener('click', () => {
    codeTextarea.value = '';
    performValidation();
  });
}

// File Reader Helper
function loadFileContent(file: File) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target?.result as string || '';
    codeTextarea.value = text;
    
    // Auto-switch mode based on file extension
    if (file.name.endsWith('.css')) {
      setMode('css');
    } else if (file.name.endsWith('.html') || file.name.endsWith('.htm')) {
      setMode('html');
    } else {
      performValidation();
    }
  };
  reader.readAsText(file);
}

// Setup File drag & drop, file uploads
function initFileUploadHandlers() {
  // File upload input change
  fileUpload.addEventListener('change', () => {
    if (fileUpload.files && fileUpload.files[0]) {
      loadFileContent(fileUpload.files[0]);
    }
  });

  // Drag over workspace
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  
  // Drag enter textarea card
  const editorCard = document.querySelector('.card-editor') as HTMLElement;
  if (editorCard) {
    editorCard.addEventListener('dragenter', (e) => {
      e.preventDefault();
      dropZone.classList.add('active');
    });
  }

  // Drag leave dropzone
  dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
  });

  // Drop in dropzone
  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('active');
    
    if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
      loadFileContent(e.dataTransfer.files[0]);
    }
  });
}

// Setup Language
langSelect.addEventListener('change', () => {
  currentLanguage = langSelect.value as Language;
  
  // Update placeholders
  if (currentMode === 'html') {
    codeTextarea.placeholder = currentLanguage === 'fr' 
      ? 'Collez votre code HTML ici pour vérifier la syntaxe...' 
      : 'Paste your HTML code here to check for syntax errors...';
  } else {
    codeTextarea.placeholder = currentLanguage === 'fr' 
      ? 'Collez votre code CSS ici pour vérifier la syntaxe...' 
      : 'Paste your CSS code here to check for syntax errors...';
  }
  
  performValidation();
});

// Setup tab navigation
modeBtnHtml.addEventListener('click', () => setMode('html'));
modeBtnCss.addEventListener('click', () => setMode('css'));

// Initialization
initNestedCssOptions();
initAccordions();
bindOptionChangeEvents();
initFileUploadHandlers();
performValidation();
