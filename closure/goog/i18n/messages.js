/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Support for declaring localizable messages.
 */

goog.module('goog.i18n.messages');

const {assert} = goog.require('goog.asserts');

/**
 * Options bag type for `declareIcuTemplate()` options argument.
 *
 * It is important to note that these options need to be known at compile time,
 * so they must always be provided to `declareIcuTmplate()` as an actual object
 * literal in the function call. Otherwise, closure-compiler will report an
 * error.
 *
 * @record
 */
const IcuTemplateOptions = function() {};

/**
 * Required text describing how the message will be used.
 *
 * Translators will use this information to help them understand and translate
 * the message.
 *
 * @type {string}
 */
IcuTemplateOptions.prototype.description;

/**
 * Optional text used to differentiate messages with identical original text but
 * different meanings.
 *
 * This field should usually be left undefined.
 * It should only be used when there exist 2 or more messages that have
 * identical original text but are used in very different ways, so that one
 * translation won't work for both.
 *
 * For example, maybe "close" needs to be translated in one place as "to close
 * something" but in another as "these things are close to each other".
 *
 * In such a case, you would specify clarifying text in the "meaning" field. It
 * is different from the "description" field in that "meaning" is used when
 * computing the unique message identifier, but "description" is not. Although
 * this field may be shown to translators, its primary function is just to
 * serve as a point of difference to disambiguate 2 otherwise identical
 * messages.
 *
 * @type {undefined|string}
 */
IcuTemplateOptions.prototype.meaning;

/**
 * Associates placeholder names with example values.
 *
 * closure-compiler uses this as the contents of the `<ex>` tag in the
 * XMB file it generates or defaults to `-` for historical reasons.
 *
 * * Must be an object literal.
 * * Ignored at runtime.
 * * Keys are placeholder names.
 * * Values are string literals containing example placeholder values.
 *   (e.g. "George McFly" for a name placeholder)
 *
 * @type {!Object<string, string>|undefined}
 */
IcuTemplateOptions.prototype.example;

/**
 * Associates placeholder names with strings showing how their values are
 * obtained.
 *
 * This field is intended for use in automatically generated JS code.
 * Human-written code should use meaningful placeholder names instead.
 *
 * closure-compiler uses this as the contents of the `<ph>` tag in the
 * XMB file it generates or defaults to `-` for historical reasons.
 *
 * * Must be an object literal.
 * * Ignored at runtime.
 * * Keys are placeholder names.
 * * Values are string literals indicating how the value is obtained.
 * * Typically this is a snippet of source code.
 *
 * @type {!Object<string, string>|undefined}
 */
IcuTemplateOptions.prototype.original_code;

/**
 * Declare a message template using ICU format.
 *
 * See https://unicode-org.github.io/icu/userguide/format_parse/messages/
 *
 * When run uncompiled, the template string and options will be checked for
 * easy-to-spot programming errors. If there are none, the template string will
 * be returned unmodified. Otherwise, an exception will be thrown.
 *
 * The template string will probably contain ICU-formatted placeholders
 * (e.g. "Hi, {NAME}"). The return value from this function will still contain
 * those. It should be passed to a message formatting API, such as
 * `goog.i18n.MessageFormat` in order to specify the runtime values to
 * substitute and produce the final message to display to users.
 *
 * IMPORTANT: It is an error to use closure-style placeholder syntax
 * (e.g. "Hi, {$NAME}" - note the '{$'), such as is used by `goog.getMsg()` for
 * compile-time substitution of placeholder values.
 *
 * At compile time, closure-compiler will look up the localized form of this
 * message in a translation bundle file (XTB), and replace this function call
 * with a string literal containing the translated template.
 *
 * The XTB file is generated by some combination of human translators and
 * automated tools based on information they receive in an XMB file.
 *
 * The closure-compiler message extraction tool will generate an XMB file
 * from messages declared in JS source code, including calls to this function.
 *
 * The message element produced for a call to this function will contain a
 * `<ph>` (placeholder) element for each ICU placeholder found in the template
 * string.
 *
 * e.g.
 *
 * ```javascript
 * const MSG_HI = declareIcuTemplate(
 *     'Hi, {START_BOLD}{NAME}{END_BOLD}!',
 *     {
 *       description: 'Say "Hi" to the user.',
 *       example: {
 *         'NAME': 'Jane'
 *       },
 *       original_code: {
 *         // Shown to make clear how it appears in the XMB file.
 *         // Hand-written JS code should not use this.
 *         'NAME': 'user.getName()'
 *       }
 *     });
 * ```
 *
 * May generate an XMB element like this:
 *
 * ```xml
 * <msg
 *     id='3346156045081344548'
 *     name='MSG_HI'
 *     desc='Say "Hi" to the user.'
 *     >Hi, {START_BOLD}<ph
 * name="NAME"><ex>Jane</ex>user.getName()</ph>{END_BOLD}!</msg>
 * ```
 *
 * IMPORTANT: The options argument and the values it contains must all be
 * literal values. The message extraction tool is not able to evaluate
 * expressions or look up variable values.
 *
 * Note that in the example above there are ICU placeholders that are not
 * converted into `<ph>` placeholder elements in the XMB file. When no example
 * or original code text is given, there is no need to create such elements.
 * When only one of these two values is given, the other will default to "-"
 * for historical reasons.
 *
 *
 * The "original_code" option is intended for use when automatically generating
 * JS code from some other source, such as an Angular template, where it is
 * difficult or impossible for the human author to specify a meaningful
 * placeholder name. Hand-written JS code should just use a meaningful
 * placeholder name instead.
 *
 * The 'original_code' text and the 'example' text are shown to human
 * translators to give them more context about the meaning of the message.
 * They are not used in any other way by closure-compiler or closure-library.
 *
 * @param {string} templateString
 * @param {!IcuTemplateOptions} options
 * @return {string}
 */
function declareIcuTemplate(templateString, options) {
  // The options are only really used by the compiler when extracting messages
  // into an XMB file for translation. However, we'll check for errors now,
  // in order to help the developer discover they've made a mistake ASAP.
  // Compilation will completely replace calls to this method with static
  // strings, so the cost of these checks will only be paid during testing
  // and development.
  assertDeclareIcuTemplateParametersAreValid(templateString, options);
  return templateString;
}

/**
 * Properties that are valid to include in the options bag argument to
 * `declareIcuTemplate()`.
 *
 * @type {!Set<string>}
 */
const VALID_OPTIONS =
    new Set(['description', 'meaning', 'example', 'original_code']);

/**
 * Throw an exception if the parameters are not valid for a `declareIcuTemplate`
 * function call.
 *
 * @param {string} templateString
 * @param {!IcuTemplateOptions} options
 */
function assertDeclareIcuTemplateParametersAreValid(templateString, options) {
  // This check exists to alert developers to possible problems with their
  // `declareIcuTemplate()` message calls during uncompiled execution.
  // During compilation closure-compiler will perform these same checks and
  // replace all calls to `declareIcuTemplate()` with string literals.
  if (COMPILED) return;

  assertNoClosureStylePlaceholdersInIcuTemplate(templateString);
  const icuPlaceholderNames = gatherIcuPlaceholderNames(templateString);

  const description = options.description;
  assert(description, 'no description supplied');
  assert(
      typeof description == 'string', 'invalid description: "%s"', description);

  const meaning = options.meaning;
  assert(
      !meaning || typeof meaning == 'string', 'invalid meaning: "%s"', meaning);

  const exampleMap = options.example;
  if (exampleMap) {
    assert(
        typeof exampleMap == 'object', 'invalid example map: "%s"', exampleMap);
    assertValidPlaceholderMap('example', exampleMap, icuPlaceholderNames);
  }

  const originalCodeMap = options.original_code;
  if (originalCodeMap) {
    assert(
        typeof originalCodeMap == 'object', 'invalid original_code map: "%s"',
        originalCodeMap);
    assertValidPlaceholderMap(
        'original_code', originalCodeMap, icuPlaceholderNames);
  }

  for (const propName of Object.keys(options)) {
    assert(VALID_OPTIONS.has(propName), 'unknown option name: "%s"', propName);
  }
}

/**
 * Throw an exception if the parameters are not valid for a `declareIcuTemplate`
 * function call.
 *
 * @param {string} mapName 'example' or 'original_code'
 * @param {!Object<string>} placeholderMap Map from placeholder names to string
 *     values
 * @param {!Set<string>} allPlaceholderNames All known placeholder names
 */
function assertValidPlaceholderMap(
    mapName, placeholderMap, allPlaceholderNames) {
  for (const placeholderName of Object.keys(placeholderMap)) {
    assert(
        allPlaceholderNames.has(placeholderName),
        '%s: unknown placeholder: "%s"', mapName, placeholderName);
    const placeholderValue = placeholderMap[placeholderName];
    assert(
        typeof placeholderValue == 'string', 'invalid %s value for %s: "%s"',
        mapName, placeholderName, placeholderValue);
  }
}


/** Matches a single closure-style placeholder. */
const CLOSURE_PLACEHOLDER_RE = /\{\$([^}]+)}/;

/**
 * @param {string} icuTemplate
 * @throws an AssertionError if the string contains closure-style placeholders
 *   (`'{$name} is a closure-style placeholder'`)
 */
function assertNoClosureStylePlaceholdersInIcuTemplate(icuTemplate) {
  const match = CLOSURE_PLACEHOLDER_RE.exec(icuTemplate);
  assert(
      match == null,
      'closure-style placeholder: "%s" found in ICU template: "%s"',
      match && match[0], icuTemplate);
}

/**
 * Matches globally for ICU-style placeholder names.
 *
 * Capturing group #1 contains the the placeholder name for each match.
 */
const ICU_PLACEHOLDER_GLOBAL_RE = /\{([a-z_]\w*)}/ig;

/**
 * @param {string} icuTemplate
 * @return {!Set<string>} contains placeholder names found in icuTemplate
 */
function gatherIcuPlaceholderNames(icuTemplate) {
  const resultSet = new Set();
  let match = null;

  while (match = ICU_PLACEHOLDER_GLOBAL_RE.exec(icuTemplate)) {
    resultSet.add(match[1]);
  }
  return resultSet;
}

// TODO(bradfordcsmith): Add another method to this module that will serve to
//     replace goog.getMsg(), so we can drop that method from base.js.
exports = {
  declareIcuTemplate,
  IcuTemplateOptions
};
