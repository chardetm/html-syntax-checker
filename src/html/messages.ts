import { HTMLCheckerErrorType, Language } from '../types';
export type { Language };

const errorTypeNames: Record<HTMLCheckerErrorType, { en: string; fr: string }> = {
  PARSE_ERROR: {
    en: 'Syntax error',
    fr: 'Erreur de syntaxe'
  },
  DOCUMENT_STRUCTURE: {
    en: 'Document structure error',
    fr: 'Erreur de structure du document'
  },
  ALLOWED_TAGS: {
    en: 'Tag restriction error',
    fr: 'Erreur de restriction sur les balises'
  },
  CASE: {
    en: 'Case sensitivity error',
    fr: 'Erreur de casse'
  },
  XHTML_SELF_CLOSING: {
    en: 'Self-closing syntax error',
    fr: 'Erreur de syntaxe de fermeture automatique'
  },
  INVALID_CLOSING_TAG: {
    en: 'Invalid closing tag',
    fr: 'Balise de fermeture invalide'
  },
  ALLOWED_ATTRIBUTES: {
    en: 'Attribute restriction error',
    fr: 'Erreur de restriction sur les attributs'
  },
  MISSING_REQUIRED_ATTRIBUTE: {
    en: 'Missing required attribute',
    fr: 'Attribut obligatoire manquant'
  },
  CLOSING_TAG_MISMATCH: {
    en: 'Tag mismatch',
    fr: 'Correspondance des balises incorrecte'
  },
  MISSING_CHARSET: {
    en: 'Missing charset declaration',
    fr: 'Déclaration d’encodage manquante'
  },
  MISSING_TITLE: {
    en: 'Missing title',
    fr: 'Titre manquant'
  },
  DUPLICATE_ID: {
    en: 'Duplicate ID',
    fr: 'Identifiant en double'
  },
  FORM_RULE: {
    en: 'Form rule violation',
    fr: 'Violation de règle de formulaire'
  },
  CSS_PARSE_ERROR: {
    en: 'CSS syntax error',
    fr: 'Erreur de syntaxe CSS'
  },
  CSS_SELECTOR_VIOLATION: {
    en: 'CSS selector error',
    fr: 'Erreur de sélecteur CSS'
  },
  CSS_PROPERTY_VIOLATION: {
    en: 'CSS property error',
    fr: 'Erreur de propriété CSS'
  },
  CSS_VALUE_VIOLATION: {
    en: 'CSS value error',
    fr: 'Erreur de valeur CSS'
  },
  CSS_CASE_VIOLATION: {
    en: 'CSS case sensitivity error',
    fr: 'Erreur de casse CSS'
  },
  CSS_STRUCTURE_VIOLATION: {
    en: 'CSS structure error',
    fr: 'Erreur de structure CSS'
  }
};

export function getHtmlErrorTypeName(type: HTMLCheckerErrorType, lang: Language): string {
  return errorTypeNames[type][lang];
}

export const getMessage = {
  unclosedComment: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Le commentaire HTML n’est pas fermé.'
      : 'HTML comment is not closed.',
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0-->\u00A0» pour fermer le commentaire.'
      : 'Add "-->" to close the comment.'
  }),

  unclosedDoctype: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La déclaration DOCTYPE n’est pas fermée.'
      : 'DOCTYPE declaration is not closed.',
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0>\u00A0» pour fermer la déclaration.'
      : 'Add ">" to close the declaration.'
  }),

  malformedClosingTag: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise de fermeture «\u00A0</${name || '...'}\u00A0» est mal formée.`
      : `Closing tag "</${name || '...'}" is malformed.`,
    advice: lang === 'fr'
      ? `Une balise de fermeture ne doit contenir que le nom de la balise, sans attributs, et se terminer par «\u00A0>\u00A0» (exemple\u00A0: «\u00A0</${name || 'nom_de_balise'}>\u00A0»).`
      : `A closing tag must only contain the tag name, without attributes, and end with ">" (example: "</${name || 'tag_name'}>").`
  }),

  spaceAfterLessThan: (lang: Language, tagName: string) => ({
    message: lang === 'fr'
      ? `Espace inattendu après «\u00A0<\u00A0» dans la balise «\u00A0< ${tagName}\u00A0».`
      : `Unexpected space after "<" in tag "< ${tagName}".`,
    advice: lang === 'fr'
      ? `Retirez l'espace entre «\u00A0<\u00A0» et «\u00A0${tagName}\u00A0» pour écrire «\u00A0<${tagName}\u00A0».`
      : `Remove the space between "<" and "${tagName}" to write "<${tagName}".`
  }),

  unexpectedCharInTag: (lang: Language, errChar: string, name: string) => ({
    message: lang === 'fr'
      ? `Caractère inattendu «\u00A0${errChar}\u00A0» dans la balise «\u00A0<${name}\u00A0».`
      : `Unexpected character "${errChar}" in tag "<${name}".`,
    advice: lang === 'fr'
      ? 'Vérifiez la syntaxe de vos attributs. Un attribut doit avoir un nom suivi de «\u00A0=\u00A0» et d\'une valeur.'
      : 'Check your attribute syntax. An attribute must have a name followed by "=" and a value.'
  }),

  unclosedAttributeQuote: (lang: Language, attrName: string, quoteType: string) => ({
    message: lang === 'fr'
      ? `La valeur de l'attribut «\u00A0${attrName}\u00A0» n'est pas fermée par un guillemet.`
      : `The value of attribute "${attrName}" is not closed by a quote.`,
    advice: lang === 'fr'
      ? `Ajoutez un guillemet fermant (${quoteType}) pour fermer la valeur de l'attribut.`
      : `Add a closing quote (${quoteType}) to close the attribute value.`
  }),

  unclosedOpeningTag: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise ouvrante «\u00A0<${name}\u00A0» n’est pas fermée.`
      : `Opening tag "<${name}" is not closed.`,
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0>\u00A0» ou «\u00A0/>\u00A0» pour fermer la balise.'
      : 'Add ">" or "/>" to close the tag.'
  }),

  unexpectedLessThan: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Caractère «\u00A0<\u00A0» inattendu.'
      : 'Unexpected "<" character.',
    advice: lang === 'fr'
      ? 'Si vous vouliez ouvrir une balise, vérifiez son nom. Si vous vouliez écrire le symbole «\u00A0inférieur à\u00A0», utilisez «\u00A0&lt;\u00A0».'
      : 'If you wanted to open a tag, check its name. If you wanted to write the "less than" symbol, use "&lt;".'
  }),

  incompatibleOptions: (lang: Language) =>
    lang === 'fr'
      ? 'Les options «\u00A0allowedTags\u00A0» et «\u00A0forbiddenTags\u00A0» ne peuvent pas être utilisées simultanément.'
      : "The options 'allowedTags' and 'forbiddenTags' cannot be used simultaneously.",

  missingDoctype: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La déclaration DOCTYPE est manquante ou mal placée.'
      : 'DOCTYPE declaration is missing or misplaced.',
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0<!DOCTYPE html>\u00A0» tout au début de votre fichier HTML.'
      : 'Add "<!DOCTYPE html>" at the very beginning of your HTML file.'
  }),

  invalidDoctype: (lang: Language, raw: string) => ({
    message: lang === 'fr'
      ? `La déclaration DOCTYPE «\u00A0${raw}\u00A0» est incorrecte ou n'est pas au format standard.`
      : `DOCTYPE declaration "${raw}" is incorrect or not in standard format.`,
    advice: lang === 'fr'
      ? 'Utilisez la déclaration standard\u00A0: «\u00A0<!DOCTYPE html>\u00A0».'
      : 'Use the standard declaration: "<!DOCTYPE html>".'
  }),

  headOutsideHtml: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <head> est située en dehors de la balise <html>.'
      : 'The <head> tag is located outside the <html> tag.',
    advice: lang === 'fr'
      ? 'La balise <head> doit être placée immédiatement après la balise ouvrante <html>.'
      : 'The <head> tag must be placed immediately after the opening <html> tag.'
  }),

  headNestedInBody: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <head> est imbriquée dans la balise <body>.'
      : 'The <head> tag is nested inside the <body> tag.',
    advice: lang === 'fr'
      ? 'La section <head> doit être placée avant la section <body>.'
      : 'The <head> section must be placed before the <body> section.'
  }),

  bodyOutsideHtml: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <body> est située en dehors de la balise <html>.'
      : 'The <body> tag is located outside the <html> tag.',
    advice: lang === 'fr'
      ? 'La balise <body> doit être à l’intérieur de la balise <html>, après la section <head>.'
      : 'The <body> tag must be inside the <html> tag, after the <head> section.'
  }),

  bodyNestedInHead: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <body> est imbriquée dans la balise <head>.'
      : 'The <body> tag is nested inside the <head> tag.',
    advice: lang === 'fr'
      ? 'Fermez d’abord la section head avec «\u00A0</head>\u00A0» avant d’ouvrir la section «\u00A0<body>\u00A0».'
      : 'First close the head section with "</head>" before opening the "<body>" section.'
  }),

  tagOutsideHtml: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> est située en dehors de la balise <html>.`
      : `The <${name}> tag is located outside the <html> tag.`,
    advice: lang === 'fr'
      ? `Déplacez la balise <${name}> à l’intérieur de la balise <body> (ou <head> s'il s'agit de métadonnées).`
      : `Move the <${name}> tag inside the <body> tag (or <head> if it is metadata).`
  }),

  tagDirectChildOfHtml: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> est un enfant direct de <html>, ce qui est interdit.`
      : `The <${name}> tag is a direct child of <html>, which is forbidden.`,
    advice: lang === 'fr'
      ? `Placez la balise <${name}> soit dans la section <head> (si c'est un titre/métadonnée), soit dans la section <body> (si c'est du contenu visible).`
      : `Place the <${name}> tag either in the <head> section (if it is title/metadata) or in the <body> section (if it is visible content).`
  }),

  tagNotAllowedInHead: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> n’est pas autorisée dans la section <head>.`
      : `The <${name}> tag is not allowed in the <head> section.`,
    advice: lang === 'fr'
      ? `La section <head> ne doit contenir que des métadonnées (comme <title>, <meta> ou <link>). Déplacez <${name}> dans le <body>.`
      : `The <head> section must only contain metadata (such as <title>, <meta> or <link>). Move <${name}> into the <body>.`
  }),

  titleTagInBody: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <title> ne doit pas être placée dans la section <body>.'
      : 'The <title> tag must not be placed in the <body> section.',
    advice: lang === 'fr'
      ? 'Déplacez la balise <title> de votre corps (body) vers la section d’en-tête (head).'
      : 'Move the <title> tag from your body section to the head section.'
  }),

  tagNotAllowed: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> n'est pas autorisée par la configuration.`
      : `The tag <${name}> is not allowed by the configuration.`,
    advice: lang === 'fr'
      ? `Modifiez l'option 'allowedTags' ou utilisez une balise autorisée.`
      : `Modify the 'allowedTags' option or use an allowed tag.`
  }),

  tagForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> est interdite par la configuration.`
      : `The tag <${name}> is forbidden by the configuration.`,
    advice: lang === 'fr'
      ? `Modifiez l'option 'forbiddenTags' ou utilisez une autre balise.`
      : `Modify the 'forbiddenTags' option or use another tag.`
  }),

  tagDeprecated: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> est obsolète/dépréciée en HTML5.`
      : `The tag <${name}> is obsolete/deprecated in HTML5.`,
    advice: lang === 'fr'
      ? `Il est recommandé de ne plus utiliser <${name}>. Utilisez du CSS pour le style ou des balises sémantiques modernes.`
      : `It is recommended to stop using <${name}>. Use CSS for styling or modern semantic tags instead.`
  }),

  customTagNotAllowed: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise personnalisée <${name}> n'est pas autorisée.`
      : `The custom tag <${name}> is not allowed.`,
    advice: lang === 'fr'
      ? `Seules les balises standard de la norme HTML5 sont acceptées.`
      : `Only standard HTML5 tags are accepted.`
  }),

  tagCaseLowercaseForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> doit respecter la casse définie (les minuscules sont interdites).`
      : `The tag <${name}> must respect the defined casing (lowercase is forbidden).`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la balise en majuscules (ex\u00A0: <${name.toUpperCase()}>).`
      : `Modify the casing to write the tag in uppercase (e.g. <${name.toUpperCase()}>).`
  }),

  tagCaseUppercaseForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> doit respecter la casse définie (les majuscules sont interdites).`
      : `The tag <${name}> must respect the defined casing (uppercase is forbidden).`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la balise en minuscules (ex\u00A0: <${name.toLowerCase()}>).`
      : `Modify the casing to write the tag in lowercase (e.g. <${name.toLowerCase()}>).`
  }),

  tagCaseMixedForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> a une casse mixte (mélange de majuscules et de minuscules) non autorisée.`
      : `The tag <${name}> has an unauthorized mixed casing (mix of uppercase and lowercase).`,
    advice: lang === 'fr'
      ? `Utilisez uniquement des minuscules (ex\u00A0: <${name.toLowerCase()}>) ou uniquement des majuscules.`
      : `Use only lowercase (e.g. <${name.toLowerCase()}>) or only uppercase.`
  }),

  voidElementMustSelfClose: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise orpheline <${name}> doit se terminer par «\u00A0/>\u00A0» (style XHTML).`
      : `The void element <${name}> must end with "/>" (XHTML style).`,
    advice: lang === 'fr'
      ? `Ajoutez une barre oblique «\u00A0/\u00A0» avant le symbole «\u00A0>\u00A0» (ex\u00A0: <${name} />).`
      : `Add a slash "/" before the ">" symbol (e.g. <${name} />).`
  }),

  voidElementMustNotSelfClose: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise orpheline <${name}> ne doit pas se terminer par «\u00A0/>\u00A0» (style HTML5).`
      : `The void element <${name}> must not end with "/>" (HTML5 style).`,
    advice: lang === 'fr'
      ? `Retirez la barre oblique «\u00A0/\u00A0» avant le symbole «\u00A0>\u00A0» (ex\u00A0: <${name}>).`
      : `Remove the slash "/" before the ">" symbol (e.g. <${name}>).`
  }),

  normalElementCannotSelfClose: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${name}> n’est pas une balise orpheline et ne peut pas être auto-fermante.`
      : `The tag <${name}> is not a void element and cannot be self-closing.`,
    advice: lang === 'fr'
      ? `Utilisez une balise de fermeture explicite (ex\u00A0: <${name}></${name}>) au lieu de la syntaxe auto-fermante.`
      : `Use an explicit closing tag (e.g. <${name}></${name}>) instead of self-closing syntax.`
  }),

  attributeLowercaseForbidden: (lang: Language, attrName: string, name: string) => ({
    message: lang === 'fr'
      ? `L'attribut «\u00A0${attrName}\u00A0» dans la balise <${name}> ne doit pas être en minuscules.`
      : `The attribute "${attrName}" in tag <${name}> must not be in lowercase.`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour respecter les règles de casse des attributs (ex\u00A0: ${attrName.toUpperCase()}).`
      : `Modify the casing to respect attribute casing rules (e.g. ${attrName.toUpperCase()}).`
  }),

  attributeUppercaseForbidden: (lang: Language, attrName: string, name: string) => ({
    message: lang === 'fr'
      ? `L'attribut «\u00A0${attrName}\u00A0» dans la balise <${name}> ne doit pas être en majuscules.`
      : `The attribute "${attrName}" in tag <${name}> must not be in uppercase.`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour respecter les règles de casse des attributs (ex\u00A0: ${attrName.toLowerCase()}).`
      : `Modify the casing to respect attribute casing rules (e.g. ${attrName.toLowerCase()}).`
  }),

  attributeMixedForbidden: (lang: Language, attrName: string, name: string) => ({
    message: lang === 'fr'
      ? `L'attribut «\u00A0${attrName}\u00A0» dans la balise <${name}> a une casse mixte non autorisée.`
      : `The attribute "${attrName}" in tag <${name}> has an unauthorized mixed casing.`,
    advice: lang === 'fr'
      ? `Utilisez uniquement des minuscules (ex\u00A0: «\u00A0${attrName.toLowerCase()}\u00A0») ou uniquement des majuscules selon vos règles.`
      : `Use only lowercase (e.g. "${attrName.toLowerCase()}") or only uppercase according to your rules.`
  }),

  attributeForbidden: (lang: Language, attrName: string, name: string) => ({
    message: lang === 'fr'
      ? `L'attribut «\u00A0${attrName}\u00A0» est interdit sur la balise <${name}>.`
      : `The attribute "${attrName}" is forbidden on the tag <${name}>.`,
    advice: lang === 'fr'
      ? `Retirez l'attribut «\u00A0${attrName}\u00A0» de cette balise.`
      : `Remove the attribute "${attrName}" from this tag.`
  }),

  attributeDeprecated: (lang: Language, attrName: string) => ({
    message: lang === 'fr'
      ? `L'attribut «\u00A0${attrName}\u00A0» est déprécié/obsolète en HTML5.`
      : `The attribute "${attrName}" is deprecated/obsolete in HTML5.`,
    advice: lang === 'fr'
      ? `Évitiez d'utiliser des attributs de style ou de mise en forme obsolètes. Utilisez du CSS pour cela.`
      : `Avoid using obsolete styling or formatting attributes. Use CSS instead.`
  }),

  attributeCustomNotAllowed: (lang: Language, attrName: string, name: string, attrNameLower: string) => ({
    message: lang === 'fr'
      ? `L'attribut personnalisé «\u00A0${attrName}\u00A0» n'est pas autorisé sur la balise <${name}>.`
      : `The custom attribute "${attrName}" is not allowed on the tag <${name}>.`,
    advice: lang === 'fr'
      ? `Seuls les attributs standard ou commençant par «\u00A0data-\u00A0» sont acceptés. Modifiez le nom en «\u00A0data-${attrNameLower}\u00A0».`
      : `Only standard attributes or those starting with "data-" are accepted. Rename it to "data-${attrNameLower}".`
  }),

  attributeRequired: (lang: Language, req: string, name: string) => ({
    message: lang === 'fr'
      ? `L'attribut obligatoire «\u00A0${req}\u00A0» est manquant pour la balise <${name}>.`
      : `The required attribute "${req}" is missing for the tag <${name}>.`,
    advice: lang === 'fr'
      ? `Ajoutez l'attribut «\u00A0${req}\u00A0» (ex\u00A0: <${name} ${req}="...">).`
      : `Add the attribute "${req}" (e.g. <${name} ${req}="...">).`
  }),

  attributeImgAltRequired: (lang: Language) => ({
    message: lang === 'fr'
      ? `L'attribut obligatoire «\u00A0alt\u00A0» (description textuelle) est manquant pour la balise <img>.`
      : `The required attribute "alt" (textual description) is missing for the tag <img>.`,
    advice: lang === 'fr'
      ? `L'attribut «\u00A0alt\u00A0» est indispensable pour l'accessibilité des personnes malvoyantes. Ajoutez alt="..." décrivant l'image.`
      : `The "alt" attribute is essential for accessibility for visually impaired users. Add alt="..." describing the image.`
  }),

  voidElementCannotClose: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise orpheline <${name}> ne doit pas avoir de balise de fermeture </${name}>.`
      : `The void element <${name}> must not have a closing tag </${name}>.`,
    advice: lang === 'fr'
      ? `Retirez la balise de fermeture "</${name}>". Les balises orphelines s'écrivent seules.`
      : `Remove the closing tag "</${name}>". Void elements are written alone.`
  }),

  closingTagCaseLowercaseForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise </${name}> doit respecter la casse définie (les minuscules sont interdites).`
      : `The tag </${name}> must respect the defined casing (lowercase is forbidden).`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la balise en majuscules (ex\u00A0: </${name.toUpperCase()}>).`
      : `Modify the casing to write the tag in uppercase (e.g. </${name.toUpperCase()}>).`
  }),

  closingTagCaseUppercaseForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise </${name}> doit respecter la casse définie (les majuscules sont interdites).`
      : `The tag </${name}> must respect the defined casing (uppercase is forbidden).`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la balise en minuscules (ex\u00A0: </${name.toLowerCase()}>).`
      : `Modify the casing to write the tag in lowercase (e.g. </${name.toLowerCase()}>).`
  }),

  closingTagCaseMixedForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise </${name}> a une casse mixte non autorisée.`
      : `The tag </${name}> has an unauthorized mixed casing.`,
    advice: lang === 'fr'
      ? `Utilisez uniquement des minuscules (ex\u00A0: </${name.toLowerCase()}>) ou uniquement des majuscules.`
      : `Use only lowercase (e.g. </${name.toLowerCase()}>) or only uppercase.`
  }),

  closingTagMismatchNoOpen: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La balise de fermeture </${name}> n'a pas de balise ouvrante correspondante.`
      : `The closing tag </${name}> has no matching opening tag.`,
    advice: lang === 'fr'
      ? `Vérifiez si vous n'avez pas écrit une balise de fermeture en trop, ou s'il manque la balise ouvrante <${name}>.`
      : `Check if you have an extra closing tag, or if the opening tag <${name}> is missing.`
  }),

  closingTagMismatchInsideOpen: (lang: Language, unclosed: string, line: number, name: string) => ({
    message: lang === 'fr'
      ? `La balise <${unclosed}> ouverte à la ligne ${line} n'est pas fermée.`
      : `The tag <${unclosed}> opened at line ${line} is not closed.`,
    advice: lang === 'fr'
      ? `Ajoutez une balise de fermeture "</${unclosed}>" avant "</${name}>" pour respecter l'ordre d'imbrication.`
      : `Add a closing tag "</${unclosed}>" before "</${name}>" to respect nesting order.`
  }),

  closingTagMismatchTopMismatch: (lang: Language, name: string, top: string, line: number) => ({
    message: lang === 'fr'
      ? `La balise de fermeture </${name}> ne correspond pas à la balise ouvrante <${top}> ouverte à la ligne ${line}.`
      : `The closing tag </${name}> does not match the opening tag <${top}> opened at line ${line}.`,
    advice: lang === 'fr'
      ? `Il est probable que vous ayez oublié de fermer <${top}>, ou que </${name}> soit une erreur de frappe.`
      : `It is likely that you forgot to close <${top}>, or </${name}> is a typo.`
  }),

  visibleTextOutsideHtml: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Du texte visible a été trouvé en dehors de la balise <html>.'
      : 'Visible text was found outside the <html> tag.',
    advice: lang === 'fr'
      ? 'Tout texte visible pour l’utilisateur doit être inséré à l’intérieur de la balise <body>...</body>.'
      : 'Any text visible to the user must be placed inside the <body>...</body> tag.'
  }),

  visibleTextDirectChildOfHtml: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Du texte visible a été trouvé directement comme enfant de <html>.'
      : 'Visible text was found directly as a child of <html>.',
    advice: lang === 'fr'
      ? 'Tout texte visible pour l’utilisateur doit être inséré à l’intérieur de la balise <body>...</body>.'
      : 'Any text visible to the user must be placed inside the <body>...</body> tag.'
  }),

  visibleTextInHead: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Du texte brut visible a été trouvé dans la section <head>.'
      : 'Raw visible text was found in the <head> section.',
    advice: lang === 'fr'
      ? 'Le <head> ne doit pas contenir de texte visible direct. Déplacez ce texte dans le <body>.'
      : 'The <head> section must not contain direct visible text. Move this text to the <body>.'
  }),

  tagUnclosedAtEOF: (lang: Language, unclosed: string, line: number) => ({
    message: lang === 'fr'
      ? `La balise <${unclosed}> ouverte à la ligne ${line} n'a pas été fermée avant la fin du fichier.`
      : `The tag <${unclosed}> opened at line ${line} was not closed before the end of the file.`,
    advice: lang === 'fr'
      ? `Ajoutez la balise de fermeture "</${unclosed}>" à la fin du document ou à l'endroit approprié.`
      : `Add the closing tag "</${unclosed}>" at the end of the document or at the appropriate place.`
  }),

  missingHtmlTag: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise principale <html> est manquante.'
      : 'The main <html> tag is missing.',
    advice: lang === 'fr'
      ? 'Enveloppez tout le contenu (sauf le DOCTYPE) dans une balise <html>...</html>.'
      : 'Wrap all content (except the DOCTYPE) in an <html>...</html> tag.'
  }),

  multipleHtmlTags: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Plusieurs balises <html> ont été trouvées.'
      : 'Multiple <html> tags were found.',
    advice: lang === 'fr'
      ? 'Un document HTML ne doit avoir qu’un seul élément racine <html>.'
      : 'An HTML document must have only one root <html> element.'
  }),

  missingHeadSection: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La section <head> est manquante.'
      : 'The <head> section is missing.',
    advice: lang === 'fr'
      ? 'Ajoutez une section <head>...</head> contenant les métadonnées de votre page.'
      : 'Add a <head>...</head> section containing your page metadata.'
  }),

  multipleHeadSections: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Plusieurs balises <head> ont été trouvées.'
      : 'Multiple <head> tags were found.',
    advice: lang === 'fr'
      ? 'Un document HTML ne doit avoir qu’une seule section <head>.'
      : 'An HTML document must have only one <head> section.'
  }),

  missingBodySection: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La section <body> est manquante.'
      : 'The <body> section is missing.',
    advice: lang === 'fr'
      ? 'Ajoutez une section <body>...</body> pour envelopper le contenu visible de votre page.'
      : 'Add a <body>...</body> section to wrap the visible content of your page.'
  }),

  multipleBodySections: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Plusieurs balises <body> ont été trouvées.'
      : 'Multiple <body> tags were found.',
    advice: lang === 'fr'
      ? 'Un document HTML ne doit avoir qu’une seule section <body>.'
      : 'An HTML document must have only one <body> section.'
  }),

  multipleDoctypes: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Plusieurs déclarations DOCTYPE ont été trouvées.'
      : 'Multiple DOCTYPE declarations were found.',
    advice: lang === 'fr'
      ? 'Un document HTML ne doit avoir qu’une seule déclaration DOCTYPE au tout début.'
      : 'An HTML document must have only one DOCTYPE declaration at the very beginning.'
  }),

  missingCharset: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise de spécification de l’encodage <meta charset="..."> est manquante dans le <head>.'
      : 'The encoding specification tag <meta charset="..."> is missing in the <head>.',
    advice: lang === 'fr'
      ? 'Ajoutez la balise <meta charset="utf-8"> dans votre section <head> pour assurer un affichage correct des caractères accentués.'
      : 'Add the <meta charset="utf-8"> tag in your <head> section to ensure correct rendering of accented characters.'
  }),

  missingTitle: (lang: Language) => ({
    message: lang === 'fr'
      ? 'La balise <title> est manquante ou vide dans la section <head>.'
      : 'The <title> tag is missing or empty in the <head> section.',
    advice: lang === 'fr'
      ? 'Ajoutez une balise <title> avec le titre de votre page (ex\u00A0: <title>Ma page web</title>) dans la section <head>.'
      : 'Add a <title> tag with your page title (e.g., <title>My Web Page</title>) inside the <head> section.'
  }),

  duplicateId: (lang: Language, id: string, line: number) => ({
    message: lang === 'fr'
      ? `L'identifiant «\u00A0${id}\u00A0» est déjà utilisé.`
      : `Duplicate ID "${id}" found.`,
    advice: lang === 'fr'
      ? `L'identifiant «\u00A0${id}\u00A0» a déjà été défini à la ligne ${line}. Les identifiants doivent être uniques dans tout le document.`
      : `The ID "${id}" was already defined at line ${line}. IDs must be unique across the entire document.`
  }),

  nestedForm: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Les éléments de formulaire ne peuvent pas être imbriqués.'
      : 'Form elements cannot be nested.',
    advice: lang === 'fr'
      ? 'Retirez la balise <form> imbriquée ou fermez d\'abord le formulaire parent.'
      : 'Remove the nested <form> tag or close the outer form first.'
  }),

  duplicateName: (lang: Language, name: string, line: number) => ({
    message: lang === 'fr'
      ? `Nom d'élément de formulaire en double «\u00A0${name}\u00A0».`
      : `Duplicate form element name "${name}".`,
    advice: lang === 'fr'
      ? `Le nom «\u00A0${name}\u00A0» est déjà utilisé par un autre élément de formulaire à la ligne ${line}. Les noms des éléments de formulaire doivent être uniques (sauf pour les boutons radio et les cases à cocher).`
      : `The name "${name}" is already used by another form element at line ${line}. Form element names must be unique (except for radio buttons and checkboxes).`
  }),

  textareaValueAttribute: (lang: Language) => ({
    message: lang === 'fr'
      ? `L'élément <textarea> ne doit pas avoir d'attribut «\u00A0value\u00A0».`
      : `The <textarea> element must not have a "value" attribute.`,
    advice: lang === 'fr'
      ? `Pour définir une valeur par défaut pour un <textarea>, placez le texte entre les balises ouvrante et fermante (ex\u00A0: <textarea>Texte par défaut</textarea>).`
      : `To set a default value for a <textarea>, place the text inside the opening and closing tags (e.g., <textarea>Default text</textarea>).`
  }),

  formControlOutsideForm: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `Le contrôle de formulaire <${name}> doit être à l'intérieur d'un élément <form>.`
      : `Form control <${name}> must be inside a <form> element.`,
    advice: lang === 'fr'
      ? `Enveloppez cet élément dans une balise <form> ou retirez-le.`
      : `Wrap this element in a <form> tag or remove it.`
  }),

  labelAssociationRequired: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `Le contrôle de formulaire interactif <${name}> doit être associé à un <label>.`
      : `Interactive form control <${name}> must be associated with a <label>.`,
    advice: lang === 'fr'
      ? `Imbriquez le contrôle dans un élément <label> ou ajoutez un attribut «\u00A0for\u00A0» à un <label> correspondant à l'attribut «\u00A0id\u00A0» du contrôle.`
      : `Nest the control inside a <label> element or add a "for" attribute to a <label> matching the control's "id" attribute.`
  }),

  radioButtonMissingName: (lang: Language) => ({
    message: lang === 'fr'
      ? `Le bouton radio n'a pas d'attribut «\u00A0name\u00A0».`
      : `Radio button is missing a "name" attribute.`,
    advice: lang === 'fr'
      ? `Ajoutez un attribut «\u00A0name\u00A0» pour regrouper ce bouton radio avec d'autres.`
      : `Add a "name" attribute to group this radio button with others.`
  }),

  radioButtonSingleInGroup: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `Le groupe de boutons radio «\u00A0${name}\u00A0» doit contenir au moins deux boutons radio.`
      : `Radio button group "${name}" must contain at least two radio buttons.`,
    advice: lang === 'fr'
      ? `Ajoutez un autre bouton radio avec le nom «\u00A0${name}\u00A0», ou utilisez une case à cocher si une seule option est nécessaire.`
      : `Add another radio button with the name "${name}", or use a checkbox if only one option is needed.`
  }),

  buttonMissingType: (lang: Language) => ({
    message: lang === 'fr'
      ? `Les boutons à l'intérieur d'un formulaire doivent avoir un attribut «\u00A0type\u00A0» explicite.`
      : `Buttons inside a form must have an explicit "type" attribute.`,
    advice: lang === 'fr'
      ? `Ajoutez type="submit", type="button" ou type="reset" à l'élément <button>.`
      : `Add type="submit", type="button", or type="reset" to the <button> element.`
  }),

  selectEmptyOptions: (lang: Language) => ({
    message: lang === 'fr'
      ? `L'élément <select> doit contenir au moins une option.`
      : `The <select> element must contain at least one <option>.`,
    advice: lang === 'fr'
      ? `Ajoutez un ou plusieurs éléments <option> à l'intérieur du <select>.`
      : `Add one or more <option> elements inside the <select>.`
  })
};
