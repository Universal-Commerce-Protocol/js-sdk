"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptZodRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Acronyms_1 = require("../../support/Acronyms");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const utils_1 = require("../JavaScript/utils");
class TypeScriptZodRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
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
        this.emitLine(this.importStatement("* as z", '"zod"'));
    }
    typeMapTypeForProperty(p) {
        const typeMap = this.typeMapTypeFor(p.type);
        return p.isOptional ? [typeMap, ".optional()"] : typeMap;
    }
    typeMapTypeFor(t, required = true) {
        if (["class", "object", "enum"].includes(t.kind)) {
            return [this.nameForNamedType(t), "Schema"];
        }
        const match = (0, TypeUtils_1.matchType)(t, (_anyType) => "z.any()", (_nullType) => "z.null()", (_boolType) => "z.boolean()", (_integerType) => "z.number()", (_doubleType) => "z.number()", (_stringType) => "z.string()", (arrayType) => [
            "z.array(",
            this.typeMapTypeFor(arrayType.items, false),
            ")",
        ], (_classType) => (0, Support_1.panic)("Should already be handled."), (_mapType) => [
            "z.record(z.string(), ",
            this.typeMapTypeFor(_mapType.values, false),
            ")",
        ], (_enumType) => (0, Support_1.panic)("Should already be handled."), (unionType) => {
            const children = Array.from(unionType.getChildren()).map((type) => this.typeMapTypeFor(type, false));
            return ["z.union([", ...(0, collection_utils_1.arrayIntercalate)(", ", children), "])"];
        }, (_transformedStringType) => {
            if (_transformedStringType.kind === "date-time") {
                return "z.coerce.date()";
            }
            return "z.string()";
        });
        if (required) {
            return [match];
        }
        return match;
    }
    emitObject(name, t) {
        this.ensureBlankLine();
        this.emitLine("\nexport const ", name, "Schema = ", "z.object({");
        this.indent(() => {
            this.forEachClassProperty(t, "none", (_, jsonName, property) => {
                this.emitLine(`"${(0, Strings_1.utf16StringEscape)(jsonName)}"`, ": ", this.typeMapTypeForProperty(property), ",");
            });
        });
        this.emitLine("});");
        if (!this._options.justSchema) {
            this.emitLine("export type ", name, " = z.infer<typeof ", name, "Schema>;");
        }
    }
    emitEnum(e, enumName) {
        this.ensureBlankLine();
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("\nexport const ", enumName, "Schema = ", "z.enum([");
        this.indent(() => this.forEachEnumCase(e, "none", (_, jsonName) => {
            this.emitLine('"', (0, Strings_1.stringEscape)(jsonName), '",');
        }));
        this.emitLine("]);");
        if (!this._options.justSchema) {
            this.emitLine("export type ", enumName, " = z.infer<typeof ", enumName, "Schema>;");
        }
    }
    /** Static function that extracts underlying type refs for types that form part of the
     * definition of the passed type - used to ensure that these appear in generated source
     * before types that reference them.
     *
     * Primitive types don't need defining and enums are output before other types, hence,
     * these are ignored.
     */
    static extractUnderlyingTyperefs(type) {
        const typeRefs = [];
        // Ignore enums and primitives
        if (!type.isPrimitive() && type.kind !== "enum") {
            // need to extract constituent types for unions and intersections (which both extend SetOperationType)
            // and can ignore the union/intersection itself
            if (type instanceof Type_1.SetOperationType) {
                type.members.forEach((member) => {
                    // recurse as the underlying type could itself be a union, instersection or array etc.
                    typeRefs.push(...TypeScriptZodRenderer.extractUnderlyingTyperefs(member));
                });
            }
            // need to extract additional properties for object, class and map types (which all extend ObjectType)
            if (type instanceof Type_1.ObjectType) {
                const addType = type.getAdditionalProperties();
                if (addType) {
                    // recurse as the underlying type could itself be a union, instersection or array etc.
                    typeRefs.push(...TypeScriptZodRenderer.extractUnderlyingTyperefs(addType));
                }
            }
            // need to extract items types for ArrayType
            if (type instanceof Type_1.ArrayType) {
                const itemsType = type.items;
                if (itemsType) {
                    // recurse as the underlying type could itself be a union, instersection or array etc.
                    typeRefs.push(...TypeScriptZodRenderer.extractUnderlyingTyperefs(itemsType));
                }
            }
            // Finally return the reference to a class as that will need to be defined (where objects, maps, unions, intersections and arrays do not)
            if (type instanceof Type_1.ClassType) {
                typeRefs.push(type.typeRef);
            }
        }
        return typeRefs;
    }
    emitSchemas() {
        this.ensureBlankLine();
        this.forEachEnum("leading-and-interposing", (u, enumName) => {
            this.emitEnum(u, enumName);
        });
        // All children must be defined before this type to avoid forward references in generated code
        // Build a model that will tell us if a referenced type has been defined then make multiple
        // passes over the defined objects to put them into the correct order for output in the
        // generated sourcecode
        const order = [];
        const mapType = [];
        const mapTypeRef = [];
        const mapName = [];
        const mapChildTypeRefs = [];
        this.forEachObject("none", (type, name) => {
            mapType.push(type);
            mapTypeRef.push(type.typeRef);
            mapName.push(name);
            const children = type.getChildren();
            let childTypeRefs = [];
            children.forEach((child) => {
                childTypeRefs = childTypeRefs.concat(TypeScriptZodRenderer.extractUnderlyingTyperefs(child));
            });
            mapChildTypeRefs.push(childTypeRefs);
        });
        // Items to process on this pass
        let indices = [];
        mapType.forEach((_, index) => {
            indices.push(index);
        });
        // items to process on the next pass
        let deferredIndices = [];
        // defensive: make sure we don't loop forever, even complex sets shouldn't require many passes
        const MAX_PASSES = 999;
        let passNum = 0;
        do {
            indices.forEach((index) => {
                // must be behind all these children
                const childTypeRefs = mapChildTypeRefs[index];
                let foundAllChildren = true;
                childTypeRefs.forEach((childRef) => {
                    // defensive: first check if there is a definition for the referenced type (there should be)
                    if (mapTypeRef.includes(childRef)) {
                        let found = false;
                        // find this childs's ordinal, if it has already been added
                        // faster to go through what we've defined so far than all definitions
                        // FIXME: refactor this
                        // eslint-disable-next-line @typescript-eslint/prefer-for-of
                        for (let j = 0; j < order.length; j++) {
                            const childIndex = order[j];
                            if (mapTypeRef[childIndex] === childRef) {
                                found = true;
                                break;
                            }
                        }
                        foundAllChildren = foundAllChildren && found;
                    }
                    else {
                        console.error("A child type reference was not found amongst all Object definitions! TypeRef: " +
                            childRef);
                    }
                });
                if (foundAllChildren) {
                    // insert index into order as we are safe to define this type
                    order.push(index);
                }
                else {
                    // defer to a subsequent pass as we need to define other types
                    deferredIndices.push(index);
                }
            });
            indices = deferredIndices;
            deferredIndices = [];
            passNum++;
            if (passNum > MAX_PASSES) {
                // giving up
                order.push(...deferredIndices);
                console.warn("Exceeded maximum number of passes when determining output order, output may contain forward references");
            }
        } while (indices.length > 0 && passNum <= MAX_PASSES);
        // now emit ordered source
        order.forEach((i) => this.emitGatheredSource(this.gatherSource(() => this.emitObject(mapName[i], mapType[i]))));
    }
    emitSourceStructure() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        this.emitImports();
        this.emitSchemas();
    }
}
exports.TypeScriptZodRenderer = TypeScriptZodRenderer;
