import { EnumOption } from "../RendererOptions";
import { allLowerWordStyle, allUpperWordStyle, firstUpperWordStyle, originalWord } from "./Strings";
export declare enum AcronymStyleOptions {
    Camel = "camel",
    Lower = "lowerCase",
    Original = "original",
    Pascal = "pascal"
}
export declare const acronymOption: (defaultOption: AcronymStyleOptions) => EnumOption<"acronym-style", {
    readonly original: AcronymStyleOptions.Original;
    readonly pascal: AcronymStyleOptions.Pascal;
    readonly camel: AcronymStyleOptions.Camel;
    readonly lowerCase: AcronymStyleOptions.Lower;
}, AcronymStyleOptions>;
declare const options: {
    readonly pascal: typeof allUpperWordStyle;
    readonly camel: typeof firstUpperWordStyle;
    readonly original: typeof originalWord;
    readonly lowerCase: typeof allLowerWordStyle;
};
export declare function acronymStyle<AcronymStyle extends AcronymStyleOptions>(style: AcronymStyle): (typeof options)[AcronymStyle];
export {};
