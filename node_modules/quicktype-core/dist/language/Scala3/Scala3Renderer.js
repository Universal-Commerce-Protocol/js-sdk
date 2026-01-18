"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scala3Renderer = void 0;
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class Scala3Renderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _scalaOptions) {
        super(targetLanguage, renderContext);
        this._scalaOptions = _scalaOptions;
    }
    forbiddenNamesForGlobalNamespace() {
        return constants_1.keywords;
    }
    forbiddenForObjectProperties(_, _classNamed) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForUnionMembers(_u, _unionName) {
        return { names: [], includeGlobalForbidden: false };
    }
    topLevelNameStyle(rawName) {
        return (0, utils_1.scalaNameStyle)(true, rawName);
    }
    makeNamedTypeNamer() {
        return utils_1.upperNamingFunction;
    }
    namerForObjectProperty() {
        return utils_1.lowerNamingFunction;
    }
    makeUnionMemberNamer() {
        return (0, Naming_1.funPrefixNamer)("upper", (s) => `${(0, utils_1.scalaNameStyle)(true, s)}Value`);
    }
    makeEnumCaseNamer() {
        return (0, Naming_1.funPrefixNamer)("upper", (s) => s.replace(" ", "")); // TODO - add backticks where appropriate
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
                : delimiter === "none"
                    ? ["", ""]
                    : ["{", "})"];
        this.emitLine(line, " ", open);
        this.indent(f);
        this.emitLine(close);
    }
    anySourceType(optional) {
        return [(0, utils_1.wrapOption)("Any", optional)];
    }
    // (asarazan): I've broken out the following two functions
    // because some renderers, such as kotlinx, can cope with `any`, while some get mad.
    arrayType(arrayType, withIssues = false) {
        return ["Seq[", this.scalaType(arrayType.items, withIssues), "]"];
    }
    mapType(mapType, withIssues = false) {
        return [
            "Map[String, ",
            this.scalaType(mapType.values, withIssues),
            "]",
        ];
    }
    scalaType(t, withIssues = false, noOptional = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => {
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, this.anySourceType(!noOptional));
        }, (_nullType) => {
            // return "None.type"
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, this.anySourceType(!noOptional));
        }, (_boolType) => "Boolean", (_integerType) => "Long", (_doubleType) => "Double", (_stringType) => "String", (arrayType) => this.arrayType(arrayType, withIssues), (classType) => this.nameForNamedType(classType), (mapType) => this.mapType(mapType, withIssues), (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                if (noOptional) {
                    return [this.scalaType(nullable, withIssues)];
                }
                return [
                    "Option[",
                    this.scalaType(nullable, withIssues),
                    "]",
                ];
            }
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
        this.emitLine("package ", this._scalaOptions.packageName);
        this.ensureBlankLine();
    }
    emitTopLevelArray(t, name) {
        const elementType = this.scalaType(t.items);
        this.emitLine(["type ", name, " = List[", elementType, "]"]);
    }
    emitTopLevelMap(t, name) {
        const elementType = this.scalaType(t.values);
        this.emitLine(["type ", name, " = Map[String, ", elementType, "]"]);
    }
    emitEmptyClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitLine("case class ", className, "()");
    }
    emitClassDefinition(c, className) {
        if (c.getProperties().size === 0) {
            this.emitEmptyClassDefinition(c, className);
            return;
        }
        const scalaType = (p) => {
            if (p.isOptional) {
                return ["Option[", this.scalaType(p.type, true, true), "]"];
            }
            return this.scalaType(p.type, true);
        };
        this.emitDescription(this.descriptionForType(c));
        this.emitLine("case class ", className, " (");
        this.indent(() => {
            let count = c.getProperties().size;
            let first = true;
            this.forEachClassProperty(c, "none", (_, jsonName, p) => {
                const nullable = p.type.kind === "union" &&
                    (0, TypeUtils_1.nullableFromUnion)(p.type) !== null;
                const nullableOrOptional = p.isOptional || p.type.kind === "null" || nullable;
                const last = --count === 0;
                const meta = [];
                const description = this.descriptionForClassProperty(c, jsonName);
                if (description !== undefined) {
                    meta.push(() => this.emitDescription(description));
                }
                if (meta.length > 0 && !first) {
                    this.ensureBlankLine();
                }
                for (const emit of meta) {
                    emit();
                }
                const nameNeedsBackticks = jsonName.endsWith("_") || (0, utils_1.shouldAddBacktick)(jsonName);
                const nameWithBackticks = nameNeedsBackticks
                    ? "`" + jsonName + "`"
                    : jsonName;
                this.emitLine("val ", nameWithBackticks, " : ", scalaType(p), p.isOptional
                    ? " = None"
                    : nullableOrOptional
                        ? " = None"
                        : "", last ? "" : ",");
                if (meta.length > 0 && !last) {
                    this.ensureBlankLine();
                }
                first = false;
            });
        });
        this.emitClassDefinitionMethods();
    }
    emitClassDefinitionMethods() {
        this.emitLine(")");
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitBlock(["enum ", enumName, " : "], () => {
            let count = e.cases.size;
            if (count > 0) {
                this.emitItem("\t case ");
            }
            this.forEachEnumCase(e, "none", (name, jsonName) => {
                if (!(jsonName === "")) {
                    const backticks = (0, utils_1.shouldAddBacktick)(jsonName) ||
                        jsonName.includes(" ") ||
                        !Number.isNaN(Number.parseInt(jsonName.charAt(0)));
                    if (backticks) {
                        this.emitItem("`");
                    }
                    this.emitItemOnce([name]);
                    if (backticks) {
                        this.emitItem("`");
                    }
                    if (--count > 0)
                        this.emitItem([","]);
                }
                else {
                    --count;
                }
            });
        }, "none");
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
        const theTypes = [];
        this.forEachUnionMember(u, nonNulls, "none", null, (_, t) => {
            theTypes.push(this.scalaType(t));
        });
        if (maybeNull !== null) {
            theTypes.push(this.nameForUnionMember(u, maybeNull));
        }
        this.emitItem(["type ", unionName, " = "]);
        theTypes.forEach((t, i) => {
            this.emitItem(i === 0 ? t : [" | ", t]);
        });
        this.ensureBlankLine();
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
        });
        this.forEachNamedType("leading-and-interposing", (c, n) => this.emitClassDefinition(c, n), (e, n) => this.emitEnumDefinition(e, n), (u, n) => this.emitUnionDefinition(u, n));
    }
}
exports.Scala3Renderer = Scala3Renderer;
