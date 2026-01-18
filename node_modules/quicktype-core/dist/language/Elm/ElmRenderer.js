"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElmRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class ElmRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
        this._topLevelDependents = new Map();
        this._namedTypeDependents = new Map();
    }
    forbiddenNamesForGlobalNamespace() {
        return constants_1.forbiddenNames;
    }
    makeTopLevelDependencyNames(t, topLevelName) {
        const encoder = new Naming_1.DependencyName(utils_1.lowerNamingFunction, topLevelName.order, (lookup) => `${lookup(topLevelName)}_to_string`);
        let decoder = undefined;
        if (this.namedTypeToNameForTopLevel(t) === undefined) {
            decoder = new Naming_1.DependencyName(utils_1.lowerNamingFunction, topLevelName.order, (lookup) => lookup(topLevelName));
        }
        this._topLevelDependents.set(topLevelName, { encoder, decoder });
        if (decoder !== undefined) {
            return [encoder, decoder];
        }
        return [encoder];
    }
    makeNamedTypeNamer() {
        return utils_1.upperNamingFunction;
    }
    makeNamedTypeDependencyNames(_, typeName) {
        const encoder = new Naming_1.DependencyName(utils_1.lowerNamingFunction, typeName.order, (lookup) => `encode_${lookup(typeName)}`);
        const decoder = new Naming_1.DependencyName(utils_1.lowerNamingFunction, typeName.order, (lookup) => lookup(typeName));
        this._namedTypeDependents.set(typeName, { encoder, decoder });
        return [encoder, decoder];
    }
    namerForObjectProperty() {
        return utils_1.lowerNamingFunction;
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    makeUnionMemberNamer() {
        return utils_1.upperNamingFunction;
    }
    get unionMembersInGlobalNamespace() {
        return true;
    }
    makeEnumCaseNamer() {
        return utils_1.upperNamingFunction;
    }
    get enumCasesInGlobalNamespace() {
        return true;
    }
    proposeUnionMemberName(u, unionName, fieldType, lookup) {
        const fieldName = super.proposeUnionMemberName(u, unionName, fieldType, lookup);
        return `${fieldName}_in_${lookup(unionName)}`;
    }
    get commentLineStart() {
        return "-- ";
    }
    emitDescriptionBlock(lines) {
        if (lines.length === 1) {
            this.emitComments([
                { customLines: lines, lineStart: "{-| ", lineEnd: " -}" },
            ]);
        }
        else {
            this.emitCommentLines(lines, {
                firstLineStart: "{-| ",
                lineStart: "",
                afterComment: "-}",
            });
        }
    }
    get arrayType() {
        return this._options.useList ? "List" : "Array";
    }
    elmType(t, noOptional = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.singleWord)((0, Source_1.annotated)(Annotation_1.anyTypeIssueAnnotation, "Jdec.Value")), (_nullType) => (0, Source_1.singleWord)((0, Source_1.annotated)(Annotation_1.nullTypeIssueAnnotation, "()")), (_boolType) => (0, Source_1.singleWord)("Bool"), (_integerType) => (0, Source_1.singleWord)("Int"), (_doubleType) => (0, Source_1.singleWord)("Float"), (_stringType) => (0, Source_1.singleWord)("String"), (arrayType) => (0, Source_1.multiWord)(" ", this.arrayType, (0, Source_1.parenIfNeeded)(this.elmType(arrayType.items))), (classType) => (0, Source_1.singleWord)(this.nameForNamedType(classType)), (mapType) => (0, Source_1.multiWord)(" ", "Dict String", (0, Source_1.parenIfNeeded)(this.elmType(mapType.values))), (enumType) => (0, Source_1.singleWord)(this.nameForNamedType(enumType)), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                const nullableType = this.elmType(nullable);
                if (noOptional)
                    return nullableType;
                return (0, Source_1.multiWord)(" ", "Maybe", (0, Source_1.parenIfNeeded)(nullableType));
            }
            return (0, Source_1.singleWord)(this.nameForNamedType(unionType));
        });
    }
    elmProperty(p) {
        if (p.isOptional) {
            return (0, Source_1.multiWord)(" ", "Maybe", (0, Source_1.parenIfNeeded)(this.elmType(p.type, true))).source;
        }
        return this.elmType(p.type).source;
    }
    decoderNameForNamedType(t) {
        const name = this.nameForNamedType(t);
        return (0, Support_1.defined)(this._namedTypeDependents.get(name)).decoder;
    }
    decoderNameForType(t, noOptional = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.singleWord)("Jdec.value"), (_nullType) => (0, Source_1.multiWord)(" ", "Jdec.null", "()"), (_boolType) => (0, Source_1.singleWord)("Jdec.bool"), (_integerType) => (0, Source_1.singleWord)("Jdec.int"), (_doubleType) => (0, Source_1.singleWord)("Jdec.float"), (_stringType) => (0, Source_1.singleWord)("Jdec.string"), (arrayType) => (0, Source_1.multiWord)(" ", ["Jdec.", (0, Strings_1.decapitalize)(this.arrayType)], (0, Source_1.parenIfNeeded)(this.decoderNameForType(arrayType.items))), (classType) => (0, Source_1.singleWord)(this.decoderNameForNamedType(classType)), (mapType) => (0, Source_1.multiWord)(" ", "Jdec.dict", (0, Source_1.parenIfNeeded)(this.decoderNameForType(mapType.values))), (enumType) => (0, Source_1.singleWord)(this.decoderNameForNamedType(enumType)), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                const nullableDecoder = this.decoderNameForType(nullable);
                if (noOptional)
                    return nullableDecoder;
                return (0, Source_1.multiWord)(" ", "Jdec.nullable", (0, Source_1.parenIfNeeded)(nullableDecoder));
            }
            return (0, Source_1.singleWord)(this.decoderNameForNamedType(unionType));
        });
    }
    decoderNameForProperty(p) {
        if (p.isOptional) {
            return (0, Source_1.multiWord)(" ", "Jdec.nullable", (0, Source_1.parenIfNeeded)(this.decoderNameForType(p.type, true)));
        }
        return this.decoderNameForType(p.type);
    }
    encoderNameForNamedType(t) {
        const name = this.nameForNamedType(t);
        return (0, Support_1.defined)(this._namedTypeDependents.get(name)).encoder;
    }
    encoderNameForType(t, noOptional = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.singleWord)("identity"), (_nullType) => (0, Source_1.multiWord)(" ", "always", "Jenc.null"), (_boolType) => (0, Source_1.singleWord)("Jenc.bool"), (_integerType) => (0, Source_1.singleWord)("Jenc.int"), (_doubleType) => (0, Source_1.singleWord)("Jenc.float"), (_stringType) => (0, Source_1.singleWord)("Jenc.string"), (arrayType) => (0, Source_1.multiWord)(" ", ["make", this.arrayType, "Encoder"], (0, Source_1.parenIfNeeded)(this.encoderNameForType(arrayType.items))), (classType) => (0, Source_1.singleWord)(this.encoderNameForNamedType(classType)), (mapType) => (0, Source_1.multiWord)(" ", "makeDictEncoder", (0, Source_1.parenIfNeeded)(this.encoderNameForType(mapType.values))), (enumType) => (0, Source_1.singleWord)(this.encoderNameForNamedType(enumType)), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                const nullableEncoder = this.encoderNameForType(nullable);
                if (noOptional)
                    return nullableEncoder;
                return (0, Source_1.multiWord)(" ", "makeNullableEncoder", (0, Source_1.parenIfNeeded)(nullableEncoder));
            }
            return (0, Source_1.singleWord)(this.encoderNameForNamedType(unionType));
        });
    }
    encoderNameForProperty(p) {
        if (p.isOptional) {
            return (0, Source_1.multiWord)(" ", "makeNullableEncoder", (0, Source_1.parenIfNeeded)(this.encoderNameForType(p.type, true)));
        }
        return this.encoderNameForType(p.type);
    }
    emitTopLevelDefinition(t, topLevelName) {
        this.emitLine("type alias ", topLevelName, " = ", this.elmType(t).source);
    }
    emitClassDefinition(c, className) {
        let description = this.descriptionForType(c);
        this.forEachClassProperty(c, "none", (name, jsonName) => {
            const propertyDescription = this.descriptionForClassProperty(c, jsonName);
            if (propertyDescription === undefined)
                return;
            if (description === undefined) {
                description = [];
            }
            else {
                description.push("");
            }
            description.push(`${this.sourcelikeToString(name)}:`);
            description.push(...propertyDescription);
        });
        this.emitDescription(description);
        this.emitLine("type alias ", className, " =");
        this.indent(() => {
            let onFirst = true;
            this.forEachClassProperty(c, "none", (name, _jsonName, p) => {
                this.emitLine(onFirst ? "{" : ",", " ", name, " : ", this.elmProperty(p));
                onFirst = false;
            });
            if (onFirst) {
                this.emitLine("{");
            }
            this.emitLine("}");
        });
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("type ", enumName);
        this.indent(() => {
            let onFirst = true;
            this.forEachEnumCase(e, "none", (name) => {
                const equalsOrPipe = onFirst ? "=" : "|";
                this.emitLine(equalsOrPipe, " ", name);
                onFirst = false;
            });
        });
    }
    emitUnionDefinition(u, unionName) {
        this.emitDescription(this.descriptionForType(u));
        this.emitLine("type ", unionName);
        this.indent(() => {
            let onFirst = true;
            this.forEachUnionMember(u, null, "none", null, (name, t) => {
                const equalsOrPipe = onFirst ? "=" : "|";
                if (t.kind === "null") {
                    this.emitLine(equalsOrPipe, " ", name);
                }
                else {
                    this.emitLine(equalsOrPipe, " ", name, " ", (0, Source_1.parenIfNeeded)(this.elmType(t)));
                }
                onFirst = false;
            });
        });
    }
    emitTopLevelFunctions(t, topLevelName) {
        const { encoder, decoder } = (0, Support_1.defined)(this._topLevelDependents.get(topLevelName));
        if (this.namedTypeToNameForTopLevel(t) === undefined) {
            this.emitLine((0, Support_1.defined)(decoder), " : Jdec.Decoder ", topLevelName);
            this.emitLine((0, Support_1.defined)(decoder), " = ", this.decoderNameForType(t).source);
            this.ensureBlankLine();
        }
        this.emitLine(encoder, " : ", topLevelName, " -> String");
        this.emitLine(encoder, " r = Jenc.encode 0 (", this.encoderNameForType(t).source, " r)");
    }
    emitClassFunctions(c, className) {
        const decoderName = this.decoderNameForNamedType(c);
        this.emitLine(decoderName, " : Jdec.Decoder ", className);
        this.emitLine(decoderName, " =");
        this.indent(() => {
            this.emitLine("Jpipe.decode ", className);
            this.indent(() => {
                this.forEachClassProperty(c, "none", (_, jsonName, p) => {
                    const propDecoder = (0, Source_1.parenIfNeeded)(this.decoderNameForProperty(p));
                    const { reqOrOpt, fallback } = (0, utils_1.requiredOrOptional)(p);
                    this.emitLine("|> ", reqOrOpt, ' "', (0, Strings_1.stringEscape)(jsonName), '" ', propDecoder, fallback);
                });
            });
        });
        this.ensureBlankLine();
        const encoderName = this.encoderNameForNamedType(c);
        this.emitLine(encoderName, " : ", className, " -> Jenc.Value");
        this.emitLine(encoderName, " x =");
        this.indent(() => {
            this.emitLine("Jenc.object");
            this.indent(() => {
                let onFirst = true;
                this.forEachClassProperty(c, "none", (name, jsonName, p) => {
                    const bracketOrComma = onFirst ? "[" : ",";
                    const propEncoder = this.encoderNameForProperty(p).source;
                    this.emitLine(bracketOrComma, ' ("', (0, Strings_1.stringEscape)(jsonName), '", ', propEncoder, " x.", name, ")");
                    onFirst = false;
                });
                if (onFirst) {
                    this.emitLine("[");
                }
                this.emitLine("]");
            });
        });
    }
    emitEnumFunctions(e, enumName) {
        const decoderName = this.decoderNameForNamedType(e);
        this.emitLine(decoderName, " : Jdec.Decoder ", enumName);
        this.emitLine(decoderName, " =");
        this.indent(() => {
            this.emitLine("Jdec.string");
            this.indent(() => {
                this.emitLine("|> Jdec.andThen (\\str ->");
                this.indent(() => {
                    this.emitLine("case str of");
                    this.indent(() => {
                        this.forEachEnumCase(e, "none", (name, jsonName) => {
                            this.emitLine('"', (0, Strings_1.stringEscape)(jsonName), '" -> Jdec.succeed ', name);
                        });
                        this.emitLine('somethingElse -> Jdec.fail <| "Invalid ', enumName, ': " ++ somethingElse');
                    });
                });
                this.emitLine(")");
            });
        });
        this.ensureBlankLine();
        const encoderName = this.encoderNameForNamedType(e);
        this.emitLine(encoderName, " : ", enumName, " -> Jenc.Value");
        this.emitLine(encoderName, " x = case x of");
        this.indent(() => {
            this.forEachEnumCase(e, "none", (name, jsonName) => {
                this.emitLine(name, ' -> Jenc.string "', (0, Strings_1.stringEscape)(jsonName), '"');
            });
        });
    }
    emitUnionFunctions(u, unionName) {
        // We need arrays first, then strings, and integers before doubles.
        function sortOrder(_, t) {
            if (t.kind === "array") {
                return "  array";
            }
            if (t.kind === "double") {
                return " xdouble";
            }
            if (t.isPrimitive()) {
                return " " + t.kind;
            }
            return t.kind;
        }
        const decoderName = this.decoderNameForNamedType(u);
        this.emitLine(decoderName, " : Jdec.Decoder ", unionName);
        this.emitLine(decoderName, " =");
        this.indent(() => {
            this.emitLine("Jdec.oneOf");
            this.indent(() => {
                let onFirst = true;
                this.forEachUnionMember(u, null, "none", sortOrder, (name, t) => {
                    const bracketOrComma = onFirst ? "[" : ",";
                    if (t.kind === "null") {
                        this.emitLine(bracketOrComma, " Jdec.null ", name);
                    }
                    else {
                        const decoder = (0, Source_1.parenIfNeeded)(this.decoderNameForType(t));
                        this.emitLine(bracketOrComma, " Jdec.map ", name, " ", decoder);
                    }
                    onFirst = false;
                });
                this.emitLine("]");
            });
        });
        this.ensureBlankLine();
        const encoderName = this.encoderNameForNamedType(u);
        this.emitLine(encoderName, " : ", unionName, " -> Jenc.Value");
        this.emitLine(encoderName, " x = case x of");
        this.indent(() => {
            this.forEachUnionMember(u, null, "none", sortOrder, (name, t) => {
                if (t.kind === "null") {
                    this.emitLine(name, " -> Jenc.null");
                }
                else {
                    const encoder = this.encoderNameForType(t).source;
                    this.emitLine(name, " y -> ", encoder, " y");
                }
            });
        });
    }
    emitSourceStructure() {
        const exports = [];
        const topLevelDecoders = [];
        this.forEachTopLevel("none", (_, name) => {
            let { encoder, decoder } = (0, Support_1.defined)(this._topLevelDependents.get(name));
            if (decoder === undefined) {
                decoder = (0, Support_1.defined)(this._namedTypeDependents.get(name)).decoder;
            }
            topLevelDecoders.push(decoder);
            exports.push(name, encoder, decoder);
        });
        this.forEachObject("none", (t, name) => {
            if (!(0, collection_utils_1.mapContains)(this.topLevels, t))
                exports.push(name);
        });
        this.forEachEnum("none", (t, name) => {
            if (!(0, collection_utils_1.mapContains)(this.topLevels, t))
                exports.push([name, "(..)"]);
        });
        this.forEachUnion("none", (t, name) => {
            if (!(0, collection_utils_1.mapContains)(this.topLevels, t))
                exports.push([name, "(..)"]);
        });
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        else if (!this._options.justTypes) {
            this.emitCommentLines([
                "To decode the JSON data, add this file to your project, run",
                "",
                "    elm-package install NoRedInk/elm-decode-pipeline",
                "",
                "add these imports",
                "",
                "    import Json.Decode exposing (decodeString)`);",
            ]);
            this.emitLine("--     import ", this._options.moduleName, " exposing (", (0, collection_utils_1.arrayIntercalate)(", ", topLevelDecoders), ")");
            this.emitMultiline(`--
-- and you're off to the races with
--`);
            this.forEachTopLevel("none", (_, name) => {
                let { decoder } = (0, Support_1.defined)(this._topLevelDependents.get(name));
                if (decoder === undefined) {
                    decoder = (0, Support_1.defined)(this._namedTypeDependents.get(name)).decoder;
                }
                this.emitLine("--     decodeString ", decoder, " myJsonString");
            });
        }
        if (!this._options.justTypes) {
            this.ensureBlankLine();
            this.emitLine("module ", this._options.moduleName, " exposing");
            this.indent(() => {
                for (let i = 0; i < exports.length; i++) {
                    this.emitLine(i === 0 ? "(" : ",", " ", exports[i]);
                }
                this.emitLine(")");
            });
            this.ensureBlankLine();
            this.emitMultiline(`import Json.Decode as Jdec
import Json.Decode.Pipeline as Jpipe
import Json.Encode as Jenc
import Dict exposing (Dict, map, toList)`);
            if (this._options.useList) {
                this.emitLine("import List exposing (map)");
            }
            else {
                this.emitLine("import Array exposing (Array, map)");
            }
        }
        this.forEachTopLevel("leading-and-interposing", (t, topLevelName) => this.emitTopLevelDefinition(t, topLevelName), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
        this.forEachNamedType("leading-and-interposing", (c, className) => this.emitClassDefinition(c, className), (e, enumName) => this.emitEnumDefinition(e, enumName), (u, unionName) => this.emitUnionDefinition(u, unionName));
        if (this._options.justTypes)
            return;
        this.ensureBlankLine();
        this.emitLine("-- decoders and encoders");
        this.forEachTopLevel("leading-and-interposing", (t, topLevelName) => this.emitTopLevelFunctions(t, topLevelName));
        this.forEachNamedType("leading-and-interposing", (c, className) => this.emitClassFunctions(c, className), (e, enumName) => this.emitEnumFunctions(e, enumName), (u, unionName) => this.emitUnionFunctions(u, unionName));
        this.ensureBlankLine();
        this.emitLine("--- encoder helpers");
        this.ensureBlankLine();
        this.emitLine("make", this.arrayType, "Encoder : (a -> Jenc.Value) -> ", this.arrayType, " a -> Jenc.Value");
        this.emitLine("make", this.arrayType, "Encoder f arr =");
        this.indent(() => {
            this.emitLine("Jenc.", (0, Strings_1.decapitalize)(this.arrayType), " (", this.arrayType, ".map f arr)");
        });
        this.ensureBlankLine();
        this.emitMultiline(`makeDictEncoder : (a -> Jenc.Value) -> Dict String a -> Jenc.Value
makeDictEncoder f dict =
	Jenc.object (toList (Dict.map (\\k -> f) dict))

makeNullableEncoder : (a -> Jenc.Value) -> Maybe a -> Jenc.Value
makeNullableEncoder f m =
	case m of
	Just x -> f x
	Nothing -> Jenc.null`);
    }
}
exports.ElmRenderer = ElmRenderer;
