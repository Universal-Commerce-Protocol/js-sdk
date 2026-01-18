"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwiftTargetLanguage = exports.swiftLanguageConfig = exports.swiftOptions = void 0;
const RendererOptions_1 = require("../../RendererOptions");
const Acronyms_1 = require("../../support/Acronyms");
const TargetLanguage_1 = require("../../TargetLanguage");
const SwiftRenderer_1 = require("./SwiftRenderer");
const utils_1 = require("./utils");
exports.swiftOptions = {
    justTypes: new RendererOptions_1.BooleanOption("just-types", "Plain types only", false),
    convenienceInitializers: new RendererOptions_1.BooleanOption("initializers", "Generate initializers and mutators", true),
    explicitCodingKeys: new RendererOptions_1.BooleanOption("coding-keys", "Explicit CodingKey values in Codable types", true),
    codingKeysProtocol: new RendererOptions_1.StringOption("coding-keys-protocol", "CodingKeys implements protocols", "protocol1, protocol2...", "", "secondary"),
    alamofire: new RendererOptions_1.BooleanOption("alamofire", "Alamofire extensions", false),
    namedTypePrefix: new RendererOptions_1.StringOption("type-prefix", "Prefix for type names", "PREFIX", "", "secondary"),
    useClasses: new RendererOptions_1.EnumOption("struct-or-class", "Structs or classes", {
        struct: false,
        class: true,
    }, "struct"),
    mutableProperties: new RendererOptions_1.BooleanOption("mutable-properties", "Use var instead of let for object properties", false),
    acronymStyle: (0, Acronyms_1.acronymOption)(Acronyms_1.AcronymStyleOptions.Pascal),
    dense: new RendererOptions_1.EnumOption("density", "Code density", {
        dense: true,
        normal: false,
    }, "dense", "secondary"),
    linux: new RendererOptions_1.BooleanOption("support-linux", "Support Linux", false, "secondary"),
    objcSupport: new RendererOptions_1.BooleanOption("objective-c-support", "Objects inherit from NSObject and @objcMembers is added to classes", false),
    optionalEnums: new RendererOptions_1.BooleanOption("optional-enums", "If no matching case is found enum value is set to null", false),
    swift5Support: new RendererOptions_1.BooleanOption("swift-5-support", "Renders output in a Swift 5 compatible mode", false),
    sendable: new RendererOptions_1.BooleanOption("sendable", "Mark generated models as Sendable", false),
    multiFileOutput: new RendererOptions_1.BooleanOption("multi-file-output", "Renders each top-level object in its own Swift file", false),
    accessLevel: new RendererOptions_1.EnumOption("access-level", "Access level", {
        internal: "internal",
        public: "public",
    }, "internal", "secondary"),
    protocol: new RendererOptions_1.EnumOption("protocol", "Make types implement protocol", {
        none: { equatable: false, hashable: false },
        equatable: { equatable: true, hashable: false },
        hashable: { equatable: false, hashable: true },
    }, "none", "secondary"),
};
exports.swiftLanguageConfig = {
    displayName: "Swift",
    names: ["swift", "swift4"],
    extension: "swift",
};
class SwiftTargetLanguage extends TargetLanguage_1.TargetLanguage {
    constructor() {
        super(exports.swiftLanguageConfig);
    }
    getOptions() {
        return exports.swiftOptions;
    }
    get stringTypeMapping() {
        const mapping = new Map();
        mapping.set("date-time", "date-time");
        return mapping;
    }
    get supportsOptionalClassProperties() {
        return true;
    }
    get supportsUnionsWithBothNumberTypes() {
        return true;
    }
    makeRenderer(renderContext, untypedOptionValues) {
        return new SwiftRenderer_1.SwiftRenderer(this, renderContext, (0, RendererOptions_1.getOptionValues)(exports.swiftOptions, untypedOptionValues));
    }
    get dateTimeRecognizer() {
        return new utils_1.SwiftDateTimeRecognizer();
    }
}
exports.SwiftTargetLanguage = SwiftTargetLanguage;
