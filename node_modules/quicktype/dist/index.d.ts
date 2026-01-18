#!/usr/bin/env node
import type { Readable } from "readable-stream";
import { JSONInput, type LanguageName, type Options, type RendererOptions, type SerializedRenderResult, type TargetLanguage } from "quicktype-core";
export interface CLIOptions<Lang extends LanguageName = LanguageName> {
    [option: string]: any;
    additionalSchema: string[];
    allPropertiesOptional: boolean;
    alphabetizeProperties: boolean;
    buildMarkovChain?: string;
    debug?: string;
    graphqlIntrospect?: string;
    graphqlSchema?: string;
    help: boolean;
    httpHeader?: string[];
    httpMethod?: string;
    lang: Lang;
    noRender: boolean;
    out?: string;
    quiet: boolean;
    rendererOptions: RendererOptions<Lang>;
    src: string[];
    srcLang: string;
    srcUrls?: string;
    telemetry?: string;
    topLevel: string;
    version: boolean;
}
export declare function parseCLIOptions(argv: string[], targetLanguage?: TargetLanguage): CLIOptions;
export declare function jsonInputForTargetLanguage(targetLanguage: string | TargetLanguage, languages?: TargetLanguage[], handleJSONRefs?: boolean): JSONInput<Readable>;
export declare function makeQuicktypeOptions(options: CLIOptions, targetLanguages?: TargetLanguage[]): Promise<Partial<Options> | undefined>;
export declare function writeOutput(cliOptions: CLIOptions, resultsByFilename: ReadonlyMap<string, SerializedRenderResult>): void;
export declare function main(args: string[] | Partial<CLIOptions>): Promise<void>;
