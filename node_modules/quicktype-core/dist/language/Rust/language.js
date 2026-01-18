"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustTargetLanguage = exports.rustLanguageConfig = exports.rustOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const TargetLanguage_1 = require("../../TargetLanguage");
const RustRenderer_1 = require("./RustRenderer");
const utils_1 = require("./utils");
exports.rustOptions = {
    density: new RendererOptions_1.EnumOption("density", "Density", {
        normal: utils_1.Density.Normal,
        dense: utils_1.Density.Dense,
    }, "normal"),
    visibility: new RendererOptions_1.EnumOption("visibility", "Field visibility", {
        private: utils_1.Visibility.Private,
        crate: utils_1.Visibility.Crate,
        public: utils_1.Visibility.Public,
    }, "private"),
    deriveDebug: new RendererOptions_1.BooleanOption("derive-debug", "Derive Debug impl", false),
    deriveClone: new RendererOptions_1.BooleanOption("derive-clone", "Derive Clone impl", false),
    derivePartialEq: new RendererOptions_1.BooleanOption("derive-partial-eq", "Derive PartialEq impl", false),
    skipSerializingNone: new RendererOptions_1.BooleanOption("skip-serializing-none", "Skip serializing empty Option fields", false),
    edition2018: new RendererOptions_1.BooleanOption("edition-2018", "Edition 2018", true),
    leadingComments: new RendererOptions_1.BooleanOption("leading-comments", "Leading Comments", true),
};
exports.rustLanguageConfig = {
    displayName: "Rust",
    names: ["rust", "rs", "rustlang"],
    extension: "rs",
};
class RustTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.rustLanguageConfig);
    }
    getOptions() {
        return exports.rustOptions;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new RustRenderer_1.RustRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.rustOptions, untypedOptionValues));
    }
}
exports.RustTargetLanguage = RustTargetLanguage;
