export declare enum Density {
    Normal = "Normal",
    Dense = "Dense"
}
export declare enum Visibility {
    Private = "Private",
    Crate = "Crate",
    Public = "Public"
}
export declare const namingStyles: {
    readonly snake_case: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly SCREAMING_SNAKE_CASE: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly camelCase: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly PascalCase: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly "kebab-case": {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly "SCREAMING-KEBAB-CASE": {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly lowercase: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
    readonly UPPERCASE: {
        readonly regex: RegExp;
        readonly toParts: (name: string) => string[];
        readonly fromParts: (parts: string[]) => string;
    };
};
export type NamingStyleKey = keyof typeof namingStyles;
export declare const snakeNamingFunction: import("../../Naming").Namer;
export declare const camelNamingFunction: import("../../Naming").Namer;
export declare const rustStringEscape: (s: string) => string;
export declare function getPreferredNamingStyle(namingStyleOccurences: string[], defaultStyle: NamingStyleKey): NamingStyleKey;
export declare function listMatchingNamingStyles(name: string): NamingStyleKey[];
export declare function nameWithNamingStyle(name: string, style: NamingStyleKey): string;
