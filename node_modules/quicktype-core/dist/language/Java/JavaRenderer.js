"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaRenderer = void 0;
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Acronyms_1 = require("../../support/Acronyms");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const DateTimeProvider_1 = require("./DateTimeProvider");
const utils_1 = require("./utils");
class JavaRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
        this._gettersAndSettersForPropertyName = new Map();
        this._haveEmittedLeadingComments = false;
        this._converterClassname = "Converter";
        this._converterKeywords = [];
        switch (_options.dateTimeProvider) {
            case "legacy":
                this._dateTimeProvider = new DateTimeProvider_1.JavaLegacyDateTimeProvider(this, this._converterClassname);
                break;
            case "java8":
            default:
                this._dateTimeProvider = new DateTimeProvider_1.Java8DateTimeProvider(this, this._converterClassname);
                break;
        }
    }
    forbiddenNamesForGlobalNamespace() {
        const keywords = [
            ...constants_1.javaKeywords,
            ...this._converterKeywords,
            this._converterClassname,
            ...this._dateTimeProvider.keywords,
        ];
        return keywords;
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    makeNamedTypeNamer() {
        return this.getNameStyling("typeNamingFunction");
    }
    namerForObjectProperty() {
        return this.getNameStyling("propertyNamingFunction");
    }
    makeUnionMemberNamer() {
        return this.getNameStyling("propertyNamingFunction");
    }
    makeEnumCaseNamer() {
        return this.getNameStyling("enumCaseNamingFunction");
    }
    unionNeedsName(u) {
        return (0, TypeUtils_1.nullableFromUnion)(u) === null;
    }
    namedTypeToNameForTopLevel(type) {
        // If the top-level type doesn't contain any classes or unions
        // we have to define a class just for the `FromJson` method, in
        // emitFromJsonForTopLevel.
        return (0, TypeUtils_1.directlyReachableSingleNamedType)(type);
    }
    makeNamesForPropertyGetterAndSetter(_c, _className, _p, _jsonName, name) {
        const getterName = new Naming_1.DependencyName(this.getNameStyling("propertyNamingFunction"), name.order, (lookup) => `get_${lookup(name)}`);
        const setterName = new Naming_1.DependencyName(this.getNameStyling("propertyNamingFunction"), name.order, (lookup) => `set_${lookup(name)}`);
        return [getterName, setterName];
    }
    makePropertyDependencyNames(c, className, p, jsonName, name) {
        const getterAndSetterNames = this.makeNamesForPropertyGetterAndSetter(c, className, p, jsonName, name);
        this._gettersAndSettersForPropertyName.set(name, getterAndSetterNames);
        return getterAndSetterNames;
    }
    getNameStyling(convention) {
        const styling = {
            typeNamingFunction: (0, Naming_1.funPrefixNamer)("types", (n) => (0, utils_1.javaNameStyle)(true, false, n, (0, Acronyms_1.acronymStyle)(this._options.acronymStyle))),
            propertyNamingFunction: (0, Naming_1.funPrefixNamer)("properties", (n) => (0, utils_1.javaNameStyle)(false, false, n, (0, Acronyms_1.acronymStyle)(this._options.acronymStyle))),
            enumCaseNamingFunction: (0, Naming_1.funPrefixNamer)("enum-cases", (n) => (0, utils_1.javaNameStyle)(true, true, n, (0, Acronyms_1.acronymStyle)(this._options.acronymStyle))),
        };
        return styling[convention];
    }
    fieldOrMethodName(methodName, topLevelName) {
        if (this.topLevels.size === 1) {
            return methodName;
        }
        return [topLevelName, (0, Strings_1.capitalize)(methodName)];
    }
    methodName(prefix, suffix, topLevelName) {
        if (this.topLevels.size === 1) {
            return [prefix, suffix];
        }
        return [prefix, topLevelName, suffix];
    }
    decoderName(topLevelName) {
        return this.fieldOrMethodName("fromJsonString", topLevelName);
    }
    encoderName(topLevelName) {
        return this.fieldOrMethodName("toJsonString", topLevelName);
    }
    readerGetterName(topLevelName) {
        return this.methodName("get", "ObjectReader", topLevelName);
    }
    writerGetterName(topLevelName) {
        return this.methodName("get", "ObjectWriter", topLevelName);
    }
    startFile(basename) {
        (0, Support_1.assert)(this._currentFilename === undefined, "Previous file wasn't finished");
        // FIXME: The filenames should actually be Sourcelikes, too
        this._currentFilename = `${this.sourcelikeToString(basename)}.java`;
        // FIXME: Why is this necessary?
        this.ensureBlankLine();
        if (!this._haveEmittedLeadingComments &&
            this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
            this.ensureBlankLine();
            this._haveEmittedLeadingComments = true;
        }
    }
    finishFile() {
        super.finishFile((0, Support_1.defined)(this._currentFilename));
        this._currentFilename = undefined;
    }
    emitPackageAndImports(imports) {
        this.emitLine("package ", this._options.packageName, ";");
        this.ensureBlankLine();
        for (const pkg of imports) {
            this.emitLine("import ", pkg, ";");
        }
    }
    emitFileHeader(fileName, imports) {
        this.startFile(fileName);
        this.emitPackageAndImports(imports);
        this.ensureBlankLine();
    }
    emitDescriptionBlock(lines) {
        this.emitCommentLines(lines, {
            lineStart: " * ",
            beforeComment: "/**",
            afterComment: " */",
        });
    }
    emitBlock(line, f) {
        this.emitLine(line, " {");
        this.indent(f);
        this.emitLine("}");
    }
    emitTryCatch(main, handler, exception = "Exception") {
        this.emitLine("try {");
        this.indent(main);
        this.emitLine("} catch (", exception, " ex) {");
        this.indent(handler);
        this.emitLine("}");
    }
    emitIgnoredTryCatchBlock(f) {
        this.emitTryCatch(f, () => this.emitLine("// Ignored"));
    }
    javaType(reference, t, withIssues = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, "Object"), (_nullType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, "Object"), (_boolType) => (reference ? "Boolean" : "boolean"), (_integerType) => (reference ? "Long" : "long"), (_doubleType) => (reference ? "Double" : "double"), (_stringType) => "String", (arrayType) => {
            if (this._options.useList) {
                return [
                    "List<",
                    this.javaType(true, arrayType.items, withIssues),
                    ">",
                ];
            }
            return [
                this.javaType(false, arrayType.items, withIssues),
                "[]",
            ];
        }, (classType) => this.nameForNamedType(classType), (mapType) => [
            "Map<String, ",
            this.javaType(true, mapType.values, withIssues),
            ">",
        ], (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return this.javaType(true, nullable, withIssues);
            return this.nameForNamedType(unionType);
        }, (transformedStringType) => {
            if (transformedStringType.kind === "time") {
                return this._dateTimeProvider.timeType;
            }
            if (transformedStringType.kind === "date") {
                return this._dateTimeProvider.dateType;
            }
            if (transformedStringType.kind === "date-time") {
                return this._dateTimeProvider.dateTimeType;
            }
            if (transformedStringType.kind === "uuid") {
                return "UUID";
            }
            return "String";
        });
    }
    javaImport(t) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => [], (_nullType) => [], (_boolType) => [], (_integerType) => [], (_doubleType) => [], (_stringType) => [], (arrayType) => {
            if (this._options.useList) {
                return [
                    ...this.javaImport(arrayType.items),
                    "java.util.List",
                ];
            }
            return [...this.javaImport(arrayType.items)];
        }, (_classType) => [], (mapType) => [...this.javaImport(mapType.values), "java.util.Map"], (_enumType) => [], (unionType) => {
            const imports = [];
            unionType.members.forEach((type) => this.javaImport(type).forEach((imp) => imports.push(imp)));
            return imports;
        }, (transformedStringType) => {
            if (transformedStringType.kind === "time") {
                return this._dateTimeProvider.timeImports;
            }
            if (transformedStringType.kind === "date") {
                return this._dateTimeProvider.dateImports;
            }
            if (transformedStringType.kind === "date-time") {
                return this._dateTimeProvider.dateTimeImports;
            }
            if (transformedStringType.kind === "uuid") {
                return ["java.util.UUID"];
            }
            return [];
        });
    }
    javaTypeWithoutGenerics(reference, t) {
        if (t instanceof Type_1.ArrayType) {
            if (this._options.useList) {
                return ["List"];
            }
            return [this.javaTypeWithoutGenerics(false, t.items), "[]"];
        }
        if (t instanceof Type_1.MapType) {
            return "Map";
        }
        if (t instanceof Type_1.UnionType) {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(t);
            if (nullable !== null)
                return this.javaTypeWithoutGenerics(true, nullable);
            return this.nameForNamedType(t);
        }
        return this.javaType(reference, t);
    }
    emitClassAttributes(_c, _className) {
        if (this._options.lombok) {
            this.emitLine("@lombok.Data");
        }
    }
    annotationsForAccessor(_c, _className, _propertyName, _jsonName, _p, _isSetter) {
        return [];
    }
    importsForType(t) {
        if (t instanceof Type_1.ClassType) {
            return [];
        }
        if (t instanceof Type_1.UnionType) {
            return ["java.io.IOException"];
        }
        if (t instanceof Type_1.EnumType) {
            return ["java.io.IOException"];
        }
        return (0, Support_1.assertNever)(t);
    }
    importsForClass(c) {
        const imports = [];
        this.forEachClassProperty(c, "none", (_name, _jsonName, p) => {
            this.javaImport(p.type).forEach((imp) => imports.push(imp));
        });
        imports.sort();
        return [...new Set(imports)];
    }
    importsForUnionMembers(u) {
        const imports = [];
        const [, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u);
        this.forEachUnionMember(u, nonNulls, "none", null, (_fieldName, t) => {
            this.javaImport(t).forEach((imp) => imports.push(imp));
        });
        imports.sort();
        return [...new Set(imports)];
    }
    emitClassDefinition(c, className) {
        const imports = [...this.importsForType(c), ...this.importsForClass(c)];
        this.emitFileHeader(className, imports);
        this.emitDescription(this.descriptionForType(c));
        this.emitClassAttributes(c, className);
        this.emitBlock(["public class ", className], () => {
            this.forEachClassProperty(c, "none", (name, jsonName, p) => {
                if (this._options.lombok &&
                    this._options.lombokCopyAnnotations) {
                    const getter = this.annotationsForAccessor(c, className, name, jsonName, p, false);
                    const setter = this.annotationsForAccessor(c, className, name, jsonName, p, true);
                    if (getter.length !== 0) {
                        this.emitLine(`@lombok.Getter(onMethod_ = {${getter.join(", ")}})`);
                    }
                    if (setter.length !== 0) {
                        this.emitLine(`@lombok.Setter(onMethod_ = {${setter.join(", ")}})`);
                    }
                }
                this.emitLine("private ", this.javaType(false, p.type, true), " ", name, ";");
            });
            if (!this._options.lombok) {
                this.forEachClassProperty(c, "leading-and-interposing", (name, jsonName, p) => {
                    this.emitDescription(this.descriptionForClassProperty(c, jsonName));
                    const [getterName, setterName] = (0, Support_1.defined)(this._gettersAndSettersForPropertyName.get(name));
                    const rendered = this.javaType(false, p.type);
                    this.annotationsForAccessor(c, className, name, jsonName, p, false).forEach((annotation) => this.emitLine(annotation));
                    this.emitLine("public ", rendered, " ", getterName, "() { return ", name, "; }");
                    this.annotationsForAccessor(c, className, name, jsonName, p, true).forEach((annotation) => this.emitLine(annotation));
                    this.emitLine("public void ", setterName, "(", rendered, " value) { this.", name, " = value; }");
                });
            }
        });
        this.finishFile();
    }
    unionField(u, t, withIssues = false) {
        const fieldType = this.javaType(true, t, withIssues);
        // FIXME: "Value" should be part of the name.
        const fieldName = [this.nameForUnionMember(u, t), "Value"];
        return { fieldType, fieldName };
    }
    emitUnionAttributes(_u, _unionName) {
        // empty
    }
    emitUnionSerializer(_u, _unionName) {
        // empty
    }
    emitUnionDefinition(u, unionName) {
        const imports = [
            ...this.importsForType(u),
            ...this.importsForUnionMembers(u),
        ];
        this.emitFileHeader(unionName, imports);
        this.emitDescription(this.descriptionForType(u));
        const [, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u);
        this.emitUnionAttributes(u, unionName);
        this.emitBlock(["public class ", unionName], () => {
            for (const t of nonNulls) {
                const { fieldType, fieldName } = this.unionField(u, t, true);
                this.emitLine("public ", fieldType, " ", fieldName, ";");
            }
            this.emitUnionSerializer(u, unionName);
        });
        this.finishFile();
    }
    emitEnumSerializationAttributes(_e) {
        // Empty
    }
    emitEnumDeserializationAttributes(_e) {
        // Empty
    }
    emitEnumDefinition(e, enumName) {
        this.emitFileHeader(enumName, this.importsForType(e));
        this.emitDescription(this.descriptionForType(e));
        const caseNames = [];
        this.forEachEnumCase(e, "none", (name) => {
            if (caseNames.length > 0)
                caseNames.push(", ");
            caseNames.push(name);
        });
        caseNames.push(";");
        this.emitBlock(["public enum ", enumName], () => {
            this.emitLine(caseNames);
            this.ensureBlankLine();
            this.emitEnumSerializationAttributes(e);
            this.emitBlock("public String toValue()", () => {
                this.emitLine("switch (this) {");
                this.indent(() => {
                    this.forEachEnumCase(e, "none", (name, jsonName) => {
                        this.emitLine("case ", name, ': return "', (0, utils_1.stringEscape)(jsonName), '";');
                    });
                });
                this.emitLine("}");
                this.emitLine("return null;");
            });
            this.ensureBlankLine();
            this.emitEnumDeserializationAttributes(e);
            this.emitBlock([
                "public static ",
                enumName,
                " forValue(String value) throws IOException",
            ], () => {
                this.forEachEnumCase(e, "none", (name, jsonName) => {
                    this.emitLine('if (value.equals("', (0, utils_1.stringEscape)(jsonName), '")) return ', name, ";");
                });
                this.emitLine('throw new IOException("Cannot deserialize ', enumName, '");');
            });
        });
        this.finishFile();
    }
    emitSourceStructure() {
        this.forEachNamedType("leading-and-interposing", (c, n) => this.emitClassDefinition(c, n), (e, n) => this.emitEnumDefinition(e, n), (u, n) => this.emitUnionDefinition(u, n));
    }
}
exports.JavaRenderer = JavaRenderer;
