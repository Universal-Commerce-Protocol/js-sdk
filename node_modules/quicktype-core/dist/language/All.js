"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = void 0;
exports.languageNamed = languageNamed;
exports.isLanguageName = isLanguageName;
exports.isLanguageDisplayName = isLanguageDisplayName;
const CJSON_1 = require("./CJSON");
const CPlusPlus_1 = require("./CPlusPlus");
const Crystal_1 = require("./Crystal");
const CSharp_1 = require("./CSharp");
const Dart_1 = require("./Dart");
const Elixir_1 = require("./Elixir");
const Elm_1 = require("./Elm");
const Golang_1 = require("./Golang");
const Haskell_1 = require("./Haskell");
const Java_1 = require("./Java");
const JavaScript_1 = require("./JavaScript");
const JavaScriptPropTypes_1 = require("./JavaScriptPropTypes");
const JSONSchema_1 = require("./JSONSchema");
const Kotlin_1 = require("./Kotlin");
const Objective_C_1 = require("./Objective-C");
const Php_1 = require("./Php");
const Pike_1 = require("./Pike");
const Python_1 = require("./Python");
const Ruby_1 = require("./Ruby");
const Rust_1 = require("./Rust");
const Scala3_1 = require("./Scala3");
const Smithy4s_1 = require("./Smithy4s");
const Swift_1 = require("./Swift");
const TypeScriptEffectSchema_1 = require("./TypeScriptEffectSchema");
const TypeScriptFlow_1 = require("./TypeScriptFlow");
const TypeScriptZod_1 = require("./TypeScriptZod");
exports.all = [
    new CJSON_1.CJSONTargetLanguage(),
    new CPlusPlus_1.CPlusPlusTargetLanguage(),
    new Crystal_1.CrystalTargetLanguage(),
    new CSharp_1.CSharpTargetLanguage(),
    new Dart_1.DartTargetLanguage(),
    new Elixir_1.ElixirTargetLanguage(),
    new Elm_1.ElmTargetLanguage(),
    new TypeScriptFlow_1.FlowTargetLanguage(),
    new Golang_1.GoTargetLanguage(),
    new Haskell_1.HaskellTargetLanguage(),
    new Java_1.JavaTargetLanguage(),
    new JavaScript_1.JavaScriptTargetLanguage(),
    new JavaScriptPropTypes_1.JavaScriptPropTypesTargetLanguage(),
    new JSONSchema_1.JSONSchemaTargetLanguage(),
    new Kotlin_1.KotlinTargetLanguage(),
    new Objective_C_1.ObjectiveCTargetLanguage(),
    new Php_1.PhpTargetLanguage(),
    new Pike_1.PikeTargetLanguage(),
    new Python_1.PythonTargetLanguage(),
    new Ruby_1.RubyTargetLanguage(),
    new Rust_1.RustTargetLanguage(),
    new Scala3_1.Scala3TargetLanguage(),
    new Smithy4s_1.SmithyTargetLanguage(),
    new Swift_1.SwiftTargetLanguage(),
    new TypeScriptFlow_1.TypeScriptTargetLanguage(),
    new TypeScriptEffectSchema_1.TypeScriptEffectSchemaTargetLanguage(),
    new TypeScriptZod_1.TypeScriptZodTargetLanguage(),
];
exports.all;
function languageNamed(name, targetLanguages = exports.all) {
    const foundLanguage = targetLanguages.find((language) => language.names.includes(name));
    if (!foundLanguage) {
        throw new Error(`Unknown language name: ${name}`);
    }
    return foundLanguage;
}
function isLanguageName(maybeName) {
    if (exports.all.some((lang) => lang.names.includes(maybeName))) {
        return true;
    }
    return false;
}
function isLanguageDisplayName(maybeName) {
    if (exports.all.some((lang) => lang.displayName === maybeName)) {
        return true;
    }
    return false;
}
