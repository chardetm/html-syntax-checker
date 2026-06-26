import { describe, it, expect } from "vitest";
import { checkHtmlSyntax, getHtmlErrorTypeName } from "../index";

describe("HTML Syntax Checker", () => {
  describe("Error type names", () => {
    it("returns localized names for checker error types", () => {
      expect(getHtmlErrorTypeName("PARSE_ERROR", "en")).toBe("Syntax error");
      expect(getHtmlErrorTypeName("PARSE_ERROR", "fr")).toBe("Erreur de syntaxe");
      expect(getHtmlErrorTypeName("MISSING_TITLE", "en")).toBe("Missing title");
      expect(getHtmlErrorTypeName("MISSING_TITLE", "fr")).toBe("Titre manquant");
      expect(getHtmlErrorTypeName("DUPLICATE_ID", "en")).toBe("Duplicate ID");
      expect(getHtmlErrorTypeName("DUPLICATE_ID", "fr")).toBe("Identifiant en double");
    });
  });

  // ─── Default language: English ──────────────────────────────────────────────

  describe("Lexical & Basic Parse Errors", () => {
    it("detects unclosed comment", () => {
      const code = "<!-- Mon commentaire";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain("HTML comment is not closed");
    });

    it("detects unclosed doctype", () => {
      const code = "<!DOCTYPE html";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain("DOCTYPE declaration is not closed");
    });

    it("detects space after <", () => {
      const code = "< div>";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain('Unexpected space after "<"');
    });

    it("detects unclosed tag", () => {
      const code = '<div class="test"';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain('Opening tag "<div" is not closed');
    });

    it("detects unclosed attribute quote", () => {
      const code = '<div class="test>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain("is not closed by a quote");
    });

    it("detects raw < character", () => {
      const code = "10 < 20";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("PARSE_ERROR");
      expect(errors[0].message).toContain('Unexpected "<" character');
    });
  });

  describe("Tag Validation Options", () => {
    it("checks allowedTags restriction", () => {
      const code = "<div><span></span></div>";
      const errors = checkHtmlSyntax(code, { allowedTags: ["span"] });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain(
        "tag <div> is not allowed by the configuration",
      );
    });

    it("checks forbiddenTags restriction", () => {
      const code = "<div><span></span></div>";
      const errors = checkHtmlSyntax(code, { forbiddenTags: ["span"] });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain(
        "tag <span> is forbidden by the configuration",
      );
    });

    it("throws error when allowedTags and forbiddenTags are combined", () => {
      expect(() => {
        checkHtmlSyntax("<div></div>", {
          allowedTags: ["div"],
          forbiddenTags: ["span"],
        });
      }).toThrow("allowedTags");
    });

    it("checks allowDeprecatedTags option", () => {
      const code = "<center>Texte</center>";
      const errors = checkHtmlSyntax(code, { allowDeprecatedTags: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain("obsolete/deprecated");
    });

    it("checks allowCustomTags option", () => {
      const code = "<mon-composant></mon-composant>";
      const errors = checkHtmlSyntax(code, { allowCustomTags: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain("custom tag <mon-composant>");
    });

    it("checks casing of tags", () => {
      const code = "<DIV></DIV><p></p><sPan></sPan>";
      const errorsLower = checkHtmlSyntax(code, {
        allowLowercaseTags: true,
        allowUppercaseTags: false,
        allowMixedcaseTags: false,
      });
      // DIV (open & close) and sPan (open & close) are invalid
      expect(errorsLower.length).toBeGreaterThanOrEqual(2);
      expect(errorsLower[0].type).toBe("CASE");
      expect(errorsLower[0].message).toContain("uppercase is forbidden");

      const errorsUpper = checkHtmlSyntax(code, {
        allowLowercaseTags: false,
        allowUppercaseTags: true,
        allowMixedcaseTags: false,
      });
      // p and sPan are invalid
      expect(errorsUpper.length).toBeGreaterThanOrEqual(2);
      expect(errorsUpper[0].type).toBe("CASE");
      expect(errorsUpper[0].message).toContain("lowercase is forbidden");
    });
  });

  describe("XHTML & Void Elements Closing", () => {
    it("checks xhtmlSelfClosing allowed (default)", () => {
      const code =
        '<img src="img.jpg" alt="test"> <img src="img2.jpg" alt="test" />';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("checks xhtmlSelfClosing forced", () => {
      const code = '<img src="img.jpg" alt="test">';
      const errors = checkHtmlSyntax(code, { xhtmlSelfClosing: "forced" });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("XHTML_SELF_CLOSING");
      expect(errors[0].message).toContain('must end with "/>"');
    });

    it("checks xhtmlSelfClosing forbidden", () => {
      const code = '<img src="img.jpg" alt="test" />';
      const errors = checkHtmlSyntax(code, { xhtmlSelfClosing: "forbidden" });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("XHTML_SELF_CLOSING");
      expect(errors[0].message).toContain('must not end with "/>"');
    });

    it("checks non-void tag with self closing slash", () => {
      const code = "<div />";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("INVALID_CLOSING_TAG");
      expect(errors[0].message).toContain("cannot be self-closing");
    });
  });

  describe("Tag Nesting & Mismatch Checks", () => {
    it("detects simple mismatched tags", () => {
      const code = "<div></span>";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("CLOSING_TAG_MISMATCH");
      expect(errors[0].message).toContain("does not match the opening tag");
    });

    it("detects closing tag of void elements", () => {
      const code = "<img></img>";
      const errors = checkHtmlSyntax(code, { forceRequiredAttributes: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("INVALID_CLOSING_TAG");
      expect(errors[0].message).toContain("must not have a closing tag");
    });

    it("detects nested unclosed tag", () => {
      const code = "<div><p>Texte</div>";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("CLOSING_TAG_MISMATCH");
      expect(errors[0].message).toContain(
        "The tag <p> opened at line 1 is not closed",
      );
    });

    it("detects unclosed tags at EOF", () => {
      const code = "<div><span>Texte";
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(2);
      expect(errors[0].type).toBe("CLOSING_TAG_MISMATCH");
      expect(errors[1].type).toBe("CLOSING_TAG_MISMATCH");
      expect(errors[1].message).toContain(
        "was not closed before the end of the file",
      );
    });
  });

  describe("Attributes Validation", () => {
    it("checks required attributes", () => {
      const code = '<img src="test.png">';
      const errors = checkHtmlSyntax(code, { forceRequiredAttributes: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_REQUIRED_ATTRIBUTE");
      expect(errors[0].message).toContain("alt");
      expect(errors[0].advice).toContain("accessibility");
    });

    it("checks forbidden attributes", () => {
      const code = '<div onclick="run()"></div>';
      const errors = checkHtmlSyntax(code, {
        forbiddenAttributes: ["onclick"],
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_ATTRIBUTES");
      expect(errors[0].message).toContain("onclick");
    });

    it("checks deprecated attributes", () => {
      const code = '<div align="center"></div>';
      const errors = checkHtmlSyntax(code, {
        allowDeprecatedAttributes: false,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_ATTRIBUTES");
      expect(errors[0].message).toContain("deprecated");
    });

    it("checks custom attributes", () => {
      const code = '<div custom-val="123" data-valid="ok"></div>';
      const errors = checkHtmlSyntax(code, { allowCustomAttributes: false });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_ATTRIBUTES");
      expect(errors[0].message).toContain("custom-val");
    });

    it("checks casing of attributes", () => {
      const code = '<div CLASS="test"></div>';
      const errors = checkHtmlSyntax(code, {
        allowLowercaseAttributes: true,
        allowUppercaseAttributes: false,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("CASE");
      expect(errors[0].message).toContain("CLASS");
    });
  });

  describe("Full Document Structure Validation", () => {
    it("checks valid page structure", () => {
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

    it("detects missing DOCTYPE", () => {
      const code = `<html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain("DOCTYPE declaration is missing");
      expect(errors[0].location).toBeUndefined();
    });

    it("detects invalid DOCTYPE format", () => {
      const code = `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"><html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain(
        "incorrect or not in standard format",
      );
    });

    it("detects tag outside html", () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head><body></body></html> <p>Erreur</p>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain("located outside the <html> tag");
    });

    it("detects invalid child of html", () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head> <p>Erreur</p> <body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain(
        "direct child of <html>, which is forbidden",
      );
    });

    it("detects visual tags in head", () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title> <div>Erreur</div> </head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain("not allowed in the <head> section");
    });

    it("detects title tag in body", () => {
      const code = `<!DOCTYPE html><html><head></head><body> <title>Titre</title> </body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain(
        "must not be placed in the <body> section",
      );
    });

    it("detects text in head", () => {
      const code = `<!DOCTYPE html><html><head>Texte interdit</head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(errors[0].message).toContain("in the <head> section");
    });

    it("detects multiple body sections and points to the duplicate body tag position", () => {
      const code = `<!DOCTYPE html>
<html>
  <head>
    <title>Titre</title>
  </head>
  <body>
    <p>First body</p>
  </body>
  <body>
    <p>Second body</p>
  </body>
</html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      const bodyErrors = errors.filter(e => e.message.includes("Multiple <body> tags"));
      expect(bodyErrors).toHaveLength(1);
      expect(bodyErrors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(bodyErrors[0].location?.start).toEqual({ line: 9, column: 3 });
      expect(bodyErrors[0].location?.end).toEqual({ line: 9, column: 8 });
    });

    it("detects multiple html tags and points to the duplicate html tag position", () => {
      const code = `<!DOCTYPE html>
<html>
  <head>
    <title>Titre</title>
  </head>
  <body></body>
</html>
<html>
  <body></body>
</html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      const htmlErrors = errors.filter(e => e.message.includes("Multiple <html> tags"));
      expect(htmlErrors).toHaveLength(1);
      expect(htmlErrors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(htmlErrors[0].location?.start).toEqual({ line: 8, column: 1 });
      expect(htmlErrors[0].location?.end).toEqual({ line: 8, column: 6 });
    });

    it("detects multiple head sections and points to the duplicate head tag position", () => {
      const code = `<!DOCTYPE html>
<html>
  <head>
    <title>Titre</title>
  </head>
  <head>
    <meta charset="utf-8">
  </head>
  <body></body>
</html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      const headErrors = errors.filter(e => e.message.includes("Multiple <head> tags"));
      expect(headErrors).toHaveLength(1);
      expect(headErrors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(headErrors[0].location?.start).toEqual({ line: 6, column: 3 });
      expect(headErrors[0].location?.end).toEqual({ line: 6, column: 8 });
    });

    it("detects multiple DOCTYPE declarations and points to the duplicate DOCTYPE positions", () => {
      const code = `<!DOCTYPE html>
<!DOCTYPE html>
<html>
  <head>
    <title>Titre</title>
  </head>
  <body></body>
</html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      const docErrors = errors.filter(e => e.message.includes("Multiple DOCTYPE declarations"));
      expect(docErrors).toHaveLength(1);
      expect(docErrors[0].type).toBe("DOCUMENT_STRUCTURE");
      expect(docErrors[0].location?.start).toEqual({ line: 2, column: 1 });
      expect(docErrors[0].location?.end).toEqual({ line: 2, column: 15 });
    });

    it("detects missing html, head, and body tags and asserts they have no location", () => {
      const code = `<!DOCTYPE html><p>no structure</p>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true });
      const htmlErrors = errors.filter(e => e.message.includes("main <html> tag is missing") || e.message.includes("balise principale"));
      const headErrors = errors.filter(e => e.message.includes("<head> section is missing") || e.message.includes("section <head> est manquante"));
      const bodyErrors = errors.filter(e => e.message.includes("<body> section is missing") || e.message.includes("section <body> est manquante"));

      expect(htmlErrors).toHaveLength(1);
      expect(htmlErrors[0].location).toBeUndefined();

      expect(headErrors).toHaveLength(1);
      expect(headErrors[0].location).toBeUndefined();

      expect(bodyErrors).toHaveLength(1);
      expect(bodyErrors[0].location).toBeUndefined();
    });
  });

  describe("Charset and Title Required Checks", () => {
    it("checks missing charset inside head", () => {
      const code = `<!DOCTYPE html><html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkCharset: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_CHARSET");
      expect(errors[0].location).toBeUndefined();
    });

    it("checks missing title inside head", () => {
      const code = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkTitle: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_TITLE");
      expect(errors[0].location).toBeUndefined();
    });

    it("checks title tag exists but is empty", () => {
      const code = `<!DOCTYPE html><html><head><title>  </title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkTitle: true });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_TITLE");
      expect(errors[0].location).toBeUndefined();
    });
  });

  // ─── French language output ─────────────────────────────────────────────────

  describe("French language output (lang: fr)", () => {
    it("outputs French for unclosed comment", () => {
      const code = "<!-- commentaire";
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain(
        "commentaire HTML n\u2019est pas ferm\u00e9",
      );
    });

    it("outputs French for unclosed doctype", () => {
      const code = "<!DOCTYPE html";
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain("DOCTYPE n\u2019est pas ferm\u00e9e");
    });

    it("outputs French for space after <", () => {
      const code = "< div>";
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain('Espace inattendu après «\u00A0<\u00A0»');
    });

    it("outputs French for unclosed tag", () => {
      const code = '<div class="test"';
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain(
        'balise ouvrante «\u00A0<div\u00A0» n\u2019est pas ferm\u00e9e',
      );
    });

    it("outputs French for unclosed attribute quote", () => {
      const code = '<div class="test>';
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain("pas ferm\u00e9e par un guillemet");
    });

    it("outputs French for raw < character", () => {
      const code = "10 < 20";
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[0].message).toContain('Caractère «\u00A0<\u00A0» inattendu');
    });

    it("outputs French for forbidden tag", () => {
      const code = "<div><span></span></div>";
      const errors = checkHtmlSyntax(code, { forbiddenTags: ["span"] }, "fr");
      expect(errors[0].message).toContain("balise <span> est interdite");
    });

    it("outputs French for deprecated tag", () => {
      const code = "<center>Texte</center>";
      const errors = checkHtmlSyntax(
        code,
        { allowDeprecatedTags: false },
        "fr",
      );
      expect(errors[0].message).toContain("obsolète/dépréciée");
    });

    it("outputs French for mismatched closing tag at EOF", () => {
      const code = "<div><span>Texte";
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors[1].message).toContain(
        "n'a pas \u00e9t\u00e9 ferm\u00e9e avant la fin du fichier",
      );
    });

    it("outputs French for missing DOCTYPE", () => {
      const code = `<html><head><title>Titre</title></head><body></body></html>`;
      const errors = checkHtmlSyntax(code, { checkFullStructure: true }, "fr");
      expect(errors[0].message).toContain("DOCTYPE est manquante");
    });

    it("outputs French for required attribute (alt)", () => {
      const code = '<img src="test.png">';
      const errors = checkHtmlSyntax(
        code,
        { forceRequiredAttributes: true },
        "fr",
      );
      expect(errors[0].message).toContain("alt");
      expect(errors[0].advice).toContain("accessibilité");
    });
  });

  // ─── HTML5 Standard Tag Recognition ─────────────────────────────────────────

  describe("HTML5 Standard Tag Recognition (allowCustomTags: false)", () => {
    // All tags in the HTML5 standard (non-deprecated) must NOT generate an
    // ALLOWED_TAGS error when allowCustomTags is false.
    // Source: https://html.spec.whatwg.org/multipage/indices.html#elements-3

    // Void elements are tested without a closing tag; all others with one.
    const VOID = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "source",
      "track",
      "wbr",
    ]);

    const ALL_STANDARD_TAGS = [
      // Document / metadata
      "html",
      "head",
      "body",
      "title",
      "meta",
      "link",
      "style",
      "script",
      "noscript",
      "base",
      // Sections
      "address",
      "article",
      "aside",
      "footer",
      "header",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "main",
      "nav",
      "section",
      // Grouping content
      "blockquote",
      "dd",
      "div",
      "dl",
      "dt",
      "figcaption",
      "figure",
      "hr",
      "li",
      "menu",
      "ol",
      "p",
      "pre",
      "ul",
      // Text-level semantics
      "a",
      "abbr",
      "b",
      "bdi",
      "bdo",
      "br",
      "cite",
      "code",
      "data",
      "dfn",
      "em",
      "i",
      "kbd",
      "mark",
      "q",
      "rp",
      "rt",
      "ruby",
      "s",
      "samp",
      "small",
      "span",
      "strong",
      "sub",
      "sup",
      "time",
      "u",
      "var",
      "wbr",
      // Embedded content
      "area",
      "audio",
      "img",
      "map",
      "track",
      "video",
      "embed",
      "iframe",
      "object",
      "picture",
      "portal",
      "source",
      // Scripting
      "canvas",
      // Edits
      "del",
      "ins",
      // Table content
      "caption",
      "col",
      "colgroup",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "tr",
      // Forms
      "button",
      "datalist",
      "fieldset",
      "form",
      "input",
      "label",
      "legend",
      "meter",
      "optgroup",
      "option",
      "output",
      "progress",
      "select",
      "textarea",
      // Interactive elements
      "details",
      "dialog",
      "summary",
      // Web components
      "template",
      "slot",
    ];

    it("accepts every HTML5 standard tag without error", () => {
      for (const tag of ALL_STANDARD_TAGS) {
        const code = VOID.has(tag) ? `<${tag}>` : `<${tag}></${tag}>`;
        const errors = checkHtmlSyntax(code, { allowCustomTags: false }).filter(
          (e) => e.type === "ALLOWED_TAGS",
        );
        expect(
          errors,
          `<${tag}> should be accepted as a standard tag`,
        ).toHaveLength(0);
      }
    });
  });

  // ─── Custom / Unknown Tag Detection ─────────────────────────────────────────

  describe("Custom tag detection (allowCustomTags: false)", () => {
    it("still allows data-* attributes on standard tags", () => {
      const errors = checkHtmlSyntax('<div data-state="open"></div>', {
        allowCustomTags: false,
      });
      expect(
        errors.filter((e) => e.type === "ALLOWED_ATTRIBUTES"),
      ).toHaveLength(0);
    });

    it("flags a hyphenated custom element", () => {
      const errors = checkHtmlSyntax("<my-widget></my-widget>", {
        allowCustomTags: false,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain("<my-widget>");
    });

    it("flags a single-word unknown tag", () => {
      const errors = checkHtmlSyntax("<foobar></foobar>", {
        allowCustomTags: false,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("ALLOWED_TAGS");
      expect(errors[0].message).toContain("<foobar>");
    });

    it("flags multiple unknown tags and counts them correctly", () => {
      const errors = checkHtmlSyntax("<alpha></alpha><beta></beta>", {
        allowCustomTags: false,
      }).filter((e) => e.type === "ALLOWED_TAGS");
      expect(errors).toHaveLength(2);
    });

    it("does NOT flag standard tags as custom", () => {
      const errors = checkHtmlSyntax("<div><span></span></div>", {
        allowCustomTags: false,
      });
      expect(errors.filter((e) => e.type === "ALLOWED_TAGS")).toHaveLength(0);
    });

    it("does NOT flag a deprecated tag as a custom tag (it has its own category)", () => {
      // <center> is deprecated, not custom — with allowCustomTags: false it should
      // NOT produce an ALLOWED_TAGS error (only allowDeprecatedTags: false would).
      const errors = checkHtmlSyntax("<center>text</center>", {
        allowCustomTags: false,
      });
      expect(errors.filter((e) => e.type === "ALLOWED_TAGS")).toHaveLength(0);
    });
  });

  // ─── Required Attributes (forceRequiredAttributes) ───────────────────────────

  describe("Required attributes enforcement (forceRequiredAttributes: true)", () => {
    // REQUIRED_ATTRIBUTES in htmlData.ts:
    //   img  → ['src', 'alt']
    //   iframe → ['src']
    //   link → ['rel']
    //   area → ['alt']

    it("flags <img> missing both src and alt", () => {
      const errors = checkHtmlSyntax("<img>", {
        forceRequiredAttributes: true,
      });
      const types = errors.map((e) => e.type);
      expect(
        types.filter((t) => t === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(2);
      const msgs = errors.map((e) => e.message);
      expect(msgs.some((m) => m.includes("src"))).toBe(true);
      expect(msgs.some((m) => m.includes("alt"))).toBe(true);
    });

    it("flags <img> missing only alt when src is present", () => {
      const errors = checkHtmlSyntax('<img src="photo.jpg">', {
        forceRequiredAttributes: true,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_REQUIRED_ATTRIBUTE");
      expect(errors[0].message).toContain("alt");
      // The advice should mention accessibility
      expect(errors[0].advice).toContain("accessibility");
    });

    it("flags <img> missing only src when alt is present", () => {
      const errors = checkHtmlSyntax('<img alt="photo">', {
        forceRequiredAttributes: true,
      });
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("MISSING_REQUIRED_ATTRIBUTE");
      expect(errors[0].message).toContain("src");
    });

    it("does NOT flag <img> when both src and alt are present", () => {
      const errors = checkHtmlSyntax('<img src="x.jpg" alt="desc">', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(0);
    });

    it("flags <iframe> missing src", () => {
      const errors = checkHtmlSyntax("<iframe></iframe>", {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(1);
      expect(errors[0].message).toContain("src");
    });

    it("does NOT flag <iframe> when src is present", () => {
      const errors = checkHtmlSyntax('<iframe src="page.html"></iframe>', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(0);
    });

    it("flags <link> missing rel", () => {
      const errors = checkHtmlSyntax('<link href="style.css">', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(1);
      expect(errors[0].message).toContain("rel");
    });

    it("does NOT flag <link> when rel is present", () => {
      const errors = checkHtmlSyntax(
        '<link rel="stylesheet" href="style.css">',
        { forceRequiredAttributes: true },
      );
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(0);
    });

    it("flags <track> missing src", () => {
      const errors = checkHtmlSyntax('<track kind="captions">', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(1);
      expect(errors[0].message).toContain("src");
    });

    it("flags <track> missing kind", () => {
      const errors = checkHtmlSyntax('<track src="captions.vtt">', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(1);
      expect(errors[0].message).toContain("kind");
    });

    it("does NOT flag <track> when src and kind are present", () => {
      const errors = checkHtmlSyntax(
        '<track src="captions.vtt" kind="captions">',
        { forceRequiredAttributes: true },
      );
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(0);
    });

    it("does NOT flag tags without required-attribute rules", () => {
      const errors = checkHtmlSyntax('<div id="main"><p>Hello</p></div>', {
        forceRequiredAttributes: true,
      });
      expect(
        errors.filter((e) => e.type === "MISSING_REQUIRED_ATTRIBUTE"),
      ).toHaveLength(0);
    });
  });

  // ─── Tag & Attribute Casing Rules ────────────────────────────────────────────

  describe("Casing rules for tags and attributes", () => {
    // ── Tags ──────────────────────────────────────────────────────────────────

    describe("Tag casing — opening tags", () => {
      it("allows lowercase opening tag when allowLowercaseTags: true", () => {
        const errors = checkHtmlSyntax("<div></div>", {
          allowLowercaseTags: true,
          allowUppercaseTags: false,
          allowMixedcaseTags: false,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags lowercase opening tag when allowLowercaseTags: false", () => {
        const errors = checkHtmlSyntax("<div></div>", {
          allowLowercaseTags: false,
          allowUppercaseTags: true,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        // Both <div> (open) and </div> (close) are lowercase → 2 CASE errors
        expect(caseErrors.length).toBeGreaterThanOrEqual(1);
        expect(caseErrors[0].message).toContain("lowercase is forbidden");
      });

      it("allows uppercase opening tag when allowUppercaseTags: true", () => {
        const errors = checkHtmlSyntax("<DIV></DIV>", {
          allowLowercaseTags: false,
          allowUppercaseTags: true,
          allowMixedcaseTags: false,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags uppercase opening tag when allowUppercaseTags: false", () => {
        const errors = checkHtmlSyntax("<DIV></DIV>", {
          allowLowercaseTags: true,
          allowUppercaseTags: false,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors.length).toBeGreaterThanOrEqual(1);
        expect(caseErrors[0].message).toContain("uppercase is forbidden");
      });

      it("allows mixed-case opening tag when allowMixedcaseTags: true", () => {
        const errors = checkHtmlSyntax("<DiV></DiV>", {
          allowLowercaseTags: false,
          allowUppercaseTags: false,
          allowMixedcaseTags: true,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags mixed-case opening tag when allowMixedcaseTags: false", () => {
        const errors = checkHtmlSyntax("<DiV></DiV>", {
          allowLowercaseTags: true,
          allowUppercaseTags: true,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors.length).toBeGreaterThanOrEqual(1);
        expect(caseErrors[0].message).toContain("mixed casing");
      });
    });

    describe("Tag casing — closing tags", () => {
      it("flags lowercase closing tag when allowLowercaseTags: false", () => {
        // Use uppercase opening (allowed) + lowercase closing (forbidden)
        const errors = checkHtmlSyntax("<DIV></div>", {
          allowLowercaseTags: false,
          allowUppercaseTags: true,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("</div>");
        expect(caseErrors[0].message).toContain("lowercase is forbidden");
      });

      it("flags uppercase closing tag when allowUppercaseTags: false", () => {
        const errors = checkHtmlSyntax("<div></DIV>", {
          allowLowercaseTags: true,
          allowUppercaseTags: false,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("</DIV>");
        expect(caseErrors[0].message).toContain("uppercase is forbidden");
      });

      it("flags mixed-case closing tag when allowMixedcaseTags: false", () => {
        const errors = checkHtmlSyntax("<DIV></dIv>", {
          allowLowercaseTags: true,
          allowUppercaseTags: true,
          allowMixedcaseTags: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("</dIv>");
        expect(caseErrors[0].message).toContain("mixed casing");
      });
    });

    describe("Tag casing — default (all casing allowed)", () => {
      it("accepts lowercase, uppercase, but not mixed-case tags by default", () => {
        const code = "<div></div><DIV></DIV><DiV></DiV>";
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(2); // Only the mixed-case <DiV> should be flagged
        expect(errors[0].message).toContain("<DiV>");
        expect(errors[1].message).toContain("</DiV>");
      });
    });

    // ── Attributes ────────────────────────────────────────────────────────────

    describe("Attribute casing", () => {
      it("allows lowercase attributes when allowLowercaseAttributes: true", () => {
        const errors = checkHtmlSyntax('<div class="x"></div>', {
          allowLowercaseAttributes: true,
          allowUppercaseAttributes: false,
          allowMixedcaseAttributes: false,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags lowercase attribute when allowLowercaseAttributes: false", () => {
        const errors = checkHtmlSyntax('<div class="x"></div>', {
          allowLowercaseAttributes: false,
          allowUppercaseAttributes: true,
          allowMixedcaseAttributes: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("class");
        // The message body says "must not be in lowercase"
        expect(caseErrors[0].message).toContain("lowercase");
      });

      it("allows uppercase attribute when allowUppercaseAttributes: true", () => {
        const errors = checkHtmlSyntax('<div CLASS="x"></div>', {
          allowLowercaseAttributes: false,
          allowUppercaseAttributes: true,
          allowMixedcaseAttributes: false,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags uppercase attribute when allowUppercaseAttributes: false", () => {
        const errors = checkHtmlSyntax('<div CLASS="x"></div>', {
          allowLowercaseAttributes: true,
          allowUppercaseAttributes: false,
          allowMixedcaseAttributes: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("CLASS");
        expect(caseErrors[0].message).toContain("uppercase");
      });

      it("allows mixed-case attribute when allowMixedcaseAttributes: true", () => {
        const errors = checkHtmlSyntax('<div tabIndex="0"></div>', {
          allowLowercaseAttributes: false,
          allowUppercaseAttributes: false,
          allowMixedcaseAttributes: true,
        });
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
      });

      it("flags mixed-case attribute when allowMixedcaseAttributes: false", () => {
        const errors = checkHtmlSyntax('<div tabIndex="0"></div>', {
          allowLowercaseAttributes: true,
          allowUppercaseAttributes: true,
          allowMixedcaseAttributes: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(1);
        expect(caseErrors[0].message).toContain("tabIndex");
        expect(caseErrors[0].message).toContain("mixed casing");
      });

      it("flags multiple attributes with wrong casing independently", () => {
        // Both CLASS and ID are uppercase — should produce 2 CASE errors
        const errors = checkHtmlSyntax('<div CLASS="x" ID="y"></div>', {
          allowLowercaseAttributes: true,
          allowUppercaseAttributes: false,
          allowMixedcaseAttributes: false,
        });
        const caseErrors = errors.filter((e) => e.type === "CASE");
        expect(caseErrors).toHaveLength(2);
      });

      it("accepts uppercase and lowercase but not mixed-case by default", () => {
        const code = '<div class="a" CLASS="b" tabIndex="0"></div>';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "CASE")).toHaveLength(1);
        expect(errors[0].message).toContain("tabIndex");
      });
    });
  });

  describe("SVG specific validation rules", () => {
    it("allows standard svg tags and inner structure with no errors", () => {
      const code = '<svg viewBox="0 0 100 100"><g><circle cx="10" cy="10" r="5" /><rect x="20" y="20" width="10" height="10"></rect></g></svg>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("allows self-closing svg itself", () => {
      const code = '<svg />';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("detects unclosed tags inside SVG at EOF", () => {
      const code = '<svg viewBox="0 0 100 100"><g><circle cx="10" cy="10" r="5" /></svg>';
      const errors = checkHtmlSyntax(code);
      expect(errors.filter((e) => e.type === "CLOSING_TAG_MISMATCH")).toHaveLength(1);
      expect(errors[0].message).toContain("<g>");
    });

    it("detects mismatched closing tags inside SVG", () => {
      const code = '<svg><g></circle></svg>';
      const errors = checkHtmlSyntax(code);
      expect(errors.filter((e) => e.type === "CLOSING_TAG_MISMATCH")).toHaveLength(1);
    });

    it("requires closing tag if it does not end with /> inside SVG", () => {
      const code = '<svg><circle cx="5" cy="5" r="5"><rect width="5" /></svg>';
      const errors = checkHtmlSyntax(code);
      expect(errors.filter((e) => e.type === "CLOSING_TAG_MISMATCH")).toHaveLength(1);
      expect(errors[0].message).toContain("<circle>");
    });

    it("bypasses void tag constraints inside SVG", () => {
      // In normal HTML, link and br are void tags and cannot have closing tags or be closed in certain modes.
      // Inside SVG they are treated as normal tags.
      const code = '<svg><link href="style.css"></link><br></br></svg>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("bypasses casing validations for tags and attributes inside SVG", () => {
      const code = '<svg viewBox="0 0 100 100" strokeWidth="2"><clipPath id="x"><CLIPPATH id="y"></CLIPPATH></clipPath></svg>';
      const errors = checkHtmlSyntax(code, {
        allowUppercaseTags: false,
        allowMixedcaseTags: false,
        allowLowercaseTags: true,
        allowLowercaseAttributes: true,
        allowUppercaseAttributes: false,
        allowMixedcaseAttributes: false,
      });
      expect(errors.filter((e) => e.type === "CASE")).toHaveLength(0);
    });

    it("bypasses custom and deprecated tag/attribute validations inside SVG", () => {
      const code = '<svg custom-svg-attr="123"><custom-svg-tag custom-attr="xyz"></custom-svg-tag></svg>';
      const errors = checkHtmlSyntax(code, {
        allowCustomTags: false,
        allowCustomAttributes: false,
      });
      expect(errors.filter((e) => e.type === "ALLOWED_TAGS" || e.type === "ALLOWED_ATTRIBUTES")).toHaveLength(0);
    });
  });

  describe("Duplicate ID validation rule", () => {
    it("allows unique IDs in a document", () => {
      const code = '<div id="first"></div><span id="second"></span>';
      const errors = checkHtmlSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("detects duplicate IDs in a document", () => {
      const code = '<div id="test"></div><span id="test"></span>';
      const errors = checkHtmlSyntax(code);
      const idErrors = errors.filter((e) => e.type === "DUPLICATE_ID");
      expect(idErrors).toHaveLength(1);
      expect(idErrors[0].message).toContain('Duplicate ID "test" found.');
      expect(idErrors[0].advice).toContain('The ID "test" was already defined at line 1.');
      expect(idErrors[0].location?.start.line).toBe(1);
    });

    it("detects duplicate IDs in a document with French messages", () => {
      const code = '<div id="test"></div><span id="test"></span>';
      const errors = checkHtmlSyntax(code, {}, "fr");
      const idErrors = errors.filter((e) => e.type === "DUPLICATE_ID");
      expect(idErrors).toHaveLength(1);
      expect(idErrors[0].message).toContain('L\'identifiant «\u00A0test\u00A0» est déjà utilisé.');
      expect(idErrors[0].advice).toContain('L\'identifiant «\u00A0test\u00A0» a déjà été défini à la ligne 1.');
    });

    it("detects duplicate IDs across standard elements and SVG elements", () => {
      const code = '<div id="my-id"></div><svg><rect id="my-id" /></svg>';
      const errors = checkHtmlSyntax(code);
      const idErrors = errors.filter((e) => e.type === "DUPLICATE_ID");
      expect(idErrors).toHaveLength(1);
      expect(idErrors[0].message).toContain('Duplicate ID "my-id" found.');
    });

    it("handles multiple occurrences of the same duplicate ID", () => {
      const code = '<div id="dup"></div><span id="dup"></span><p id="dup"></p>';
      const errors = checkHtmlSyntax(code);
      const idErrors = errors.filter((e) => e.type === "DUPLICATE_ID");
      expect(idErrors).toHaveLength(2);
      expect(idErrors[0].advice).toContain('defined at line 1');
      expect(idErrors[1].advice).toContain('defined at line 1');
    });

    it("is case-sensitive for ID values but case-insensitive for attribute names", () => {
      const code = '<div id="myId"></div><span ID="myid"></span><p Id="myId"></p>';
      const errors = checkHtmlSyntax(code);
      const idErrors = errors.filter((e) => e.type === "DUPLICATE_ID");
      // "myId" and "myid" are different (case-sensitive values).
      // "myId" (first) and "myId" (third) are duplicate.
      expect(idErrors).toHaveLength(1);
      expect(idErrors[0].message).toContain('Duplicate ID "myId" found.');
    });
  });

  describe("Form element validation rules", () => {
    describe("Nested form elements (always active)", () => {
      it("detects nested forms", () => {
        const code = '<form><form></form></form>';
        const errors = checkHtmlSyntax(code);
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain("Form elements cannot be nested.");
        expect(formErrors[0].advice).toContain("Remove the nested <form> tag or close the outer form first.");
      });

      it("detects nested forms in French", () => {
        const code = '<form><form></form></form>';
        const errors = checkHtmlSyntax(code, {}, "fr");
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain("Les éléments de formulaire ne peuvent pas être imbriqués.");
      });
    });

    describe("Name uniqueness for form elements (always active)", () => {
      it("allows unique names", () => {
        const code = '<input name="user"><input name="pass">';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects duplicate names on non-exempt elements", () => {
        const code = '<input name="email"><textarea name="email"></textarea>';
        const errors = checkHtmlSyntax(code);
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('Duplicate form element name "email".');
        expect(formErrors[0].advice).toContain('already used by another form element at line 1.');
      });

      it("detects duplicate names in French", () => {
        const code = '<input name="email"><textarea name="email"></textarea>';
        const errors = checkHtmlSyntax(code, {}, "fr");
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('Nom d\'élément de formulaire en double «\u00A0email\u00A0».');
      });

      it("allows multiple radio buttons with the same name", () => {
        const code = '<input type="radio" name="sex"><input type="radio" name="sex">';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("allows multiple checkboxes with the same name", () => {
        const code = '<input type="checkbox" name="interest"><input type="checkbox" name="interest">';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects conflict between radio and checkbox with the same name", () => {
        const code = '<input type="radio" name="opt"><input type="checkbox" name="opt">';
        const errors = checkHtmlSyntax(code);
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
      });

      it("detects conflict between text input and radio with the same name", () => {
        const code = '<input name="gender"><input type="radio" name="gender">';
        const errors = checkHtmlSyntax(code);
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
      });
    });

    describe("Textarea value attribute check (always active)", () => {
      it("detects value attribute on textarea", () => {
        const code = '<textarea value="hello"></textarea>';
        const errors = checkHtmlSyntax(code);
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('The <textarea> element must not have a "value" attribute.');
        // Ensure no duplicate ALLOWED_ATTRIBUTES error is reported
        expect(errors.filter((e) => e.type === "ALLOWED_ATTRIBUTES")).toHaveLength(0);
      });

      it("detects value attribute on textarea even if custom attributes are allowed", () => {
        const code = '<textarea value="hello"></textarea>';
        const errors = checkHtmlSyntax(code, { allowCustomAttributes: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
      });

      it("detects value attribute on textarea in French", () => {
        const code = '<textarea value="hello"></textarea>';
        const errors = checkHtmlSyntax(code, {}, "fr");
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain("L'élément <textarea> ne doit pas avoir d'attribut «\u00A0value\u00A0».");
      });
    });

    describe("requireFormControlsInForm option", () => {
      it("allows controls outside form by default", () => {
        const code = '<input><textarea></textarea><select></select>';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects controls outside form when option is enabled", () => {
        const code = '<input><textarea></textarea><select></select>';
        const errors = checkHtmlSyntax(code, { requireFormControlsInForm: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(3);
        expect(formErrors[0].message).toContain("must be inside a <form> element.");
      });

      it("allows controls inside form when option is enabled", () => {
        const code = '<form><input><textarea></textarea><select></select></form>';
        const errors = checkHtmlSyntax(code, { requireFormControlsInForm: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });
    });

    describe("requireLabelForInteractiveControls option", () => {
      it("allows controls without labels by default", () => {
        const code = '<input type="text">';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects control without label when option is enabled", () => {
        const code = '<input type="text">';
        const errors = checkHtmlSyntax(code, { requireLabelForInteractiveControls: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain("must be associated with a <label>.");
      });

      it("allows control nested inside label", () => {
        const code = '<label>User: <input type="text"></label>';
        const errors = checkHtmlSyntax(code, { requireLabelForInteractiveControls: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("allows control matching label by ID", () => {
        const code = '<label for="usr">User</label><input id="usr" type="text">';
        const errors = checkHtmlSyntax(code, { requireLabelForInteractiveControls: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("allows non-interactive or submit inputs without label", () => {
        const code = '<input type="submit"><input type="button"><input type="hidden">';
        const errors = checkHtmlSyntax(code, { requireLabelForInteractiveControls: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });
    });

    describe("requireRadioButtonNameConsistency option", () => {
      it("allows single radio button without consistency checks by default", () => {
        const code = '<input type="radio"><input type="radio" name="foo">';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects radio button missing name when enabled", () => {
        const code = '<input type="radio">';
        const errors = checkHtmlSyntax(code, { requireRadioButtonNameConsistency: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('Radio button is missing a "name" attribute.');
      });

      it("detects single radio button in a group when enabled", () => {
        const code = '<input type="radio" name="choice">';
        const errors = checkHtmlSyntax(code, { requireRadioButtonNameConsistency: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('Radio button group "choice" must contain at least two radio buttons.');
      });

      it("allows two or more radio buttons with same name when enabled", () => {
        const code = '<input type="radio" name="choice"><input type="radio" name="choice">';
        const errors = checkHtmlSyntax(code, { requireRadioButtonNameConsistency: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });
    });

    describe("requireExplicitButtonType option", () => {
      it("allows button without type inside form by default", () => {
        const code = '<form><button>Click</button></form>';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects button without type inside form when enabled", () => {
        const code = '<form><button>Click</button></form>';
        const errors = checkHtmlSyntax(code, { requireExplicitButtonType: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('Buttons inside a form must have an explicit "type" attribute.');
      });

      it("allows button with type inside form when enabled", () => {
        const code = '<form><button type="button">Click</button><button type="submit">Send</button></form>';
        const errors = checkHtmlSyntax(code, { requireExplicitButtonType: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("allows button without type outside form when enabled", () => {
        const code = '<button>Click</button>';
        const errors = checkHtmlSyntax(code, { requireExplicitButtonType: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });
    });

    describe("requireSelectHasOption option", () => {
      it("allows select without option by default", () => {
        const code = '<select></select>';
        const errors = checkHtmlSyntax(code);
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });

      it("detects empty select when enabled", () => {
        const code = '<select></select>';
        const errors = checkHtmlSyntax(code, { requireSelectHasOption: true });
        const formErrors = errors.filter((e) => e.type === "FORM_RULE");
        expect(formErrors).toHaveLength(1);
        expect(formErrors[0].message).toContain('The <select> element must contain at least one <option>.');
      });

      it("allows select with options when enabled", () => {
        const code = '<select><option value="1">1</option></select>';
        const errors = checkHtmlSyntax(code, { requireSelectHasOption: true });
        expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(0);
      });
    });

    describe("Integration with CSS syntax checker for <style> blocks", () => {
      it("correctly identifies CSS syntax errors and maps their locations", () => {
        const html = [
          "<!DOCTYPE html>",
          "<html>",
          "<head>",
          "  <style>",
          "    h1 {",
          "      color: ; /* Syntax error: missing value */",
          "    }",
          "  </style>",
          "</head>",
          "<body></body>",
          "</html>"
        ].join("\n");
        const errors = checkHtmlSyntax(html, { cssOptions: {} });
        expect(errors.filter(e => e.type === "CSS_PARSE_ERROR")).toHaveLength(1);
        const err = errors.find(e => e.type === "CSS_PARSE_ERROR")!;
        expect(err.location?.start.line).toBe(6);
        // "color: ;" starts at column 7, value starts at 14. 
        // Let's verify exactly what is reported:
        expect(err.location?.start.line).toBe(6);
      });

      it("respects cssOptions passed into HTML checker options", () => {
        const html = [
          "<!DOCTYPE html>",
          "<html>",
          "<head>",
          "  <style>",
          "    #header { color: red; }",
          "  </style>",
          "</head>",
          "<body></body>",
          "</html>"
        ].join("\n");
        // Disable ID selectors
        const errors = checkHtmlSyntax(html, {
          cssOptions: { allowIdSelectors: false }
        });
        expect(errors.filter(e => e.type === "CSS_SELECTOR_VIOLATION")).toHaveLength(1);
        const err = errors.find(e => e.type === "CSS_SELECTOR_VIOLATION")!;
        expect(err.location?.start.line).toBe(5);
        expect(err.location?.start.column).toBe(5); // "#header"
      });

      it("translates CSS errors inside HTML to French when requested", () => {
        const html = [
          "<!DOCTYPE html>",
          "<html>",
          "<head>",
          "  <style>",
          "    h1 { color: red !important; }",
          "  </style>",
          "</head>",
          "<body></body>",
          "</html>"
        ].join("\n");
        const errors = checkHtmlSyntax(html, {
          cssOptions: { allowImportant: false }
        }, "fr");
        expect(errors.filter(e => e.type === "CSS_VALUE_VIOLATION")).toHaveLength(1);
        const err = errors.find(e => e.type === "CSS_VALUE_VIOLATION")!;
        expect(err.message).toContain("L'utilisation de «\u00A0!important\u00A0» n'est pas autorisée.");
      });

      it("correctly identifies missing semicolon errors inside HTML style blocks", () => {
        const html = [
          "<!DOCTYPE html>",
          "<html>",
          "<head>",
          "  <style>",
          "    h1 {",
          "      color: red",
          "      width: 100%",
          "    }",
          "  </style>",
          "</head>",
          "<body></body>",
          "</html>"
        ].join("\n");
        const errors = checkHtmlSyntax(html, { cssOptions: {} });
        expect(errors.filter(e => e.type === "CSS_PARSE_ERROR")).toHaveLength(1);
        const err = errors.find(e => e.type === "CSS_PARSE_ERROR")!;
        expect(err.message).toContain("Missing semicolon");
        expect(err.location?.start.line).toBe(7);
      });

      it("respects allowMultiplePropertiesPerLine option inside HTML style blocks", () => {
        const html = [
          "<!DOCTYPE html>",
          "<html>",
          "<head>",
          "  <style>",
          "    h1 { color: red; width: 100%; }",
          "  </style>",
          "</head>",
          "<body></body>",
          "</html>"
        ].join("\n");
        
        // Allowed by default
        let errors = checkHtmlSyntax(html, { cssOptions: {} });
        expect(errors.filter(e => e.type === "CSS_STRUCTURE_VIOLATION")).toHaveLength(0);

        // Forbidden
        errors = checkHtmlSyntax(html, {
          cssOptions: { allowMultiplePropertiesPerLine: false }
        });
        expect(errors.filter(e => e.type === "CSS_STRUCTURE_VIOLATION")).toHaveLength(1);
        const err = errors.find(e => e.type === "CSS_STRUCTURE_VIOLATION")!;
        expect(err.message).toContain("Each property must be on its own line");
        expect(err.location?.start.line).toBe(5);
      });
    });
  });
});

