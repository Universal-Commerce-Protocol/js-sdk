import type { ConvenienceRenderer } from "../../ConvenienceRenderer";
import type { RenderContext } from "../../Renderer";
import { BooleanOption, EnumOption, StringOption } from "../../RendererOptions";
import { TargetLanguage } from "../../TargetLanguage";
import type { Type } from "../../Type";
import type { StringTypeMapping } from "../../Type/TypeBuilderUtils";
import type { LanguageName, RendererOptions } from "../../types";
export interface OutputFeatures {
    attributes: boolean;
    helpers: boolean;
}
export type CSharpTypeForAny = "object" | "dynamic";
export declare const cSharpOptions: {
    readonly framework: EnumOption<"framework", {
        readonly NewtonSoft: "NewtonSoft";
        readonly SystemTextJson: "SystemTextJson";
    }, "NewtonSoft" | "SystemTextJson">;
    readonly useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    readonly dense: EnumOption<"density", {
        readonly normal: false;
        readonly dense: true;
    }, "normal" | "dense">;
    readonly namespace: StringOption<"namespace">;
    readonly version: EnumOption<"csharp-version", {
        readonly "5": 5;
        readonly "6": 6;
    }, "5" | "6">;
    readonly virtual: BooleanOption<"virtual">;
    readonly typeForAny: EnumOption<"any-type", {
        readonly object: "object";
        readonly dynamic: "dynamic";
    }, "object" | "dynamic">;
    readonly useDecimal: EnumOption<"number-type", {
        readonly double: false;
        readonly decimal: true;
    }, "decimal" | "double">;
    readonly features: EnumOption<"features", {
        readonly complete: {
            readonly namespaces: true;
            readonly helpers: true;
            readonly attributes: true;
        };
        readonly "attributes-only": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: true;
        };
        readonly "just-types-and-namespace": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
        readonly "just-types": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
    }, "complete" | "just-types" | "attributes-only" | "just-types-and-namespace">;
    readonly baseclass: EnumOption<"base-class", {
        readonly EntityData: "EntityData";
        readonly Object: undefined;
    }, "EntityData" | "Object">;
    readonly checkRequired: BooleanOption<"check-required">;
    readonly keepPropertyName: BooleanOption<"keep-property-name">;
};
export declare const newtonsoftCSharpOptions: {
    readonly framework: EnumOption<"framework", {
        readonly NewtonSoft: "NewtonSoft";
        readonly SystemTextJson: "SystemTextJson";
    }, "NewtonSoft" | "SystemTextJson">;
    readonly useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    readonly dense: EnumOption<"density", {
        readonly normal: false;
        readonly dense: true;
    }, "normal" | "dense">;
    readonly namespace: StringOption<"namespace">;
    readonly version: EnumOption<"csharp-version", {
        readonly "5": 5;
        readonly "6": 6;
    }, "5" | "6">;
    readonly virtual: BooleanOption<"virtual">;
    readonly typeForAny: EnumOption<"any-type", {
        readonly object: "object";
        readonly dynamic: "dynamic";
    }, "object" | "dynamic">;
    readonly useDecimal: EnumOption<"number-type", {
        readonly double: false;
        readonly decimal: true;
    }, "decimal" | "double">;
    readonly features: EnumOption<"features", {
        readonly complete: {
            readonly namespaces: true;
            readonly helpers: true;
            readonly attributes: true;
        };
        readonly "attributes-only": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: true;
        };
        readonly "just-types-and-namespace": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
        readonly "just-types": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
    }, "complete" | "just-types" | "attributes-only" | "just-types-and-namespace">;
    readonly baseclass: EnumOption<"base-class", {
        readonly EntityData: "EntityData";
        readonly Object: undefined;
    }, "EntityData" | "Object">;
    readonly checkRequired: BooleanOption<"check-required">;
    readonly keepPropertyName: BooleanOption<"keep-property-name">;
};
export declare const systemTextJsonCSharpOptions: {
    readonly framework: EnumOption<"framework", {
        readonly NewtonSoft: "NewtonSoft";
        readonly SystemTextJson: "SystemTextJson";
    }, "NewtonSoft" | "SystemTextJson">;
    readonly useList: EnumOption<"array-type", {
        readonly array: false;
        readonly list: true;
    }, "array" | "list">;
    readonly dense: EnumOption<"density", {
        readonly normal: false;
        readonly dense: true;
    }, "normal" | "dense">;
    readonly namespace: StringOption<"namespace">;
    readonly version: EnumOption<"csharp-version", {
        readonly "5": 5;
        readonly "6": 6;
    }, "5" | "6">;
    readonly virtual: BooleanOption<"virtual">;
    readonly typeForAny: EnumOption<"any-type", {
        readonly object: "object";
        readonly dynamic: "dynamic";
    }, "object" | "dynamic">;
    readonly useDecimal: EnumOption<"number-type", {
        readonly double: false;
        readonly decimal: true;
    }, "decimal" | "double">;
    readonly features: EnumOption<"features", {
        readonly complete: {
            readonly namespaces: true;
            readonly helpers: true;
            readonly attributes: true;
        };
        readonly "attributes-only": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: true;
        };
        readonly "just-types-and-namespace": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
        readonly "just-types": {
            readonly namespaces: true;
            readonly helpers: false;
            readonly attributes: false;
        };
    }, "complete" | "just-types" | "attributes-only" | "just-types-and-namespace">;
    readonly baseclass: EnumOption<"base-class", {
        readonly EntityData: "EntityData";
        readonly Object: undefined;
    }, "EntityData" | "Object">;
    readonly checkRequired: BooleanOption<"check-required">;
    readonly keepPropertyName: BooleanOption<"keep-property-name">;
};
export declare const cSharpLanguageConfig: {
    readonly displayName: "C#";
    readonly names: readonly ["cs", "csharp"];
    readonly extension: "cs";
};
export declare class CSharpTargetLanguage extends TargetLanguage<typeof cSharpLanguageConfig> {
    constructor();
    getOptions(): typeof cSharpOptions;
    get stringTypeMapping(): StringTypeMapping;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get supportsOptionalClassProperties(): boolean;
    needsTransformerForType(t: Type): boolean;
    protected makeRenderer<Lang extends LanguageName = "csharp">(renderContext: RenderContext, untypedOptionValues: RendererOptions<Lang>): ConvenienceRenderer;
}
