import type { DateTimeRecognizer } from "../../DateTime";
import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { AcronymStyleOptions } from "../../support/Acronyms";
import { TargetLanguage } from "../../TargetLanguage";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
import { SwiftRenderer } from "./SwiftRenderer";
export declare const swiftOptions: {
    justTypes: BooleanOption<"just-types">;
    convenienceInitializers: BooleanOption<"initializers">;
    explicitCodingKeys: BooleanOption<"coding-keys">;
    codingKeysProtocol: StringOption<"coding-keys-protocol">;
    alamofire: BooleanOption<"alamofire">;
    namedTypePrefix: StringOption<"type-prefix">;
    useClasses: EnumOption<"struct-or-class", {
        readonly struct: false;
        readonly class: true;
    }, "class" | "struct">;
    mutableProperties: BooleanOption<"mutable-properties">;
    acronymStyle: EnumOption<"acronym-style", {
        readonly original: AcronymStyleOptions.Original;
        readonly pascal: AcronymStyleOptions.Pascal;
        readonly camel: AcronymStyleOptions.Camel;
        readonly lowerCase: AcronymStyleOptions.Lower;
    }, AcronymStyleOptions>;
    dense: EnumOption<"density", {
        readonly dense: true;
        readonly normal: false;
    }, "normal" | "dense">;
    linux: BooleanOption<"support-linux">;
    objcSupport: BooleanOption<"objective-c-support">;
    optionalEnums: BooleanOption<"optional-enums">;
    swift5Support: BooleanOption<"swift-5-support">;
    sendable: BooleanOption<"sendable">;
    multiFileOutput: BooleanOption<"multi-file-output">;
    accessLevel: EnumOption<"access-level", {
        readonly internal: "internal";
        readonly public: "public";
    }, "internal" | "public">;
    protocol: EnumOption<"protocol", {
        readonly none: {
            readonly equatable: false;
            readonly hashable: false;
        };
        readonly equatable: {
            readonly equatable: true;
            readonly hashable: false;
        };
        readonly hashable: {
            readonly equatable: false;
            readonly hashable: true;
        };
    }, "none" | "equatable" | "hashable">;
};
export declare const swiftLanguageConfig: {
    readonly displayName: "Swift";
    readonly names: readonly ["swift", "swift4"];
    readonly extension: "swift";
};
export declare class SwiftTargetLanguage extends TargetLanguage<typeof swiftLanguageConfig> {
    constructor();
    getOptions(): typeof swiftOptions;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    protected makeRenderer<Lang extends LanguageName = "swift">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): SwiftRenderer;
    get dateTimeRecognizer(): DateTimeRecognizer;
}
