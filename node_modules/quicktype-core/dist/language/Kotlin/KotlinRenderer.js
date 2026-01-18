"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinRenderer = void 0;
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Acronyms_1 = require("../../support/Acronyms");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class KotlinRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _kotlinOptions) {
        super(targetLanguage, renderContext);
        this._kotlinOptions = _kotlinOptions;
    }
    forbiddenNamesForGlobalNamespace() {
        return constants_1.keywords;
    }
    forbiddenForObjectProperties(_o, _classNamed) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_e, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForUnionMembers(_u, _unionName) {
        return { names: [], includeGlobalForbidden: false };
    }
    topLevelNameStyle(rawName) {
        return (0, utils_1.kotlinNameStyle)(true, rawName);
    }
    makeNamedTypeNamer() {
        return (0, Naming_1.funPrefixNamer)("upper", (s) => (0, utils_1.kotlinNameStyle)(true, s, (0, Acronyms_1.acronymStyle)(this._kotlinOptions.acronymStyle)));
    }
    namerForObjectProperty() {
        return (0, Naming_1.funPrefixNamer)("lower", (s) => (0, utils_1.kotlinNameStyle)(false, s, (0, Acronyms_1.acronymStyle)(this._kotlinOptions.acronymStyle)));
    }
    makeUnionMemberNamer() {
        return (0, Naming_1.funPrefixNamer)("upper", (s) => `${(0, utils_1.kotlinNameStyle)(true, s)}Value`);
    }
    makeEnumCaseNamer() {
        return (0, Naming_1.funPrefixNamer)("upper", (s) => (0, utils_1.kotlinNameStyle)(true, s, (0, Acronyms_1.acronymStyle)(this._kotlinOptions.acronymStyle)));
    }
    emitDescriptionBlock(lines) {
        this.emitCommentLines(lines, {
            lineStart: " * ",
            beforeComment: "/**",
            afterComment: " */",
        });
    }
    emitBlock(line, f, delimiter = "curly") {
        const [open, close] = delimiter === "curly"
            ? ["{", "}"]
            : delimiter === "paren"
                ? ["(", ")"]
                : ["{", "})"];
        this.emitLine(line, " ", open);
        this.indent(f);
        this.emitLine(close);
    }
    anySourceType(optional) {
        return ["Any", optional];
    }
    // (asarazan): I've broken out the following two functions
    // because some renderers, such as kotlinx, can cope with `any`, while some get mad.
    arrayType(arrayType, withIssues = false, _noOptional = false) {
        return ["List<", this.kotlinType(arrayType.items, withIssues), ">"];
    }
    mapType(mapType, withIssues = false, _noOptional = false) {
        return [
            "Map<String, ",
            this.kotlinType(mapType.values, withIssues),
            ">",
        ];
    }
    kotlinType(t, withIssues = false, noOptional = false) {
        const optional = noOptional ? "" : "?";
        return (0, TypeUtils_1.matchType)(t, (_anyType) => {
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, this.anySourceType(optional));
        }, (_nullType) => {
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, this.anySourceType(optional));
        }, (_boolType) => "Boolean", (_integerType) => "Long", (_doubleType) => "Double", (_stringType) => "String", (arrayType) => this.arrayType(arrayType, withIssues), (classType) => this.nameForNamedType(classType), (mapType) => this.mapType(mapType, withIssues), (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return [this.kotlinType(nullable, withIssues), optional];
            return this.nameForNamedType(unionType);
        });
    }
    emitUsageHeader() {
        // To be overridden
    }
    emitHeader() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        else {
            this.emitUsageHeader();
        }
        this.ensureBlankLine();
        this.emitLine("package ", this._kotlinOptions.packageName);
        this.ensureBlankLine();
    }
    emitTopLevelPrimitive(t, name) {
        const elementType = this.kotlinType(t);
        this.emitLine(["typealias ", name, " = ", elementType, ""]);
    }
    emitTopLevelArray(t, name) {
        const elementType = this.kotlinType(t.items);
        this.emitLine(["typealias ", name, " = ArrayList<", elementType, ">"]);
    }
    emitTopLevelMap(t, name) {
        const elementType = this.kotlinType(t.values);
        this.emitLine([
            "typealias ",
            name,
            " = HashMap<String, ",
            elementType,
            ">",
        ]);
    }
    emitEmptyClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitClassAnnotations(c, className);
        this.emitLine("class ", className, "()");
    }
    emitClassDefinition(c, className) {
        if (c.getProperties().size === 0) {
            this.emitEmptyClassDefinition(c, className);
            return;
        }
        const kotlinType = (p) => {
            if (p.isOptional) {
                return [this.kotlinType(p.type, true, true), "?"];
            }
            return this.kotlinType(p.type, true);
        };
        this.emitDescription(this.descriptionForType(c));
        this.emitClassAnnotations(c, className);
        this.emitLine("data class ", className, " (");
        this.indent(() => {
            let count = c.getProperties().size;
            let first = true;
            this.forEachClassProperty(c, "none", (name, jsonName, p) => {
                const nullable = p.type.kind === "union" &&
                    (0, TypeUtils_1.nullableFromUnion)(p.type) !== null;
                const nullableOrOptional = p.isOptional || p.type.kind === "null" || nullable;
                const last = --count === 0;
                const meta = [];
                const description = this.descriptionForClassProperty(c, jsonName);
                if (description !== undefined) {
                    meta.push(() => this.emitDescription(description));
                }
                this.renameAttribute(name, jsonName, !nullableOrOptional, meta);
                if (meta.length > 0 && !first) {
                    this.ensureBlankLine();
                }
                for (const emit of meta) {
                    emit();
                }
                this.emitLine("val ", name, ": ", kotlinType(p), nullableOrOptional ? " = null" : "", last ? "" : ",");
                if (meta.length > 0 && !last) {
                    this.ensureBlankLine();
                }
                first = false;
            });
        });
        this.emitClassDefinitionMethods(c, className);
    }
    emitClassDefinitionMethods(_c, _className) {
        this.emitLine(")");
    }
    emitClassAnnotations(_c, _className) {
        // to be overridden
    }
    renameAttribute(_name, _jsonName, _required, _meta) {
        // to be overridden
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitBlock(["enum class ", enumName], () => {
            let count = e.cases.size;
            this.forEachEnumCase(e, "none", (name) => {
                this.emitLine(name, --count === 0 ? "" : ",");
            });
        });
    }
    emitUnionDefinition(u, unionName) {
        function sortBy(t) {
            const kind = t.kind;
            if (kind === "class")
                return kind;
            return `_${kind}`;
        }
        this.emitDescription(this.descriptionForType(u));
        const [maybeNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u, sortBy);
        this.emitClassAnnotations(u, unionName);
        this.emitBlock(["sealed class ", unionName], () => {
            {
                const table = [];
                this.forEachUnionMember(u, nonNulls, "none", null, (name, t) => {
                    table.push([
                        [
                            "class ",
                            name,
                            "(val value: ",
                            this.kotlinType(t),
                            ")",
                        ],
                        [" : ", unionName, "()"],
                    ]);
                });
                if (maybeNull !== null) {
                    table.push([
                        ["class ", this.nameForUnionMember(u, maybeNull), "()"],
                        [" : ", unionName, "()"],
                    ]);
                }
                this.emitTable(table);
            }
            this.emitUnionDefinitionMethods(u, nonNulls, maybeNull, unionName);
        });
    }
    emitUnionDefinitionMethods(_u, _nonNulls, _maybeNull, _unionName) {
        // to be overridden
    }
    emitSourceStructure() {
        this.emitHeader();
        // Top-level arrays, maps
        this.forEachTopLevel("leading", (t, name) => {
            if (t instanceof Type_1.ArrayType) {
                this.emitTopLevelArray(t, name);
            }
            else if (t instanceof Type_1.MapType) {
                this.emitTopLevelMap(t, name);
            }
            else if (t.isPrimitive()) {
                this.emitTopLevelPrimitive(t, name);
            }
        });
        this.forEachNamedType("leading-and-interposing", (c, n) => this.emitClassDefinition(c, n), (e, n) => this.emitEnumDefinition(e, n), (u, n) => this.emitUnionDefinition(u, n));
    }
}
exports.KotlinRenderer = KotlinRenderer;
