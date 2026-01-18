/**
 * Check if given parameter name should be wrapped in a backtick
 * @param paramName
 */
export declare const shouldAddBacktick: (paramName: string) => boolean;
export declare const wrapOption: (s: string, optional: boolean) => string;
export declare function scalaNameStyle(isUpper: boolean, original: string): string;
export declare const upperNamingFunction: import("../../Naming").Namer;
export declare const lowerNamingFunction: import("../../Naming").Namer;
