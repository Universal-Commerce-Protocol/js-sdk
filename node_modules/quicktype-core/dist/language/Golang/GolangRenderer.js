"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoRenderer = void 0;
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const utils_1 = require("./utils");
class GoRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
        this._topLevelUnmarshalNames = new Map();
    }
    makeNamedTypeNamer() {
        return utils_1.namingFunction;
    }
    namerForObjectProperty() {
        return utils_1.namingFunction;
    }
    makeUnionMemberNamer() {
        return utils_1.namingFunction;
    }
    makeEnumCaseNamer() {
        return utils_1.namingFunction;
    }
    get enumCasesInGlobalNamespace() {
        return true;
    }
    makeTopLevelDependencyNames(_, topLevelName) {
        const unmarshalName = new Naming_1.DependencyName(utils_1.namingFunction, topLevelName.order, (lookup) => `unmarshal_${lookup(topLevelName)}`);
        this._topLevelUnmarshalNames.set(topLevelName, unmarshalName);
        return [unmarshalName];
    }
    /// startFile takes a file name, lowercases it, appends ".go" to it, and sets it as the current filename.
    startFile(basename) {
        if (this._options.multiFileOutput === false) {
            return;
        }
        (0, Support_1.assert)(this._currentFilename === undefined, `Previous file wasn't finished: ${this._currentFilename}`);
        this._currentFilename = `${this.sourcelikeToString(basename)}.go`;
        this.initializeEmitContextForFilename(this._currentFilename);
    }
    /// endFile pushes the current file name onto the collection of finished files and then resets the current file name. These finished files are used in index.ts to write the output.
    endFile() {
        if (this._options.multiFileOutput === false) {
            return;
        }
        this.finishFile((0, Support_1.defined)(this._currentFilename));
        this._currentFilename = undefined;
    }
    emitBlock(line, f) {
        this.emitLine(line, " {");
        this.indent(f);
        this.emitLine("}");
    }
    emitFunc(decl, f) {
        this.emitBlock(["func ", decl], f);
    }
    emitStruct(name, table) {
        this.emitBlock(["type ", name, " struct"], () => this.emitTable(table));
    }
    nullableGoType(t, withIssues) {
        const goType = this.goType(t, withIssues);
        if ((0, utils_1.isValueType)(t)) {
            return ["*", goType];
        }
        return goType;
    }
    propertyGoType(cp) {
        const t = cp.type;
        if (t instanceof Type_1.UnionType && (0, TypeUtils_1.nullableFromUnion)(t) === null) {
            return ["*", this.goType(t, true)];
        }
        if (cp.isOptional) {
            return this.nullableGoType(t, true);
        }
        return this.goType(t, true);
    }
    goType(t, withIssues = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, "interface{}"), (_nullType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, "interface{}"), (_boolType) => "bool", (_integerType) => "int64", (_doubleType) => "float64", (_stringType) => "string", (arrayType) => ["[]", this.goType(arrayType.items, withIssues)], (classType) => this.nameForNamedType(classType), (mapType) => {
            let valueSource;
            const v = mapType.values;
            if (v instanceof Type_1.UnionType && (0, TypeUtils_1.nullableFromUnion)(v) === null) {
                valueSource = ["*", this.nameForNamedType(v)];
            }
            else {
                valueSource = this.goType(v, withIssues);
            }
            return ["map[string]", valueSource];
        }, (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return this.nullableGoType(nullable, withIssues);
            return this.nameForNamedType(unionType);
        }, (transformedStringType) => {
            if (transformedStringType.kind === "date-time") {
                return "time.Time";
            }
            return "string";
        });
    }
    emitTopLevel(t, name) {
        this.startFile(name);
        if (this._options.multiFileOutput &&
            this._options.justTypes === false &&
            this._options.justTypesAndPackage === false &&
            this.leadingComments === undefined) {
            this.emitLineOnce("// Code generated from JSON Schema using quicktype. DO NOT EDIT.");
            this.emitLineOnce("// To parse and unparse this JSON data, add this code to your project and do:");
            this.emitLineOnce("//");
            const ref = (0, Source_1.modifySource)(Strings_1.camelCase, name);
            this.emitLineOnce("//    ", ref, ", err := ", (0, Support_1.defined)(this._topLevelUnmarshalNames.get(name)), "(bytes)");
            this.emitLineOnce("//    bytes, err = ", ref, ".Marshal()");
        }
        this.emitPackageDefinitons(true);
        const unmarshalName = (0, Support_1.defined)(this._topLevelUnmarshalNames.get(name));
        if (this.namedTypeToNameForTopLevel(t) === undefined) {
            this.emitLine("type ", name, " ", this.goType(t));
        }
        if (this._options.justTypes || this._options.justTypesAndPackage)
            return;
        this.ensureBlankLine();
        this.emitFunc([unmarshalName, "(data []byte) (", name, ", error)"], () => {
            this.emitLine("var r ", name);
            this.emitLine("err := json.Unmarshal(data, &r)");
            this.emitLine("return r, err");
        });
        this.ensureBlankLine();
        this.emitFunc(["(r *", name, ") Marshal() ([]byte, error)"], () => {
            this.emitLine("return json.Marshal(r)");
        });
        this.endFile();
    }
    emitClass(c, className) {
        this.startFile(className);
        const columns = [];
        const usedTypes = new Set();
        this.forEachClassProperty(c, "none", (name, jsonName, p) => {
            const description = this.descriptionForClassProperty(c, jsonName);
            const docStrings = description !== undefined && description.length > 0
                ? description.map((d) => "// " + d)
                : [];
            const goType = this.propertyGoType(p);
            const omitEmpty = (0, utils_1.canOmitEmpty)(p, this._options.omitEmpty)
                ? ",omitempty"
                : [];
            docStrings.forEach((doc) => columns.push([doc]));
            const tags = this._options.fieldTags
                .split(",")
                .map((tag) => `${tag}:"${(0, Strings_1.stringEscape)(jsonName)}${omitEmpty}"`)
                .join(" ");
            columns.push([
                [name, " "],
                [goType, " "],
                ["`", tags, "`"],
            ]);
            usedTypes.add(goType.toString());
        });
        this.emitPackageDefinitons(false, usedTypes.has("time.Time") ||
            usedTypes.has("*,time.Time") ||
            usedTypes.has("[],time.Time")
            ? new Set(["time"])
            : undefined);
        this.emitDescription(this.descriptionForType(c));
        this.emitStruct(className, columns);
        this.endFile();
    }
    emitEnum(e, enumName) {
        this.startFile(enumName);
        this.emitPackageDefinitons(false);
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("type ", enumName, " string");
        this.ensureBlankLine();
        this.emitLine("const (");
        const columns = [];
        this.forEachEnumCase(e, "none", (name, jsonName) => {
            columns.push([
                [name, " "],
                [enumName, ' = "', (0, Strings_1.stringEscape)(jsonName), '"'],
            ]);
        });
        this.indent(() => this.emitTable(columns));
        this.emitLine(")");
        this.endFile();
    }
    emitUnion(u, unionName) {
        this.startFile(unionName);
        this.emitPackageDefinitons(false);
        const [hasNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u);
        const isNullableArg = hasNull !== null ? "true" : "false";
        const ifMember = (kind, ifNotMember, f) => {
            const maybeType = u.findMember(kind);
            if (maybeType === undefined)
                return ifNotMember;
            return f(maybeType, this.nameForUnionMember(u, maybeType), this.goType(maybeType));
        };
        const maybeAssignNil = (kind) => {
            ifMember(kind, undefined, (_1, fieldName, _2) => {
                this.emitLine("x.", fieldName, " = nil");
            });
        };
        const makeArgs = (primitiveArg, compoundArg) => {
            const args = [];
            for (const kind of utils_1.primitiveValueTypeKinds) {
                args.push(ifMember(kind, "nil", (_1, fieldName, _2) => primitiveArg(fieldName)), ", ");
            }
            for (const kind of utils_1.compoundTypeKinds) {
                args.push(ifMember(kind, "false, nil", (t, fieldName, _) => compoundArg(t.kind === "class", fieldName)), ", ");
            }
            args.push(isNullableArg);
            return args;
        };
        const columns = [];
        this.forEachUnionMember(u, nonNulls, "none", null, (fieldName, t) => {
            const goType = this.nullableGoType(t, true);
            columns.push([[fieldName, " "], goType]);
        });
        this.emitDescription(this.descriptionForType(u));
        this.emitStruct(unionName, columns);
        if (this._options.justTypes || this._options.justTypesAndPackage)
            return;
        this.ensureBlankLine();
        this.emitFunc(["(x *", unionName, ") UnmarshalJSON(data []byte) error"], () => {
            for (const kind of utils_1.compoundTypeKinds) {
                maybeAssignNil(kind);
            }
            ifMember("class", undefined, (_1, _2, goType) => {
                this.emitLine("var c ", goType);
            });
            const args = makeArgs((fn) => ["&x.", fn], (isClass, fn) => (isClass ? "true, &c" : ["true, &x.", fn]));
            this.emitLine("object, err := unmarshalUnion(data, ", args, ")");
            this.emitBlock("if err != nil", () => {
                this.emitLine("return err");
            });
            this.emitBlock("if object", () => {
                ifMember("class", undefined, (_1, fieldName, _2) => {
                    this.emitLine("x.", fieldName, " = &c");
                });
            });
            this.emitLine("return nil");
        });
        this.ensureBlankLine();
        this.emitFunc(["(x *", unionName, ") MarshalJSON() ([]byte, error)"], () => {
            const args = makeArgs((fn) => ["x.", fn], (_, fn) => ["x.", fn, " != nil, x.", fn]);
            this.emitLine("return marshalUnion(", args, ")");
        });
        this.endFile();
    }
    emitSingleFileHeaderComments() {
        this.emitLineOnce("// Code generated from JSON Schema using quicktype. DO NOT EDIT.");
        this.emitLineOnce("// To parse and unparse this JSON data, add this code to your project and do:");
        this.forEachTopLevel("none", (_, name) => {
            this.emitLine("//");
            const ref = (0, Source_1.modifySource)(Strings_1.camelCase, name);
            this.emitLine("//    ", ref, ", err := ", (0, Support_1.defined)(this._topLevelUnmarshalNames.get(name)), "(bytes)");
            this.emitLine("//    bytes, err = ", ref, ".Marshal()");
        });
    }
    emitPackageDefinitons(includeJSONEncodingImport, imports = new Set()) {
        if (!this._options.justTypes || this._options.justTypesAndPackage) {
            this.ensureBlankLine();
            const packageDeclaration = `package ${this._options.packageName}`;
            this.emitLineOnce(packageDeclaration);
            this.ensureBlankLine();
        }
        if (!this._options.justTypes && !this._options.justTypesAndPackage) {
            if (this.haveNamedUnions &&
                this._options.multiFileOutput === false) {
                imports.add("bytes");
                imports.add("errors");
            }
            if (includeJSONEncodingImport) {
                imports.add("encoding/json");
            }
        }
        this.emitImports(imports);
    }
    emitImports(imports) {
        const sortedImports = Array.from(imports).sort((a, b) => a.localeCompare(b));
        if (sortedImports.length === 0) {
            return;
        }
        sortedImports.forEach((packageName) => {
            this.emitLineOnce(`import "${packageName}"`);
        });
        this.ensureBlankLine();
    }
    emitHelperFunctions() {
        if (this.haveNamedUnions) {
            this.startFile("JSONSchemaSupport");
            const imports = new Set();
            if (this._options.multiFileOutput) {
                imports.add("bytes");
                imports.add("errors");
            }
            this.emitPackageDefinitons(true, imports);
            this.ensureBlankLine();
            this.emitMultiline(`func unmarshalUnion(data []byte, pi **int64, pf **float64, pb **bool, ps **string, haveArray bool, pa interface{}, haveObject bool, pc interface{}, haveMap bool, pm interface{}, haveEnum bool, pe interface{}, nullable bool) (bool, error) {
	if pi != nil {
			*pi = nil
	}
	if pf != nil {
			*pf = nil
	}
	if pb != nil {
			*pb = nil
	}
	if ps != nil {
			*ps = nil
	}

	dec := json.NewDecoder(bytes.NewReader(data))
	dec.UseNumber()
	tok, err := dec.Token()
	if err != nil {
			return false, err
	}

	switch v := tok.(type) {
	case json.Number:
			if pi != nil {
					i, err := v.Int64()
					if err == nil {
							*pi = &i
							return false, nil
					}
			}
			if pf != nil {
					f, err := v.Float64()
					if err == nil {
							*pf = &f
							return false, nil
					}
					return false, errors.New("Unparsable number")
			}
			return false, errors.New("Union does not contain number")
	case float64:
			return false, errors.New("Decoder should not return float64")
	case bool:
			if pb != nil {
					*pb = &v
					return false, nil
			}
			return false, errors.New("Union does not contain bool")
	case string:
			if haveEnum {
					return false, json.Unmarshal(data, pe)
			}
			if ps != nil {
					*ps = &v
					return false, nil
			}
			return false, errors.New("Union does not contain string")
	case nil:
			if nullable {
					return false, nil
			}
			return false, errors.New("Union does not contain null")
	case json.Delim:
			if v == '{' {
					if haveObject {
							return true, json.Unmarshal(data, pc)
					}
					if haveMap {
							return false, json.Unmarshal(data, pm)
					}
					return false, errors.New("Union does not contain object")
			}
			if v == '[' {
					if haveArray {
							return false, json.Unmarshal(data, pa)
					}
					return false, errors.New("Union does not contain array")
			}
			return false, errors.New("Cannot handle delimiter")
	}
	return false, errors.New("Cannot unmarshal union")
}

func marshalUnion(pi *int64, pf *float64, pb *bool, ps *string, haveArray bool, pa interface{}, haveObject bool, pc interface{}, haveMap bool, pm interface{}, haveEnum bool, pe interface{}, nullable bool) ([]byte, error) {
	if pi != nil {
			return json.Marshal(*pi)
	}
	if pf != nil {
			return json.Marshal(*pf)
	}
	if pb != nil {
			return json.Marshal(*pb)
	}
	if ps != nil {
			return json.Marshal(*ps)
	}
	if haveArray {
			return json.Marshal(pa)
	}
	if haveObject {
			return json.Marshal(pc)
	}
	if haveMap {
			return json.Marshal(pm)
	}
	if haveEnum {
			return json.Marshal(pe)
	}
	if nullable {
			return json.Marshal(nil)
	}
	return nil, errors.New("Union must not be null")
}`);
            this.endFile();
        }
    }
    emitSourceStructure() {
        if (this._options.multiFileOutput === false &&
            this._options.justTypes === false &&
            this._options.justTypesAndPackage === false &&
            this.leadingComments === undefined) {
            this.emitSingleFileHeaderComments();
            this.emitPackageDefinitons(false, this.collectAllImports());
        }
        this.forEachTopLevel("leading-and-interposing", (t, name) => this.emitTopLevel(t, name), (t) => !(this._options.justTypes || this._options.justTypesAndPackage) || this.namedTypeToNameForTopLevel(t) === undefined);
        this.forEachObject("leading-and-interposing", (c, className) => this.emitClass(c, className));
        this.forEachEnum("leading-and-interposing", (u, enumName) => this.emitEnum(u, enumName));
        this.forEachUnion("leading-and-interposing", (u, unionName) => this.emitUnion(u, unionName));
        if (this._options.justTypes || this._options.justTypesAndPackage) {
            return;
        }
        this.emitHelperFunctions();
    }
    collectAllImports() {
        let imports = new Set();
        this.forEachObject("leading-and-interposing", (c, _className) => {
            const classImports = this.collectClassImports(c);
            imports = new Set([...imports, ...classImports]);
        });
        this.forEachUnion("leading-and-interposing", (u, _unionName) => {
            const unionImports = this.collectUnionImports(u);
            imports = new Set([...imports, ...unionImports]);
        });
        return imports;
    }
    collectClassImports(c) {
        const usedTypes = new Set();
        const mapping = new Map();
        mapping.set("time.Time", "time");
        mapping.set("*,time.Time", "time");
        mapping.set("[],time.Time", "time");
        this.forEachClassProperty(c, "none", (_name, _jsonName, p) => {
            const goType = this.propertyGoType(p);
            usedTypes.add(goType.toString());
        });
        const imports = new Set();
        usedTypes.forEach((k) => {
            const typeImport = mapping.get(k);
            if (typeImport) {
                imports.add(typeImport);
            }
        });
        return imports;
    }
    collectUnionImports(u) {
        const usedTypes = new Set();
        const mapping = new Map();
        mapping.set("time.Time", "time");
        mapping.set("*,time.Time", "time");
        this.forEachUnionMember(u, null, "none", null, (_fieldName, t) => {
            const goType = this.nullableGoType(t, true);
            usedTypes.add(goType.toString());
        });
        const imports = new Set();
        for (const k of usedTypes) {
            const typeImport = mapping.get(k);
            if (!typeImport) {
                continue;
            }
            imports.add(typeImport);
        }
        return imports;
    }
}
exports.GoRenderer = GoRenderer;
