"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONSchemaTargetLanguage = exports.JSONSchemaLanguageConfig = void 0;
const TargetLanguage_1 = require("../../TargetLanguage");
const TypeBuilderUtils_1 = require("../../Type/TypeBuilderUtils");
const JSONSchemaRenderer_1 = require("./JSONSchemaRenderer");
exports.JSONSchemaLanguageConfig = {
    displayName: "JSON Schema",
    names: ["schema", "json-schema"],
    extension: "schema",
};
class JSONSchemaTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.JSONSchemaLanguageConfig);
    }
    getOptions() {
        return {};
    }
    get stringTypeMapping() {
        return (0, TypeBuilderUtils_1.getNoStringTypeMapping)();
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsFullObjectType() {
        return true;
    }
    makeRenderer(renderContext, _untypedOptionValues) {
        return new JSONSchemaRenderer_1.JSONSchemaRenderer(this, renderContext);
    }
}
exports.JSONSchemaTargetLanguage = JSONSchemaTargetLanguage;
