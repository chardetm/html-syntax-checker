import { describe, it, expect } from "vitest";
import { checkHtmlSyntax } from "../index";

describe("Complex HTML Syntax and Integration Tests", () => {
  describe("Complex Form & Accessibility Validation", () => {
    it("validates a complex form layout with various interactive controls and label associations", () => {
      // Form containing label-controlled fields, some correct and some incorrect
      const code = `
        <form action="/submit" method="POST" id="main-form">
          <!-- Valid text input: wrapped inside label -->
          <p>
            <label>
              Username:
              <input type="text" name="username" placeholder="Enter username">
            </label>
          </p>

          <!-- Valid email input: label has matching for attribute -->
          <p>
            <label for="email-field">Email:</label>
            <input type="email" id="email-field" name="email">
          </p>

          <!-- Invalid input: interactive control without any label association -->
          <p>
            <input type="password" id="password-field" name="password" placeholder="Password">
          </p>

          <!-- Invalid textarea: interactive control without label AND invalid value attribute -->
          <p>
            <textarea name="bio" value="This is default text"></textarea>
          </p>

          <!-- Valid select: option present and label associated -->
          <p>
            <label for="country-select">Country:</label>
            <select id="country-select" name="country">
              <option value="us">United States</option>
              <option value="ca">Canada</option>
            </select>
          </p>

          <!-- Invalid select: no options inside -->
          <p>
            <label for="empty-select">Choose:</label>
            <select id="empty-select" name="empty_sel"></select>
          </p>

          <!-- Radio button group checking: requireRadioButtonNameConsistency -->
          <fieldset>
            <legend>Preferences</legend>
            <!-- Missing name entirely -->
            <input type="radio" value="opt1"> Option 1
            <!-- Mismatched name in the same radio group (handled by user, but let's test missing names) -->
            <input type="radio" name="" value="opt2"> Option 2
            <!-- Consistent name -->
            <input type="radio" name="preference" value="opt3" id="pref-opt3">
            <label for="pref-opt3">Option 3</label>
          </fieldset>

          <!-- Buttons inside form checking: requireExplicitButtonType -->
          <div>
            <!-- Valid buttons -->
            <button type="submit">Submit Form</button>
            <button type="button">Cancel</button>
            <!-- Invalid button: implicit type (defaults to submit, which is flagged when required) -->
            <button class="btn">Help</button>
          </div>
        </form>
      `;

      // Check with strict form options enabled
      const errors = checkHtmlSyntax(code, {
        requireFormControlsInForm: true,
        requireLabelForInteractiveControls: true,
        requireRadioButtonNameConsistency: true,
        requireExplicitButtonType: true,
        requireSelectHasOption: true,
      });

      // Let's count errors
      // 1. Password input has no label association (labelAssociationRequired)
      // 2. Textarea has value attribute (core rule - textareaValueAttribute)
      // 3. Textarea has no label association (labelAssociationRequired)
      // 4. Select 'empty-select' has no options (selectEmptyOptions)
      // 5. Radio button (opt1) has no label association (labelAssociationRequired)
      // 6. Radio button (opt1) is missing a name attribute (radioButtonMissingName)
      // 7. Radio button (opt2) has no label association (labelAssociationRequired)
      // 8. Radio button (opt2) has empty name attribute (radioButtonMissingName)
      // 9. Radio button (opt3) is the only one in its group (radioButtonSingleInGroup)
      // 10. Button (Help) is missing explicit type (buttonMissingType)
      // Total expected: 10 errors
      expect(errors).toHaveLength(10);

      // Verify individual errors
      const valueAttrError = errors.find(
        (e) => e.type === "FORM_RULE" && e.message.includes("value")
      );
      expect(valueAttrError).toBeDefined();

      const labelErrors = errors.filter(
        (e) => e.type === "FORM_RULE" && e.message.toLowerCase().includes("label")
      );
      expect(labelErrors).toHaveLength(4); // Password, Textarea, opt1, opt2

      const selectError = errors.find(
        (e) => e.type === "FORM_RULE" && e.message.toLowerCase().includes("select")
      );
      expect(selectError).toBeDefined();

      const radioNameErrors = errors.filter(
        (e) => e.type === "FORM_RULE" && e.message.toLowerCase().includes("radio") && e.message.toLowerCase().includes("name")
      );
      expect(radioNameErrors).toHaveLength(2); // one for opt1, one for opt2

      const radioSingleError = errors.find(
        (e) => e.type === "FORM_RULE" && e.message.toLowerCase().includes("group")
      );
      expect(radioSingleError).toBeDefined(); // for opt3 / group preference

      const buttonError = errors.find(
        (e) => e.type === "FORM_RULE" && e.message.toLowerCase().includes("button")
      );
      expect(buttonError).toBeDefined();
    });

    it("verifies nested forms are detected and rejected as syntax structure violations", () => {
      const code = `
        <form id="outer-form">
          <div>
            <form id="inner-form">
              <input type="text" name="data">
            </form>
          </div>
        </form>
      `;
      const errors = checkHtmlSyntax(code);
      expect(errors.filter((e) => e.type === "FORM_RULE")).toHaveLength(1);
      expect(errors[0].message).toContain("nested");
    });
  });

  describe("Complex SVG Integration", () => {
    it("handles complex nested SVG hierarchies with camelCase attributes and self-closing tags", () => {
      const code = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Complex SVG Test</title>
        </head>
        <body>
          <div class="icon-container">
            <svg version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" stroke-linecap="round" stroke-linejoin="round">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(255,0,0);stop-opacity:1" />
                </linearGradient>
                <clipPath id="clip-circle">
                  <circle cx="256" cy="256" r="200" />
                </clipPath>
              </defs>
              
              <g clip-path="url(#clip-circle)" stroke="url(#grad1)" stroke-width="4">
                <!-- Inside SVG, standard self-closing tags are fully allowed -->
                <path d="M150 0 L75 200 L225 200 Z" fill="red" />
                <rect x="50" y="50" width="400" height="400" fill="none" strokeWidth="10" />
                <circle cx="256" cy="256" r="50" fill="blue" stroke-width="2" />
                
                <!-- CamelCase and CLIPPATH inside svg are allowed and not flagged for casing -->
                <clipPath id="inner-clip">
                  <CLIPPATH id="nested-clip"></CLIPPATH>
                </clipPath>

                <!-- Deprecated and custom attributes/tags are allowed inside SVG -->
                <custom-svg-tag myCustomAttr="val">
                  <text x="256" y="256" font-size="20">SVG Content</text>
                </custom-svg-tag>
              </g>
            </svg>
          </div>
        </body>
        </html>
      `;

      const errors = checkHtmlSyntax(code, {
        checkFullStructure: true,
        checkCharset: false,
        checkTitle: true,
        allowLowercaseTags: true,
        allowLowercaseAttributes: true,
        allowCustomTags: false,       // Enabled to show SVG bypasses this!
        allowCustomAttributes: false, // Enabled to show SVG bypasses this!
      });

      // There should be zero syntax validation errors, proving SVG bypasses custom/deprecated/casing rules.
      expect(errors).toHaveLength(0);
    });

    it("verifies structure rules (mismatched/unclosed tags) are still fully active inside SVG", () => {
      const code = `
        <svg viewBox="0 0 100 100">
          <g>
            <rect x="0" y="0" width="10" height="10">
            <circle cx="5" cy="5" r="3" />
          </g>
        </svg>
      `;
      const errors = checkHtmlSyntax(code);
      // rect is unclosed before g or svg closes
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.type === "CLOSING_TAG_MISMATCH")).toBe(true);
    });

    it("verifies duplicate IDs are detected across SVG and regular HTML tags", () => {
      const code = `
        <div id="common-id"></div>
        <svg>
          <g id="common-id"></g>
        </svg>
      `;
      const errors = checkHtmlSyntax(code);
      expect(errors.filter((e) => e.type === "DUPLICATE_ID")).toHaveLength(1);
      expect(errors[0].message).toContain("common-id");
    });
  });

  describe("Localization Check on Complex Scenarios (French)", () => {
    it("reports complex HTML form and nested form errors in French", () => {
      const code = `
        <form>
          <form>
            <input type="text" value="some" name="username">
          </form>
        </form>
      `;
      const errors = checkHtmlSyntax(code, {}, "fr");
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("FORM_RULE");
      expect(errors[0].message).toContain("imbriqués");
    });

    it("reports missing label errors in French", () => {
      const code = `
        <form>
          <input type="text" name="username">
        </form>
      `;
      const errors = checkHtmlSyntax(
        code,
        { requireLabelForInteractiveControls: true },
        "fr"
      );
      expect(errors).toHaveLength(1);
      expect(errors[0].type).toBe("FORM_RULE");
      expect(errors[0].message).toContain("associé à un <label>");
    });
  });
});
