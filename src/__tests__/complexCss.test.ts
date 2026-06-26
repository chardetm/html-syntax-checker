import { describe, it, expect } from "vitest";
import { checkCssSyntax } from "../index";

describe("Complex CSS Syntax and Integration Tests", () => {
  describe("Complex Selectors & Combinators", () => {
    it("accepts complex selectors including combinators, pseudo-classes, and pseudo-elements with default options", () => {
      const code = `
        /* Combinators */
        div p { line-height: 1.5; }
        main > section { margin-bottom: 2rem; }
        h1 + p { font-weight: bold; }
        h2 ~ p { color: #333; }

        /* Pseudo-classes and Pseudo-elements */
        a:hover, a:focus-visible { text-decoration: underline; color: navy; }
        li:nth-child(2n+1):not(.active) { background-color: #fafafa; }
        div:has(> img.hero) { display: flex; flex-direction: column; }
        
        /* Pseudo-elements */
        p::before { content: "★ "; color: gold; }
        p::after { content: ""; display: block; }
        input::placeholder { color: #888; }
        
        /* Universal selector */
        * { box-sizing: border-box; }
      `;

      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("flags violations when advanced selectors are restricted by configuration options", () => {
      const code = `
        h1, h2 { font-family: sans-serif; }
        div > p { margin: 0 0 10px; }
        a:hover { color: red; }
        p::after { content: ""; }
        * { margin: 0; }
      `;

      const errors = checkCssSyntax(code, {
        allowSelectorLists: false,       // should flag h1, h2
        allowCombinators: false,         // should flag div > p
        allowPeudoClasses: false,        // should flag a:hover
        allowPseudoElements: false,      // should flag p::after
        allowUniversalSelector: false,   // should flag *
      });

      expect(errors).toHaveLength(5);
      expect(errors.filter((e) => e.type === "CSS_SELECTOR_VIOLATION")).toHaveLength(5);
    });

    it("verifies nested selectors and the nesting selector (&) are correctly parsed and validated", () => {
      const code = `
        .card {
          border: 1px solid #ccc;
          padding: 1rem;
          
          .card-header {
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
            
            h3 {
              color: darkred;
            }
          }
          
          &:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          &.featured {
            border-color: gold;
          }
        }
      `;

      // With nested rules allowed
      let errors = checkCssSyntax(code, { allowNestedRules: true });
      expect(errors).toHaveLength(0);

      // With nested rules forbidden
      errors = checkCssSyntax(code, { allowNestedRules: false });
      // Should flag nested rules: .card-header, h3 (nested in header), &:hover (block + &), &.featured (block + &) -> total 6
      expect(errors.filter((e) => e.type === "CSS_SELECTOR_VIOLATION")).toHaveLength(6);
    });
  });

  describe("Color Formats Validation", () => {
    it("handles color checking with different syntaxes and whitelist filters", () => {
      const code = `
        .colors-hex {
          /* Hex colors (3, 4, 6, 8 digits) */
          color: #f00;
          border-color: #f00f;
          background-color: #ff0000;
          outline-color: #ff000080;
        }

        .colors-old-func {
          /* Old functional notation */
          border-top-color: rgb(255, 0, 0);
          border-right-color: rgba(0, 255, 0, 0.5);
          border-bottom-color: hsl(120, 100%, 50%);
          border-left-color: hsla(240, 100%, 50%, 0.3);
        }

        .colors-new-func {
          /* New functional notation (space-separated / slash alpha) */
          text-decoration-color: rgb(255 0 0);
          column-rule-color: rgb(0 255 0 / 50%);
          color: hsl(240 100% 50% / 30%);
        }

        .colors-modern {
          /* Modern color formats */
          background-color: oklch(60% 0.15 120);
          border-color: oklab(60% 0.1 0.1);
          color: hwb(120 0% 0%);
        }

        .colors-named {
          /* Named color keywords */
          color: transparent;
          border-color: currentColor;
          background-color: crimson;
        }
      `;

      // By default all color formats are allowed
      let errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);

      // Restrict allowed formats to only 'hex' and 'rgb'
      errors = checkCssSyntax(code, {
        allowedColorFormats: ["hex", "rgb"],
      });

      // Should flag:
      // rgba (border-right-color - rgba is not in ['hex', 'rgb'])
      // hsl (border-bottom-color)
      // hsla (border-left-color)
      // hsl new (color)
      // oklch (background-color)
      // oklab (border-color)
      // hwb (color)
      // transparent (color - named)
      // currentColor (border-color - named)
      // crimson (background-color - named)
      expect(errors.filter((e) => e.type === "CSS_VALUE_VIOLATION")).toHaveLength(10);
    });
  });

  describe("Rare and Layout Properties", () => {
    it("accepts rare layout and rendering properties under default settings", () => {
      const code = `
        .rare-properties {
          clip-path: circle(50% at 50% 50%);
          image-rendering: pixelated;
          backdrop-filter: blur(5px);
          writing-mode: vertical-rl;
          object-fit: cover;
          aspect-ratio: 16 / 9;
        }
      `;
      const errors = checkCssSyntax(code);
      expect(errors).toHaveLength(0);
    });

    it("verifies allowedProperties and forbiddenProperties configurations block rare properties accordingly", () => {
      const code = `
        .rare-properties {
          backdrop-filter: blur(5px);
          object-fit: cover;
        }
      `;
      const errors = checkCssSyntax(code, {
        forbiddenProperties: ["backdrop-filter", "object-fit"],
      });
      expect(errors.filter((e) => e.type === "CSS_PROPERTY_VIOLATION")).toHaveLength(2);
      expect(errors[0].message).toContain("backdrop-filter");
      expect(errors[1].message).toContain("object-fit");
    });

    it("enforces flexbox vs grid constraints dynamically based on configuration", () => {
      const flexCode = `
        .flex-container {
          display: flex;
          flex-direction: row;
          justify-content: space-around;
          align-items: center;
          gap: 15px;
        }
      `;

      const gridCode = `
        .grid-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 20px;
          justify-items: stretch;
          row-gap: 10px;
        }
      `;

      // 1. Flexbox allowed, Grid allowed (default)
      expect(checkCssSyntax(flexCode)).toHaveLength(0);
      expect(checkCssSyntax(gridCode)).toHaveLength(0);

      // 2. Flexbox forbidden, Grid allowed
      let flexErrors = checkCssSyntax(flexCode, { allowFlexbox: false });
      // display: flex (value violation)
      // flex-direction, justify-content, align-items (property violations)
      expect(flexErrors).toHaveLength(4);

      // 3. Flexbox allowed, Grid forbidden
      let gridErrors = checkCssSyntax(gridCode, { allowGrid: false });
      // display: grid (value violation)
      // grid-template-columns, grid-gap, justify-items (property violations)
      expect(gridErrors).toHaveLength(4);

      // 4. Both forbidden
      let combinedErrors = checkCssSyntax(flexCode + "\n" + gridCode, {
        allowFlexbox: false,
        allowGrid: false,
      });
      // Should flag all layout properties:
      // flexCode: 4 errors + 1 gap layout error = 5
      // gridCode: 4 errors + 1 row-gap layout error = 5
      // Total = 10 errors
      expect(combinedErrors).toHaveLength(10);
    });
  });

  describe("Structural and Casing Integration Checks", () => {
    it("reports empty rule blocks and duplicate property definitions in nested rules", () => {
      const code = `
        .nested-card {
          margin: 10px;
          margin: 20px; /* duplicate */
          
          .nested-inner {
            /* empty rule block */
          }
        }
      `;

      const errors = checkCssSyntax(code, {
        allowEmptyRules: false,
        allowDuplicateProperties: false,
      });

      // Expected:
      // 1. Duplicate margin property in .nested-card
      // 2. Empty rule block inside .nested-inner
      expect(errors.filter((e) => e.type === "CSS_STRUCTURE_VIOLATION")).toHaveLength(2);
    });

    it("verifies property casing validations on complex code", () => {
      const code = `
        .cased {
          BACKGROUND-COLOR: white; /* uppercase */
          border-Color: red;       /* mixedcase */
          color: black;            /* lowercase */
        }
      `;

      // Default: allow lowercase (true), allow uppercase (true), forbid mixedcase (false)
      let errors = checkCssSyntax(code);
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("CSS_CASE_VIOLATION");
      expect(errors[0].message).toContain("border-Color");

      // Strict lowercase only
      errors = checkCssSyntax(code, {
        allowLowercaseProperties: true,
        allowUppercaseProperties: false,
        allowMixedcaseProperties: false,
      });
      expect(errors).toHaveLength(2); // BACKGROUND-COLOR and border-Color
    });
  });
});
