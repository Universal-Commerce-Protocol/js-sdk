"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpickleRenderer = void 0;
const Scala3Renderer_1 = require("./Scala3Renderer");
class UpickleRenderer extends Scala3Renderer_1.Scala3Renderer {
    emitClassDefinitionMethods() {
        this.emitLine(") derives ReadWriter ");
    }
    emitHeader() {
        super.emitHeader();
        this.emitLine("import upickle.default.*");
        this.ensureBlankLine();
    }
}
exports.UpickleRenderer = UpickleRenderer;
