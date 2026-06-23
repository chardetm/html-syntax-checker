import { describe, it, expect } from 'vitest';
import { checkHtmlSyntax } from '../index';

describe('HTML Syntax Checker', () => {
  // ─── Default language: English ──────────────────────────────────────────────

  describe('Lexical & Basic Parse Errors', () => {
    it('detects unclosed comment', () => {
      const code = '<!-- Mon commentaire';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('HTML comment is not closed');
    });

    it('detects unclosed doctype', () => {
      const code = '<!DOCTYPE html';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('DOCTYPE declaration is not closed');
    });

    it('detects space after <', () => {
      const code = '< div>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('Unexpected space after "<"');
    });

    it('detects unclosed tag', () => {
      const code = '<div class="test"';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('Opening tag "<div" is not closed');
    });

    it('detects unclosed attribute quote', () => {
      const code = '<div class="test>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('is not closed by a quote');
    });

    it('detects raw < character', () => {
      const code = '10 < 20';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('PARSE_ERROR');
      expect(errors[0].message).toContain('Unexpected "<" character');
    });
  });

  describe('Tag Validation Options', () => {
    it('checks allowedTags restriction', () => {
      const code = '<div><span></span></div>';
      const errors = checkHtmlSyntax(code, { allowedTags: ['span'] });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_TAGS');
      expect(errors[0].message).toContain('tag <div> is not allowed by the configuration');
    });

    it('checks forbiddenTags restriction', () => {
      const code = '<div><span></span></div>';
      const errors = checkHtmlSyntax(code, { forbiddenTags: ['span'] });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_TAGS');
      expect(errors[0].message).toContain('tag <span> is forbidden by the configuration');
    });

    it('throws error when allowedTags and forbiddenTags are combined', () => {
      expect(() => {
        checkHtmlSyntax('<div></div>', { allowedTags: ['div'], forbiddenTags: ['span'] });
      }).toThrow('allowedTags');
    });

    it('checks allowDeprecated_tags option', () => {
      const code = '<center>Texte</center>';
      const errors = checkHtmlSyntax(code, { allowDeprecated_tags: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_TAGS');
      expect(errors[0].message).toContain('obsolete/deprecated');
    });

    it('checks allowCustomTags option', () => {
      const code = '<mon-composant></mon-composant>';
      const errors = checkHtmlSyntax(code, { allowCustomTags: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_TAGS');
      expect(errors[0].message).toContain('custom tag <mon-composant>');
    });

    it('checks casing of tags', () => {
      const code = '<DIV></DIV><p></p><sPan></sPan>';
      const errorsLower = checkHtmlSyntax(code, { allowLowercaseTags: true, allowUppercaseTags: false, allowMixedcaseTags: false });
      // DIV (open & close) and sPan (open & close) are invalid
      expect(errorsLower.length).toBeGreaterThanOrEqual(2);
      expect(errorsLower[0].type).toBe('CASE');
      expect(errorsLower[0].message).toContain('uppercase is forbidden');

      const errorsUpper = checkHtmlSyntax(code, { allowLowercaseTags: false, allowUppercaseTags: true, allowMixedcaseTags: false });
      // p and sPan are invalid
      expect(errorsUpper.length).toBeGreaterThanOrEqual(2);
      expect(errorsUpper[0].type).toBe('CASE');
      expect(errorsUpper[0].message).toContain('lowercase is forbidden');
    });
  });

  describe('XHTML & Void Elements Closing', () => {
    it('checks xhtmlSelfClosing allowed (default)', () => {
      const code = '<img src="img.jpg" alt="test"> <img src="img2.jpg" alt="test" />';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it('checks xhtmlSelfClosing forced', () => {
      const code = '<img src="img.jpg" alt="test">';
      const errors = checkHtmlSyntax(code, { xhtmlSelfClosing: 'forced' });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('XHTML_SELF_CLOSING');
      expect(errors[0].message).toContain('must end with "/>"');
    });

    it('checks xhtmlSelfClosing forbidden', () => {
      const code = '<img src="img.jpg" alt="test" />';
      const errors = checkHtmlSyntax(code, { xhtmlSelfClosing: 'forbidden' });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('XHTML_SELF_CLOSING');
      expect(errors[0].message).toContain('must not end with "/>"');
    });

    it('checks non-void tag with self closing slash', () => {
      const code = '<div />';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('INVALID_CLOSING_TAG');
      expect(errors[0].message).toContain('cannot be self-closing');
    });
  });

  describe('Tag Nesting & Mismatch Checks', () => {
    it('detects simple mismatched tags', () => {
      const code = '<div></span>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CLOSING_TAG_MISMATCH');
      expect(errors[0].message).toContain('does not match the opening tag');
    });

    it('detects closing tag of void elements', () => {
      const code = '<img></img>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('INVALID_CLOSING_TAG');
      expect(errors[0].message).toContain('must not have a closing tag');
    });

    it('detects nested unclosed tag', () => {
      const code = '<div><p>Texte</div>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CLOSING_TAG_MISMATCH');
      expect(errors[0].message).toContain('The tag <p> opened at line 1 is not closed');
    });

    it('detects unclosed tags at EOF', () => {
      const code = '<div><span>Texte';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(2);
      expect(errors[0].type).toBe('CLOSING_TAG_MISMATCH');
      expect(errors[1].type).toBe('CLOSING_TAG_MISMATCH');
      expect(errors[1].message).toContain('was not closed before the end of the file');
    });
  });

  describe('Attributes Validation', () => {
    it('checks required attributes', () => {
      const code = '<img src="test.png">';
      const errors = checkHtmlSyntax(code, { forceRequiredAttributes: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('MISSING_REQUIRED_ATTRIBUTE');
      expect(errors[0].message).toContain('alt');
      expect(errors[0].advice).toContain('accessibility');
    });

    it('checks forbidden attributes', () => {
      const code = '<div onclick="run()"></div>';
      const errors = checkHtmlSyntax(code, { forbiddenAttributes: ['onclick'] });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_ATTRIBUTES');
      expect(errors[0].message).toContain('onclick');
    });

    it('checks deprecated attributes', () => {
      const code = '<div align="center"></div>';
      const errors = checkHtmlSyntax(code, { allowDeprecatedAttributes: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_ATTRIBUTES');
      expect(errors[0].message).toContain('deprecated');
    });

    it('checks custom attributes', () => {
      const code = '<div custom-val="123" data-valid="ok"></div>';
      const errors = checkHtmlSyntax(code, { allowCustomAttributes: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('ALLOWED_ATTRIBUTES');
      expect(errors[0].message).toContain('custom-val');
    });

    it('checks casing of attributes', () => {
      const code = '<div CLASS="test"></div>';
      const errors = checkHtmlSyntax(code, { allowLowercaseAttributes: true, allowUppercaseAttributes: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('CASE');
      expect(errors[0].message).toContain('CLASS');
    });
  });

  describe('Full Document Structure Validation', () => {
    it('checks valid page structure', () => {
      const code = `<!DOCTYPE html>
<html>
  <head>
    <title>Mon Titre</title>
  </head>
  <body>
    <h1>Bonjour</h1>
  </body>
</html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(0);
    });

    it('detects missing DOCTYPE', () => {
      const code = `<html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('DOCTYPE declaration is missing');
    });

    it('detects invalid DOCTYPE format', () => {
      const code = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('incorrect or not in standard format');
    });

    it('detects tag outside html', () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head><body></body></html> <p>Erreur</p>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('located outside the <html> tag');
    });

    it('detects invalid child of html', () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head> <p>Erreur</p> <body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('direct child of <html>, which is forbidden');
    });

    it('detects visual tags in head', () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title> <div>Erreur</div> </head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('not allowed in the <head> section');
    });

    it('detects title tag in body', () => {
      const code = `<!DOCTYPE html><html><head></head><body> <title>Titre</title> </body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('must not be placed in the <body> section');
    });

    it('detects text in head', () => {
      const code = `<!DOCTYPE html><html><head>Texte interdit</head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('DOCUMENT_STRUCTURE');
      expect(errors[0].message).toContain('in the <head> section');
    });
  });

  describe('Charset and Title Required Checks', () => {
    it('checks missing charset inside head', () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkCharset: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('MISSING_CHARSET');
    });

    it('checks missing title inside head', () => {
      const code = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkTitle: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('MISSING_TITLE');
    });

    it('checks title tag exists but is empty', () => {
      const code = `<!DOCTYPE html><html><head><title>  </title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkTitle: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe('MISSING_TITLE');
    });
  });

  // ─── French language output ─────────────────────────────────────────────────

  describe('French language output (lang: fr)', () => {
    it('outputs French for unclosed comment', () => {
      const code = '<!-- commentaire';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain("commentaire HTML n\u2019est pas ferm\u00e9");
    });

    it('outputs French for unclosed doctype', () => {
      const code = '<!DOCTYPE html';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain("DOCTYPE n\u2019est pas ferm\u00e9e");
    });

    it('outputs French for space after <', () => {
      const code = '< div>';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain('Espace inattendu après "<"');
    });

    it('outputs French for unclosed tag', () => {
      const code = '<div class="test"';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain("balise ouvrante \"<div\" n\u2019est pas ferm\u00e9e");
    });

    it('outputs French for unclosed attribute quote', () => {
      const code = '<div class="test>';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain('pas ferm\u00e9e par un guillemet');
    });

    it('outputs French for raw < character', () => {
      const code = '10 < 20';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[0].message).toContain('Caractère "<" inattendu');
    });

    it('outputs French for forbidden tag', () => {
      const code = '<div><span></span></div>';
      const errors = checkHtmlSyntax(code, { forbiddenTags: ['span'] }, 'fr');
      expect(errors[0].message).toContain('balise <span> est interdite');
    });

    it('outputs French for deprecated tag', () => {
      const code = '<center>Texte</center>';
      const errors = checkHtmlSyntax(code, { allowDeprecated_tags: false }, 'fr');
      expect(errors[0].message).toContain('obsolète/dépréciée');
    });

    it('outputs French for mismatched closing tag at EOF', () => {
      const code = '<div><span>Texte';
      const errors = checkHtmlSyntax(code, {}, 'fr');
      expect(errors[1].message).toContain("n'a pas \u00e9t\u00e9 ferm\u00e9e avant la fin du fichier");
    });

    it('outputs French for missing DOCTYPE', () => {
      const code = `<html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true }, 'fr');
      expect(errors[0].message).toContain('DOCTYPE est manquante');
    });

    it('outputs French for required attribute (alt)', () => {
      const code = '<img src="test.png">';
      const errors = checkHtmlSyntax(code, { forceRequiredAttributes: true }, 'fr');
      expect(errors[0].message).toContain('alt');
      expect(errors[0].advice).toContain('accessibilité');
    });
  });
});
