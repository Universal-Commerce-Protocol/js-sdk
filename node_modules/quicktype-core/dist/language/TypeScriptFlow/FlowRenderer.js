"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowRenderer = void 0;
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const TypeScriptFlowBaseRenderer_1 = require("./TypeScriptFlowBaseRenderer");
const utils_1 = require("./utils");
class FlowRenderer extends TypeScriptFlowBaseRenderer_1.TypeScriptFlowBaseRenderer {
    forbiddenNamesForGlobalNamespace() {
        return ["Class", "Date", "Object", "String", "Array", "JSON", "Error"];
    }
    get typeAnnotations() {
        return Object.assign({ never: "" }, utils_1.tsFlowTypeAnnotations);
    }
    emitEnum(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        const lines = [];
        this.forEachEnumCase(e, "none", (_, jsonName) => {
            const maybeOr = lines.length === 0 ? "  " : "| ";
            lines.push([maybeOr, '"', (0, Strings_1.utf16StringEscape)(jsonName), '"']);
        });
        (0, Support_1.defined)(lines[lines.length - 1]).push(";");
        this.emitLine("export type ", enumName, " =");
        this.indent(() => {
            for (const line of lines) {
                this.emitLine(line);
            }
        });
    }
    emitClassBlock(c, className) {
        this.emitBlock(["export type ", className, " = "], ";", () => {
            this.emitClassBlockBody(c);
        });
    }
    emitSourceStructure() {
        this.emitLine("// @flow");
        this.ensureBlankLine();
        super.emitSourceStructure();
    }
}
exports.FlowRenderer = FlowRenderer;
