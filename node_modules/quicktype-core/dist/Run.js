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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTargetLanguage = getTargetLanguage;
exports.quicktypeMultiFile = quicktypeMultiFile;
exports.quicktypeMultiFileSync = quicktypeMultiFileSync;
exports.combineRenderResults = combineRenderResults;
exports.quicktype = quicktype;
const collection_utils_1 = require("collection-utils");
const TypeNames_1 = require("./attributes/TypeNames");
const Inputs_1 = require("./input/Inputs");
const targetLanguages = __importStar(require("./language/All"));
const CombineClasses_1 = require("./rewrites/CombineClasses");
const ExpandStrings_1 = require("./rewrites/ExpandStrings");
const FlattenStrings_1 = require("./rewrites/FlattenStrings");
const FlattenUnions_1 = require("./rewrites/FlattenUnions");
const InferMaps_1 = require("./rewrites/InferMaps");
const ReplaceObjectType_1 = require("./rewrites/ReplaceObjectType");
const ResolveIntersections_1 = require("./rewrites/ResolveIntersections");
const Support_1 = require("./support/Support");
const GatherNames_1 = require("./GatherNames");
const Inference_1 = require("./Inference");
const MakeTransformations_1 = require("./MakeTransformations");
const Messages_1 = require("./Messages");
const TypeBuilder_1 = require("./Type/TypeBuilder");
const TypeGraph_1 = require("./Type/TypeGraph");
const TypeGraphUtils_1 = require("./Type/TypeGraphUtils");
function getTargetLanguage(nameOrInstance) {
    if (typeof nameOrInstance === "object") {
        return nameOrInstance;
    }
    const language = targetLanguages.languageNamed(nameOrInstance);
    if (language !== undefined) {
        return language;
    }
    return (0, Messages_1.messageError)("DriverUnknownOutputLanguage", {
        lang: nameOrInstance,
    });
}
const defaultOptions = {
    lang: "ts",
    inputData: new Inputs_1.InputData(),
    alphabetizeProperties: false,
    allPropertiesOptional: false,
    fixedTopLevels: false,
    noRender: false,
    leadingComments: undefined,
    rendererOptions: {},
    indentation: undefined,
    outputFilename: "stdout",
    debugPrintGraph: false,
    checkProvenance: false,
    debugPrintReconstitution: false,
    debugPrintGatherNames: false,
    debugPrintTransformations: false,
    debugPrintTimes: false,
    debugPrintSchemaResolving: false,
};
class Run {
    constructor(options) {
        // We must not overwrite defaults with undefined values, which
        // we sometimes get.
        this._options = Object.fromEntries(Object.entries(Object.assign({}, defaultOptions, Inference_1.defaultInferenceFlags)).map(([k, v]) => { var _a; return [k, (_a = options[k]) !== null && _a !== void 0 ? _a : v]; }));
    }
    get stringTypeMapping() {
        const targetLanguage = getTargetLanguage(this._options.lang);
        const mapping = new Map(targetLanguage.stringTypeMapping);
        for (const flag of Inference_1.inferenceFlagNames) {
            const stringType = Inference_1.inferenceFlags[flag].stringType;
            if (!this._options[flag] && stringType !== undefined) {
                mapping.set(stringType, "string");
            }
        }
        return mapping;
    }
    get debugPrintReconstitution() {
        return this._options.debugPrintReconstitution === true;
    }
    get debugPrintTransformations() {
        return this._options.debugPrintTransformations;
    }
    get debugPrintSchemaResolving() {
        return this._options.debugPrintSchemaResolving;
    }
    timeSync(name, f) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const result = yield f();
            const end = Date.now();
            if (this._options.debugPrintTimes) {
                console.log(`${name} took ${end - start}ms`);
            }
            return result;
        });
    }
    time(name, f) {
        const start = Date.now();
        const result = f();
        const end = Date.now();
        if (this._options.debugPrintTimes) {
            console.log(`${name} took ${end - start}ms`);
        }
        return result;
    }
    makeGraphInputs() {
        const targetLanguage = getTargetLanguage(this._options.lang);
        const stringTypeMapping = this.stringTypeMapping;
        const conflateNumbers = !targetLanguage.supportsUnionsWithBothNumberTypes;
        const typeBuilder = new TypeBuilder_1.TypeBuilder(stringTypeMapping, this._options.alphabetizeProperties, this._options.allPropertiesOptional, this._options.checkProvenance, false);
        typeBuilder.typeGraph = new TypeGraph_1.TypeGraph(typeBuilder, 0, this._options.checkProvenance);
        return {
            targetLanguage,
            stringTypeMapping,
            conflateNumbers,
            typeBuilder,
        };
    }
    makeGraph(allInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const graphInputs = this.makeGraphInputs();
            yield this.timeSync("read input", () => __awaiter(this, void 0, void 0, function* () {
                return yield allInputs.addTypes(this, graphInputs.typeBuilder, this._options.inferMaps, this._options.inferEnums, this._options.fixedTopLevels);
            }));
            return this.processGraph(allInputs, graphInputs);
        });
    }
    makeGraphSync(allInputs) {
        const graphInputs = this.makeGraphInputs();
        this.time("read input", () => allInputs.addTypesSync(this, graphInputs.typeBuilder, this._options.inferMaps, this._options.inferEnums, this._options.fixedTopLevels));
        return this.processGraph(allInputs, graphInputs);
    }
    processGraph(allInputs, graphInputs) {
        const { targetLanguage, stringTypeMapping, conflateNumbers, typeBuilder, } = graphInputs;
        let graph = typeBuilder.finish();
        if (this._options.debugPrintGraph) {
            graph.setPrintOnRewrite();
            graph.printGraph();
        }
        const debugPrintReconstitution = this.debugPrintReconstitution;
        if (typeBuilder.didAddForwardingIntersection ||
            !this._options.ignoreJsonRefs) {
            this.time("remove indirection intersections", () => {
                graph = (0, TypeGraphUtils_1.removeIndirectionIntersections)(graph, stringTypeMapping, debugPrintReconstitution);
            });
        }
        let unionsDone = false;
        if (allInputs.needSchemaProcessing || !this._options.ignoreJsonRefs) {
            let intersectionsDone = false;
            do {
                const graphBeforeRewrites = graph;
                if (!intersectionsDone) {
                    this.time("resolve intersections", () => {
                        [graph, intersectionsDone] = (0, ResolveIntersections_1.resolveIntersections)(graph, stringTypeMapping, debugPrintReconstitution);
                    });
                }
                if (!unionsDone) {
                    this.time("flatten unions", () => {
                        [graph, unionsDone] = (0, FlattenUnions_1.flattenUnions)(graph, stringTypeMapping, conflateNumbers, true, debugPrintReconstitution);
                    });
                }
                if (graph === graphBeforeRewrites) {
                    (0, Support_1.assert)(intersectionsDone && unionsDone, "Graph didn't change but we're not done");
                }
            } while (!intersectionsDone || !unionsDone);
        }
        this.time("replace object type", () => {
            graph = (0, ReplaceObjectType_1.replaceObjectType)(graph, stringTypeMapping, conflateNumbers, targetLanguage.supportsFullObjectType, debugPrintReconstitution);
        });
        do {
            this.time("flatten unions", () => {
                [graph, unionsDone] = (0, FlattenUnions_1.flattenUnions)(graph, stringTypeMapping, conflateNumbers, false, debugPrintReconstitution);
            });
        } while (!unionsDone);
        if (this._options.combineClasses) {
            const combinedGraph = this.time("combine classes", () => (0, CombineClasses_1.combineClasses)(this, graph, this._options.alphabetizeProperties, true, false, debugPrintReconstitution));
            if (combinedGraph === graph) {
                graph = combinedGraph;
            }
            else {
                this.time("combine classes cleanup", () => {
                    graph = (0, CombineClasses_1.combineClasses)(this, combinedGraph, this._options.alphabetizeProperties, false, true, debugPrintReconstitution);
                });
            }
        }
        if (this._options.inferMaps) {
            for (;;) {
                const newGraph = this.time("infer maps", () => (0, InferMaps_1.inferMaps)(graph, stringTypeMapping, true, debugPrintReconstitution));
                if (newGraph === graph) {
                    break;
                }
                graph = newGraph;
            }
        }
        const enumInference = allInputs.needSchemaProcessing
            ? "all"
            : this._options.inferEnums
                ? "infer"
                : "none";
        this.time("expand strings", () => {
            graph = (0, ExpandStrings_1.expandStrings)(this, graph, enumInference);
        });
        this.time("flatten unions", () => {
            [graph, unionsDone] = (0, FlattenUnions_1.flattenUnions)(graph, stringTypeMapping, conflateNumbers, false, debugPrintReconstitution);
        });
        (0, Support_1.assert)(unionsDone, "We should only have to flatten unions once after expanding strings");
        if (allInputs.needSchemaProcessing) {
            this.time("flatten strings", () => {
                graph = (0, FlattenStrings_1.flattenStrings)(graph, stringTypeMapping, debugPrintReconstitution);
            });
        }
        this.time("none to any", () => {
            graph = (0, TypeGraphUtils_1.noneToAny)(graph, stringTypeMapping, debugPrintReconstitution);
        });
        if (!targetLanguage.supportsOptionalClassProperties) {
            this.time("optional to nullable", () => {
                graph = (0, TypeGraphUtils_1.optionalToNullable)(graph, stringTypeMapping, debugPrintReconstitution);
            });
        }
        this.time("fixed point", () => {
            graph = graph.rewriteFixedPoint(false, debugPrintReconstitution);
        });
        this.time("make transformations", () => {
            graph = (0, MakeTransformations_1.makeTransformations)(this, graph, targetLanguage);
        });
        this.time("flatten unions", () => {
            [graph, unionsDone] = (0, FlattenUnions_1.flattenUnions)(graph, stringTypeMapping, conflateNumbers, false, debugPrintReconstitution);
        });
        (0, Support_1.assert)(unionsDone, "We should only have to flatten unions once after making transformations");
        // Sometimes we combine classes in ways that will the order come out
        // differently compared to what it would be from the equivalent schema,
        // so we always just garbage collect to get a defined order and be done
        // with it.
        // FIXME: We don't actually have to do this if any of the above graph
        // rewrites did anything.  We could just check whether the current graph
        // is different from the one we started out with.
        this.time("GC", () => {
            graph = graph.garbageCollect(this._options.alphabetizeProperties, debugPrintReconstitution);
        });
        if (this._options.debugPrintGraph) {
            console.log("\n# gather names");
        }
        this.time("gather names", () => (0, GatherNames_1.gatherNames)(graph, !allInputs.needSchemaProcessing, this._options.debugPrintGatherNames));
        if (this._options.debugPrintGraph) {
            graph.printGraph();
        }
        return graph;
    }
    makeSimpleTextResult(lines) {
        return new Map([
            [this._options.outputFilename, { lines, annotations: [] }],
        ]);
    }
    preRun() {
        // FIXME: This makes quicktype not quite reentrant
        (0, TypeNames_1.initTypeNames)();
        const targetLanguage = getTargetLanguage(this._options.lang);
        const inputData = this._options.inputData;
        const needIR = inputData.needIR || !targetLanguage.names.includes("schema");
        const schemaString = needIR
            ? undefined
            : inputData.singleStringSchemaSource();
        if (schemaString !== undefined) {
            const lines = JSON.stringify(JSON.parse(schemaString), undefined, 4).split("\n");
            lines.push("");
            const srr = { lines, annotations: [] };
            return new Map([
                [this._options.outputFilename, srr],
            ]);
        }
        return [inputData, targetLanguage];
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const preRunResult = this.preRun();
            if (!Array.isArray(preRunResult)) {
                return preRunResult;
            }
            const [inputData, targetLanguage] = preRunResult;
            const graph = yield this.makeGraph(inputData);
            return this.renderGraph(targetLanguage, graph);
        });
    }
    runSync() {
        const preRunResult = this.preRun();
        if (!Array.isArray(preRunResult)) {
            return preRunResult;
        }
        const [inputData, targetLanguage] = preRunResult;
        const graph = this.makeGraphSync(inputData);
        return this.renderGraph(targetLanguage, graph);
    }
    renderGraph(targetLanguage, graph) {
        if (this._options.noRender) {
            return this.makeSimpleTextResult(["Done.", ""]);
        }
        return targetLanguage.renderGraphAndSerialize(graph, this._options.outputFilename, this._options.alphabetizeProperties, this._options.leadingComments, this._options.rendererOptions, this._options.indentation);
    }
}
/**
 * Run quicktype and produce one or more output files.
 *
 * @param options Partial options.  For options that are not defined, the
 * defaults will be used.
 */
function quicktypeMultiFile(options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Run(options).run();
    });
}
function quicktypeMultiFileSync(options) {
    return new Run(options).runSync();
}
function offsetLocation(loc, lineOffset) {
    return { line: loc.line + lineOffset, column: loc.column };
}
function offsetSpan(span, lineOffset) {
    return {
        start: offsetLocation(span.start, lineOffset),
        end: offsetLocation(span.end, lineOffset),
    };
}
/**
 * Combines a multi-file render result into a single output.  All the files
 * are concatenated and prefixed with a `//`-style comment giving the
 * filename.
 */
function combineRenderResults(result) {
    if (result.size <= 1) {
        const first = (0, collection_utils_1.mapFirst)(result);
        if (first === undefined) {
            return { lines: [], annotations: [] };
        }
        return first;
    }
    let lines = [];
    let annotations = [];
    for (const [filename, srr] of result) {
        const offset = lines.length + 2;
        lines = lines.concat([`// ${filename}`, ""], srr.lines);
        annotations = annotations.concat(srr.annotations.map((ann) => ({
            annotation: ann.annotation,
            span: offsetSpan(ann.span, offset),
        })));
    }
    return { lines, annotations };
}
/**
 * Run quicktype like `quicktypeMultiFile`, but if there are multiple
 * output files they will all be squashed into one output, with comments at the
 * start of each file.
 *
 * @param options Partial options.  For options that are not defined, the
 * defaults will be used.
 */
function quicktype(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield quicktypeMultiFile(options);
        return combineRenderResults(result);
    });
}
