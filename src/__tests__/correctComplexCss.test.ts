import { describe, it, expect } from "vitest";
import { checkCssSyntax } from "../index";

describe("100% Correct Complex CSS Integration Test", () => {
  it("validates a large, diverse CSS stylesheet containing advanced selectors, modern colors, layouts, at-rules, and rare properties with zero errors", () => {
    const code = `
      /* Root variables and global reset */
      :root {
        --primary-color: #3f51b5;
        --secondary-color: #ff4081;
        --text-color: #333333;
        --spacing-unit: 8px;
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Outfit', sans-serif;
        color: var(--text-color);
        line-height: 1.5;
        background-color: #fafafa;
      }

      /* Diverse Selectors and Combinators */
      main > section {
        padding: 2rem;
        border-bottom: 1px solid #eeeeee;
      }

      h1 + p {
        font-size: 1.2rem;
        color: #666666;
        margin-bottom: 16px;
      }

      h2 ~ .card-list {
        margin-top: 24px;
      }

      .btn.primary.active {
        background-color: var(--primary-color);
        color: #ffffff;
      }

      /* Attribute selectors */
      input[type="text"][disabled] {
        background-color: #e0e0e0;
        cursor: not-allowed;
      }

      a[href^="https://"]::after {
        content: " ↗";
        font-size: 0.8rem;
      }

      [class*="icon-"] {
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        vertical-align: middle;
      }

      /* Pseudo-classes and Pseudo-elements */
      .card-item:nth-child(2n+1):not(.featured) {
        background-color: #f5f5f5;
      }

      .card-item:hover, .card-item:focus-within {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .input-wrapper::before {
        content: "✉";
        color: #888888;
      }

      input::placeholder {
        color: #aaaaaa;
        font-style: italic;
      }

      li::marker {
        color: var(--primary-color);
      }

      /* Nesting selector (&) usage */
      .navigation-bar {
        display: flex;
        align-items: center;

        .nav-item {
          color: #555555;
          padding: 8px 16px;

          &:hover {
            color: var(--primary-color);
            background-color: #eceff1;
          }

          &.active {
            font-weight: bold;
            border-bottom: 2px solid var(--primary-color);
          }
        }
      }

      /* Diverse Color Formats and Valued Properties */
      .color-hex-3 { color: #f00; }
      .color-hex-4 { color: #f00f; }
      .color-hex-6 { color: #ff0000; }
      .color-hex-8 { color: #ff000080; }

      .color-old-rgb { background-color: rgb(0, 255, 0); }
      .color-old-rgba { background-color: rgba(0, 0, 0, 0.6); }
      .color-old-hsl { border-color: hsl(120, 100%, 50%); }
      .color-old-hsla { border-color: hsla(240, 100%, 50%, 0.3); }

      .color-new-rgb { background-color: rgb(255 120 0); }
      .color-new-rgba { background-color: rgb(255 0 0 / 50%); }
      .color-new-hsl { color: hsl(240 100% 50% / 30%); }

      .color-modern-oklch { background-color: oklch(70% 0.12 145); }
      .color-modern-oklab { border-color: oklab(0.6 0.1 0.1); }
      .color-modern-hwb { color: hwb(200 10% 10%); }

      .color-keywords {
        color: transparent;
        background-color: currentColor;
        border-color: crimson;
      }

      /* Rare & Special properties */
      .special-layout {
        clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        backdrop-filter: blur(8px);
        image-rendering: crisp-edges;
        writing-mode: horizontal-tb;
        object-fit: cover;
        aspect-ratio: 16 / 9;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      /* Flexbox layout */
      .flex-gallery {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      /* Grid layout */
      .grid-dashboard {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-template-rows: auto;
        gap: 24px;
        justify-items: stretch;
      }

      /* Media Queries */
      @media (min-width: 1024px) {
        .grid-dashboard {
          grid-template-columns: repeat(6, 1fr);
        }
        
        .special-layout {
          aspect-ratio: 21 / 9;
        }
      }

      /* Keyframe animations and keyframe selectors */
      @keyframes pulse-animation {
        from {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.05);
          opacity: 0.8;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;

    // Strictly check with all capabilities enabled
    const errors = checkCssSyntax(code, {
      allowTypeSelectors: true,
      allowClassSelectors: true,
      allowIdSelectors: true,
      allowUniversalSelector: true,
      allowSelectorLists: true,
      allowCombinators: true,
      allowNestedRules: true,
      allowAtRules: true,
      allowPeudoClasses: true,
      allowPseudoElements: true,
      allowImportant: true,
      allowFlexbox: true,
      allowGrid: true,
      allowLowercaseProperties: true,
      allowUppercaseProperties: true,
      allowMixedcaseProperties: false,
      allowEmptyRules: false,
      allowDuplicateProperties: false,
    });

    expect(errors).toHaveLength(0);
  });
});
