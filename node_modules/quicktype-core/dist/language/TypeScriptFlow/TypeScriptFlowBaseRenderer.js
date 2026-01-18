"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptFlowBaseRenderer = void 0;
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const JavaScript_1 = require("../JavaScript");
const utils_1 = require("./utils");
class TypeScriptFlowBaseRenderer extends JavaScript_1.JavaScriptRenderer {
    constructor(targetLanguage, renderContext, _tsFlowOptions) {
        super(targetLanguage, renderContext, _tsFlowOptions);
        this._tsFlowOptions = _tsFlowOptions;
    }
    namerForObjectProperty() {
        if (this._tsFlowOptions.nicePropertyNames) {
            return (0, Naming_1.funPrefixNamer)("properties", (s) => this.nameStyle(s, false));
        }
        return super.namerForObjectProperty();
    }
    sourceFor(t) {
        var _a;
        if (this._tsFlowOptions.preferConstValues &&
            t.kind === "enum" &&
            t instanceof Type_1.EnumType &&
            t.cases.size === 1) {
            const item = (_a = t.cases.values().next().value) !== null && _a !== void 0 ? _a : "";
            return (0, Source_1.singleWord)(`"${(0, Strings_1.utf16StringEscape)(item)}"`);
        }
        if (["class", "object", "enum"].includes(t.kind)) {
            return (0, Source_1.singleWord)(this.nameForNamedType(t));
        }
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.singleWord)("any"), (_nullType) => (0, Source_1.singleWord)("null"), (_boolType) => (0, Source_1.singleWord)("boolean"), (_integerType) => (0, Source_1.singleWord)("number"), (_doubleType) => (0, Source_1.singleWord)("number"), (_stringType) => (0, Source_1.singleWord)("string"), (arrayType) => {
            const itemType = this.sourceFor(arrayType.items);
            if ((arrayType.items instanceof Type_1.UnionType &&
                !this._tsFlowOptions.declareUnions) ||
                arrayType.items instanceof Type_1.ArrayType) {
                return (0, Source_1.singleWord)(["Array<", itemType.source, ">"]);
            }
            return (0, Source_1.singleWord)([(0, Source_1.parenIfNeeded)(itemType), "[]"]);
        }, (_classType) => (0, Support_1.panic)("We handled this above"), (mapType) => (0, Source_1.singleWord)([
            "{ [key: string]: ",
            this.sourceFor(mapType.values).source,
            " }",
        ]), (_enumType) => (0, Support_1.panic)("We handled this above"), (unionType) => {
            if (!this._tsFlowOptions.declareUnions ||
                (0, TypeUtils_1.nullableFromUnion)(unionType) !== null) {
                const children = Array.from(unionType.getChildren()).map((c) => (0, Source_1.parenIfNeeded)(this.sourceFor(c)));
                return (0, Source_1.multiWord)(" | ", ...children);
            }
            return (0, Source_1.singleWord)(this.nameForNamedType(unionType));
        }, (transformedStringType) => {
            if (transformedStringType.kind === "date-time") {
                return (0, Source_1.singleWord)("Date");
            }
            return (0, Source_1.singleWord)("string");
        });
    }
    emitClassBlockBody(c) {
        this.emitPropertyTable(c, (name, _jsonName, p) => {
            const t = p.type;
            let propertyName = name;
            propertyName = (0, Source_1.modifySource)(utils_1.quotePropertyName, name);
            if (this._tsFlowOptions.readonly) {
                propertyName = (0, Source_1.modifySource)((_propertyName) => `readonly ${_propertyName}`, propertyName);
            }
            return [
                [propertyName, p.isOptional ? "?" : "", ": "],
                [this.sourceFor(t).source, ";"],
            ];
        });
        const additionalProperties = c.getAdditionalProperties();
        if (additionalProperties) {
            this.emitTable([
                [
                    "[property: string]",
                    ": ",
                    this.sourceFor(additionalProperties).source,
                    ";",
                ],
            ]);
        }
    }
    emitClass(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitClassBlock(c, className);
    }
    emitUnion(u, unionName) {
        if (!this._tsFlowOptions.declareUnions) {
            return;
        }
        this.emitDescription(this.descriptionForType(u));
        const children = (0, Source_1.multiWord)(" | ", ...Array.from(u.getChildren()).map((c) => (0, Source_1.parenIfNeeded)(this.sourceFor(c))));
        this.emitLine("export type ", unionName, " = ", children.source, ";");
    }
    emitTypes() {
        // emit primitive top levels
        this.forEachTopLevel("none", (t, name) => {
            if (!t.isPrimitive()) {
                return;
            }
            this.ensureBlankLine();
            this.emitDescription(this.descriptionForType(t));
            this.emitLine("type ", name, " = ", this.sourceFor(t).source, ";");
        });
        this.forEachNamedType("leading-and-interposing", (c, n) => this.emitClass(c, n), (e, n) => this.emitEnum(e, n), (u, n) => this.emitUnion(u, n));
    }
    emitUsageComments() {
        if (this._tsFlowOptions.justTypes)
            return;
        super.emitUsageComments();
    }
    deserializerFunctionLine(t, name) {
        const jsonType = this._tsFlowOptions.rawType === "json" ? "string" : "any";
        return [
            "function to",
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
            "function ",
            camelCaseName,
            "ToJson(value: ",
            this.sourceFor(t).source,
            "): ",
            returnType,
        ];
    }
    get moduleLine() {
        return undefined;
    }
    get castFunctionLines() {
        return [
            "function cast<T>(val: any, typ: any): T",
            "function uncast<T>(val: T, typ: any): any",
        ];
    }
    get typeAnnotations() {
        throw new Error("not implemented");
    }
    emitConvertModule() {
        if (this._tsFlowOptions.justTypes)
            return;
        super.emitConvertModule();
    }
    emitConvertModuleHelpers() {
        if (this._tsFlowOptions.justTypes)
            return;
        super.emitConvertModuleHelpers();
    }
    emitModuleExports() {
        if (this._tsFlowOptions.justTypes) {
            return;
        }
        else {
            super.emitModuleExports();
        }
    }
}
exports.TypeScriptFlowBaseRenderer = TypeScriptFlowBaseRenderer;
