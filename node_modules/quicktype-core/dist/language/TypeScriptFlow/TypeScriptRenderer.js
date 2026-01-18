"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptRenderer = void 0;
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const TypeUtils_1 = require("../../Type/TypeUtils");
const TypeScriptFlowBaseRenderer_1 = require("./TypeScriptFlowBaseRenderer");
const utils_1 = require("./utils");
class TypeScriptRenderer extends TypeScriptFlowBaseRenderer_1.TypeScriptFlowBaseRenderer {
    forbiddenNamesForGlobalNamespace() {
        return ["Array", "Date"];
    }
    deserializerFunctionLine(t, name) {
        const jsonType = this._tsFlowOptions.rawType === "json" ? "string" : "any";
        return [
            "public static to",
            name,
            "(json: ",
            jsonType,
            "): ",
            this.sourceFor(t).source,
        ];
    }
    serializerFunctionLine(t, name) {
        const camelCaseName = (0, Source_1.modifySource)(Strings_1.camelCase, name);
        const returnType = this._tsFlowOptions.rawType === "json" ? "string" : "any";
        return [
            "public static ",
            camelCaseName,
            "ToJson(value: ",
            this.sourceFor(t).source,
            "): ",
            returnType,
        ];
    }
    get moduleLine() {
        return "export class Convert";
    }
    get typeAnnotations() {
        return Object.assign({ never: ": never" }, utils_1.tsFlowTypeAnnotations);
    }
    emitModuleExports() {
        return;
    }
    emitUsageImportComment() {
        const topLevelNames = [];
        this.forEachTopLevel("none", (_t, name) => {
            topLevelNames.push(", ", name);
        }, TypeUtils_1.isNamedType);
        this.emitLine("//   import { Convert", topLevelNames, ' } from "./file";');
    }
    emitEnum(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        // enums with only one value are emitted as constants
        if (this._tsFlowOptions.preferConstValues && e.cases.size === 1)
            return;
        if (this._tsFlowOptions.preferUnions) {
            let items = "";
            e.cases.forEach((item) => {
                if (items === "") {
                    items += `"${(0, Strings_1.utf16StringEscape)(item)}"`;
                    return;
                }
                items += ` | "${(0, Strings_1.utf16StringEscape)(item)}"`;
            });
            this.emitLine("export type ", enumName, " = ", items, ";");
        }
        else {
            this.emitBlock(["export enum ", enumName, " "], "", () => {
                this.forEachEnumCase(e, "none", (name, jsonName) => {
                    this.emitLine(name, ` = "${(0, Strings_1.utf16StringEscape)(jsonName)}",`);
                });
            });
        }
    }
    emitClassBlock(c, className) {
        this.emitBlock(this._tsFlowOptions.preferTypes
            ? ["export type ", className, " = "]
            : ["export interface ", className, " "], "", () => {
            this.emitClassBlockBody(c);
        });
    }
}
exports.TypeScriptRenderer = TypeScriptRenderer;
