#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCLIOptions = parseCLIOptions;
exports.jsonInputForTargetLanguage = jsonInputForTargetLanguage;
exports.makeQuicktypeOptions = makeQuicktypeOptions;
exports.writeOutput = writeOutput;
exports.main = main;
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const ts_necessities_1 = require("@glideapps/ts-necessities");
const chalk_1 = __importDefault(require("chalk"));
const collection_utils_1 = require("collection-utils");
const command_line_args_1 = __importDefault(require("command-line-args"));
const command_line_usage_1 = __importDefault(require("command-line-usage"));
const _ = __importStar(require("lodash"));
const string_to_stream_1 = __importDefault(require("string-to-stream"));
const wordwrap_1 = __importDefault(require("wordwrap"));
const quicktype_core_1 = require("quicktype-core");
const quicktype_graphql_input_1 = require("quicktype-graphql-input");
const quicktype_typescript_input_1 = require("quicktype-typescript-input");
const CompressedJSONFromStream_1 = require("./CompressedJSONFromStream");
const GraphQLIntrospection_1 = require("./GraphQLIntrospection");
const URLGrammar_1 = require("./URLGrammar");
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const packageJSON = require("../package.json");
const wordWrap = (0, wordwrap_1.default)(90);
const defaultDefaultTargetLanguageName = "go";
async function sourceFromFileOrUrlArray(name, filesOrUrls, httpHeaders) {
    const samples = await Promise.all(filesOrUrls.map(async (file) => await (0, quicktype_core_1.readableFromFileOrURL)(file, httpHeaders)));
    return { kind: "json", name, samples };
}
function typeNameFromFilename(filename) {
    const name = path.basename(filename);
    return name.substring(0, name.lastIndexOf("."));
}
async function samplesFromDirectory(dataDir, httpHeaders) {
    async function readFilesOrURLsInDirectory(d) {
        const files = fs
            .readdirSync(d)
            .map((x) => path.join(d, x))
            .filter((x) => fs.lstatSync(x).isFile());
        // Each file is a (Name, JSON | URL)
        const sourcesInDir = [];
        const graphQLSources = [];
        let graphQLSchema = undefined;
        let graphQLSchemaFileName = undefined;
        for (let file of files) {
            const name = typeNameFromFilename(file);
            let fileOrUrl = file;
            file = file.toLowerCase();
            // If file is a URL string, download it
            if (file.endsWith(".url")) {
                fileOrUrl = fs.readFileSync(file, "utf8").trim();
            }
            if (file.endsWith(".url") || file.endsWith(".json")) {
                sourcesInDir.push({
                    kind: "json",
                    name,
                    samples: [
                        await (0, quicktype_core_1.readableFromFileOrURL)(fileOrUrl, httpHeaders),
                    ],
                });
            }
            else if (file.endsWith(".schema")) {
                sourcesInDir.push({
                    kind: "schema",
                    name,
                    uris: [fileOrUrl],
                });
            }
            else if (file.endsWith(".gqlschema")) {
                (0, quicktype_core_1.messageAssert)(graphQLSchema === undefined, "DriverMoreThanOneGraphQLSchemaInDir", {
                    dir: dataDir,
                });
                graphQLSchema = await (0, quicktype_core_1.readableFromFileOrURL)(fileOrUrl, httpHeaders);
                graphQLSchemaFileName = fileOrUrl;
            }
            else if (file.endsWith(".graphql")) {
                graphQLSources.push({
                    kind: "graphql",
                    name,
                    schema: undefined,
                    query: await (0, quicktype_core_1.getStream)(await (0, quicktype_core_1.readableFromFileOrURL)(fileOrUrl, httpHeaders)),
                });
            }
        }
        if (graphQLSources.length > 0) {
            if (graphQLSchema === undefined) {
                return (0, quicktype_core_1.messageError)("DriverNoGraphQLSchemaInDir", {
                    dir: dataDir,
                });
            }
            const schema = (0, quicktype_core_1.parseJSON)(await (0, quicktype_core_1.getStream)(graphQLSchema), "GraphQL schema", graphQLSchemaFileName);
            for (const source of graphQLSources) {
                source.schema = schema;
                sourcesInDir.push(source);
            }
        }
        return sourcesInDir;
    }
    const contents = fs.readdirSync(dataDir).map((x) => path.join(dataDir, x));
    const directories = contents.filter((x) => fs.lstatSync(x).isDirectory());
    let sources = await readFilesOrURLsInDirectory(dataDir);
    for (const dir of directories) {
        let jsonSamples = [];
        const schemaSources = [];
        const graphQLSources = [];
        for (const source of await readFilesOrURLsInDirectory(dir)) {
            switch (source.kind) {
                case "json":
                    jsonSamples = jsonSamples.concat(source.samples);
                    break;
                case "schema":
                    schemaSources.push(source);
                    break;
                case "graphql":
                    graphQLSources.push(source);
                    break;
                default:
                    return (0, quicktype_core_1.assertNever)(source);
            }
        }
        if (jsonSamples.length > 0 &&
            schemaSources.length + graphQLSources.length > 0) {
            return (0, quicktype_core_1.messageError)("DriverCannotMixJSONWithOtherSamples", {
                dir: dir,
            });
        }
        // FIXME: rewrite this to be clearer
        const oneUnlessEmpty = (xs) => Math.sign(xs.length);
        if (oneUnlessEmpty(schemaSources) + oneUnlessEmpty(graphQLSources) >
            1) {
            return (0, quicktype_core_1.messageError)("DriverCannotMixNonJSONInputs", { dir: dir });
        }
        if (jsonSamples.length > 0) {
            sources.push({
                kind: "json",
                name: path.basename(dir),
                samples: jsonSamples,
            });
        }
        sources = sources.concat(schemaSources);
        sources = sources.concat(graphQLSources);
    }
    return sources;
}
function inferLang(options, defaultLanguage) {
    // Output file extension determines the language if language is undefined
    if (options.out !== undefined) {
        const extension = path.extname(options.out);
        if (extension === "") {
            return (0, quicktype_core_1.messageError)("DriverNoLanguageOrExtension", {});
        }
        return extension.slice(1);
    }
    return defaultLanguage;
}
function inferTopLevel(options) {
    // Output file name determines the top-level if undefined
    if (options.out !== undefined) {
        const extension = path.extname(options.out);
        const without = path.basename(options.out).replace(extension, "");
        return without;
    }
    // Source determines the top-level if undefined
    if (options.src !== undefined && options.src.length === 1) {
        const src = options.src[0];
        const extension = path.extname(src);
        const without = path.basename(src).replace(extension, "");
        return without;
    }
    return "TopLevel";
}
function inferCLIOptions(opts, targetLanguage) {
    let srcLang = opts.srcLang;
    if (opts.graphqlSchema !== undefined ||
        opts.graphqlIntrospect !== undefined) {
        (0, quicktype_core_1.messageAssert)(srcLang === undefined || srcLang === "graphql", "DriverSourceLangMustBeGraphQL", {});
        srcLang = "graphql";
    }
    else if (opts.src !== undefined &&
        opts.src.length > 0 &&
        opts.src.every((file) => _.endsWith(file, ".ts"))) {
        srcLang = "typescript";
    }
    else {
        (0, quicktype_core_1.messageAssert)(srcLang !== "graphql", "DriverGraphQLSchemaNeeded", {});
        srcLang = (0, collection_utils_1.withDefault)(srcLang, "json");
    }
    let language;
    if (targetLanguage !== undefined) {
        language = targetLanguage;
    }
    else {
        const languageName = opts.lang ?? inferLang(opts, defaultDefaultTargetLanguageName);
        if ((0, quicktype_core_1.isLanguageName)(languageName)) {
            language = (0, quicktype_core_1.languageNamed)(languageName);
        }
        else {
            return (0, quicktype_core_1.messageError)("DriverUnknownOutputLanguage", {
                lang: languageName,
            });
        }
    }
    const options = {
        src: opts.src ?? [],
        srcUrls: opts.srcUrls,
        srcLang: srcLang,
        lang: language.name,
        topLevel: opts.topLevel ?? inferTopLevel(opts),
        noRender: !!opts.noRender,
        alphabetizeProperties: !!opts.alphabetizeProperties,
        allPropertiesOptional: !!opts.allPropertiesOptional,
        rendererOptions: opts.rendererOptions ?? {},
        help: opts.help ?? false,
        quiet: opts.quiet ?? false,
        version: opts.version ?? false,
        out: opts.out,
        buildMarkovChain: opts.buildMarkovChain,
        additionalSchema: opts.additionalSchema ?? [],
        graphqlSchema: opts.graphqlSchema,
        graphqlIntrospect: opts.graphqlIntrospect,
        httpMethod: opts.httpMethod,
        httpHeader: opts.httpHeader,
        debug: opts.debug,
        telemetry: opts.telemetry,
    };
    for (const flagName of quicktype_core_1.inferenceFlagNames) {
        const cliName = negatedInferenceFlagName(flagName);
        options[cliName] = !!opts[cliName];
    }
    return options;
}
function makeLangTypeLabel(targetLanguages) {
    (0, quicktype_core_1.assert)(targetLanguages.length > 0, "Must have at least one target language");
    return targetLanguages
        .map((r) => _.minBy(r.names, (s) => s.length))
        .join("|");
}
function negatedInferenceFlagName(name) {
    const prefix = "infer";
    if (name.startsWith(prefix)) {
        name = name.slice(prefix.length);
    }
    return "no" + (0, quicktype_core_1.capitalize)(name);
}
function dashedFromCamelCase(name) {
    return (0, quicktype_core_1.splitIntoWords)(name)
        .map((w) => w.word.toLowerCase())
        .join("-");
}
function makeOptionDefinitions(targetLanguages) {
    const beforeLang = [
        {
            name: "out",
            alias: "o",
            optionType: "string",
            typeLabel: "FILE",
            description: "The output file. Determines --lang and --top-level.",
            kind: "cli",
        },
        {
            name: "top-level",
            alias: "t",
            optionType: "string",
            typeLabel: "NAME",
            description: "The name for the top level type.",
            kind: "cli",
        },
    ];
    const lang = targetLanguages.length < 2
        ? []
        : [
            {
                name: "lang",
                alias: "l",
                optionType: "string",
                typeLabel: "LANG",
                description: "The target language.",
                kind: "cli",
            },
        ];
    const afterLang = [
        {
            name: "src-lang",
            alias: "s",
            optionType: "string",
            defaultValue: undefined,
            typeLabel: "SRC_LANG",
            description: "The source language (default is json).",
            kind: "cli",
        },
        {
            name: "src",
            optionType: "string",
            multiple: true,
            typeLabel: "FILE|URL|DIRECTORY",
            description: "The file, url, or data directory to type.",
            kind: "cli",
            defaultOption: true,
        },
        {
            name: "src-urls",
            optionType: "string",
            typeLabel: "FILE",
            description: "Tracery grammar describing URLs to crawl.",
            kind: "cli",
        },
    ];
    const inference = Array.from((0, collection_utils_1.mapMap)((0, collection_utils_1.mapFromObject)(quicktype_core_1.inferenceFlags), (flag, name) => {
        return {
            name: dashedFromCamelCase(negatedInferenceFlagName(name)),
            optionType: "boolean",
            description: flag.negationDescription + ".",
            kind: "cli",
        };
    }).values());
    const afterInference = [
        {
            name: "graphql-schema",
            optionType: "string",
            typeLabel: "FILE",
            description: "GraphQL introspection file.",
            kind: "cli",
        },
        {
            name: "graphql-introspect",
            optionType: "string",
            typeLabel: "URL",
            description: "Introspect GraphQL schema from a server.",
            kind: "cli",
        },
        {
            name: "http-method",
            optionType: "string",
            typeLabel: "METHOD",
            description: "HTTP method to use for the GraphQL introspection query.",
            kind: "cli",
        },
        {
            name: "http-header",
            optionType: "string",
            multiple: true,
            typeLabel: "HEADER",
            description: "Header(s) to attach to all HTTP requests, including the GraphQL introspection query.",
            kind: "cli",
        },
        {
            name: "additional-schema",
            alias: "S",
            optionType: "string",
            multiple: true,
            typeLabel: "FILE",
            description: "Register the $id's of additional JSON Schema files.",
            kind: "cli",
        },
        {
            name: "no-render",
            optionType: "boolean",
            description: "Don't render output.",
            kind: "cli",
        },
        {
            name: "alphabetize-properties",
            optionType: "boolean",
            description: "Alphabetize order of class properties.",
            kind: "cli",
        },
        {
            name: "all-properties-optional",
            optionType: "boolean",
            description: "Make all class properties optional.",
            kind: "cli",
        },
        {
            name: "build-markov-chain",
            optionType: "string",
            typeLabel: "FILE",
            description: "Markov chain corpus filename.",
            kind: "cli",
        },
        {
            name: "quiet",
            optionType: "boolean",
            description: "Don't show issues in the generated code.",
            kind: "cli",
        },
        {
            name: "debug",
            optionType: "string",
            typeLabel: "OPTIONS or all",
            description: "Comma separated debug options: print-graph, print-reconstitution, print-gather-names, print-transformations, print-schema-resolving, print-times, provenance",
            kind: "cli",
        },
        {
            name: "telemetry",
            optionType: "string",
            typeLabel: "enable|disable",
            description: "Enable anonymous telemetry to help improve quicktype",
            kind: "cli",
        },
        {
            name: "help",
            alias: "h",
            optionType: "boolean",
            description: "Get some help.",
            kind: "cli",
        },
        {
            name: "version",
            alias: "v",
            optionType: "boolean",
            description: "Display the version of quicktype",
            kind: "cli",
        },
    ];
    return beforeLang.concat(lang, afterLang, inference, afterInference);
}
const tableOptionsForOptions = {
    columns: [
        {
            name: "option",
            width: 60,
        },
        {
            name: "description",
            width: 60,
        },
    ],
};
function makeSectionsBeforeRenderers(targetLanguages) {
    const langDisplayNames = targetLanguages
        .map((r) => r.displayName)
        .join(", ");
    return [
        {
            header: "Synopsis",
            content: [
                `$ quicktype [${chalk_1.default.bold("--lang")} LANG] [${chalk_1.default.bold("--src-lang")} SRC_LANG] [${chalk_1.default.bold("--out")} FILE] FILE|URL ...`,
                "",
                `  LANG ... ${makeLangTypeLabel(targetLanguages)}`,
                "",
                "SRC_LANG ... json|schema|graphql|postman|typescript",
            ],
        },
        {
            header: "Description",
            content: `Given JSON sample data, quicktype outputs code for working with that data in ${langDisplayNames}.`,
        },
        {
            header: "Options",
            optionList: makeOptionDefinitions(targetLanguages),
            hide: ["no-render", "build-markov-chain"],
            tableOptions: tableOptionsForOptions,
        },
    ];
}
const sectionsAfterRenderers = [
    {
        header: "Examples",
        content: [
            chalk_1.default.dim("Generate C# to parse a Bitcoin API"),
            "$ quicktype -o LatestBlock.cs https://blockchain.info/latestblock",
            "",
            chalk_1.default.dim("Generate Go code from a directory of samples containing:"),
            chalk_1.default.dim(`  - Foo.json
  + Bar
    - bar-sample-1.json
    - bar-sample-2.json
  - Baz.url`),
            "$ quicktype -l go samples",
            "",
            chalk_1.default.dim("Generate JSON Schema, then TypeScript"),
            "$ quicktype -o schema.json https://blockchain.info/latestblock",
            "$ quicktype -o bitcoin.ts --src-lang schema schema.json",
        ],
    },
    {
        content: `Learn more at ${chalk_1.default.bold("quicktype.io")}`,
    },
];
function parseCLIOptions(argv, targetLanguage) {
    if (argv.length === 0) {
        return inferCLIOptions({ help: true }, targetLanguage);
    }
    const targetLanguages = targetLanguage === undefined
        ? quicktype_core_1.defaultTargetLanguages
        : [targetLanguage];
    const optionDefinitions = makeOptionDefinitions(targetLanguages);
    // We can only fully parse the options once we know which renderer is selected,
    // because there are renderer-specific options.  But we only know which renderer
    // is selected after we've parsed the options.  Hence, we parse the options
    // twice.  This is the first parse to get the renderer:
    const incompleteOptions = inferCLIOptions(parseOptions(optionDefinitions, argv, true), targetLanguage);
    if (targetLanguage === undefined) {
        const languageName = (0, quicktype_core_1.isLanguageName)(incompleteOptions.lang)
            ? incompleteOptions.lang
            : "typescript";
        targetLanguage = (0, quicktype_core_1.getTargetLanguage)(languageName);
    }
    const rendererOptionDefinitions = targetLanguage.cliOptionDefinitions.actual;
    // Use the global options as well as the renderer options from now on:
    const allOptionDefinitions = _.concat(optionDefinitions, rendererOptionDefinitions);
    // This is the parse that counts:
    return inferCLIOptions(parseOptions(allOptionDefinitions, argv, false), targetLanguage);
}
// Parse the options in argv and split them into global options and renderer options,
// according to each option definition's `renderer` field.  If `partial` is false this
// will throw if it encounters an unknown option.
function parseOptions(definitions, argv, partial) {
    let opts;
    try {
        opts = (0, command_line_args_1.default)(definitions.map((def) => ({
            ...def,
            type: def.optionType === "boolean" ? Boolean : String,
        })), { argv, partial });
    }
    catch (e) {
        (0, quicktype_core_1.assert)(!partial, "Partial option parsing should not have failed");
        return (0, quicktype_core_1.messageError)("DriverCLIOptionParsingFailed", {
            message: (0, ts_necessities_1.exceptionToString)(e),
        });
    }
    for (const k of Object.keys(opts)) {
        if (opts[k] === null) {
            return (0, quicktype_core_1.messageError)("DriverCLIOptionParsingFailed", {
                message: `Missing value for command line option "${k}"`,
            });
        }
    }
    const options = { rendererOptions: {} };
    for (const optionDefinition of definitions) {
        if (!(0, collection_utils_1.hasOwnProperty)(opts, optionDefinition.name)) {
            continue;
        }
        const optionValue = opts[optionDefinition.name];
        if (optionDefinition.kind !== "cli") {
            options.rendererOptions[optionDefinition.name] = optionValue;
        }
        else {
            const k = _.lowerFirst(optionDefinition.name.split("-").map(_.upperFirst).join(""));
            options[k] = optionValue;
        }
    }
    return options;
}
function usage(targetLanguages) {
    const rendererSections = [];
    for (const language of targetLanguages) {
        const definitions = language.cliOptionDefinitions.display;
        if (definitions.length === 0)
            continue;
        rendererSections.push({
            header: `Options for ${language.displayName}`,
            optionList: definitions,
            tableOptions: tableOptionsForOptions,
        });
    }
    const sections = _.concat(makeSectionsBeforeRenderers(targetLanguages), rendererSections, sectionsAfterRenderers);
    console.log((0, command_line_usage_1.default)(sections));
}
// Returns an array of [name, sourceURIs] pairs.
async function getSourceURIs(options) {
    if (options.srcUrls !== undefined) {
        const json = (0, quicktype_core_1.parseJSON)(await (0, quicktype_core_1.readFromFileOrURL)(options.srcUrls, options.httpHeader), "URL grammar", options.srcUrls);
        const jsonMap = (0, URLGrammar_1.urlsFromURLGrammar)(json);
        const topLevels = Object.getOwnPropertyNames(jsonMap);
        return topLevels.map((name) => [name, jsonMap[name]]);
    }
    if (options.src.length === 0) {
        return [[options.topLevel, ["-"]]];
    }
    return [];
}
async function typeSourcesForURIs(name, uris, options) {
    switch (options.srcLang) {
        case "json":
            return [
                await sourceFromFileOrUrlArray(name, uris, options.httpHeader),
            ];
        case "schema":
            return uris.map((uri) => ({ kind: "schema", name, uris: [uri] }));
        default:
            return (0, quicktype_core_1.panic)(`typeSourceForURIs must not be called for source language ${options.srcLang}`);
    }
}
async function getSources(options) {
    const sourceURIs = await getSourceURIs(options);
    const sourceArrays = await Promise.all(sourceURIs.map(async ([name, uris]) => await typeSourcesForURIs(name, uris, options)));
    let sources = [].concat(...sourceArrays);
    const exists = options.src.filter(fs.existsSync);
    const directories = exists.filter((x) => fs.lstatSync(x).isDirectory());
    for (const dataDir of directories) {
        sources = sources.concat(await samplesFromDirectory(dataDir, options.httpHeader));
    }
    // Every src that's not a directory is assumed to be a file or URL
    const filesOrUrls = options.src.filter((x) => !_.includes(directories, x));
    if (!_.isEmpty(filesOrUrls)) {
        sources.push(...(await typeSourcesForURIs(options.topLevel, filesOrUrls, options)));
    }
    return sources;
}
function makeTypeScriptSource(fileNames) {
    return Object.assign({ kind: "schema" }, (0, quicktype_typescript_input_1.schemaForTypeScriptSources)(fileNames));
}
function jsonInputForTargetLanguage(targetLanguage, languages, handleJSONRefs = false) {
    if (typeof targetLanguage === "string") {
        const languageName = (0, quicktype_core_1.isLanguageName)(targetLanguage)
            ? targetLanguage
            : "typescript";
        targetLanguage = (0, quicktype_core_1.defined)((0, quicktype_core_1.languageNamed)(languageName, languages));
    }
    const compressedJSON = new CompressedJSONFromStream_1.CompressedJSONFromStream(targetLanguage.dateTimeRecognizer, handleJSONRefs);
    return new quicktype_core_1.JSONInput(compressedJSON);
}
async function makeInputData(sources, targetLanguage, additionalSchemaAddresses, handleJSONRefs, httpHeaders) {
    const inputData = new quicktype_core_1.InputData();
    for (const source of sources) {
        switch (source.kind) {
            case "graphql":
                await inputData.addSource("graphql", source, () => new quicktype_graphql_input_1.GraphQLInput());
                break;
            case "json":
                await inputData.addSource("json", source, () => jsonInputForTargetLanguage(targetLanguage, undefined, handleJSONRefs));
                break;
            case "schema":
                await inputData.addSource("schema", source, () => new quicktype_core_1.JSONSchemaInput(new quicktype_core_1.FetchingJSONSchemaStore(httpHeaders), [], additionalSchemaAddresses));
                break;
            default:
                return (0, quicktype_core_1.assertNever)(source);
        }
    }
    return inputData;
}
function stringSourceDataToStreamSourceData(src) {
    return {
        name: src.name,
        description: src.description,
        samples: src.samples.map((sample) => (0, string_to_stream_1.default)(sample)),
    };
}
async function makeQuicktypeOptions(options, targetLanguages) {
    if (options.help) {
        usage(targetLanguages ?? quicktype_core_1.defaultTargetLanguages);
        return undefined;
    }
    if (options.version) {
        console.log(`quicktype version ${packageJSON.version}`);
        console.log("Visit quicktype.io for more info.");
        return undefined;
    }
    if (options.buildMarkovChain !== undefined) {
        const contents = fs.readFileSync(options.buildMarkovChain).toString();
        const lines = contents.split("\n");
        const mc = (0, quicktype_core_1.trainMarkovChain)(lines, 3);
        console.log(JSON.stringify(mc));
        return undefined;
    }
    let sources = [];
    let leadingComments = undefined;
    let fixedTopLevels = false;
    switch (options.srcLang) {
        case "graphql":
            let schemaString = undefined;
            let wroteSchemaToFile = false;
            if (options.graphqlIntrospect !== undefined) {
                schemaString = await (0, GraphQLIntrospection_1.introspectServer)(options.graphqlIntrospect, (0, collection_utils_1.withDefault)(options.httpMethod, "POST"), (0, collection_utils_1.withDefault)(options.httpHeader, []));
                if (options.graphqlSchema !== undefined) {
                    fs.writeFileSync(options.graphqlSchema, schemaString);
                    wroteSchemaToFile = true;
                }
            }
            const numSources = options.src.length;
            if (numSources !== 1) {
                if (wroteSchemaToFile) {
                    // We're done.
                    return undefined;
                }
                if (numSources === 0) {
                    if (schemaString !== undefined) {
                        console.log(schemaString);
                        return undefined;
                    }
                    return (0, quicktype_core_1.messageError)("DriverNoGraphQLQueryGiven", {});
                }
            }
            const gqlSources = [];
            for (const queryFile of options.src) {
                let schemaFileName = undefined;
                if (schemaString === undefined) {
                    schemaFileName = (0, quicktype_core_1.defined)(options.graphqlSchema);
                    schemaString = fs.readFileSync(schemaFileName, "utf8");
                }
                const schema = (0, quicktype_core_1.parseJSON)(schemaString, "GraphQL schema", schemaFileName);
                const query = await (0, quicktype_core_1.getStream)(await (0, quicktype_core_1.readableFromFileOrURL)(queryFile, options.httpHeader));
                const name = numSources === 1
                    ? options.topLevel
                    : typeNameFromFilename(queryFile);
                gqlSources.push({ kind: "graphql", name, schema, query });
            }
            sources = gqlSources;
            break;
        case "json":
        case "schema":
            sources = await getSources(options);
            break;
        case "typescript":
            sources = [makeTypeScriptSource(options.src)];
            break;
        case "postman":
            for (const collectionFile of options.src) {
                const collectionJSON = fs.readFileSync(collectionFile, "utf8");
                const { sources: postmanSources, description } = (0, quicktype_core_1.sourcesFromPostmanCollection)(collectionJSON, collectionFile);
                for (const src of postmanSources) {
                    sources.push(Object.assign({ kind: "json" }, stringSourceDataToStreamSourceData(src)));
                }
                if (postmanSources.length > 1) {
                    fixedTopLevels = true;
                }
                if (description !== undefined) {
                    leadingComments = wordWrap(description).split("\n");
                }
            }
            break;
        default:
            return (0, quicktype_core_1.messageError)("DriverUnknownSourceLanguage", {
                lang: options.srcLang,
            });
    }
    const components = (0, collection_utils_1.definedMap)(options.debug, (d) => d.split(","));
    const debugAll = components?.includes("all");
    let debugPrintGraph = debugAll;
    let checkProvenance = debugAll;
    let debugPrintReconstitution = debugAll;
    let debugPrintGatherNames = debugAll;
    let debugPrintTransformations = debugAll;
    let debugPrintSchemaResolving = debugAll;
    let debugPrintTimes = debugAll;
    if (components !== undefined) {
        for (let component of components) {
            component = component.trim();
            if (component === "print-graph") {
                debugPrintGraph = true;
            }
            else if (component === "print-reconstitution") {
                debugPrintReconstitution = true;
            }
            else if (component === "print-gather-names") {
                debugPrintGatherNames = true;
            }
            else if (component === "print-transformations") {
                debugPrintTransformations = true;
            }
            else if (component === "print-times") {
                debugPrintTimes = true;
            }
            else if (component === "print-schema-resolving") {
                debugPrintSchemaResolving = true;
            }
            else if (component === "provenance") {
                checkProvenance = true;
            }
            else if (component !== "all") {
                return (0, quicktype_core_1.messageError)("DriverUnknownDebugOption", {
                    option: component,
                });
            }
        }
    }
    if (!(0, quicktype_core_1.isLanguageName)(options.lang)) {
        return (0, quicktype_core_1.messageError)("DriverUnknownOutputLanguage", {
            lang: options.lang,
        });
    }
    const lang = (0, quicktype_core_1.languageNamed)(options.lang, targetLanguages);
    const quicktypeOptions = {
        lang,
        alphabetizeProperties: options.alphabetizeProperties,
        allPropertiesOptional: options.allPropertiesOptional,
        fixedTopLevels,
        noRender: options.noRender,
        rendererOptions: options.rendererOptions,
        leadingComments,
        outputFilename: (0, collection_utils_1.definedMap)(options.out, path.basename),
        debugPrintGraph,
        checkProvenance,
        debugPrintReconstitution,
        debugPrintGatherNames,
        debugPrintTransformations,
        debugPrintSchemaResolving,
        debugPrintTimes,
    };
    for (const flagName of quicktype_core_1.inferenceFlagNames) {
        const cliName = negatedInferenceFlagName(flagName);
        const v = options[cliName];
        if (typeof v === "boolean") {
            quicktypeOptions[flagName] = !v;
        }
        else {
            quicktypeOptions[flagName] = true;
        }
    }
    quicktypeOptions.inputData = await makeInputData(sources, lang, options.additionalSchema, quicktypeOptions.ignoreJsonRefs !== true, options.httpHeader);
    return quicktypeOptions;
}
function writeOutput(cliOptions, resultsByFilename) {
    let onFirst = true;
    for (const [filename, { lines, annotations }] of resultsByFilename) {
        const output = lines.join("\n");
        if (cliOptions.out !== undefined) {
            fs.writeFileSync(path.join(path.dirname(cliOptions.out), filename), output);
        }
        else {
            if (!onFirst) {
                process.stdout.write("\n");
            }
            if (resultsByFilename.size > 1) {
                process.stdout.write(`// ${filename}\n\n`);
            }
            process.stdout.write(output);
        }
        if (cliOptions.quiet) {
            continue;
        }
        for (const sa of annotations) {
            const annotation = sa.annotation;
            if (!(annotation instanceof quicktype_core_1.IssueAnnotationData))
                continue;
            const lineNumber = sa.span.start.line;
            const humanLineNumber = lineNumber + 1;
            console.error(`\nIssue in line ${humanLineNumber}: ${annotation.message}`);
            console.error(`${humanLineNumber}: ${lines[lineNumber]}`);
        }
        onFirst = false;
    }
}
async function main(args) {
    let cliOptions;
    if (Array.isArray(args)) {
        cliOptions = parseCLIOptions(args);
    }
    else {
        cliOptions = inferCLIOptions(args, undefined);
    }
    if (cliOptions.telemetry !== undefined) {
        switch (cliOptions.telemetry) {
            case "enable":
                break;
            case "disable":
                break;
            default:
                console.error(chalk_1.default.red("telemetry must be 'enable' or 'disable'"));
                return;
        }
        if (Array.isArray(args) && args.length === 2) {
            // This was merely a CLI run to set telemetry and we should not proceed
            return;
        }
    }
    const quicktypeOptions = await makeQuicktypeOptions(cliOptions);
    if (quicktypeOptions === undefined) {
        return;
    }
    const resultsByFilename = await (0, quicktype_core_1.quicktypeMultiFile)(quicktypeOptions);
    writeOutput(cliOptions, resultsByFilename);
}
if (require.main === module) {
    main(process.argv.slice(2)).catch((e) => {
        if (e instanceof Error) {
            console.error(`Error: ${e.message}.`);
        }
        else {
            console.error(e);
        }
        process.exit(1);
    });
}
