"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhpTargetLanguage = exports.phpLanguageConfig = exports.phpOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const TargetLanguage_1 = require("../../TargetLanguage");
const PhpRenderer_1 = require("./PhpRenderer");
exports.phpOptions = {
    withGet: new RendererOptions_1.BooleanOption("with-get", "Create Getter", true),
    fastGet: new RendererOptions_1.BooleanOption("fast-get", "getter without validation", false),
    withSet: new RendererOptions_1.BooleanOption("with-set", "Create Setter", false),
    withClosing: new RendererOptions_1.BooleanOption("with-closing", "PHP Closing Tag", false),
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
};
exports.phpLanguageConfig = {
    displayName: "PHP",
    names: ["php"],
    extension: "php",
};
class PhpTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.phpLanguageConfig);
    }
    getOptions() {
        return exports.phpOptions;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        const options = (0, RendererOptions_1.getOptionValues)(exports.phpOptions, untypedOptionValues);
        return new PhpRenderer_1.PhpRenderer(this, renderContext, options);
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date", "date"); // TODO is not implemented yet
        mapping.set("time", "time"); // TODO is not implemented yet
        mapping.set("uuid", "uuid"); // TODO is not implemented yet
        mapping.set("date-time", "date-time");
        return mapping;
    }
}
exports.PhpTargetLanguage = PhpTargetLanguage;
