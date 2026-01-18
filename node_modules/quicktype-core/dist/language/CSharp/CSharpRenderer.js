"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSharpRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Source_1 = require("../../Source");
const Support_1 = require("../../support/Support");
const Transformers_1 = require("../../Transformers");
const TypeUtils_1 = require("../../Type/TypeUtils");
const utils_1 = require("./utils");
class CSharpRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _csOptions) {
        super(targetLanguage, renderContext);
        this._csOptions = _csOptions;
    }
    forbiddenNamesForGlobalNamespace() {
        return [
            "QuickType",
            "Type",
            "System",
            "Console",
            "Exception",
            "DateTimeOffset",
            "Guid",
            "Uri",
        ];
    }
    forbiddenForObjectProperties(_, classNamed) {
        return {
            names: [
                classNamed,
                "ToString",
                "GetHashCode",
                "Finalize",
                "Equals",
                "GetType",
                "MemberwiseClone",
                "ReferenceEquals",
            ],
            includeGlobalForbidden: false,
        };
    }
    forbiddenForUnionMembers(_, unionNamed) {
        return { names: [unionNamed], includeGlobalForbidden: true };
    }
    makeNamedTypeNamer() {
        return utils_1.namingFunction;
    }
    namerForObjectProperty() {
        return this._csOptions.keepPropertyName
            ? utils_1.namingFunctionKeep
            : utils_1.namingFunction;
    }
    makeUnionMemberNamer() {
        return utils_1.namingFunction;
    }
    makeEnumCaseNamer() {
        return utils_1.namingFunction;
    }
    unionNeedsName(u) {
        return (0, TypeUtils_1.nullableFromUnion)(u) === null;
    }
    namedTypeToNameForTopLevel(type) {
        // If the top-level type doesn't contain any classes or unions
        // we have to define a class just for the `FromJson` method, in
        // emitFromJsonForTopLevel.
        return (0, TypeUtils_1.directlyReachableSingleNamedType)(type);
    }
    emitBlock(f, semicolon = false) {
        this.emitLine("{");
        this.indent(f);
        this.emitLine("}", semicolon ? ";" : "");
    }
    get doubleType() {
        return this._csOptions.useDecimal ? "decimal" : "double";
    }
    csType(t, follow = Transformers_1.followTargetType, withIssues = false) {
        const actualType = follow(t);
        return (0, TypeUtils_1.matchType)(actualType, (_anyType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, this._csOptions.typeForAny), (_nullType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, this._csOptions.typeForAny), (_boolType) => "bool", (_integerType) => "long", (_doubleType) => this.doubleType, (_stringType) => "string", (arrayType) => {
            const itemsType = this.csType(arrayType.items, follow, withIssues);
            if (this._csOptions.useList) {
                return ["List<", itemsType, ">"];
            }
            else {
                return [itemsType, "[]"];
            }
        }, (classType) => this.nameForNamedType(classType), (mapType) => [
            "Dictionary<string, ",
            this.csType(mapType.values, follow, withIssues),
            ">",
        ], (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return this.nullableCSType(nullable, utils_1.noFollow);
            return this.nameForNamedType(unionType);
        }, (transformedStringType) => (0, utils_1.csTypeForTransformedStringType)(transformedStringType));
    }
    nullableCSType(t, follow = Transformers_1.followTargetType, withIssues = false) {
        t = (0, Transformers_1.followTargetType)(t);
        const csType = this.csType(t, follow, withIssues);
        if ((0, utils_1.isValueType)(t)) {
            return [csType, "?"];
        }
        else {
            return csType;
        }
    }
    baseclassForType(_t) {
        return undefined;
    }
    emitType(description, accessModifier, declaration, name, baseclass, emitter) {
        switch (accessModifier) {
            case utils_1.AccessModifier.Public:
                declaration = ["public ", declaration];
                break;
            case utils_1.AccessModifier.Internal:
                declaration = ["internal ", declaration];
                break;
            default:
                break;
        }
        this.emitDescription(description);
        if (baseclass === undefined) {
            this.emitLine(declaration, " ", name);
        }
        else {
            this.emitLine(declaration, " ", name, " : ", baseclass);
        }
        this.emitBlock(emitter);
    }
    attributesForProperty(_property, _name, _c, _jsonName) {
        return undefined;
    }
    propertyDefinition(property, name, _c, _jsonName) {
        const t = property.type;
        const csType = property.isOptional
            ? this.nullableCSType(t, Transformers_1.followTargetType, true)
            : this.csType(t, Transformers_1.followTargetType, true);
        const propertyArray = ["public "];
        if (this._csOptions.virtual)
            propertyArray.push("virtual ");
        return [...propertyArray, csType, " ", name, " { get; set; }"];
    }
    emitDescriptionBlock(lines) {
        const start = "/// <summary>";
        if (this._csOptions.dense) {
            this.emitLine(start, lines.join("; "), "</summary>");
        }
        else {
            this.emitCommentLines(lines, {
                lineStart: "/// ",
                beforeComment: start,
                afterComment: "/// </summary>",
            });
        }
    }
    blankLinesBetweenAttributes() {
        return false;
    }
    emitClassDefinition(c, className) {
        this.emitType(this.descriptionForType(c), utils_1.AccessModifier.Public, "partial class", className, this.baseclassForType(c), () => {
            if (c.getProperties().size === 0)
                return;
            const blankLines = this.blankLinesBetweenAttributes()
                ? "interposing"
                : "none";
            const columns = [];
            let isFirstProperty = true;
            let previousDescription = undefined;
            this.forEachClassProperty(c, blankLines, (name, jsonName, p) => {
                const attributes = this.attributesForProperty(p, name, c, jsonName);
                const description = this.descriptionForClassProperty(c, jsonName);
                const property = this.propertyDefinition(p, name, c, jsonName);
                if (attributes === undefined) {
                    if (
                    // Descriptions should be preceded by an empty line
                    (!isFirstProperty &&
                        description !== undefined) ||
                        // If the previous property has a description, leave an empty line
                        previousDescription !== undefined) {
                        this.ensureBlankLine();
                    }
                    this.emitDescription(description);
                    this.emitLine(property);
                }
                else if (this._csOptions.dense &&
                    attributes.length > 0) {
                    const comment = description === undefined
                        ? ""
                        : ` // ${description.join("; ")}`;
                    columns.push([attributes, " ", property, comment]);
                }
                else {
                    this.emitDescription(description);
                    for (const attribute of attributes) {
                        this.emitLine(attribute);
                    }
                    this.emitLine(property);
                }
                isFirstProperty = false;
                previousDescription = description;
            });
            if (columns.length > 0) {
                this.emitTable(columns);
            }
        });
    }
    emitUnionDefinition(u, unionName) {
        const nonNulls = (0, TypeUtils_1.removeNullFromUnion)(u, true)[1];
        this.emitType(this.descriptionForType(u), utils_1.AccessModifier.Public, "partial struct", unionName, this.baseclassForType(u), () => {
            this.forEachUnionMember(u, nonNulls, "none", null, (fieldName, t) => {
                const csType = this.nullableCSType(t);
                this.emitLine("public ", csType, " ", fieldName, ";");
            });
            this.ensureBlankLine();
            const nullTests = Array.from(nonNulls).map((t) => [this.nameForUnionMember(u, t), " == null"]);
            this.ensureBlankLine();
            this.forEachUnionMember(u, nonNulls, "none", null, (fieldName, t) => {
                const csType = this.csType(t);
                this.emitExpressionMember([
                    "public static implicit operator ",
                    unionName,
                    "(",
                    csType,
                    " ",
                    fieldName,
                    ")",
                ], [
                    "new ",
                    unionName,
                    " { ",
                    fieldName,
                    " = ",
                    fieldName,
                    " }",
                ]);
            });
            if (u.findMember("null") === undefined)
                return;
            this.emitExpressionMember("public bool IsNull", (0, collection_utils_1.arrayIntercalate)(" && ", nullTests), true);
        });
    }
    emitEnumDefinition(e, enumName) {
        const caseNames = [];
        this.forEachEnumCase(e, "none", (name) => {
            if (caseNames.length > 0)
                caseNames.push(", ");
            caseNames.push(name);
        });
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("public enum ", enumName, " { ", caseNames, " };");
    }
    emitExpressionMember(declare, define, isProperty = false) {
        if (this._csOptions.version === 5) {
            this.emitLine(declare);
            this.emitBlock(() => {
                const stmt = ["return ", define, ";"];
                if (isProperty) {
                    this.emitLine("get");
                    this.emitBlock(() => this.emitLine(stmt));
                }
                else {
                    this.emitLine(stmt);
                }
            });
        }
        else {
            this.emitLine(declare, " => ", define, ";");
        }
    }
    emitTypeSwitch(types, condition, withBlock, withReturn, f) {
        (0, Support_1.assert)(!withReturn || withBlock, "Can only have return with block");
        for (const t of types) {
            this.emitLine("if (", condition(t), ")");
            if (withBlock) {
                this.emitBlock(() => {
                    f(t);
                    if (withReturn) {
                        this.emitLine("return;");
                    }
                });
            }
            else {
                this.indent(() => f(t));
            }
        }
    }
    emitUsing(ns) {
        this.emitLine("using ", ns, ";");
    }
    emitUsings() {
        for (const ns of ["System", "System.Collections.Generic"]) {
            this.emitUsing(ns);
        }
    }
    emitRequiredHelpers() {
        return;
    }
    emitTypesAndSupport() {
        this.forEachObject("leading-and-interposing", (c, name) => this.emitClassDefinition(c, name));
        this.forEachEnum("leading-and-interposing", (e, name) => this.emitEnumDefinition(e, name));
        this.forEachUnion("leading-and-interposing", (u, name) => this.emitUnionDefinition(u, name));
        this.emitRequiredHelpers();
    }
    emitDefaultLeadingComments() {
        return;
    }
    emitDefaultFollowingComments() {
        return;
    }
    needNamespace() {
        return true;
    }
    emitSourceStructure() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        else {
            this.emitDefaultLeadingComments();
        }
        this.ensureBlankLine();
        if (this.needNamespace()) {
            this.emitLine("namespace ", this._csOptions.namespace);
            this.emitBlock(() => {
                this.emitUsings();
                this.emitTypesAndSupport();
            });
        }
        else {
            this.emitUsings();
            this.emitTypesAndSupport();
        }
        this.emitDefaultFollowingComments();
    }
    emitDependencyUsings() {
        let genericEmited = false;
        let ensureGenericOnce = () => {
            if (!genericEmited) {
                this.emitUsing("System.Collections.Generic");
                genericEmited = true;
            }
        };
        this.typeGraph.allTypesUnordered().forEach(_ => {
            (0, TypeUtils_1.matchCompoundType)(_, _arrayType => this._csOptions.useList ? ensureGenericOnce() : undefined, _classType => { }, _mapType => ensureGenericOnce(), _objectType => { }, _unionType => { });
        });
    }
}
exports.CSharpRenderer = CSharpRenderer;
