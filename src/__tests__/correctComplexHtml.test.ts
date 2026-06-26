import { describe, it, expect } from "vitest";
import { checkHtmlSyntax } from "../index";

describe("100% Correct Complex HTML Integration Test", () => {
  it("validates a large, diverse HTML5 document containing forms, SVG, dialog, details, ruby, and templating with zero errors", () => {
    const code = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Extremely Complex & 100% Valid HTML5 Document</title>
</head>
<body>
  <!-- Header Navigation -->
  <header>
    <nav aria-label="Main Navigation">
      <ul>
        <li><a href="#section-form">Form Section</a></li>
        <li><a href="#section-svg">SVG Graphics</a></li>
        <li><a href="#section-multimedia">Multimedia & Picture</a></li>
        <li><a href="#section-unusual">Unusual Elements</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <!-- Section 1: Complex Valid Forms -->
    <section id="section-form">
      <h2>Form, Controls, and Associations</h2>
      
      <form action="/api/register" method="POST" id="registration-form">
        <!-- Text Input with Implicit Label Wrapping -->
        <div class="form-group">
          <label>
            Full Name:
            <input type="text" name="fullName" required placeholder="John Doe">
          </label>
        </div>

        <!-- Email Input with Explicit Label 'for' association -->
        <div class="form-group">
          <label for="user-email">Email Address:</label>
          <input type="email" id="user-email" name="userEmail" required>
        </div>

        <!-- Valid Textarea without value attribute (correct text content nesting) -->
        <div class="form-group">
          <label for="user-bio">Short Biography:</label>
          <textarea id="user-bio" name="userBio" placeholder="Tell us about yourself..."></textarea>
        </div>

        <!-- Select Element with options -->
        <div class="form-group">
          <label for="user-country">Country of Residence:</label>
          <select id="user-country" name="userCountry" required>
            <option value="">Select country...</option>
            <option value="us" selected>United States</option>
            <option value="ca">Canada</option>
            <option value="fr">France</option>
          </select>
        </div>

        <!-- Consistent Radio Button Group with 3 items -->
        <fieldset>
          <legend>Subscription Tier</legend>
          <div class="radio-option">
            <input type="radio" id="tier-free" name="subscriptionTier" value="free" checked>
            <label for="tier-free">Free Tier</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="tier-pro" name="subscriptionTier" value="pro">
            <label for="tier-pro">Professional Tier</label>
          </div>
          <div class="radio-option">
            <input type="radio" id="tier-ent" name="subscriptionTier" value="enterprise">
            <label for="tier-ent">Enterprise Tier</label>
          </div>
        </fieldset>

        <!-- Explicit buttons inside a form -->
        <div class="button-group">
          <button type="submit" class="btn-primary">Register Account</button>
          <button type="reset" class="btn-secondary">Reset Fields</button>
          <button type="button" class="btn-secondary" id="btn-cancel">Cancel</button>
        </div>
      </form>
    </section>

    <hr>

    <!-- Section 2: Complex Valid SVG -->
    <section id="section-svg">
      <h2>Advanced SVG Elements</h2>
      
      <div class="svg-container">
        <!-- SVG container has multiple shapes, groups, clipping paths, text, camelCase and custom attrs -->
        <svg version="1.1" viewBox="0 0 800 600" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Linear Gradient definition -->
            <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#3f51b5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f44336;stop-opacity:1" />
            </linearGradient>
            
            <!-- Radial Gradient definition -->
            <radialGradient id="glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
              <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0" />
            </radialGradient>
            
            <!-- Clipping Path definition -->
            <clipPath id="circle-clip">
              <circle cx="400" cy="300" r="150" />
            </clipPath>
          </defs>

          <!-- Draw Background using gradient -->
          <rect x="0" y="0" width="800" height="600" fill="url(#primary-gradient)" rx="15" />

          <!-- Group of Shapes with transform -->
          <g transform="translate(10, 10)" opacity="0.95" stroke="#ffffff" stroke-width="2">
            <!-- Rect, Circle, and Ellipse shapes -->
            <rect x="50" y="50" width="200" height="150" fill="#ffffff" fill-opacity="0.2" />
            <circle cx="400" cy="150" r="75" fill="#ffeb3b" />
            <ellipse cx="650" cy="150" rx="80" ry="50" fill="none" stroke-dasharray="5,5" />
          </g>

          <!-- Polygon, Polyline and Path shapes -->
          <g fill="none" stroke="#ffffff" stroke-width="4">
            <polygon points="100,500 150,420 200,500" fill="#4caf50" />
            <polyline points="250,450 300,420 350,480 400,430" />
            <path d="M450 500 C470 420, 530 420, 550 500 S630 580, 650 500" />
          </g>

          <!-- Group utilizing the clip path -->
          <g clip-path="url(#circle-clip)">
            <rect x="200" y="100" width="400" height="400" fill="url(#glow-gradient)" />
            <!-- Text element inside SVG with x, y, and font styles -->
            <text x="400" y="300" text-anchor="middle" font-family="'Outfit', sans-serif" font-size="28" fill="#ffffff" font-weight="bold">
              SVG Inner Text
            </text>
          </g>
        </svg>
      </div>
    </section>

    <hr>

    <!-- Section 3: Diverse HTML5 Media and Picture Structures -->
    <section id="section-multimedia">
      <h2>Multimedia & Responsive Elements</h2>
      
      <!-- Valid Picture element with nested source and img -->
      <figure>
        <picture id="responsive-pic">
          <source srcset="image-large.webp" media="(min-width: 1024px)" type="image/webp">
          <source srcset="image-medium.webp" media="(min-width: 768px)" type="image/webp">
          <!-- Fallback image -->
          <img src="image-small.jpg" alt="Responsive scenery image" width="640" height="360" loading="lazy">
        </picture>
        <figcaption>A beautiful responsive landscape presentation.</figcaption>
      </figure>

      <!-- Video element with subtitle tracks -->
      <div class="video-player">
        <video id="promo-video" controls width="640" height="360" poster="poster.jpg">
          <source src="video.mp4" type="video/mp4">
          <source src="video.webm" type="video/webm">
          <!-- Track element for captions (void tag) -->
          <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English" default>
          <track src="subtitles_fr.vtt" kind="subtitles" srclang="fr" label="Français">
          Your browser does not support the video tag.
        </video>
      </div>
    </section>

    <hr>

    <!-- Section 4: Unusual, Semantically Diverse Elements -->
    <section id="section-unusual">
      <h2>Semantically Diverse & Unusual Elements</h2>

      <!-- Details and Summary -->
      <details id="details-accordion">
        <summary>Click to view system requirements</summary>
        <div class="details-content">
          <p>Minimum requirements:</p>
          <ul>
            <li>Processor: <kbd>Intel i5</kbd> or <samp>Apple M1</samp></li>
            <li>Memory: <var>8GB RAM</var></li>
            <li>Storage: 20GB free space</li>
          </ul>
        </div>
      </details>

      <!-- Dialog box (Modal) -->
      <dialog id="help-dialog" open>
        <h3>Interactive Guidance</h3>
        <p>Press <kbd>Esc</kbd> to close this dialog layout.</p>
        <form method="dialog" id="dialog-close-form">
          <button type="submit">Acknowledge</button>
        </form>
      </dialog>

      <!-- Progress and Meter -->
      <div class="status-indicators">
        <p>
          Profile Completion:
          <progress id="profile-progress" value="70" max="100">70%</progress>
        </p>
        <p>
          Disk Usage:
          <meter id="disk-meter" value="0.6" min="0" max="1.0" low="0.3" high="0.8" optimum="0.5">60%</meter>
        </p>
      </div>

      <!-- Time, Data, Ruby annotations -->
      <article>
        <p>
          Article published on <time datetime="2026-06-26T13:17:00Z">June 26, 2026</time>.
          Product code reference: <data value="PROD-98122-A">#98122</data>.
        </p>
        <p>
          Pronunciation guide:
          <ruby id="ruby-ann">
            漢字 <rp>(</rp><rt>かんじ</rt><rp>)</rp>
          </ruby>
        </p>
      </article>

      <!-- HTML5 Templates and Slots -->
      <template id="card-template">
        <div class="custom-card">
          <slot name="card-title">Default Card Title</slot>
          <div class="card-body">
            <p>This is a slot-based card component body layout.</p>
          </div>
        </div>
      </template>
    </section>
  </main>

  <footer>
    <p>&copy; <time datetime="2026">2026</time> Syntax Checker Project. All rights reserved.</p>
  </footer>
</body>
</html>
`;

    // Strictly check with all structure and form/association validations turned on
    const errors = checkHtmlSyntax(code, {
      checkFullStructure: true,
      checkCharset: true,
      checkTitle: true,
      requireFormControlsInForm: true,
      requireLabelForInteractiveControls: true,
      requireRadioButtonNameConsistency: true,
      requireExplicitButtonType: true,
      requireSelectHasOption: true,
      allowLowercaseTags: true,
      allowLowercaseAttributes: true,
      allowCustomTags: true,
      allowCustomAttributes: true,
    });

    // Verify there are absolutely no errors detected
    expect(errors).toHaveLength(0);
  });
});
