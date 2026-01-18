"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrystalRenderer = void 0;
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Source_1 = require("../../Source");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class CrystalRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext) {
        super(targetLanguage, renderContext);
    }
    makeNamedTypeNamer() {
        return utils_1.camelNamingFunction;
    }
    namerForObjectProperty() {
        return utils_1.snakeNamingFunction;
    }
    makeUnionMemberNamer() {
        return utils_1.camelNamingFunction;
    }
    makeEnumCaseNamer() {
        return utils_1.camelNamingFunction;
    }
    forbiddenNamesForGlobalNamespace() {
        return constants_1.keywords;
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForUnionMembers(_u, _unionName) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_e, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    get commentLineStart() {
        return "# ";
    }
    nullableCrystalType(t, withIssues) {
        return [this.crystalType(t, withIssues), "?"];
    }
    isImplicitCycleBreaker(t) {
        const kind = t.kind;
        return kind === "array" || kind === "map";
    }
    crystalType(t, withIssues = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, "JSON::Any?"), (_nullType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, "Nil"), (_boolType) => "Bool", (_integerType) => "Int32", (_doubleType) => "Float64", (_stringType) => "String", (arrayType) => [
            "Array(",
            this.crystalType(arrayType.items, withIssues),
            ")",
        ], (classType) => this.nameForNamedType(classType), (mapType) => [
            "Hash(String, ",
            this.crystalType(mapType.values, withIssues),
            ")",
        ], (_enumType) => "String", (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return this.nullableCrystalType(nullable, withIssues);
            const [hasNull] = (0, TypeUtils_1.removeNullFromUnion)(unionType);
            const name = this.nameForNamedType(unionType);
            return hasNull !== null ? [name, "?"] : name;
        });
    }
    breakCycle(t, withIssues) {
        return this.crystalType(t, withIssues);
    }
    emitRenameAttribute(propName, jsonName) {
        const escapedName = (0, utils_1.crystalStringEscape)(jsonName);
        const namesDiffer = this.sourcelikeToString(propName) !== escapedName;
        if (namesDiffer) {
            this.emitLine('@[JSON::Field(key: "', escapedName, '")]');
        }
    }
    emitStructDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        const structBody = () => this.forEachClassProperty(c, "none", (name, jsonName, prop) => {
            this.ensureBlankLine();
            this.emitDescription(this.descriptionForClassProperty(c, jsonName));
            this.emitRenameAttribute(name, jsonName);
            this.emitLine("property ", name, " : ", this.crystalType(prop.type, true));
        });
        this.emitBlock(["class ", className], structBody);
    }
    emitBlock(line, f) {
        this.emitLine(line);
        this.indent(() => {
            this.emitLine("include JSON::Serializable");
        });
        this.ensureBlankLine();
        this.indent(f);
        this.emitLine("end");
    }
    emitEnum(line, f) {
        this.emitLine(line);
        this.indent(f);
        this.emitLine("end");
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
            const crystalType = this.breakCycle(t, true);
            types.push([crystalType]);
        });
        this.emitLine([
            "alias ",
            unionName,
            " = ",
            types
                .map((r) => r.map((sl) => this.sourcelikeToString(sl)))
                .join(" | "),
        ]);
    }
    emitTopLevelAlias(t, name) {
        this.emitLine("alias ", name, " = ", this.crystalType(t));
    }
    emitLeadingComments() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
            return;
        }
    }
    emitSourceStructure() {
        this.emitLeadingComments();
        this.ensureBlankLine();
        this.emitLine('require "json"');
        this.forEachTopLevel("leading", (t, name) => this.emitTopLevelAlias(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
        this.forEachObject("leading-and-interposing", (c, name) => this.emitStructDefinition(c, name));
        this.forEachUnion("leading-and-interposing", (u, name) => this.emitUnion(u, name));
    }
}
exports.CrystalRenderer = CrystalRenderer;
