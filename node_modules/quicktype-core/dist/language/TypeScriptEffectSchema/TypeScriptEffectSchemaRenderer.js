"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptEffectSchemaRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Acronyms_1 = require("../../support/Acronyms");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const utils_1 = require("../JavaScript/utils");
class TypeScriptEffectSchemaRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
        this.emittedObjects = new Set();
    }
    forbiddenNamesForGlobalNamespace() {
        return ["Class", "Date", "Object", "String", "Array", "JSON", "Error"];
    }
    nameStyle(original, upper) {
        const acronyms = (0, Acronyms_1.acronymStyle)(Acronyms_1.AcronymStyleOptions.Camel);
        const words = (0, Strings_1.splitIntoWords)(original);
        return (0, Strings_1.combineWords)(words, utils_1.legalizeName, upper ? Strings_1.firstUpperWordStyle : Strings_1.allLowerWordStyle, Strings_1.firstUpperWordStyle, upper ? (s) => (0, Strings_1.capitalize)(acronyms(s)) : Strings_1.allLowerWordStyle, acronyms, "", Strings_1.isLetterOrUnderscore);
    }
    makeNamedTypeNamer() {
        return (0, Naming_1.funPrefixNamer)("types", (s) => this.nameStyle(s, true));
    }
    makeUnionMemberNamer() {
        return (0, Naming_1.funPrefixNamer)("properties", (s) => this.nameStyle(s, true));
    }
    namerForObjectProperty() {
        return (0, Naming_1.funPrefixNamer)("properties", (s) => this.nameStyle(s, true));
    }
    makeEnumCaseNamer() {
        return (0, Naming_1.funPrefixNamer)("enum-cases", (s) => this.nameStyle(s, false));
    }
    importStatement(lhs, moduleName) {
        return ["import ", lhs, " from ", moduleName, ";"];
    }
    emitImports() {
        this.ensureBlankLine();
        this.emitLine(this.importStatement("* as S", '"effect/Schema"'));
    }
    typeMapTypeForProperty(p) {
        if (!p.isOptional) {
            return this.typeMapTypeFor(p.type);
        }
        return ["S.optional(", this.typeMapTypeFor(p.type), ")"];
    }
    typeMapTypeFor(t, required = true) {
        if (t.kind === "class" || t.kind === "object" || t.kind === "enum") {
            const name = this.nameForNamedType(t);
            if (this.emittedObjects.has(name)) {
                return [name];
            }
            return ["S.suspend(() => ", name, ")"];
        }
        const match = (0, TypeUtils_1.matchType)(t, (_anyType) => "S.Any", (_nullType) => "S.Null", (_boolType) => "S.Boolean", (_integerType) => "S.Number", (_doubleType) => "S.Number", (_stringType) => "S.String", (arrayType) => [
            "S.Array(",
            this.typeMapTypeFor(arrayType.items, false),
            ")",
        ], (_classType) => (0, Support_1.panic)("Should already be handled."), (_mapType) => [
            "S.Record({ key: S.String, value: ",
            this.typeMapTypeFor(_mapType.values, false),
            "})",
        ], (_enumType) => (0, Support_1.panic)("Should already be handled."), (unionType) => {
            const types = Array.from(unionType.getChildren());
            const children = [];
            let nullable = false;
            for (const type of types) {
                if (type.kind === "null") {
                    nullable = true;
                }
                else {
                    children.push(this.typeMapTypeFor(type, false));
                }
            }
            if (nullable && children.length === 1) {
                return ["S.NullOr(", children[0], ")"];
            }
            return [
                "S.Union(",
                ...(0, collection_utils_1.arrayIntercalate)(", ", children),
                nullable ? ", S.Null)" : ")",
            ];
        }, (_transformedStringType) => {
            return "S.String";
        });
        if (required) {
            return [match];
        }
        return match;
    }
    emitObject(name, t) {
        this.emittedObjects.add(name);
        this.ensureBlankLine();
        this.emitLine("\nexport class ", name, " extends S.Class<", name, '>("', name, '")({');
        this.indent(() => {
            this.forEachClassProperty(t, "none", (_, jsonName, property) => {
                this.emitLine(`"${(0, Strings_1.utf16StringEscape)(jsonName)}"`, ": ", this.typeMapTypeForProperty(property), ",");
            });
        });
        this.emitLine("}) {}");
    }
    emitEnum(e, enumName) {
        this.emittedObjects.add(enumName);
        this.ensureBlankLine();
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("\nexport const ", enumName, " = ", "S.Literal(");
        this.indent(() => this.forEachEnumCase(e, "none", (_, jsonName) => {
            this.emitLine('"', (0, Strings_1.stringEscape)(jsonName), '",');
        }));
        this.emitLine(");");
        if (!this._options.justSchema) {
            this.emitLine("export type ", enumName, " = S.Schema.Type<typeof ", enumName, ">;");
        }
    }
    walkObjectNames(objectType) {
        const names = [];
        const recurse = (type) => {
            if (type.kind === "object" || type.kind === "class") {
                names.push(this.nameForNamedType(type));
                this.forEachClassProperty(type, "none", (_, __, prop) => {
                    recurse(prop.type);
                });
            }
            else if (type instanceof Type_1.ArrayType) {
                recurse(type.items);
            }
            else if (type instanceof Type_1.MapType) {
                recurse(type.values);
            }
            else if (type instanceof Type_1.EnumType) {
                for (const t of type.getChildren()) {
                    recurse(t);
                }
            }
        };
        this.forEachClassProperty(objectType, "none", (_, __, prop) => {
            recurse(prop.type);
        });
        return names;
    }
    emitSchemas() {
        this.ensureBlankLine();
        this.forEachEnum("leading-and-interposing", (u, enumName) => {
            this.emitEnum(u, enumName);
        });
        const order = [];
        const mapKey = [];
        const mapValue = [];
        this.forEachObject("none", (type, name) => {
            mapKey.push(name);
            mapValue.push(type);
        });
        mapKey.forEach((_, index) => {
            // assume first
            let ordinal = 0;
            // pull out all names
            const source = mapValue[index];
            const names = this.walkObjectNames(source);
            // must be behind all these names
            names.forEach((name) => {
                const depName = name;
                // find this name's ordinal, if it has already been added
                order.forEach((orderItem) => {
                    const depIndex = orderItem;
                    if (mapKey[depIndex] === depName) {
                        // this is the index of the dependency, so make sure we come after it
                        ordinal = Math.max(ordinal, depIndex + 1);
                    }
                });
            });
            // insert index
            order.splice(ordinal, 0, index);
        });
        // now emit ordered source
        order.forEach((i) => this.emitGatheredSource(this.gatherSource(() => this.emitObject(mapKey[i], mapValue[i]))));
    }
    emitSourceStructure() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        this.emitImports();
        this.emitSchemas();
    }
}
exports.TypeScriptEffectSchemaRenderer = TypeScriptEffectSchemaRenderer;
