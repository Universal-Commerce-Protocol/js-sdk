"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PikeRenderer = void 0;
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class PikeRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    emitSourceStructure() {
        this.emitInformationComment();
        this.ensureBlankLine();
        this.forEachTopLevel("leading", (t, name) => {
            this.emitTopLevelTypedef(t, name);
            this.ensureBlankLine();
            this.emitTopLevelConverter(t, name);
            this.ensureBlankLine();
        }, (t) => this.namedTypeToNameForTopLevel(t) === undefined);
        this.ensureBlankLine();
        this.forEachNamedType("leading-and-interposing", (c, className) => this.emitClassDefinition(c, className), (e, n) => this.emitEnum(e, n), (u, n) => this.emitUnion(u, n));
    }
    get enumCasesInGlobalNamespace() {
        return true;
    }
    makeEnumCaseNamer() {
        return utils_1.enumNamingFunction;
    }
    makeNamedTypeNamer() {
        return utils_1.namedTypeNamingFunction;
    }
    makeUnionMemberNamer() {
        return utils_1.namingFunction;
    }
    namerForObjectProperty() {
        return utils_1.namingFunction;
    }
    forbiddenNamesForGlobalNamespace() {
        return [...constants_1.keywords];
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_e, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForUnionMembers(_u, _unionName) {
        return { names: [], includeGlobalForbidden: true };
    }
    sourceFor(t) {
        if (["class", "object", "enum"].includes(t.kind)) {
            return (0, Source_1.singleWord)(this.nameForNamedType(t));
        }
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.singleWord)("mixed"), (_nullType) => (0, Source_1.singleWord)("mixed"), (_boolType) => (0, Source_1.singleWord)("bool"), (_integerType) => (0, Source_1.singleWord)("int"), (_doubleType) => (0, Source_1.singleWord)("float"), (_stringType) => (0, Source_1.singleWord)("string"), (arrayType) => (0, Source_1.singleWord)([
            "array(",
            this.sourceFor(arrayType.items).source,
            ")",
        ]), (_classType) => (0, Source_1.singleWord)(this.nameForNamedType(_classType)), (mapType) => {
            const v = mapType.values;
            const valueSource = this.sourceFor(v).source;
            return (0, Source_1.singleWord)(["mapping(string:", valueSource, ")"]);
        }, (_enumType) => (0, Source_1.singleWord)("enum"), (unionType) => {
            if ((0, TypeUtils_1.nullableFromUnion)(unionType) !== null) {
                const children = Array.from(unionType.getChildren()).map((c) => (0, Source_1.parenIfNeeded)(this.sourceFor(c)));
                return (0, Source_1.multiWord)("|", ...children);
            }
            return (0, Source_1.singleWord)(this.nameForNamedType(unionType));
        });
    }
    emitClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitBlock(["class ", className], () => {
            this.emitClassMembers(c);
            this.ensureBlankLine();
            this.emitEncodingFunction(c);
        });
        this.ensureBlankLine();
        this.emitDecodingFunction(className, c);
    }
    emitEnum(e, enumName) {
        this.emitBlock([e.kind, " ", enumName], () => {
            const table = [];
            this.forEachEnumCase(e, "none", (name, jsonName) => {
                table.push([
                    [name, ' = "', (0, Strings_1.stringEscape)(jsonName), '", '],
                    ['// json: "', jsonName, '"'],
                ]);
            });
            this.emitTable(table);
        });
    }
    emitUnion(u, unionName) {
        const isMaybeWithSingleType = (0, TypeUtils_1.nullableFromUnion)(u);
        if (isMaybeWithSingleType !== null) {
            return;
        }
        this.emitDescription(this.descriptionForType(u));
        const [, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u);
        const types = [];
        this.forEachUnionMember(u, nonNulls, "none", null, (_name, t) => {
            const pikeType = this.sourceFor(t).source;
            types.push([pikeType]);
        });
        this.emitLine([
            "typedef ",
            types
                .map((r) => r.map((sl) => this.sourcelikeToString(sl)))
                .join("|"),
            " ",
            unionName,
            ";",
        ]);
        this.ensureBlankLine();
        this.emitBlock([unionName, " ", unionName, "_from_JSON(mixed json)"], () => {
            this.emitLine(["return json;"]);
        });
    }
    emitBlock(line, f, opening = " {", closing = "}") {
        this.emitLine(line, opening);
        this.indent(f);
        this.emitLine(closing);
    }
    emitMappingBlock(line, f) {
        this.emitBlock(line, f, "([", "]);");
    }
    emitClassMembers(c) {
        const table = [];
        this.forEachClassProperty(c, "none", (name, jsonName, p) => {
            const pikeType = this.sourceFor(p.type).source;
            table.push([
                [pikeType, " "],
                [name, "; "],
                ['// json: "', jsonName, '"'],
            ]);
        });
        this.emitTable(table);
    }
    emitInformationComment() {
        this.emitCommentLines([
            "This source has been automatically generated by quicktype.",
            "( https://github.com/quicktype/quicktype )",
            "",
            "To use this code, simply import it into your project as a Pike module.",
            "To JSON-encode your object, you can pass it to `Standards.JSON.encode`",
            "or call `encode_json` on it.",
            "",
            "To decode a JSON string, first pass it to `Standards.JSON.decode`,",
            "and then pass the result to `<YourClass>_from_JSON`.",
            "It will return an instance of <YourClass>.",
            "Bear in mind that these functions have unexpected behavior,",
            "and will likely throw an error, if the JSON string does not",
            "match the expected interface, even if the JSON itself is valid.",
        ], { lineStart: "// " });
    }
    emitTopLevelTypedef(t, name) {
        this.emitLine("typedef ", this.sourceFor(t).source, " ", name, ";");
    }
    emitTopLevelConverter(t, name) {
        this.emitBlock([name, " ", name, "_from_JSON(mixed json)"], () => {
            if (t instanceof Type_1.PrimitiveType) {
                this.emitLine(["return json;"]);
            }
            else if (t instanceof Type_1.ArrayType) {
                if (t.items instanceof Type_1.PrimitiveType)
                    this.emitLine(["return json;"]);
                else
                    this.emitLine([
                        "return map(json, ",
                        this.sourceFor(t.items).source,
                        "_from_JSON);",
                    ]);
            }
            else if (t instanceof Type_1.MapType) {
                const type = this.sourceFor(t.values).source;
                this.emitLine(["mapping(string:", type, ") retval = ([]);"]);
                let assignmentRval;
                if (t.values instanceof Type_1.PrimitiveType)
                    assignmentRval = ["(", type, ") v"];
                else
                    assignmentRval = [type, "_from_JSON(v)"];
                this.emitBlock(["foreach (json; string k; mixed v)"], () => {
                    this.emitLine(["retval[k] = ", assignmentRval, ";"]);
                });
                this.emitLine(["return retval;"]);
            }
        });
    }
    emitEncodingFunction(c) {
        this.emitBlock(["string encode_json()"], () => {
            this.emitMappingBlock(["mapping(string:mixed) json = "], () => {
                this.forEachClassProperty(c, "none", (name, jsonName) => {
                    this.emitLine([
                        '"',
                        (0, Strings_1.stringEscape)(jsonName),
                        '" : ',
                        name,
                        ",",
                    ]);
                });
            });
            this.ensureBlankLine();
            this.emitLine(["return Standards.JSON.encode(json);"]);
        });
    }
    emitDecodingFunction(className, c) {
        this.emitBlock([className, " ", className, "_from_JSON(mixed json)"], () => {
            this.emitLine([className, " retval = ", className, "();"]);
            this.ensureBlankLine();
            this.forEachClassProperty(c, "none", (name, jsonName) => {
                this.emitLine([
                    "retval.",
                    name,
                    ' = json["',
                    (0, Strings_1.stringEscape)(jsonName),
                    '"];',
                ]);
            });
            this.ensureBlankLine();
            this.emitLine(["return retval;"]);
        });
    }
}
exports.PikeRenderer = PikeRenderer;
