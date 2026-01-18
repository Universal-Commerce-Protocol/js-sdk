import { EnumOption } from "../RendererOptions";
export declare enum ConvertersOptions {
    AllObjects = "all-objects",
    TopLevel = "top-level"
}
export declare function convertersOption(): EnumOption<"converters", {
    readonly "top-level": ConvertersOptions.TopLevel;
    readonly "all-objects": ConvertersOptions.AllObjects;
}, ConvertersOptions>;
