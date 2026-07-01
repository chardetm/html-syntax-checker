import { CSSCheckerErrorType, Language } from '../types';

const errorTypeNames: Record<CSSCheckerErrorType, { en: string; fr: string }> = {
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

export function getCssErrorTypeName(type: CSSCheckerErrorType, lang: Language): string {
  return errorTypeNames[type][lang];
}

export const getCssMessage = {
  unclosedComment: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Le commentaire CSS n’est pas fermé.'
      : 'CSS comment is not closed.',
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0*/\u00A0» pour fermer le commentaire.'
      : 'Add "*/" to close the comment.'
  }),

  unclosedBlock: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Bloc « { » non fermé par une accolade « } ».'
      : 'Block "{" is not closed by a brace "}".',
    advice: lang === 'fr'
      ? 'Ajoutez une accolade fermante « } » pour fermer le bloc.'
      : 'Add a closing brace "}" to close the block.'
  }),

  missingSelector: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Sélecteur manquant avant le bloc «\u00A0{\u00A0».'
      : 'Missing selector before block "{".',
    advice: lang === 'fr'
      ? 'Ajoutez un sélecteur avant le bloc de déclarations (ex\u00A0: «\u00A0h1 { ... }\u00A0»).'
      : 'Add a selector before the declaration block (e.g., "h1 { ... }").'
  }),

  unclosedRule: (lang: Language, selector: string) => ({
    message: lang === 'fr'
      ? `Règle CSS non fermée ou accolade «\u00A0{\u00A0» manquante pour le sélecteur «\u00A0${selector || '...'}\u00A0».`
      : `Unclosed CSS rule or missing brace "{" for selector "${selector || '...'}".`,
    advice: lang === 'fr'
      ? 'Ajoutez une accolade ouvrante «\u00A0{\u00A0» pour commencer le bloc ou fermez le bloc précédent.'
      : 'Add an opening brace "{" to start the block or close the previous block.'
  }),

  invalidElement: (lang: Language, raw: string) => ({
    message: lang === 'fr'
      ? `Déclaration ou règle invalide «\u00A0${raw || '...'}\u00A0».`
      : `Invalid declaration or rule "${raw || '...'}".`,
    advice: lang === 'fr'
      ? 'Vérifiez la syntaxe de vos règles. Chaque déclaration doit avoir un nom de propriété suivi de «\u00A0:\u00A0» et d’une valeur.'
      : 'Check your rule syntax. Each declaration must have a property name followed by ":" and a value.'
  }),

  missingColon: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété «\u00A0${prop}\u00A0» est manquante des deux-points «\u00A0:\u00A0».`
      : `Property "${prop}" is missing a colon ":".`,
    advice: lang === 'fr'
      ? `Ajoutez un caractère «\u00A0:\u00A0» après la propriété (ex\u00A0: «\u00A0${prop}: valeur;\u00A0»).`
      : `Add a ":" character after the property (e.g. "${prop}: value;").`
  }),

  unclosedAtRule: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `La règle @ «\u00A0@${name}\u00A0» n'est pas fermée.`
      : `At-rule "@${name}" is not closed.`,
    advice: lang === 'fr'
      ? 'Ajoutez «\u00A0;\u00A0» ou un bloc «\u00A0{ ... }\u00A0» pour fermer la règle.'
      : 'Add ";" or a block "{ ... }" to close the rule.'
  }),

  emptyRulesForbidden: (lang: Language, selector: string) => ({
    message: lang === 'fr'
      ? `Les règles vides ne sont pas autorisées («\u00A0${selector}\u00A0»).`
      : `Empty rules are not allowed ("${selector}").`,
    advice: lang === 'fr'
      ? 'Ajoutez des déclarations de propriétés ou supprimez cette règle vide.'
      : 'Add property declarations or remove this empty rule.'
  }),

  duplicatePropertyForbidden: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété en double «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Duplicate property "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? `Supprimez l'une des déclarations en double pour «\u00A0${prop}\u00A0».`
      : `Remove one of the duplicate declarations for "${prop}".`
  }),

  importantForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? `L'utilisation de «\u00A0!important\u00A0» n'est pas autorisée.`
      : "Use of '!important' is not allowed.",
    advice: lang === 'fr'
      ? 'Essayez de structurer vos règles pour éviter d’avoir recours à !important pour écraser des styles.'
      : 'Try structuring your rules to avoid relying on !important to override styles.'
  }),

  propertyForbidden: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété «\u00A0${prop}\u00A0» est interdite.`
      : `Property "${prop}" is forbidden.`,
    advice: lang === 'fr'
      ? `Retirez cette propriété ou utilisez-en une autre selon les instructions.`
      : `Remove this property or use another one according to the instructions.`
  }),

  propertyNotAllowed: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Property "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? `Seules les propriétés enseignées/spécifiées sont autorisées.`
      : `Only specifically allowed properties are permitted.`
  }),

  flexboxForbiddenProperty: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété Flexbox «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Flexbox property "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Flexbox a été désactivé dans la configuration.'
      : 'Flexbox has been disabled in the configuration.'
  }),

  flexboxForbiddenValue: (lang: Language, val: string) => ({
    message: lang === 'fr'
      ? `La valeur Flexbox «\u00A0${val}\u00A0» n'est pas autorisée.`
      : `Flexbox value "${val}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Retirez la valeur flex ou inline-flex de display.'
      : 'Remove flex or inline-flex from the display property.'
  }),

  gridForbiddenProperty: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété CSS Grid «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `CSS Grid property "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? 'CSS Grid a été désactivé dans la configuration.'
      : 'CSS Grid has been disabled in the configuration.'
  }),

  gridForbiddenValue: (lang: Language, val: string) => ({
    message: lang === 'fr'
      ? `La valeur CSS Grid «\u00A0${val}\u00A0» n'est pas autorisée.`
      : `CSS Grid value "${val}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Retirez la valeur grid ou inline-grid de display.'
      : 'Remove grid or inline-grid from the display property.'
  }),

  layoutForbiddenProperty: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété de mise en page «\u00A0${prop}\u00A0» n'est pas autorisée car Flexbox et Grid sont désactivés.`
      : `Layout property "${prop}" is not allowed because both Flexbox and Grid are disabled.`,
    advice: lang === 'fr'
      ? 'Utilisez des méthodes de mise en page traditionnelles (bloc, en-ligne, etc.).'
      : 'Use traditional layout methods (block, inline, float, etc.).'
  }),

  mixedCaseProperty: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La casse mixte dans la propriété «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Mixed case in property name "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? `Écrivez le nom de la propriété entièrement en minuscules (ex\u00A0: «\u00A0${prop.toLowerCase()}\u00A0»).`
      : `Write the property name entirely in lowercase (e.g. "${prop.toLowerCase()}").`
  }),

  lowercasePropertyForbidden: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété en minuscules «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Lowercase property name "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la propriété en majuscules.`
      : `Modify the casing to write the property in uppercase.`
  }),

  uppercasePropertyForbidden: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété en majuscules «\u00A0${prop}\u00A0» n'est pas autorisée.`
      : `Uppercase property name "${prop}" is not allowed.`,
    advice: lang === 'fr'
      ? `Modifiez la casse pour écrire la propriété en minuscules.`
      : `Modify the casing to write the property in lowercase.`
  }),

  missingUnit: (lang: Language, val: string, prop: string) => ({
    message: lang === 'fr'
      ? `Unité manquante pour la valeur «\u00A0${val}\u00A0» dans la propriété «\u00A0${prop}\u00A0».`
      : `Missing unit for value "${val}" in property "${prop}".`,
    advice: lang === 'fr'
      ? `Ajoutez une unité de longueur ou de temps (ex\u00A0: «\u00A0${val}px\u00A0» ou «\u00A0${val}s\u00A0»). Les valeurs non nulles requièrent des unités.`
      : `Add a length or time unit (e.g. "${val}px" or "${val}s"). Non-zero values require units.`
  }),

  unitForbidden: (lang: Language, unit: string) => ({
    message: lang === 'fr'
      ? `L'unité «\u00A0${unit}\u00A0» n'est pas autorisée.`
      : `Unit "${unit}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Utilisez uniquement les unités autorisées par la configuration.'
      : 'Use only the units permitted by the configuration.'
  }),

  colorFormatForbidden: (lang: Language, fmt: string) => ({
    message: lang === 'fr'
      ? `Le format de couleur «\u00A0${fmt}\u00A0» n'est pas autorisé.`
      : `Color format "${fmt}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Utilisez uniquement les formats de couleur autorisés (ex\u00A0: hex, rgb, rgba, hsl, etc.).'
      : 'Use only allowed color formats (e.g. hex, rgb, rgba, hsl, etc.).'
  }),

  colorNamedForbidden: (lang: Language, color: string) => ({
    message: lang === 'fr'
      ? `Le format de couleur nommée («\u00A0${color}\u00A0») n'est pas autorisé.`
      : `Named color format ("${color}") is not allowed.`,
    advice: lang === 'fr'
      ? 'Utilisez un format de couleur numérique (hex, rgb, hsl, etc.).'
      : 'Use a numeric color format (hex, rgb, hsl, etc.).'
  }),

  atRuleForbidden: (lang: Language, name: string) => ({
    message: lang === 'fr'
      ? `L'utilisation de la règle @ «\u00A0@${name}\u00A0» n'est pas autorisée.`
      : `Use of at-rule "@${name}" is not allowed.`,
    advice: lang === 'fr'
      ? 'Les règles débutant par @ sont désactivées.'
      : 'Rules starting with @ are disabled.'
  }),

  universalSelectorForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Le sélecteur universel «\u00A0*\u00A0» n\'est pas autorisé.'
      : "Universal selector '*' is not allowed.",
    advice: lang === 'fr'
      ? 'Sélectionnez des éléments spécifiques au lieu d’appliquer des styles universels.'
      : 'Select specific elements instead of applying universal styles.'
  }),

  nestingSelectorForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Le sélecteur d’imbrication «\u00A0&\u00A0» n\'est pas autorisé.'
      : "Nesting selector '&' is not allowed.",
    advice: lang === 'fr'
      ? 'N’utilisez pas de règles imbriquées. Écrivez chaque sélecteur séparément.'
      : 'Do not use nested rules. Write each selector separately.'
  }),

  classSelectorForbidden: (lang: Language, cls: string) => ({
    message: lang === 'fr'
      ? `Les sélecteurs de classe ne sont pas autorisés («\u00A0${cls}\u00A0»).`
      : `Class selectors are not allowed ("${cls}").`,
    advice: lang === 'fr'
      ? 'Utilisez des sélecteurs de type (balise) ou d’identifiant (ID) selon vos instructions.'
      : 'Use type (tag) or ID selectors according to instructions.'
  }),

  idSelectorForbidden: (lang: Language, id: string) => ({
    message: lang === 'fr'
      ? `Les sélecteurs d'identifiant (ID) ne sont pas autorisés («\u00A0${id}\u00A0»).`
      : `ID selectors are not allowed ("${id}").`,
    advice: lang === 'fr'
      ? 'Les identifiants ne doivent pas être stylisés directement pour éviter les problèmes de spécificité.'
      : 'IDs should not be styled directly to avoid specificity traps.'
  }),

  pseudoClassForbidden: (lang: Language, pseudo: string) => ({
    message: lang === 'fr'
      ? `Les pseudo-classes ne sont pas autorisées («\u00A0${pseudo}\u00A0»).`
      : `Pseudo-classes are not allowed ("${pseudo}").`,
    advice: lang === 'fr'
      ? 'Les pseudo-classes sont désactivées dans cette configuration.'
      : 'Pseudo-classes are disabled in this configuration.'
  }),

  pseudoElementForbidden: (lang: Language, pseudo: string) => ({
    message: lang === 'fr'
      ? `Les pseudo-éléments ne sont pas autorisés («\u00A0${pseudo}\u00A0»).`
      : `Pseudo-elements are not allowed ("${pseudo}").`,
    advice: lang === 'fr'
      ? 'Les pseudo-éléments sont désactivés dans cette configuration.'
      : 'Pseudo-elements are disabled in this configuration.'
  }),

  typeSelectorForbidden: (lang: Language, tag: string) => ({
    message: lang === 'fr'
      ? `Les sélecteurs de type (balise) ne sont pas autorisés («\u00A0${tag}\u00A0»).`
      : `Type selectors are not allowed ("${tag}").`,
    advice: lang === 'fr'
      ? 'Utilisez uniquement des classes ou des identifiants.'
      : 'Use only class or ID selectors.'
  }),

  combinatorsForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Les combinateurs (ex\u00A0: «\u00A0>\u00A0», «\u00A0+\u00A0», «\u00A0~\u00A0», sélecteur descendant) ne sont pas autorisés.'
      : 'Combinators (e.g. ">", "+", "~", or descendant spaces) are not allowed.',
    advice: lang === 'fr'
      ? 'Ciblez vos éléments directement sans utiliser de relations de parenté ou d’adjacence.'
      : 'Target elements directly without using parent-child or sibling relations.'
  }),

  selectorListsForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Les listes de sélecteurs (séparées par des virgules) ne sont pas autorisées.'
      : 'Selector lists (separated by commas) are not allowed.',
    advice: lang === 'fr'
      ? 'Écrivez une règle séparée pour chaque sélecteur.'
      : 'Write a separate rule for each selector.'
  }),

  nestedRulesForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Les règles imbriquées ne sont pas autorisées.'
      : 'Nested rules are not allowed.',
    advice: lang === 'fr'
      ? 'Écrivez chaque règle CSS au niveau racine de la feuille de style.'
      : 'Write each CSS rule at the root level of the stylesheet.'
  }),

  invalidKeyframeSelector: (lang: Language, selector: string) => ({
    message: lang === 'fr'
      ? `Sélecteur d'animation non valide «\u00A0${selector}\u00A0» dans @keyframes.`
      : `Invalid keyframe selector "${selector}" inside @keyframes.`,
    advice: lang === 'fr'
      ? 'Les sélecteurs d’animation doivent être «\u00A0from\u00A0», «\u00A0to\u00A0» ou un pourcentage (ex\u00A0: «\u00A050%\u00A0»).'
      : 'Keyframe selectors must be "from", "to", or a percentage (e.g., "50%").'
  }),

  missingSemicolon: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `Point-virgule «\u00A0;\u00A0» manquant à la fin de la déclaration de la propriété «\u00A0${prop}\u00A0».`
      : `Missing semicolon ";" at the end of declaration for property "${prop}".`,
    advice: lang === 'fr'
      ? 'Ajoutez un point-virgule «\u00A0;\u00A0» à la fin de la déclaration.'
      : 'Add a semicolon ";" at the end of the declaration.'
  }),

  multiplePropertiesPerLineForbidden: (lang: Language) => ({
    message: lang === 'fr'
      ? 'Chaque propriété doit être sur sa propre ligne.'
      : 'Each property must be on its own line.',
    advice: lang === 'fr'
      ? 'Déplacez les propriétés supplémentaires vers de nouvelles lignes.'
      : 'Move additional properties to new lines.'
  }),

  invalidSelector: (lang: Language, selector: string) => ({
    message: lang === 'fr'
      ? `Sélecteur non valide «\u00A0${selector}\u00A0».`
      : `Invalid selector "${selector}".`,
    advice: lang === 'fr'
      ? 'Vérifiez la syntaxe de votre sélecteur (ex\u00A0: parenthèses, crochets ou pseudo-classes mal fermés ou vides).'
      : 'Verify the syntax of your selector (e.g. unclosed or empty parentheses, brackets, or pseudo-classes).'
  }),

  unrecognizedProperty: (lang: Language, prop: string) => ({
    message: lang === 'fr'
      ? `La propriété «\u00A0${prop}\u00A0» n'est pas reconnue.`
      : `Property "${prop}" is unrecognized.`,
    advice: lang === 'fr'
      ? 'Vérifiez l’orthographe du nom de la propriété ou assurez-vous qu’elle est valide en CSS.'
      : 'Verify the spelling of the property name or ensure it is a valid CSS property.'
  })
};
