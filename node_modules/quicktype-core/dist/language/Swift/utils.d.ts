import { DefaultDateTimeRecognizer } from "../../DateTime";
import type { Name } from "../../Naming";
import type { ForEachPosition } from "../../Renderer";
import type { ClassProperty } from "../../Type";
export declare const MAX_SAMELINE_PROPERTIES = 4;
export declare class SwiftDateTimeRecognizer extends DefaultDateTimeRecognizer {
    isDateTime(str: string): boolean;
}
export interface SwiftProperty {
    jsonName: string;
    name: Name;
    parameter: ClassProperty;
    position: ForEachPosition;
}
export declare function swiftNameStyle(prefix: string, isUpper: boolean, original: string, acronymsStyle?: (s: string) => string): string;
export declare const stringEscape: (s: string) => string;
