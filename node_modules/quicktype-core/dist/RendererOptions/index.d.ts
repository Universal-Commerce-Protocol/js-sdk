import type { LanguageName, RendererOptions } from "../types";
import type { OptionDefinition, OptionKind, OptionValues } from "./types";
export * from "./types";
/**
 * The superclass for target language options.  You probably want to use one of its
 * subclasses, `BooleanOption`, `EnumOption`, or `StringOption`.
 */
export declare abstract class Option<Name extends string, T> {
    readonly definition: OptionDefinition<Name, T>;
    constructor(definition: OptionDefinition<Name, T>);
    get name(): Name;
    getValue(values: Record<string, unknown>): T;
    get cliDefinitions(): {
        actual: Array<OptionDefinition<Name, T>>;
        display: Array<OptionDefinition<Name, T>>;
    };
}
export declare function getOptionValues<const Options extends Record<string, Option<string, unknown>>, Lang extends LanguageName>(options: Options, untypedOptionValues: RendererOptions<Lang>): OptionValues<Options>;
/**
 * A target language option that allows setting a boolean flag.
 */
export declare class BooleanOption<Name extends string> extends Option<Name, boolean> {
    /**
     * @param name The shorthand name.
     * @param description Short-ish description of the option.
     * @param defaultValue The default value.
     * @param kind Whether it's a primary or secondary option.
     */
    constructor(name: Name, description: string, defaultValue: boolean, kind?: OptionKind);
    get cliDefinitions(): {
        actual: Array<OptionDefinition<Name, boolean>>;
        display: Array<OptionDefinition<Name, boolean>>;
    };
    getValue(values: Record<string, unknown>): boolean;
}
export declare class StringOption<Name extends string> extends Option<Name, string> {
    constructor(name: Name, description: string, typeLabel: string, defaultValue: string, kind?: OptionKind);
}
export declare class EnumOption<Name extends string, const EnumMap extends Record<string, unknown>, EnumKey extends Extract<keyof EnumMap, string> = Extract<keyof EnumMap, string>> extends Option<Name, EnumKey> {
    private readonly _values;
    constructor(name: Name, description: string, values: EnumMap, defaultValue: NoInfer<EnumKey>, kind?: OptionKind);
    getEnumValue<const Key extends EnumKey>(name: Key): EnumMap[Key];
}
