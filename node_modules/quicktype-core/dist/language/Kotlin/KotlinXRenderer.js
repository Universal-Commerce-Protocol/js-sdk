"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KotlinXRenderer = void 0;
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const KotlinRenderer_1 = require("./KotlinRenderer");
const utils_1 = require("./utils");
/**
 * Currently supports simple classes, enums, and TS string unions (which are also enums).
 * TODO: Union, Any, Top Level Array, Top Level Map
 */
class KotlinXRenderer extends KotlinRenderer_1.KotlinRenderer {
    constructor(targetLanguage, renderContext, _kotlinOptions) {
        super(targetLanguage, renderContext, _kotlinOptions);
    }
    anySourceType(optional) {
        return ["JsonElement", optional];
    }
    arrayType(arrayType, withIssues = false, noOptional = false) {
        const valType = this.kotlinType(arrayType.items, withIssues, true);
        const name = this.sourcelikeToString(valType);
        if (name === "JsonObject" || name === "JsonElement") {
            return "JsonArray";
        }
        return super.arrayType(arrayType, withIssues, noOptional);
    }
    mapType(mapType, withIssues = false, noOptional = false) {
        const valType = this.kotlinType(mapType.values, withIssues, true);
        const name = this.sourcelikeToString(valType);
        if (name === "JsonObject" || name === "JsonElement") {
            return "JsonObject";
        }
        return super.mapType(mapType, withIssues, noOptional);
    }
    emitTopLevelMap(t, name) {
        const elementType = this.kotlinType(t.values);
        if (elementType === "JsonObject") {
            this.emitLine(["typealias ", name, " = JsonObject"]);
        }
        else {
            super.emitTopLevelMap(t, name);
        }
    }
    emitTopLevelArray(t, name) {
        const elementType = this.kotlinType(t.items);
        this.emitLine(["typealias ", name, " = JsonArray<", elementType, ">"]);
    }
    emitUsageHeader() {
        this.emitLine("// To parse the JSON, install kotlin's serialization plugin and do:");
        this.emitLine("//");
        const table = [];
        table.push([
            "// val ",
            "json",
            " = Json { allowStructuredMapKeys = true }",
        ]);
        this.forEachTopLevel("none", (_, name) => {
            table.push([
                "// val ",
                (0, Source_1.modifySource)(Strings_1.camelCase, name),
                ` = json.parse(${this.sourcelikeToString(name)}.serializer(), jsonString)`,
            ]);
        });
        this.emitTable(table);
    }
    emitHeader() {
        super.emitHeader();
        this.emitLine("import kotlinx.serialization.*");
        this.emitLine("import kotlinx.serialization.json.*");
        this.emitLine("import kotlinx.serialization.descriptors.*");
        this.emitLine("import kotlinx.serialization.encoding.*");
    }
    emitClassAnnotations(_c, _className) {
        this.emitLine("@Serializable");
    }
    renameAttribute(name, jsonName, _required, meta) {
        const rename = this._rename(name, jsonName);
        if (rename !== undefined) {
            meta.push(() => this.emitLine(rename));
        }
    }
    _rename(propName, jsonName) {
        const escapedName = (0, utils_1.stringEscape)(jsonName);
        const namesDiffer = this.sourcelikeToString(propName) !== escapedName;
        if (namesDiffer) {
            return ['@SerialName("', escapedName, '")'];
        }
        return undefined;
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitLine(["@Serializable"]);
        this.emitBlock(["enum class ", enumName, "(val value: String)"], () => {
            let count = e.cases.size;
            this.forEachEnumCase(e, "none", (name, json) => {
                const jsonEnum = (0, utils_1.stringEscape)(json);
                this.emitLine(`@SerialName("${jsonEnum}") `, name, `("${jsonEnum}")`, --count === 0 ? ";" : ",");
            });
        });
    }
}
exports.KotlinXRenderer = KotlinXRenderer;
