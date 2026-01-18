"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinKlaxonRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const KotlinRenderer_1 = require("./KotlinRenderer");
const utils_1 = require("./utils");
class KotlinKlaxonRenderer extends KotlinRenderer_1.KotlinRenderer {
    constructor(targetLanguage, renderContext, _kotlinOptions) {
        super(targetLanguage, renderContext, _kotlinOptions);
    }
    unionMemberFromJsonValue(t, e) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => [e, ".inside"], (_nullType) => "null", (_boolType) => [e, ".boolean"], (_integerType) => ["(", e, ".int?.toLong() ?: ", e, ".longValue)"], (_doubleType) => [e, ".double"], (_stringType) => [e, ".string"], (arrayType) => [
            e,
            ".array?.let { klaxon.parseFromJsonArray<",
            this.kotlinType(arrayType.items),
            ">(it) }",
        ], (_classType) => [
            e,
            ".obj?.let { klaxon.parseFromJsonObject<",
            this.kotlinType(t),
            ">(it) }",
        ], (_mapType) => [
            e,
            ".obj?.let { klaxon.parseFromJsonObject<",
            this.kotlinType(t),
            ">(it) }",
        ], (enumType) => [
            e,
            ".string?.let { ",
            this.kotlinType(enumType),
            ".fromValue(it) }",
        ], (_unionType) => (0, Support_1.mustNotHappen)());
    }
    unionMemberJsonValueGuard(t, _e) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => "is Any", (_nullType) => "null", (_boolType) => "is Boolean", (_integerType) => "is Int, is Long", (_doubleType) => "is Double", (_stringType) => "is String", (_arrayType) => "is JsonArray<*>", 
        // These could be stricter, but for now we don't allow maps
        // and objects in the same union
        (_classType) => "is JsonObject", (_mapType) => "is JsonObject", 
        // This could be stricter, but for now we don't allow strings
        // and enums in the same union
        (_enumType) => "is String", (_unionType) => (0, Support_1.mustNotHappen)());
    }
    emitUsageHeader() {
        this.emitLine("// To parse the JSON, install Klaxon and do:");
        this.emitLine("//");
        this.forEachTopLevel("none", (_, name) => {
            this.emitLine("//   val ", (0, Source_1.modifySource)(Strings_1.camelCase, name), " = ", name, ".fromJson(jsonString)");
        });
    }
    emitHeader() {
        super.emitHeader();
        this.emitLine("import com.beust.klaxon.*");
        const hasUnions = (0, collection_utils_1.iterableSome)(this.typeGraph.allNamedTypes(), (t) => t instanceof Type_1.UnionType && (0, TypeUtils_1.nullableFromUnion)(t) === null);
        const hasEmptyObjects = (0, collection_utils_1.iterableSome)(this.typeGraph.allNamedTypes(), (c) => c instanceof Type_1.ClassType && c.getProperties().size === 0);
        if (hasUnions || this.haveEnums || hasEmptyObjects) {
            this.emitGenericConverter();
        }
        const converters = [];
        if (hasEmptyObjects) {
            converters.push([
                [".convert(JsonObject::class,"],
                [" { it.obj!! },"],
                [" { it.toJsonString() })"],
            ]);
        }
        this.forEachEnum("none", (_, name) => {
            converters.push([
                [".convert(", name, "::class,"],
                [" { ", name, ".fromValue(it.string!!) },"],
                [' { "\\"${it.value}\\"" })'],
            ]);
        });
        this.forEachUnion("none", (_, name) => {
            converters.push([
                [".convert(", name, "::class,"],
                [" { ", name, ".fromJson(it) },"],
                [" { it.toJson() }, true)"],
            ]);
        });
        this.ensureBlankLine();
        this.emitLine("private val klaxon = Klaxon()");
        if (converters.length > 0) {
            this.indent(() => this.emitTable(converters));
        }
    }
    emitTopLevelArray(t, name) {
        const elementType = this.kotlinType(t.items);
        this.emitBlock([
            "class ",
            name,
            "(elements: Collection<",
            elementType,
            ">) : ArrayList<",
            elementType,
            ">(elements)",
        ], () => {
            this.emitLine("public fun toJson() = klaxon.toJsonString(this)");
            this.ensureBlankLine();
            this.emitBlock("companion object", () => {
                this.emitLine("public fun fromJson(json: String) = ", name, "(klaxon.parseArray<", elementType, ">(json)!!)");
            });
        });
    }
    emitTopLevelMap(t, name) {
        const elementType = this.kotlinType(t.values);
        this.emitBlock([
            "class ",
            name,
            "(elements: Map<String, ",
            elementType,
            ">) : HashMap<String, ",
            elementType,
            ">(elements)",
        ], () => {
            this.emitLine("public fun toJson() = klaxon.toJsonString(this)");
            this.ensureBlankLine();
            this.emitBlock("companion object", () => {
                this.emitBlock(["public fun fromJson(json: String) = ", name], () => {
                    this.emitLine("klaxon.parseJsonObject(java.io.StringReader(json)) as Map<String, ", elementType, ">");
                }, "paren");
            });
        });
    }
    klaxonRenameAttribute(propName, jsonName, ignore = false) {
        const escapedName = (0, utils_1.stringEscape)(jsonName);
        const namesDiffer = this.sourcelikeToString(propName) !== escapedName;
        const properties = [];
        if (namesDiffer) {
            properties.push(['name = "', escapedName, '"']);
        }
        if (ignore) {
            properties.push("ignored = true");
        }
        return properties.length === 0
            ? undefined
            : ["@Json(", (0, collection_utils_1.arrayIntercalate)(", ", properties), ")"];
    }
    emitEmptyClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitLine("typealias ", className, " = JsonObject");
    }
    emitClassDefinitionMethods(c, className) {
        const isTopLevel = (0, collection_utils_1.iterableSome)(this.topLevels, ([_, top]) => top === c);
        if (isTopLevel) {
            this.emitBlock(")", () => {
                this.emitLine("public fun toJson() = klaxon.toJsonString(this)");
                this.ensureBlankLine();
                this.emitBlock("companion object", () => {
                    this.emitLine("public fun fromJson(json: String) = klaxon.parse<", className, ">(json)");
                });
            });
        }
        else {
            this.emitLine(")");
        }
    }
    renameAttribute(name, jsonName, _required, meta) {
        const rename = this.klaxonRenameAttribute(name, jsonName);
        if (rename !== undefined) {
            meta.push(() => this.emitLine(rename));
        }
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitBlock(["enum class ", enumName, "(val value: String)"], () => {
            let count = e.cases.size;
            this.forEachEnumCase(e, "none", (name, json) => {
                this.emitLine(name, `("${(0, utils_1.stringEscape)(json)}")`, --count === 0 ? ";" : ",");
            });
            this.ensureBlankLine();
            this.emitBlock("companion object", () => {
                this.emitBlock([
                    "public fun fromValue(value: String): ",
                    enumName,
                    " = when (value)",
                ], () => {
                    const table = [];
                    this.forEachEnumCase(e, "none", (name, json) => {
                        table.push([
                            [`"${(0, utils_1.stringEscape)(json)}"`],
                            [" -> ", name],
                        ]);
                    });
                    table.push([
                        ["else"],
                        [" -> throw IllegalArgumentException()"],
                    ]);
                    this.emitTable(table);
                });
            });
        });
    }
    emitGenericConverter() {
        this.ensureBlankLine();
        this.emitLine("private fun <T> Klaxon.convert(k: kotlin.reflect.KClass<*>, fromJson: (JsonValue) -> T, toJson: (T) -> String, isUnion: Boolean = false) =");
        this.indent(() => {
            this.emitLine("this.converter(object: Converter {");
            this.indent(() => {
                this.emitLine('@Suppress("UNCHECKED_CAST")');
                this.emitTable([
                    [
                        "override fun toJson(value: Any)",
                        " = toJson(value as T)",
                    ],
                    [
                        "override fun fromJson(jv: JsonValue)",
                        " = fromJson(jv) as Any",
                    ],
                    [
                        "override fun canConvert(cls: Class<*>)",
                        " = cls == k.java || (isUnion && cls.superclass == k.java)",
                    ],
                ]);
            });
            this.emitLine("})");
        });
    }
    emitUnionDefinitionMethods(u, nonNulls, maybeNull, unionName) {
        this.ensureBlankLine();
        this.emitLine("public fun toJson(): String = klaxon.toJsonString(when (this) {");
        this.indent(() => {
            const toJsonTable = [];
            this.forEachUnionMember(u, nonNulls, "none", null, (name) => {
                toJsonTable.push([["is ", name], [" -> this.value"]]);
            });
            if (maybeNull !== null) {
                const name = this.nameForUnionMember(u, maybeNull);
                toJsonTable.push([["is ", name], [' -> "null"']]);
            }
            this.emitTable(toJsonTable);
        });
        this.emitLine("})");
        this.ensureBlankLine();
        this.emitBlock("companion object", () => {
            this.emitLine("public fun fromJson(jv: JsonValue): ", unionName, " = when (jv.inside) {");
            this.indent(() => {
                const table = [];
                this.forEachUnionMember(u, nonNulls, "none", null, (name, t) => {
                    table.push([
                        [this.unionMemberJsonValueGuard(t, "jv.inside")],
                        [
                            " -> ",
                            name,
                            "(",
                            this.unionMemberFromJsonValue(t, "jv"),
                            "!!)",
                        ],
                    ]);
                });
                if (maybeNull !== null) {
                    const name = this.nameForUnionMember(u, maybeNull);
                    table.push([
                        [
                            this.unionMemberJsonValueGuard(maybeNull, "jv.inside"),
                        ],
                        [" -> ", name, "()"],
                    ]);
                }
                table.push([
                    ["else"],
                    [" -> throw IllegalArgumentException()"],
                ]);
                this.emitTable(table);
            });
            this.emitLine("}");
        });
    }
}
exports.KotlinKlaxonRenderer = KotlinKlaxonRenderer;
