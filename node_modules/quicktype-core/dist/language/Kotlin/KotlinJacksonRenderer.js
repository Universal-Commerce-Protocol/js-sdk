"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinJacksonRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const KotlinRenderer_1 = require("./KotlinRenderer");
const utils_1 = require("./utils");
class KotlinJacksonRenderer extends KotlinRenderer_1.KotlinRenderer {
    constructor(targetLanguage, renderContext, _kotlinOptions) {
        super(targetLanguage, renderContext, _kotlinOptions);
    }
    unionMemberJsonValueGuard(t, _e) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => "is Any", (_nullType) => "null", (_boolType) => "is BooleanNode", (_integerType) => "is IntNode, is LongNode", (_doubleType) => "is DoubleNode", (_stringType) => "is TextNode", (_arrayType) => "is ArrayNode", 
        // These could be stricter, but for now we don't allow maps
        // and objects in the same union
        (_classType) => "is ObjectNode", (_mapType) => "is ObjectNode", 
        // This could be stricter, but for now we don't allow strings
        // and enums in the same union
        (_enumType) => "is TextNode", (_unionType) => (0, Support_1.mustNotHappen)());
    }
    emitUsageHeader() {
        this.emitLine("// To parse the JSON, install jackson-module-kotlin and do:");
        this.emitLine("//");
        this.forEachTopLevel("none", (_, name) => {
            this.emitLine("//   val ", (0, Source_1.modifySource)(Strings_1.camelCase, name), " = ", name, ".fromJson(jsonString)");
        });
    }
    emitHeader() {
        super.emitHeader();
        this.emitMultiline(`import com.fasterxml.jackson.annotation.*
import com.fasterxml.jackson.core.*
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.node.*
import com.fasterxml.jackson.databind.ser.std.StdSerializer
import com.fasterxml.jackson.module.kotlin.*`);
        const hasUnions = (0, collection_utils_1.iterableSome)(this.typeGraph.allNamedTypes(), (t) => t instanceof Type_1.UnionType && (0, TypeUtils_1.nullableFromUnion)(t) === null);
        const hasEmptyObjects = (0, collection_utils_1.iterableSome)(this.typeGraph.allNamedTypes(), (c) => c instanceof Type_1.ClassType && c.getProperties().size === 0);
        if (hasUnions || this.haveEnums || hasEmptyObjects) {
            this.emitGenericConverter();
        }
        const converters = [];
        // if (hasEmptyObjects) {
        //     converters.push([["convert(JsonNode::class,"], [" { it },"], [" { writeValueAsString(it) })"]]);
        // }
        this.forEachEnum("none", (_, name) => {
            converters.push([
                ["convert(", name, "::class,"],
                [" { ", name, ".fromValue(it.asText()) },"],
                [' { "\\"${it.value}\\"" })'],
            ]);
        });
        this.forEachUnion("none", (_, name) => {
            converters.push([
                ["convert(", name, "::class,"],
                [" { ", name, ".fromJson(it) },"],
                [" { it.toJson() }, true)"],
            ]);
        });
        this.ensureBlankLine();
        this.emitLine("val mapper = jacksonObjectMapper().apply {");
        this.indent(() => {
            this.emitLine("propertyNamingStrategy = PropertyNamingStrategy.LOWER_CAMEL_CASE");
            this.emitLine("setSerializationInclusion(JsonInclude.Include.NON_NULL)");
        });
        if (converters.length > 0) {
            this.indent(() => this.emitTable(converters));
        }
        this.emitLine("}");
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
            this.emitLine("fun toJson() = mapper.writeValueAsString(this)");
            this.ensureBlankLine();
            this.emitBlock("companion object", () => {
                this.emitLine("fun fromJson(json: String) = mapper.readValue<", name, ">(json)");
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
            this.emitLine("fun toJson() = mapper.writeValueAsString(this)");
            this.ensureBlankLine();
            this.emitBlock("companion object", () => {
                this.emitLine("fun fromJson(json: String) = mapper.readValue<", name, ">(json)");
            });
        });
    }
    jacksonRenameAttribute(propName, jsonName, required, ignore = false) {
        const escapedName = (0, utils_1.stringEscape)(jsonName);
        const namesDiffer = this.sourcelikeToString(propName) !== escapedName;
        const properties = [];
        const isPrefixBool = jsonName.startsWith("is"); // https://github.com/FasterXML/jackson-module-kotlin/issues/80
        const propertyOpts = [];
        if (namesDiffer || isPrefixBool) {
            propertyOpts.push(`"${escapedName}"`);
        }
        if (required) {
            propertyOpts.push("required=true");
        }
        if (propertyOpts.length > 0) {
            properties.push([
                "@get:JsonProperty(",
                (0, collection_utils_1.arrayIntercalate)(", ", propertyOpts),
                ")",
            ]);
            properties.push([
                "@field:JsonProperty(",
                (0, collection_utils_1.arrayIntercalate)(", ", propertyOpts),
                ")",
            ]);
        }
        if (ignore) {
            properties.push("@get:JsonIgnore");
            properties.push("@field:JsonIgnore");
        }
        return properties.length === 0 ? undefined : properties;
    }
    emitEmptyClassDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitLine("typealias ", className, " = JsonNode");
    }
    emitClassDefinitionMethods(c, className) {
        const isTopLevel = (0, collection_utils_1.iterableSome)(this.topLevels, ([_, top]) => top === c);
        if (isTopLevel) {
            this.emitBlock(")", () => {
                this.emitLine("fun toJson() = mapper.writeValueAsString(this)");
                this.ensureBlankLine();
                this.emitBlock("companion object", () => {
                    this.emitLine("fun fromJson(json: String) = mapper.readValue<", className, ">(json)");
                });
            });
        }
        else {
            this.emitLine(")");
        }
    }
    renameAttribute(name, jsonName, required, meta) {
        const rename = this.jacksonRenameAttribute(name, jsonName, required);
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
                    "fun fromValue(value: String): ",
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
        this.emitMultiline(`
@Suppress("UNCHECKED_CAST")
private fun <T> ObjectMapper.convert(k: kotlin.reflect.KClass<*>, fromJson: (JsonNode) -> T, toJson: (T) -> String, isUnion: Boolean = false) = registerModule(SimpleModule().apply {
	addSerializer(k.java as Class<T>, object : StdSerializer<T>(k.java as Class<T>) {
			override fun serialize(value: T, gen: JsonGenerator, provider: SerializerProvider) = gen.writeRawValue(toJson(value))
	})
	addDeserializer(k.java as Class<T>, object : StdDeserializer<T>(k.java as Class<T>) {
			override fun deserialize(p: JsonParser, ctxt: DeserializationContext) = fromJson(p.readValueAsTree())
	})
})`);
    }
    emitUnionDefinitionMethods(u, nonNulls, maybeNull, unionName) {
        this.ensureBlankLine();
        this.emitLine("fun toJson(): String = mapper.writeValueAsString(when (this) {");
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
            this.emitLine("fun fromJson(jn: JsonNode): ", unionName, " = when (jn) {");
            this.indent(() => {
                const table = [];
                this.forEachUnionMember(u, nonNulls, "none", null, (name, t) => {
                    table.push([
                        [this.unionMemberJsonValueGuard(t, "jn")],
                        [" -> ", name, "(mapper.treeToValue(jn))"],
                    ]);
                });
                if (maybeNull !== null) {
                    const name = this.nameForUnionMember(u, maybeNull);
                    table.push([
                        [this.unionMemberJsonValueGuard(maybeNull, "jn")],
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
exports.KotlinJacksonRenderer = KotlinJacksonRenderer;
