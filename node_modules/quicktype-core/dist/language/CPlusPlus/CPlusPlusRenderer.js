"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CPlusPlusRenderer = void 0;
const collection_utils_1 = require("collection-utils");
const Annotation_1 = require("../../Annotation");
const AccessorNames_1 = require("../../attributes/AccessorNames");
const EnumValues_1 = require("../../attributes/EnumValues");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Naming_1 = require("../../Naming");
const Source_1 = require("../../Source");
const Strings_1 = require("../../support/Strings");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class CPlusPlusRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
        this._gettersAndSettersForPropertyName = new Map();
        this.NarrowString = new (class extends utils_1.BaseString {
            constructor() {
                super("std::string", "const std::string & ", "std::smatch", "std::regex", "", new utils_1.WrappingCode(["std::to_string("], [")"]), "", "");
            }
            wrapEncodingChange(_qualifier, _fromType, _toType, inner) {
                return inner;
            }
            emitHelperFunctions() {
                return;
            }
        })();
        this.WideString = new (class extends utils_1.BaseString {
            constructor(superThis) {
                super("std::wstring", "const std::wstring & ", "std::wsmatch", "std::wregex", "L", new utils_1.WrappingCode(["std::to_wstring("], [")"]), "Utf16_Utf8", "convert");
                this.superThis = superThis;
            }
            wrapEncodingChange(qualifier, fromType, toType, inner) {
                if (this.superThis.sourcelikeToString(fromType) ===
                    this.superThis.sourcelikeToString(toType)) {
                    return inner;
                }
                return [
                    (0, utils_1.addQualifier)(qualifier, [this._encodingClass]),
                    "<",
                    fromType,
                    ", ",
                    toType,
                    ">::",
                    this._encodingFunction,
                    "(",
                    inner,
                    ")",
                ];
            }
            emitHelperFunctions() {
                this.superThis.emitLine("template<typename T>");
                this.superThis.emitLine("struct tag {};");
                this.superThis.ensureBlankLine();
                this.superThis.emitLine("template<typename fromType, typename toType>");
                this.superThis.emitBlock(["class Utf16_Utf8"], true, () => {
                    this.superThis.emitLine("private:");
                    this.superThis.emitLine("template<typename TF, typename TT>");
                    this.superThis.emitBlock([
                        "static toType convert(tag<std::shared_ptr<TF> >, tag<std::shared_ptr<TT> >, fromType ptr)",
                    ], false, () => {
                        this.superThis.emitLine("if (ptr == nullptr) return std::unique_ptr<TT>(); else return std::unique_ptr<TT>(new TT(Utf16_Utf8<TF,TT>::convert(*ptr)));");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitLine("template<typename TF, typename TT>");
                    this.superThis.emitBlock([
                        "static toType convert(tag<std::vector<TF> >, tag<std::vector<TT> >, fromType v)",
                    ], false, () => {
                        this.superThis.emitLine("auto it = v.begin();");
                        this.superThis.emitLine("auto newVector = std::vector<TT>();");
                        this.superThis.emitBlock(["while (it != v.end())"], false, () => {
                            this.superThis.emitLine("newVector.push_back(Utf16_Utf8<TF,TT>::convert(*it));");
                            this.superThis.emitLine("it++;");
                        });
                        this.superThis.emitLine("return newVector;");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitLine("template<typename KF, typename VF, typename KT, typename VT>");
                    this.superThis.emitBlock([
                        "static toType convert(tag<std::map<KF,VF> >, tag<std::map<KT,VT> >, fromType m)",
                    ], false, () => {
                        this.superThis.emitLine("auto it = m.begin();");
                        this.superThis.emitLine("auto newMap = std::map<KT, VT>();");
                        this.superThis.emitBlock(["while (it != m.end())"], false, () => {
                            this.superThis.emitLine("newMap.insert(std::pair<KT, VT>(Utf16_Utf8<KF, KT>::convert(it->first), Utf16_Utf8<VF, VT>::convert(it->second)));");
                            this.superThis.emitLine("it++;");
                        });
                        this.superThis.emitLine("return newMap;");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitLine("template<typename TF, typename TT>");
                    this.superThis.emitBlock([
                        "static fromType convert(tag<TF>, tag<TT>, fromType from)",
                    ], false, () => {
                        this.superThis.emitLine("return from;");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitBlock([
                        "static std::wstring convert(tag<std::string>, tag<std::wstring>, std::string str)",
                    ], false, () => {
                        this.superThis.emitLine("return std::wstring_convert<std::codecvt_utf8_utf16<wchar_t, 0x10ffff, std::little_endian>, wchar_t>{}.from_bytes(str.data());");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitBlock([
                        "static std::string convert(tag<std::wstring>, tag<std::string>, std::wstring str)",
                    ], false, () => {
                        this.superThis.emitLine("return std::wstring_convert<std::codecvt_utf8_utf16<wchar_t, 0x10ffff, std::little_endian>, wchar_t>{}.to_bytes(str.data());");
                    });
                    this.superThis.ensureBlankLine();
                    this.superThis.emitLine("public:");
                    this.superThis.emitBlock(["static toType convert(fromType in)"], false, () => {
                        this.superThis.emitLine("return convert(tag<fromType>(), tag<toType>(), in);");
                    });
                });
                this.superThis.ensureBlankLine();
                this.superThis.emitLine("template<typename T>");
                this.superThis.emitBlock(["std::wstring wdump(const T& j)"], false, () => {
                    this.superThis.emitLine("std::ostringstream s;");
                    this.superThis.emitLine("s << j;");
                    this.superThis.emitLine("return ", this.superThis.ourQualifier(false), "Utf16_Utf8<std::string, std::wstring>::convert(s.str()); ");
                });
                this.superThis.ensureBlankLine();
            }
        })(this);
        this._enumType = _options.enumType;
        this._namespaceNames = _options.namespace.split("::");
        this.typeNamingStyle = _options.typeNamingStyle;
        this._namedTypeNameStyle = (0, Strings_1.makeNameStyle)(this.typeNamingStyle, utils_1.legalizeName);
        this.enumeratorNamingStyle = _options.enumeratorNamingStyle;
        this._memberNameStyle = (0, Strings_1.makeNameStyle)(_options.memberNamingStyle, utils_1.legalizeName);
        this._memberNamingFunction = (0, Naming_1.funPrefixNamer)("members", this._memberNameStyle);
        this._gettersAndSettersForPropertyName = new Map();
        this._allTypeNames = new Set();
        this._generatedFiles = new Set();
        this._generatedGlobalNames = new Map();
        this._generatedMemberNames = new Map();
        this._forbiddenGlobalNames = [];
        if (_options.wstring) {
            this._stringType = this.WideString;
        }
        else {
            this._stringType = this.NarrowString;
        }
        if (_options.boost) {
            this._optionalType = "boost::optional";
            this._optionalFactory = "boost::optional";
            this._nulloptType = "boost::none";
            this._variantType = "boost::variant";
            this._variantIndexMethodName = "which";
        }
        else {
            this._optionalType = "std::optional";
            this._optionalFactory = "std::make_optional";
            this._nulloptType = "std::nullopt";
            this._variantType = "std::variant";
            this._variantIndexMethodName = "index";
        }
        this.setupGlobalNames();
    }
    // union typeguard
    isUnion(t) {
        return t.kind === "union";
    }
    // Returns true if the type can be stored in
    // a stack based optional type. This requires
    // that the type does not require forward declaration.
    isOptionalAsValuePossible(t) {
        if (this.isForwardDeclaredType(t))
            return false;
        if (this.isUnion(t)) {
            // There is something stinky about this test.
            // There is special handling somewhere that if you
            // have the following schema
            // {
            //     "$schema": "http://json-schema.org/draft-06/schema#",
            //     "$ref": "#/definitions/List",
            //     "definitions": {
            //         "List": {
            //             "type": "object",
            //             "additionalProperties": false,
            //             "properties": {
            //                 "data": {
            //                     "type": "string"
            //                 },
            //                 "next": {
            //                     "anyOf": [
            //                         {
            //                             "$ref": "#/definitions/List"
            //                         }
            //                         {
            //                             "type": "null"
            //                         }
            //                     ]
            //                 }
            //             },
            //             "required": [],
            //             "title": "List"
            //         }
            //     }
            // }
            // Then a variant is not output but the single item inlined
            //
            //     struct TopLevel {
            //       std::optional<std::string> data;
            //       std::optional<TopLevel> next;
            //     };
            //
            // instead of
            //     struct TopLevel {
            //       std::optional<std::string> data;
            //       std::shared_ptr<TopLevel> next;
            //     };
            //
            // checking to see if the collapse of the variant has
            // occurred and then doing the isCycleBreakerType check
            // on the single type the variant would contain seems
            // to solve the problem. But does this point to a problem
            // with the core library or with the CPlusPlus package
            const [, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(t);
            if (nonNulls.size === 1) {
                const tt = (0, Support_1.defined)((0, collection_utils_1.iterableFirst)(nonNulls));
                return !this.isCycleBreakerType(tt);
            }
        }
        return !this.isCycleBreakerType(t);
    }
    isImplicitCycleBreaker(t) {
        const kind = t.kind;
        return kind === "array" || kind === "map";
    }
    // Is likely to return std::optional or boost::optional
    optionalTypeStack() {
        return this._optionalType;
    }
    // Is likely to return std::make_optional or boost::optional
    optionalFactoryStack() {
        return this._optionalFactory;
    }
    // Is likely to return std::shared_ptr
    optionalTypeHeap() {
        return utils_1.optionalAsSharedType;
    }
    // Is likely to return std::make_shared
    optionalFactoryHeap() {
        return utils_1.optionalFactoryAsSharedType;
    }
    // Returns the optional type most suitable for the given type.
    // Classes that don't require forward declarations can be stored
    // in std::optional ( or boost::optional )
    optionalType(t) {
        if (this.isOptionalAsValuePossible(t)) {
            return this.optionalTypeStack();
        }
        return this.optionalTypeHeap();
    }
    // Returns a label that can be used to distinguish between
    // heap and stack based optional handling methods
    optionalTypeLabel(t) {
        if (this.isOptionalAsValuePossible(t)) {
            return "stack";
        }
        return "heap";
    }
    getConstraintMembers() {
        return [
            {
                name: utils_1.MemberNames.MinIntValue,
                getter: utils_1.MemberNames.GetMinIntValue,
                setter: utils_1.MemberNames.SetMinIntValue,
                cppType: "int64_t",
            },
            {
                name: utils_1.MemberNames.MaxIntValue,
                getter: utils_1.MemberNames.GetMaxIntValue,
                setter: utils_1.MemberNames.SetMaxIntValue,
                cppType: "int64_t",
            },
            {
                name: utils_1.MemberNames.MinDoubleValue,
                getter: utils_1.MemberNames.GetMinDoubleValue,
                setter: utils_1.MemberNames.SetMinDoubleValue,
                cppType: "double",
            },
            {
                name: utils_1.MemberNames.MaxDoubleValue,
                getter: utils_1.MemberNames.GetMaxDoubleValue,
                setter: utils_1.MemberNames.SetMaxDoubleValue,
                cppType: "double",
            },
            {
                name: utils_1.MemberNames.MinLength,
                getter: utils_1.MemberNames.GetMinLength,
                setter: utils_1.MemberNames.SetMinLength,
                cppType: "size_t",
            },
            {
                name: utils_1.MemberNames.MaxLength,
                getter: utils_1.MemberNames.GetMaxLength,
                setter: utils_1.MemberNames.SetMaxLength,
                cppType: "size_t",
            },
            {
                name: utils_1.MemberNames.Pattern,
                getter: utils_1.MemberNames.GetPattern,
                setter: utils_1.MemberNames.SetPattern,
                cppType: this._stringType.getType(),
                cppConstType: this._stringType.getConstType(),
            },
        ];
    }
    lookupGlobalName(type) {
        return (0, Support_1.defined)(this._generatedGlobalNames.get(type));
    }
    lookupMemberName(type) {
        return (0, Support_1.defined)(this._generatedMemberNames.get(type));
    }
    addGlobalName(type) {
        const genName = this._namedTypeNameStyle(utils_1.GlobalNames[type]);
        this._generatedGlobalNames.set(type, genName);
        this._forbiddenGlobalNames.push(genName);
    }
    addMemberName(type) {
        this._generatedMemberNames.set(type, this._memberNameStyle(utils_1.MemberNames[type]));
    }
    setupGlobalNames() {
        for (const v of (0, Support_1.numberEnumValues)(utils_1.GlobalNames)) {
            this.addGlobalName(v);
        }
        for (const v of (0, Support_1.numberEnumValues)(utils_1.MemberNames)) {
            this.addMemberName(v);
        }
    }
    forbiddenNamesForGlobalNamespace() {
        return [...constants_1.keywords, ...this._forbiddenGlobalNames];
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_e, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    makeNamedTypeNamer() {
        return (0, Naming_1.funPrefixNamer)("types", this._namedTypeNameStyle);
    }
    namerForObjectProperty() {
        return this._memberNamingFunction;
    }
    makeUnionMemberNamer() {
        return null;
    }
    makeEnumCaseNamer() {
        return (0, Naming_1.funPrefixNamer)("enumerators", (0, Strings_1.makeNameStyle)(this.enumeratorNamingStyle, utils_1.legalizeName));
    }
    makeNamesForPropertyGetterAndSetter(_c, _className, _p, _jsonName, name) {
        const getterName = new Naming_1.DependencyName(this._memberNamingFunction, name.order, (lookup) => `get_${lookup(name)}`);
        const mutableGetterName = new Naming_1.DependencyName(this._memberNamingFunction, name.order, (lookup) => `getMutable_${lookup(name)}`);
        const setterName = new Naming_1.DependencyName(this._memberNamingFunction, name.order, (lookup) => `set_${lookup(name)}`);
        return [getterName, mutableGetterName, setterName];
    }
    makePropertyDependencyNames(c, className, p, jsonName, name) {
        const getterAndSetterNames = this.makeNamesForPropertyGetterAndSetter(c, className, p, jsonName, name);
        this._gettersAndSettersForPropertyName.set(name, getterAndSetterNames);
        return getterAndSetterNames;
    }
    withConst(s) {
        if (this._options.westConst) {
            return ["const ", s];
        }
        return [s, " const"];
    }
    emitInclude(global, name) {
        this.emitLine("#include ", global ? "<" : '"', name, global ? ">" : '"');
    }
    startFile(basename, includeHelper = true) {
        (0, Support_1.assert)(this._currentFilename === undefined, "Previous file wasn't finished");
        if (basename !== undefined) {
            this._currentFilename = this.sourcelikeToString(basename);
        }
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
        }
        else if (!this._options.justTypes) {
            this.emitCommentLines([
                " To parse this JSON data, first install",
                "",
            ]);
            if (this._options.boost) {
                this.emitCommentLines(["     Boost     http://www.boost.org"]);
            }
            this.emitCommentLines([
                "     json.hpp  https://github.com/nlohmann/json",
                "",
                " Then include this file, and then do",
                "",
            ]);
            if (this._options.typeSourceStyle) {
                this.forEachTopLevel("none", (_, topLevelName) => {
                    this.emitLine("//     ", topLevelName, " data = nlohmann::json::parse(jsonString);");
                });
            }
            else {
                this.emitLine("//     ", basename, " data = nlohmann::json::parse(jsonString);");
            }
            if (this._options.wstring) {
                this.emitLine("//");
                this.emitLine("//  You can get std::wstring data back out using");
                this.emitLine("//");
                this.forEachTopLevel("none", (_, topLevelName) => {
                    this.emitLine("//     std::wcout << ", "wdump((nlohmann::json) ", topLevelName, ");");
                });
            }
        }
        this.ensureBlankLine();
        this.emitLine("#pragma once");
        this.ensureBlankLine();
        if (this.haveOptionalProperties) {
            if (this._options.boost) {
                this.emitInclude(true, "boost/optional.hpp");
            }
            else {
                this.emitInclude(true, "optional");
            }
        }
        if (this.haveNamedUnions) {
            if (this._options.boost) {
                this.emitInclude(true, "boost/variant.hpp");
            }
            else {
                this.emitInclude(true, "variant");
            }
        }
        if (!this._options.justTypes) {
            if (!this._options.includeLocation) {
                this.emitInclude(true, "nlohmann/json.hpp");
            }
            else {
                this.emitInclude(false, "json.hpp");
            }
            if (includeHelper && !this._options.typeSourceStyle) {
                this.emitInclude(false, "helper.hpp");
            }
        }
        this.ensureBlankLine();
    }
    finishFile() {
        super.finishFile((0, Support_1.defined)(this._currentFilename));
        this._currentFilename = undefined;
    }
    get needsTypeDeclarationBeforeUse() {
        return true;
    }
    canBeForwardDeclared(t) {
        const kind = t.kind;
        return kind === "class";
    }
    emitDescriptionBlock(lines) {
        this.emitCommentLines(lines, {
            lineStart: " * ",
            beforeComment: "/**",
            afterComment: " */",
        });
    }
    emitBlock(line, withSemicolon, f, withIndent = true) {
        this.emitLine(line, " {");
        this.preventBlankLine();
        if (withIndent) {
            this.indent(f);
        }
        else {
            f();
        }
        this.preventBlankLine();
        if (withSemicolon) {
            this.emitLine("};");
        }
        else {
            this.emitLine("}");
        }
    }
    emitNamespaces(namespaceNames, f) {
        const namesArray = (0, collection_utils_1.toReadonlyArray)(namespaceNames);
        const first = namesArray[0];
        if (first === undefined) {
            f();
        }
        else {
            this.emitBlock(["namespace ", first], false, () => this.emitNamespaces(namesArray.slice(1), f), namesArray.length === 1);
        }
    }
    cppTypeInOptional(nonNulls, ctx, withIssues, forceNarrowString) {
        if (nonNulls.size === 1) {
            return this.cppType((0, Support_1.defined)((0, collection_utils_1.iterableFirst)(nonNulls)), ctx, withIssues, forceNarrowString, false);
        }
        const typeList = [];
        for (const t of nonNulls) {
            if (typeList.length !== 0) {
                typeList.push(", ");
            }
            typeList.push(this.cppType(t, {
                needsForwardIndirection: true,
                needsOptionalIndirection: false,
                inJsonNamespace: ctx.inJsonNamespace,
            }, withIssues, false, false));
        }
        return [this._variantType, "<", typeList, ">"];
    }
    variantType(u, inJsonNamespace) {
        const [maybeNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u, true);
        (0, Support_1.assert)(nonNulls.size >= 2, "Variant not needed for less than two types.");
        const indirection = maybeNull !== null;
        const variant = this.cppTypeInOptional(nonNulls, {
            needsForwardIndirection: !indirection,
            needsOptionalIndirection: !indirection,
            inJsonNamespace,
        }, true, false);
        if (!indirection) {
            return variant;
        }
        return [this.optionalType(u), "<", variant, ">"];
    }
    ourQualifier(inJsonNamespace) {
        return inJsonNamespace
            ? [(0, collection_utils_1.arrayIntercalate)("::", this._namespaceNames), "::"]
            : [];
    }
    jsonQualifier(inJsonNamespace) {
        return inJsonNamespace ? [] : "nlohmann::";
    }
    variantIndirection(type, needIndirection, typeSrc) {
        if (!needIndirection)
            return typeSrc;
        return [this.optionalType(type), "<", typeSrc, ">"];
    }
    cppType(t, ctx, withIssues, forceNarrowString, isOptional) {
        const inJsonNamespace = ctx.inJsonNamespace;
        if (isOptional && t instanceof Type_1.UnionType) {
            // avoid have optionalType<optionalType<Type>>
            for (const tChild of t.getChildren()) {
                if (tChild.isNullable) {
                    isOptional = false;
                    break;
                }
            }
        }
        const typeSource = (0, TypeUtils_1.matchType)(t, (_anyType) => {
            isOptional = false;
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, [
                this.jsonQualifier(inJsonNamespace),
                "json",
            ]);
        }, (_nullType) => {
            isOptional = false;
            return (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, [
                this.jsonQualifier(inJsonNamespace),
                "json",
            ]);
        }, (_boolType) => "bool", (_integerType) => "int64_t", (_doubleType) => "double", (_stringType) => {
            if (forceNarrowString) {
                return "std::string";
            }
            return this._stringType.getType();
        }, (arrayType) => [
            "std::vector<",
            this.cppType(arrayType.items, {
                needsForwardIndirection: false,
                needsOptionalIndirection: true,
                inJsonNamespace,
            }, withIssues, forceNarrowString, false),
            ">",
        ], (classType) => this.variantIndirection(classType, ctx.needsForwardIndirection &&
            this.isForwardDeclaredType(classType) &&
            !isOptional, [
            this.ourQualifier(inJsonNamespace),
            this.nameForNamedType(classType),
        ]), (mapType) => {
            let keyType = this._stringType.getType();
            if (forceNarrowString) {
                keyType = "std::string";
            }
            return [
                "std::map<",
                keyType,
                ", ",
                this.cppType(mapType.values, {
                    needsForwardIndirection: false,
                    needsOptionalIndirection: true,
                    inJsonNamespace,
                }, withIssues, forceNarrowString, false),
                ">",
            ];
        }, (enumType) => [
            this.ourQualifier(inJsonNamespace),
            this.nameForNamedType(enumType),
        ], (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null) {
                isOptional = true;
                return this.cppType(nullable, {
                    needsForwardIndirection: false,
                    needsOptionalIndirection: false,
                    inJsonNamespace,
                }, withIssues, forceNarrowString, false);
            }
            return [
                this.ourQualifier(inJsonNamespace),
                this.nameForNamedType(unionType),
            ];
        });
        if (!isOptional)
            return typeSource;
        return [this.optionalType(t), "<", typeSource, ">"];
    }
    /**
     * similar to cppType, it practically gathers all the generated types within
     * 't'. It also records, whether a given sub-type is part of a variant or not.
     */
    generatedTypes(isClassMember, theType) {
        const result = [];
        const recur = (forceInclude, isVariant, l, t) => {
            if (t instanceof Type_1.ArrayType) {
                recur(true, isVariant, l + 1, t.items);
            }
            else if (t instanceof Type_1.ClassType) {
                result.push({
                    name: this.nameForNamedType(t),
                    type: t,
                    level: l,
                    variant: isVariant,
                    forceInclude,
                });
            }
            else if (t instanceof Type_1.MapType) {
                recur(true, isVariant, l + 1, t.values);
            }
            else if (t instanceof Type_1.EnumType) {
                result.push({
                    name: this.nameForNamedType(t),
                    type: t,
                    level: l,
                    variant: isVariant,
                    forceInclude: false,
                });
            }
            else if (t instanceof Type_1.UnionType) {
                /**
                 * If we have a union as a class member and we see it as a "named union",
                 * we can safely include it as-is.
                 * HOWEVER if we define a union on its own, we must recurse into the
                 * typedefinition and include all subtypes.
                 */
                if (this.unionNeedsName(t) && isClassMember) {
                    /**
                     * This is NOT ENOUGH.
                     * We have a variant member in a class, e.g. defined with a boost::variant.
                     * The compiler can only compile the class if IT KNOWS THE SIZES
                     * OF ALL MEMBERS OF THE VARIANT.
                     * So it means that you must include ALL SUBTYPES (practically classes only)
                     * AS WELL
                     */
                    forceInclude = true;
                    result.push({
                        name: this.nameForNamedType(t),
                        type: t,
                        level: l,
                        variant: true,
                        forceInclude,
                    });
                    /** intentional "fall-through", add all subtypes as well - but forced include */
                }
                const [hasNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(t);
                isVariant = hasNull !== null;
                /** we need to collect all the subtypes of the union */
                for (const tt of nonNulls) {
                    recur(forceInclude, isVariant, l + 1, tt);
                }
            }
        };
        recur(false, false, 0, theType);
        return result;
    }
    constraintMember(jsonName) {
        return this._memberNameStyle(`${jsonName}Constraint`);
    }
    emitMember(cppType, name) {
        this.emitLine(cppType, " ", name, ";");
    }
    emitClassMembers(c, constraints) {
        if (this._options.codeFormat) {
            this.emitLine("private:");
            this.forEachClassProperty(c, "none", (name, jsonName, property) => {
                this.emitMember(this.cppType(property.type, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, true, false, property.isOptional), name);
                if (constraints === null || constraints === void 0 ? void 0 : constraints.has(jsonName)) {
                    /** FIXME!!! NameStyle will/can collide with other Names */
                    const cnst = this.lookupGlobalName(utils_1.GlobalNames.ClassMemberConstraints);
                    this.emitMember(cnst, this.constraintMember(jsonName));
                }
            });
            this.ensureBlankLine();
            this.emitLine("public:");
        }
        this.forEachClassProperty(c, "none", (name, jsonName, property) => {
            this.emitDescription(this.descriptionForClassProperty(c, jsonName));
            if (!this._options.codeFormat) {
                this.emitMember(this.cppType(property.type, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, true, false, property.isOptional), name);
            }
            else {
                const [getterName, mutableGetterName, setterName] = (0, Support_1.defined)(this._gettersAndSettersForPropertyName.get(name));
                const rendered = this.cppType(property.type, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, true, false, property.isOptional);
                /**
                 * fix for optional type -> e.g. unique_ptrs can't be copied
                 * One might as why the "this->xxx = value". Simple if we have
                 * a member called 'value' value = value will screw up the compiler
                 */
                const checkConst = this.lookupGlobalName(utils_1.GlobalNames.CheckConstraint);
                if ((property.type instanceof Type_1.UnionType &&
                    property.type.findMember("null") !== undefined) ||
                    (property.isOptional &&
                        property.type.kind !== "null" &&
                        property.type.kind !== "any")) {
                    this.emitLine(rendered, " ", getterName, "() const { return ", name, "; }");
                    if (constraints === null || constraints === void 0 ? void 0 : constraints.has(jsonName)) {
                        this.emitLine("void ", setterName, "(", rendered, " value) { if (value) ", checkConst, "(", this._stringType.createStringLiteral([name]), ", ", this.constraintMember(jsonName), ", *value); this->", name, " = value; }");
                    }
                    else {
                        this.emitLine("void ", setterName, "(", rendered, " value) { this->", name, " = value; }");
                    }
                }
                else {
                    this.emitLine(this.withConst(rendered), " & ", getterName, "() const { return ", name, "; }");
                    this.emitLine(rendered, " & ", mutableGetterName, "() { return ", name, "; }");
                    if (constraints === null || constraints === void 0 ? void 0 : constraints.has(jsonName)) {
                        this.emitLine("void ", setterName, "(", this.withConst(rendered), " & value) { ", checkConst, "(", this._stringType.createStringLiteral([name]), ", ", this.constraintMember(jsonName), ", value); this->", name, " = value; }");
                    }
                    else {
                        this.emitLine("void ", setterName, "(", this.withConst(rendered), " & value) { this->", name, " = value; }");
                    }
                }
                this.ensureBlankLine();
            }
        });
    }
    generateClassConstraints(c) {
        const res = new Map();
        this.forEachClassProperty(c, "none", (_name, jsonName, property) => {
            const constraints = (0, utils_1.constraintsForType)(property.type);
            if (constraints === undefined)
                return;
            const { minMax, minMaxLength, pattern } = constraints;
            // TODO is there a better way to check if property.type is an integer or a number?
            const cppType = this.cppType(property.type, {
                needsForwardIndirection: true,
                needsOptionalIndirection: true,
                inJsonNamespace: false,
            }, true, false, property.isOptional);
            res.set(jsonName, [
                this.constraintMember(jsonName),
                "(",
                (minMax === null || minMax === void 0 ? void 0 : minMax[0]) && cppType === "int64_t"
                    ? String(minMax[0])
                    : this._nulloptType,
                ", ",
                (minMax === null || minMax === void 0 ? void 0 : minMax[1]) && cppType === "int64_t"
                    ? String(minMax[1])
                    : this._nulloptType,
                ", ",
                (minMax === null || minMax === void 0 ? void 0 : minMax[0]) && cppType === "double"
                    ? String(minMax[0])
                    : this._nulloptType,
                ", ",
                (minMax === null || minMax === void 0 ? void 0 : minMax[1]) && cppType === "double"
                    ? String(minMax[1])
                    : this._nulloptType,
                ", ",
                (minMaxLength === null || minMaxLength === void 0 ? void 0 : minMaxLength[0]) ? String(minMaxLength[0]) : this._nulloptType,
                ", ",
                (minMaxLength === null || minMaxLength === void 0 ? void 0 : minMaxLength[1]) ? String(minMaxLength[1]) : this._nulloptType,
                ", ",
                pattern === undefined
                    ? this._nulloptType
                    : [
                        this._stringType.getType(),
                        "(",
                        this._stringType.createStringLiteral([
                            (0, Strings_1.stringEscape)(pattern),
                        ]),
                        ")",
                    ],
                ")",
            ]);
        });
        return res.size === 0 ? undefined : res;
    }
    emitClass(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitBlock([this._options.codeFormat ? "class " : "struct ", className], true, () => {
            const constraints = this.generateClassConstraints(c);
            if (this._options.codeFormat) {
                this.emitLine("public:");
                if (constraints === undefined) {
                    this.emitLine(className, "() = default;");
                }
                else {
                    this.emitLine(className, "() :");
                    let numEmits = 0;
                    constraints.forEach((initializer, _propName) => {
                        numEmits++;
                        this.indent(() => {
                            if (numEmits === constraints.size) {
                                this.emitLine(initializer);
                            }
                            else {
                                this.emitLine(initializer, ",");
                            }
                        });
                    });
                    this.emitLine("{}");
                }
                this.emitLine("virtual ~", className, "() = default;");
                this.ensureBlankLine();
            }
            this.emitClassMembers(c, constraints);
        });
    }
    emitTopLevelHeaders(t, className) {
        // Forward declarations for std::map<std::wstring, Key> (need to convert UTF16 <-> UTF8)
        if (t instanceof Type_1.MapType && this._stringType !== this.NarrowString) {
            const ourQualifier = this.ourQualifier(true);
            this.emitBlock(["struct adl_serializer<", ourQualifier, className, ">"], true, () => {
                this.emitLine("template <>");
                this.emitLine("static void from_json(", this.withConst("json"), " & j, ", ourQualifier, className, " & x);");
                this.emitLine("static void to_json(json & j, ", this.withConst([ourQualifier, className]), " & x);");
            });
        }
    }
    emitClassHeaders(className) {
        const ourQualifier = this.ourQualifier(false);
        this.emitLine("void from_json(", this.withConst("json"), " & j, ", ourQualifier, className, " & x);");
        this.emitLine("void to_json(json & j, ", this.withConst([ourQualifier, className]), " & x);");
    }
    emitTopLevelFunction(t, className) {
        // Function definitions for std::map<std::wstring, Key> (need to convert UTF16 <-> UTF8)
        if (t instanceof Type_1.MapType && this._stringType !== this.NarrowString) {
            const ourQualifier = this.ourQualifier(true);
            let cppType;
            let toType;
            this.emitBlock([
                "inline void adl_serializer<",
                ourQualifier,
                className,
                ">::from_json(",
                this.withConst("json"),
                " & j, ",
                ourQualifier,
                className,
                "& x)",
            ], false, () => {
                cppType = this.cppType(t, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: true,
                }, false, true, false);
                toType = this.cppType(t, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: true,
                }, false, false, false);
                this.emitLine([
                    "x = ",
                    this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, ["j.get<", cppType, ">()"]),
                    ";",
                ]);
            });
            this.emitBlock([
                "inline void adl_serializer<",
                ourQualifier,
                className,
                ">::to_json(json & j, ",
                this.withConst([ourQualifier, className]),
                " & x)",
            ], false, () => {
                cppType = this.cppType(t, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: true,
                }, false, false, false);
                toType = this.cppType(t, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: true,
                }, false, true, false);
                this.emitLine([
                    "j = ",
                    this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, "x"),
                    ";",
                ]);
            });
        }
    }
    emitClassFunctions(c, className) {
        const ourQualifier = this.ourQualifier(false);
        let cppType;
        let toType;
        this.emitBlock([
            "inline void from_json(",
            this.withConst("json"),
            " & j, ",
            ourQualifier,
            className,
            "& x)",
        ], false, () => {
            this.forEachClassProperty(c, "none", (name, json, p) => {
                const [, , setterName] = (0, Support_1.defined)(this._gettersAndSettersForPropertyName.get(name));
                const propType = p.type;
                let assignment;
                if (this._options.codeFormat) {
                    assignment = new utils_1.WrappingCode(["x.", setterName, "("], [")"]);
                }
                else {
                    assignment = new utils_1.WrappingCode(["x.", name, " = "], []);
                }
                if (propType.kind === "null" || propType.kind === "any") {
                    this.emitLine(assignment.wrap([], [
                        ourQualifier,
                        "get_untyped(j, ",
                        this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), [
                            this._stringType.createStringLiteral([(0, Strings_1.stringEscape)(json)]),
                        ]),
                        ")",
                    ]), ";");
                    return;
                }
                if (p.isOptional || propType instanceof Type_1.UnionType) {
                    const [nullOrOptional, typeSet] = (() => {
                        if (propType instanceof Type_1.UnionType) {
                            const [maybeNull, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(propType, true);
                            return [
                                maybeNull !== null || p.isOptional,
                                nonNulls,
                            ];
                        }
                        const set = new Set();
                        set.add(propType);
                        return [true, set];
                    })();
                    if (nullOrOptional) {
                        cppType = this.cppTypeInOptional(typeSet, {
                            needsForwardIndirection: false,
                            needsOptionalIndirection: false,
                            inJsonNamespace: false,
                        }, false, true);
                        toType = this.cppTypeInOptional(typeSet, {
                            needsForwardIndirection: false,
                            needsOptionalIndirection: false,
                            inJsonNamespace: false,
                        }, false, false);
                        this.emitLine(assignment.wrap([], [
                            this._stringType.wrapEncodingChange([ourQualifier], [
                                this.optionalType(propType),
                                "<",
                                cppType,
                                ">",
                            ], [
                                this.optionalType(propType),
                                "<",
                                toType,
                                ">",
                            ], [
                                ourQualifier,
                                `get_${this.optionalTypeLabel(propType)}_optional<`,
                                cppType,
                                ">(j, ",
                                this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), [
                                    this._stringType.createStringLiteral([
                                        (0, Strings_1.stringEscape)(json),
                                    ]),
                                ]),
                                ")",
                            ]),
                        ]), ";");
                        return;
                    }
                }
                cppType = this.cppType(propType, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, false, true, p.isOptional);
                toType = this.cppType(propType, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, false, false, p.isOptional);
                this.emitLine(assignment.wrap([], this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, [
                    "j.at(",
                    this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), this._stringType.createStringLiteral([
                        (0, Strings_1.stringEscape)(json),
                    ])),
                    ").get<",
                    cppType,
                    ">()",
                ])), ";");
            });
        });
        this.ensureBlankLine();
        this.emitBlock([
            "inline void to_json(json & j, ",
            this.withConst([ourQualifier, className]),
            " & x)",
        ], false, () => {
            this.emitLine("j = json::object();");
            this.forEachClassProperty(c, "none", (name, json, p) => {
                const propType = p.type;
                cppType = this.cppType(propType, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, false, false, p.isOptional);
                toType = this.cppType(propType, {
                    needsForwardIndirection: true,
                    needsOptionalIndirection: true,
                    inJsonNamespace: false,
                }, false, true, p.isOptional);
                const [getterName, ,] = (0, Support_1.defined)(this._gettersAndSettersForPropertyName.get(name));
                let getter;
                if (this._options.codeFormat) {
                    getter = [getterName, "()"];
                }
                else {
                    getter = [name];
                }
                const assignment = [
                    "j[",
                    this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), this._stringType.createStringLiteral([
                        (0, Strings_1.stringEscape)(json),
                    ])),
                    "] = ",
                    this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, ["x.", getter]),
                    ";",
                ];
                if (p.isOptional && this._options.hideNullOptional) {
                    this.emitBlock([
                        "if (",
                        this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, ["x.", getter]),
                        ")",
                    ], false, () => {
                        this.emitLine(assignment);
                    });
                }
                else {
                    this.emitLine(assignment);
                }
            });
        });
    }
    emitEnum(e, enumName) {
        const caseNames = [];
        const enumValues = (0, EnumValues_1.enumCaseValues)(e, this.targetLanguage.name);
        this.forEachEnumCase(e, "none", (name, jsonName) => {
            if (caseNames.length > 0)
                caseNames.push(", ");
            caseNames.push(name);
            if (enumValues !== undefined) {
                const [enumValue] = (0, AccessorNames_1.getAccessorName)(enumValues, jsonName);
                if (enumValue !== undefined) {
                    caseNames.push(" = ", enumValue.toString());
                }
            }
        });
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("enum class ", enumName, " : ", this._enumType, " { ", caseNames, " };");
    }
    emitUnionTypedefs(u, unionName) {
        this.emitLine("using ", unionName, " = ", this.variantType(u, false), ";");
    }
    emitUnionHeaders(u) {
        // Forward declarations for boost::variant<Ts...>. If none of the Ts were defined by us (e.g. if we have
        // boost::variant<int32_t, std::string>) then we need to specialize nlohmann::adl_serializer for our
        // variant type. If at least one of the Ts is our type then we could get away with regular adl definitions,
        // but it's nontrivial to detect that (consider variant<string, variant<map<string, string>, int>> which
        // does need an adl_serializer specialization) so we'll just specialize every time.
        const nonNulls = (0, TypeUtils_1.removeNullFromUnion)(u, true)[1];
        const variantType = this.cppTypeInOptional(nonNulls, {
            needsForwardIndirection: false,
            needsOptionalIndirection: false,
            inJsonNamespace: true,
        }, false, false);
        this.emitLine("template <>");
        this.emitBlock(["struct adl_serializer<", variantType, ">"], true, () => {
            this.emitLine("static void from_json(", this.withConst("json"), " & j, ", variantType, " & x);");
            this.emitLine("static void to_json(json & j, ", this.withConst(variantType), " & x);");
        });
    }
    emitUnionFunctions(u) {
        // Function definitions for boost::variant<Ts...>.
        const ourQualifier = this.ourQualifier(true);
        const functionForKind = [
            ["bool", "is_boolean"],
            ["integer", "is_number_integer"],
            ["double", "is_number"],
            ["string", "is_string"],
            ["class", "is_object"],
            ["map", "is_object"],
            ["array", "is_array"],
            ["enum", "is_string"],
        ];
        const nonNulls = (0, TypeUtils_1.removeNullFromUnion)(u, true)[1];
        const variantType = this.cppTypeInOptional(nonNulls, {
            needsForwardIndirection: false,
            needsOptionalIndirection: false,
            inJsonNamespace: true,
        }, false, false);
        this.emitBlock([
            "inline void adl_serializer<",
            variantType,
            ">::from_json(",
            this.withConst("json"),
            " & j, ",
            variantType,
            " & x)",
        ], false, () => {
            let onFirst = true;
            for (const [kind, func] of functionForKind) {
                const typeForKind = (0, collection_utils_1.iterableFind)(nonNulls, (t) => t.kind === kind);
                if (typeForKind === undefined)
                    continue;
                this.emitLine(onFirst ? "if" : "else if", " (j.", func, "())");
                this.indent(() => {
                    const cppType = this.cppType(typeForKind, {
                        needsForwardIndirection: true,
                        needsOptionalIndirection: true,
                        inJsonNamespace: true,
                    }, false, true, false);
                    const toType = this.cppType(typeForKind, {
                        needsForwardIndirection: true,
                        needsOptionalIndirection: true,
                        inJsonNamespace: true,
                    }, false, false, false);
                    this.emitLine("x = ", this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, ["j.get<", cppType, ">()"]), ";");
                });
                onFirst = false;
            }
            this.emitLine('else throw std::runtime_error("Could not deserialise!");');
        });
        this.ensureBlankLine();
        this.emitBlock([
            "inline void adl_serializer<",
            variantType,
            ">::to_json(json & j, ",
            this.withConst(variantType),
            " & x)",
        ], false, () => {
            this.emitBlock(["switch (x.", this._variantIndexMethodName, "())"], false, () => {
                let i = 0;
                for (const t of nonNulls) {
                    this.emitLine("case ", i.toString(), ":");
                    this.indent(() => {
                        const cppType = this.cppType(t, {
                            needsForwardIndirection: true,
                            needsOptionalIndirection: true,
                            inJsonNamespace: true,
                        }, false, false, false);
                        const toType = this.cppType(t, {
                            needsForwardIndirection: true,
                            needsOptionalIndirection: true,
                            inJsonNamespace: true,
                        }, false, true, false);
                        this.emitLine("j = ", this._stringType.wrapEncodingChange([ourQualifier], cppType, toType, [
                            this._options.boost
                                ? "boost::get<"
                                : "std::get<",
                            cppType,
                            ">(x)",
                        ]), ";");
                        this.emitLine("break;");
                    });
                    i++;
                }
                this.emitLine('default: throw std::runtime_error("Input JSON does not conform to schema!");');
            });
        });
    }
    emitEnumHeaders(enumName) {
        const ourQualifier = this.ourQualifier(false);
        this.emitLine("void from_json(", this.withConst("json"), " & j, ", ourQualifier, enumName, " & x);");
        this.emitLine("void to_json(json & j, ", this.withConst([ourQualifier, enumName]), " & x);");
    }
    isLargeEnum(e) {
        // This is just an estimation. Someone might want to do some
        // benchmarks to find the optimum value here
        return e.cases.size > 15;
    }
    emitEnumFunctions(e, enumName) {
        const ourQualifier = this.ourQualifier(false);
        this.emitBlock([
            "inline void from_json(",
            this.withConst("json"),
            " & j, ",
            ourQualifier,
            enumName,
            " & x)",
        ], false, () => {
            if (this.isLargeEnum(e)) {
                this.emitBlock([
                    "static std::unordered_map<",
                    this._stringType.getType(),
                    ", ",
                    ourQualifier,
                    enumName,
                    "> enumValues",
                ], true, () => {
                    this.forEachEnumCase(e, "none", (name, jsonName) => {
                        this.emitLine("{", this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), [
                            this._stringType.createStringLiteral([(0, Strings_1.stringEscape)(jsonName)]),
                        ]), ", ", ourQualifier, enumName, "::", name, "},");
                    });
                });
                this.emitLine(`auto iter = enumValues.find(j.get<${this._stringType.getType()}>());`);
                this.emitBlock("if (iter != enumValues.end())", false, () => {
                    this.emitLine("x = iter->second;");
                });
            }
            else {
                let onFirst = true;
                this.forEachEnumCase(e, "none", (name, jsonName) => {
                    const maybeElse = onFirst ? "" : "else ";
                    this.emitLine(maybeElse, "if (j == ", this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), [
                        this._stringType.createStringLiteral([
                            (0, Strings_1.stringEscape)(jsonName),
                        ]),
                    ]), ") x = ", ourQualifier, enumName, "::", name, ";");
                    onFirst = false;
                });
                this.emitLine('else { throw std::runtime_error("Input JSON does not conform to schema!"); }');
            }
        });
        this.ensureBlankLine();
        this.emitBlock([
            "inline void to_json(json & j, ",
            this.withConst([ourQualifier, enumName]),
            " & x)",
        ], false, () => {
            this.emitBlock("switch (x)", false, () => {
                this.forEachEnumCase(e, "none", (name, jsonName) => {
                    this.emitLine("case ", ourQualifier, enumName, "::", name, ": j = ", this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), [
                        this._stringType.createStringLiteral([
                            (0, Strings_1.stringEscape)(jsonName),
                        ]),
                    ]), "; break;");
                });
                this.emitLine(`default: throw std::runtime_error("Unexpected value in enumeration \\"`, enumName, `\\": " + std::to_string(static_cast<int>(x)));`);
            });
        });
    }
    emitTopLevelTypedef(t, name) {
        this.emitLine("using ", name, " = ", this.cppType(t, {
            needsForwardIndirection: true,
            needsOptionalIndirection: true,
            inJsonNamespace: false,
        }, true, false, false), ";");
    }
    emitAllUnionFunctions() {
        this.forEachUniqueUnion("leading-and-interposing", (u) => this.sourcelikeToString(this.cppTypeInOptional((0, TypeUtils_1.removeNullFromUnion)(u, true)[1], {
            needsForwardIndirection: false,
            needsOptionalIndirection: false,
            inJsonNamespace: true,
        }, false, false)), (u) => this.emitUnionFunctions(u));
    }
    emitAllUnionHeaders() {
        this.forEachUniqueUnion("interposing", (u) => this.sourcelikeToString(this.cppTypeInOptional((0, TypeUtils_1.removeNullFromUnion)(u, true)[1], {
            needsForwardIndirection: false,
            needsOptionalIndirection: false,
            inJsonNamespace: true,
        }, false, false)), (u) => this.emitUnionHeaders(u));
    }
    emitOptionalHelpers() {
        this.emitLine("#ifndef NLOHMANN_OPT_HELPER");
        this.emitLine("#define NLOHMANN_OPT_HELPER");
        this.emitNamespaces(["nlohmann"], () => {
            const emitAdlStruct = (optType, factory) => {
                this.emitLine("template <typename T>");
                this.emitBlock(["struct adl_serializer<", optType, "<T>>"], true, () => {
                    this.emitBlock([
                        "static void to_json(json & j, ",
                        this.withConst([optType, "<T>"]),
                        " & opt)",
                    ], false, () => {
                        this.emitLine("if (!opt) j = nullptr; else j = *opt;");
                    });
                    this.ensureBlankLine();
                    this.emitBlock([
                        "static ",
                        optType,
                        "<T> from_json(",
                        this.withConst("json"),
                        " & j)",
                    ], false, () => {
                        this.emitLine(`if (j.is_null()) return ${factory}<T>(); else return ${factory}<T>(j.get<T>());`);
                    });
                });
            };
            emitAdlStruct(this.optionalTypeHeap(), this.optionalFactoryHeap());
            emitAdlStruct(this.optionalTypeStack(), this.optionalFactoryStack());
        });
        this.emitLine("#endif");
    }
    emitDeclaration(decl) {
        if (decl.kind === "forward") {
            if (this._options.codeFormat) {
                this.emitLine("class ", this.nameForNamedType(decl.type), ";");
            }
            else {
                this.emitLine("struct ", this.nameForNamedType(decl.type), ";");
            }
        }
        else if (decl.kind === "define") {
            const type = decl.type;
            const name = this.nameForNamedType(type);
            if (type instanceof Type_1.ClassType) {
                this.emitClass(type, name);
            }
            else if (type instanceof Type_1.EnumType) {
                this.emitEnum(type, name);
            }
            else if (type instanceof Type_1.UnionType) {
                this.emitUnionTypedefs(type, name);
            }
            else {
                (0, Support_1.panic)(`Cannot declare type ${type.kind}`);
            }
        }
        else {
            (0, Support_1.assertNever)(decl.kind);
        }
    }
    emitGetterSetter(t, getterName, setterName, memberName) {
        this.emitLine("void ", setterName, "(", t, " ", memberName, ") { this->", memberName, " = ", memberName, "; }");
        this.emitLine("auto ", getterName, "() const { return ", memberName, "; }");
    }
    emitNumericCheckConstraints(checkConst, classConstraint, getterMinValue, getterMaxValue, cppType) {
        this.emitBlock([
            "inline void ",
            checkConst,
            "(",
            this._stringType.getConstType(),
            " name, ",
            this.withConst(classConstraint),
            " & c, ",
            cppType,
            " value)",
        ], false, () => {
            this.emitBlock([
                "if (c.",
                getterMinValue,
                "() != ",
                this._nulloptType,
                " && value < *c.",
                getterMinValue,
                "())",
            ], false, () => {
                this.emitLine("throw ", this.lookupGlobalName(utils_1.GlobalNames.ValueTooLowException), " (", this._stringType.createStringLiteral([
                    "Value too low for ",
                ]), " + name + ", this._stringType.createStringLiteral([" ("]), " + ", this._stringType.wrapToString(["value"]), " + ", this._stringType.createStringLiteral(["<"]), " + ", this._stringType.wrapToString([
                    "*c.",
                    getterMinValue,
                    "()",
                ]), " + ", this._stringType.createStringLiteral([")"]), ");");
            });
            this.ensureBlankLine();
            this.emitBlock([
                "if (c.",
                getterMaxValue,
                "() != ",
                this._nulloptType,
                " && value > *c.",
                getterMaxValue,
                "())",
            ], false, () => {
                this.emitLine("throw ", this.lookupGlobalName(utils_1.GlobalNames.ValueTooHighException), " (", this._stringType.createStringLiteral([
                    "Value too high for ",
                ]), " + name + ", this._stringType.createStringLiteral([" ("]), " + ", this._stringType.wrapToString(["value"]), " + ", this._stringType.createStringLiteral([">"]), " + ", this._stringType.wrapToString([
                    "*c.",
                    getterMaxValue,
                    "()",
                ]), " + ", this._stringType.createStringLiteral([")"]), ");");
            });
            this.ensureBlankLine();
        });
        this.ensureBlankLine();
    }
    emitConstraintClasses() {
        const ourQualifier = this.ourQualifier(false);
        const getterMinIntValue = this.lookupMemberName(utils_1.MemberNames.GetMinIntValue);
        const getterMaxIntValue = this.lookupMemberName(utils_1.MemberNames.GetMaxIntValue);
        const getterMinDoubleValue = this.lookupMemberName(utils_1.MemberNames.GetMinDoubleValue);
        const getterMaxDoubleValue = this.lookupMemberName(utils_1.MemberNames.GetMaxDoubleValue);
        const getterMinLength = this.lookupMemberName(utils_1.MemberNames.GetMinLength);
        const getterMaxLength = this.lookupMemberName(utils_1.MemberNames.GetMaxLength);
        const getterPattern = this.lookupMemberName(utils_1.MemberNames.GetPattern);
        const classConstraint = this.lookupGlobalName(utils_1.GlobalNames.ClassMemberConstraints);
        this.emitBlock(["class ", classConstraint], true, () => {
            this.emitLine("private:");
            const constraintMembers = this.getConstraintMembers();
            for (const member of constraintMembers) {
                this.emitMember([this._optionalType, "<", member.cppType, ">"], this.lookupMemberName(member.name));
            }
            this.ensureBlankLine();
            this.emitLine("public:");
            this.emitLine(classConstraint, "(");
            this.indent(() => {
                this.iterableForEach(constraintMembers, ({ name, cppType }, pos) => {
                    const comma = pos === "first" || pos === "middle" ? "," : [];
                    this.emitLine(this._optionalType, "<", cppType, "> ", this.lookupMemberName(name), comma);
                });
            });
            const args = constraintMembers.map(({ name }) => {
                const member = this.lookupMemberName(name);
                return [member, "(", member, ")"];
            });
            this.emitLine(") : ", (0, collection_utils_1.arrayIntercalate)([", "], args), " {}");
            this.emitLine(classConstraint, "() = default;");
            this.emitLine("virtual ~", classConstraint, "() = default;");
            for (const member of constraintMembers) {
                this.ensureBlankLine();
                this.emitGetterSetter((0, collection_utils_1.withDefault)(member.cppConstType, member.cppType), this.lookupMemberName(member.getter), this.lookupMemberName(member.setter), this.lookupMemberName(member.name));
            }
        });
        this.ensureBlankLine();
        const classConstEx = this.lookupGlobalName(utils_1.GlobalNames.ClassMemberConstraintException);
        this.emitBlock(["class ", classConstEx, " : public std::runtime_error"], true, () => {
            this.emitLine("public:");
            this.emitLine(classConstEx, "(", this._stringType.getConstType(), " msg) : std::runtime_error(", this._stringType.wrapEncodingChange([ourQualifier], this._stringType.getType(), this.NarrowString.getType(), ["msg"]), ") {}");
        });
        this.ensureBlankLine();
        const exceptions = [
            utils_1.GlobalNames.ValueTooLowException,
            utils_1.GlobalNames.ValueTooHighException,
            utils_1.GlobalNames.ValueTooShortException,
            utils_1.GlobalNames.ValueTooLongException,
            utils_1.GlobalNames.InvalidPatternException,
        ];
        for (const ex of exceptions) {
            const name = this.lookupGlobalName(ex);
            this.emitBlock(["class ", name, " : public ", classConstEx], true, () => {
                this.emitLine("public:");
                this.emitLine(name, "(", this._stringType.getConstType(), " msg) : ", classConstEx, "(msg) {}");
            });
            this.ensureBlankLine();
        }
        const checkConst = this.lookupGlobalName(utils_1.GlobalNames.CheckConstraint);
        this.emitNumericCheckConstraints(checkConst, classConstraint, getterMinIntValue, getterMaxIntValue, "int64_t");
        this.emitNumericCheckConstraints(checkConst, classConstraint, getterMinDoubleValue, getterMaxDoubleValue, "double");
        this.emitBlock([
            "inline void ",
            checkConst,
            "(",
            this._stringType.getConstType(),
            " name, ",
            this.withConst(classConstraint),
            " & c, ",
            this._stringType.getConstType(),
            " value)",
        ], false, () => {
            this.emitBlock([
                "if (c.",
                getterMinLength,
                "() != ",
                this._nulloptType,
                " && value.length() < *c.",
                getterMinLength,
                "())",
            ], false, () => {
                this.emitLine("throw ", this.lookupGlobalName(utils_1.GlobalNames.ValueTooShortException), " (", this._stringType.createStringLiteral([
                    "Value too short for ",
                ]), " + name + ", this._stringType.createStringLiteral([" ("]), " + ", this._stringType.wrapToString(["value.length()"]), " + ", this._stringType.createStringLiteral(["<"]), " + ", this._stringType.wrapToString([
                    "*c.",
                    getterMinLength,
                    "()",
                ]), " + ", this._stringType.createStringLiteral([")"]), ");");
            });
            this.ensureBlankLine();
            this.emitBlock([
                "if (c.",
                getterMaxLength,
                "() != ",
                this._nulloptType,
                " && value.length() > *c.",
                getterMaxLength,
                "())",
            ], false, () => {
                this.emitLine("throw ", this.lookupGlobalName(utils_1.GlobalNames.ValueTooLongException), " (", this._stringType.createStringLiteral([
                    "Value too long for ",
                ]), " + name + ", this._stringType.createStringLiteral([" ("]), " + ", this._stringType.wrapToString(["value.length()"]), " + ", this._stringType.createStringLiteral([">"]), " + ", this._stringType.wrapToString([
                    "*c.",
                    getterMaxLength,
                    "()",
                ]), " + ", this._stringType.createStringLiteral([")"]), ");");
            });
            this.ensureBlankLine();
            this.emitBlock(["if (c.", getterPattern, "() != ", this._nulloptType, ")"], false, () => {
                this.emitLine(this._stringType.getSMatch(), " result;");
                this.emitLine("std::regex_search(value, result, ", this._stringType.getRegex(), "( *c.", getterPattern, "() ));");
                this.emitBlock(["if (result.empty())"], false, () => {
                    this.emitLine("throw ", this.lookupGlobalName(utils_1.GlobalNames.InvalidPatternException), " (", this._stringType.createStringLiteral([
                        "Value doesn't match pattern for ",
                    ]), " + name + ", this._stringType.createStringLiteral([" ("]), " + value +", this._stringType.createStringLiteral([" != "]), " + *c.", getterPattern, "() + ", this._stringType.createStringLiteral([")"]), ");");
                });
            });
            this.ensureBlankLine();
        });
    }
    emitHelperFunctions() {
        this._stringType.emitHelperFunctions();
        if (this._options.codeFormat &&
            (0, collection_utils_1.iterableSome)(this.typeGraph.allTypesUnordered(), (t) => (0, utils_1.constraintsForType)(t) !== undefined)) {
            this.emitConstraintClasses();
            this.ensureBlankLine();
        }
        this.ensureBlankLine();
        let untypedMacroName = "NLOHMANN_UNTYPED_";
        let optionalMacroName = "NLOHMANN_OPTIONAL_";
        this._namespaceNames.forEach((value) => {
            // We can't use upper name, because namespaces are case sensitive
            untypedMacroName += value;
            untypedMacroName += "_";
            optionalMacroName += value;
            optionalMacroName += "_";
        });
        untypedMacroName += "HELPER";
        optionalMacroName += "HELPER";
        this.emitLine(`#ifndef ${untypedMacroName}`);
        this.emitLine(`#define ${untypedMacroName}`);
        this.emitBlock([
            "inline json get_untyped(",
            this.withConst("json"),
            " & j, ",
            this.withConst("char"),
            " * property)",
        ], false, () => {
            this.emitBlock(["if (j.find(property) != j.end())"], false, () => {
                this.emitLine("return j.at(property).get<json>();");
            });
            this.emitLine("return json();");
        });
        this.ensureBlankLine();
        this.emitBlock([
            "inline json get_untyped(",
            this.withConst("json"),
            " & j, std::string property)",
        ], false, () => {
            this.emitLine("return get_untyped(j, property.data());");
        });
        this.emitLine("#endif");
        this.ensureBlankLine();
        if (this.haveUnions || this.haveOptionalProperties) {
            this.ensureBlankLine();
            this.emitLine(`#ifndef ${optionalMacroName}`);
            this.emitLine(`#define ${optionalMacroName}`);
            const emitGetOptional = (optionalType, label) => {
                this.emitLine("template <typename T>");
                this.emitBlock([
                    "inline ",
                    optionalType,
                    `<T> get_${label}_optional(`,
                    this.withConst("json"),
                    " & j, ",
                    this.withConst("char"),
                    " * property)",
                ], false, () => {
                    this.emitLine(["auto it = j.find(property);"]);
                    this.emitBlock(["if (it != j.end() && !it->is_null())"], false, () => {
                        this.emitLine("return j.at(property).get<", optionalType, "<T>>();");
                    });
                    this.emitLine("return ", optionalType, "<T>();");
                });
                this.ensureBlankLine();
                this.emitLine("template <typename T>");
                this.emitBlock([
                    "inline ",
                    optionalType,
                    `<T> get_${label}_optional(`,
                    this.withConst("json"),
                    " & j, std::string property)",
                ], false, () => {
                    this.emitLine(`return get_${label}_optional<T>(j, property.data());`);
                });
            };
            emitGetOptional(this.optionalTypeHeap(), "heap");
            emitGetOptional(this.optionalTypeStack(), "stack");
            this.emitLine("#endif");
            this.ensureBlankLine();
        }
    }
    emitExtraIncludes() {
        this.ensureBlankLine();
        if (this._options.codeFormat) {
            if (this._options.boost) {
                this.emitInclude(true, "boost/optional.hpp");
            }
            else {
                this.emitInclude(true, "optional");
            }
            this.emitInclude(true, "stdexcept");
            this.emitInclude(true, "regex");
        }
        if (this._options.wstring) {
            this.emitInclude(true, "codecvt");
            this.emitInclude(true, "locale");
        }
        // Include unordered_map if contains large enums
        if (Array.from(this.enums).some((enumType) => this.isLargeEnum(enumType))) {
            this.emitInclude(true, "unordered_map");
        }
        this.ensureBlankLine();
    }
    emitHelper() {
        this.startFile("helper.hpp", false);
        this.emitExtraIncludes();
        this.emitInclude(true, "sstream");
        this.ensureBlankLine();
        this.emitNamespaces(this._namespaceNames, () => {
            this.emitLine("using nlohmann::json;");
            this.ensureBlankLine();
            this.emitHelperFunctions();
        });
        if (this.haveUnions || this.haveOptionalProperties) {
            this.ensureBlankLine();
            this.emitOptionalHelpers();
        }
        this.finishFile();
    }
    emitTypes() {
        if (!this._options.justTypes) {
            this.emitLine("using nlohmann::json;");
            this.ensureBlankLine();
            this.emitHelperFunctions();
        }
        this.forEachDeclaration("interposing", (decl) => this.emitDeclaration(decl));
        if (this._options.justTypes)
            return;
        this.forEachTopLevel("leading", (t, name) => this.emitTopLevelTypedef(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
    }
    gatherUserNamespaceForwardDecls() {
        return this.gatherSource(() => {
            this.forEachObject("leading-and-interposing", (_, className) => this.emitClassHeaders(className));
            this.forEachEnum("leading-and-interposing", (_, enumName) => this.emitEnumHeaders(enumName));
        });
    }
    gatherNlohmannNamespaceForwardDecls() {
        return this.gatherSource(() => {
            this.forEachTopLevel("leading-and-interposing", (t, className) => this.emitTopLevelHeaders(t, className));
            this.ensureBlankLine();
            this.emitAllUnionHeaders();
        });
    }
    emitUserNamespaceImpls() {
        this.forEachObject("leading-and-interposing", (c, className) => this.emitClassFunctions(c, className));
        this.forEachEnum("leading-and-interposing", (e, enumName) => this.emitEnumFunctions(e, enumName));
    }
    emitNlohmannNamespaceImpls() {
        this.forEachTopLevel("leading-and-interposing", (t, name) => this.emitTopLevelFunction(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
        this.ensureBlankLine();
        this.emitAllUnionFunctions();
    }
    emitGenerators() {
        if (this._options.justTypes) {
            let didEmit = false;
            const gathered = this.gatherSource(() => this.emitNamespaces(this._namespaceNames, () => {
                didEmit = this.forEachTopLevel("none", (t, name) => this.emitTopLevelTypedef(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
            }));
            if (didEmit) {
                this.emitGatheredSource(gathered);
                this.ensureBlankLine();
            }
        }
        else {
            const userNamespaceForwardDecls = this.gatherUserNamespaceForwardDecls();
            const nlohmannNamespaceForwardDecls = this.gatherNlohmannNamespaceForwardDecls();
            if (userNamespaceForwardDecls.length === 0 &&
                nlohmannNamespaceForwardDecls.length > 0) {
                this.emitNamespaces(["nlohmann"], () => {
                    this.emitGatheredSource(nlohmannNamespaceForwardDecls);
                    this.emitNlohmannNamespaceImpls();
                });
            }
            else if (userNamespaceForwardDecls.length > 0 &&
                nlohmannNamespaceForwardDecls.length === 0) {
                this.emitNamespaces(this._namespaceNames, () => {
                    this.emitGatheredSource(userNamespaceForwardDecls);
                    this.emitUserNamespaceImpls();
                });
            }
            else if (userNamespaceForwardDecls.length > 0 &&
                nlohmannNamespaceForwardDecls.length > 0) {
                this.emitNamespaces(this._namespaceNames, () => {
                    this.emitGatheredSource(userNamespaceForwardDecls);
                });
                this.emitNamespaces(["nlohmann"], () => {
                    this.emitGatheredSource(nlohmannNamespaceForwardDecls);
                });
                this.emitNamespaces(this._namespaceNames, () => {
                    this.emitUserNamespaceImpls();
                });
                this.emitNamespaces(["nlohmann"], () => {
                    this.emitNlohmannNamespaceImpls();
                });
            }
        }
    }
    emitSingleSourceStructure(proposedFilename) {
        this.startFile(proposedFilename);
        this._generatedFiles.add(proposedFilename);
        this.emitExtraIncludes();
        if (this._options.justTypes) {
            this.emitTypes();
        }
        else {
            if (!this._options.justTypes &&
                this.haveNamedTypes &&
                (this.haveUnions || this.haveOptionalProperties)) {
                this.emitOptionalHelpers();
                this.ensureBlankLine();
            }
            this.emitNamespaces(this._namespaceNames, () => this.emitTypes());
        }
        this.ensureBlankLine();
        this.emitGenerators();
        this.finishFile();
    }
    updateIncludes(isClassMember, includes, propertyType, _defName) {
        const propTypes = this.generatedTypes(isClassMember, propertyType);
        for (const t of propTypes) {
            const typeName = this.sourcelikeToString(t.name);
            const propRecord = {
                kind: undefined,
                typeKind: undefined,
            };
            if (t.type instanceof Type_1.ClassType) {
                /**
                 * Ok. We can NOT forward declare direct class members, e.g. a class type is included
                 * at level#0. HOWEVER if it is not a direct class member (e.g. std::shared_ptr<Class>),
                 * - level > 0 - then we can SURELY forward declare it.
                 */
                propRecord.typeKind = "class";
                propRecord.kind =
                    t.level === 0
                        ? utils_1.IncludeKind.Include
                        : utils_1.IncludeKind.ForwardDeclare;
                if (t.forceInclude) {
                    propRecord.kind = utils_1.IncludeKind.Include;
                }
            }
            else if (t.type instanceof Type_1.EnumType) {
                propRecord.typeKind = "enum";
                propRecord.kind = utils_1.IncludeKind.ForwardDeclare;
            }
            else if (t.type instanceof Type_1.UnionType) {
                propRecord.typeKind = "union";
                /** Recurse into the union */
                const [maybeNull] = (0, TypeUtils_1.removeNullFromUnion)(t.type, true);
                if (maybeNull !== undefined) {
                    /** Houston this is a variant, include it */
                    propRecord.kind = utils_1.IncludeKind.Include;
                }
                else {
                    if (t.forceInclude) {
                        propRecord.kind = utils_1.IncludeKind.Include;
                    }
                    else {
                        propRecord.kind = utils_1.IncludeKind.ForwardDeclare;
                    }
                }
            }
            if (includes.has(typeName)) {
                const incKind = includes.get(typeName);
                /**
                 * If we already include the type as typed include,
                 * do not write it over with forward declare
                 */
                if (incKind !== undefined &&
                    incKind.kind === utils_1.IncludeKind.ForwardDeclare) {
                    includes.set(typeName, propRecord);
                }
            }
            else {
                includes.set(typeName, propRecord);
            }
        }
    }
    emitIncludes(c, defName) {
        /**
         * Need to generate "includes", in terms 'c' has members, which
         * are defined by others
         */
        const includes = new Map();
        if (c instanceof Type_1.UnionType) {
            this.updateIncludes(false, includes, c, defName);
        }
        else if (c instanceof Type_1.ClassType) {
            this.forEachClassProperty(c, "none", (_name, _jsonName, property) => {
                this.updateIncludes(true, includes, property.type, defName);
            });
        }
        if (includes.size !== 0) {
            let numForwards = 0;
            let numIncludes = 0;
            includes.forEach((rec, name) => {
                /** Don't bother including the one we are defining */
                if (name === defName) {
                    return;
                }
                if (rec.kind !== utils_1.IncludeKind.ForwardDeclare) {
                    this.emitInclude(false, [name, ".hpp"]);
                    numIncludes++;
                }
                else {
                    numForwards++;
                }
            });
            if (numIncludes > 0) {
                this.ensureBlankLine();
            }
            if (numForwards > 0) {
                this.emitNamespaces(this._namespaceNames, () => {
                    includes.forEach((rec, name) => {
                        /** Don't bother including the one we are defining */
                        if (name === defName) {
                            return;
                        }
                        if (rec.kind !== utils_1.IncludeKind.ForwardDeclare) {
                            return;
                        }
                        if (rec.typeKind === "class" ||
                            rec.typeKind === "union") {
                            if (this._options.codeFormat) {
                                this.emitLine("class ", name, ";");
                            }
                            else {
                                this.emitLine("struct ", name, ";");
                            }
                        }
                        else if (rec.typeKind === "enum") {
                            this.emitLine("enum class ", name, " : ", this._enumType, ";");
                        }
                        else {
                            (0, Support_1.panic)(`Invalid type "${rec.typeKind}" to forward declare`);
                        }
                    });
                });
            }
            this.ensureBlankLine();
        }
    }
    emitDefinition(d, defName) {
        const name = `${this.sourcelikeToString(defName)}.hpp`;
        this.startFile(name, true);
        this._generatedFiles.add(name);
        this.emitIncludes(d, this.sourcelikeToString(defName));
        this.emitNamespaces(this._namespaceNames, () => {
            this.emitDescription(this.descriptionForType(d));
            this.ensureBlankLine();
            this.emitLine("using nlohmann::json;");
            this.ensureBlankLine();
            if (d instanceof Type_1.ClassType) {
                this.emitClass(d, defName);
            }
            else if (d instanceof Type_1.EnumType) {
                this.emitEnum(d, defName);
            }
            else if (d instanceof Type_1.UnionType) {
                this.emitUnionTypedefs(d, defName);
            }
        });
        this.finishFile();
    }
    emitMultiSourceStructure(proposedFilename) {
        if (!this._options.justTypes && this.haveNamedTypes) {
            this.emitHelper();
            this.startFile("Generators.hpp", true);
            this._allTypeNames.forEach((t) => {
                this.emitInclude(false, [t, ".hpp"]);
            });
            this.ensureBlankLine();
            this.emitGenerators();
            this.finishFile();
        }
        this.forEachNamedType("leading-and-interposing", (c, n) => {
            this.emitDefinition(c, n);
        }, (e, n) => {
            this.emitDefinition(e, n);
        }, (u, n) => {
            this.emitDefinition(u, n);
        });
        /**
         * If for some reason we have not generated anything,
         * it means that a unnamed type has been generated - or nothing.
         */
        if (!this._generatedFiles.has(proposedFilename)) {
            if (!this.haveNamedTypes) {
                this.emitHelper();
            }
            this.startFile(proposedFilename);
            this._generatedFiles.forEach((f) => {
                this.emitInclude(false, f);
            });
            this.emitNamespaces(this._namespaceNames, () => {
                this.forEachTopLevel("leading", (t, name) => this.emitTopLevelTypedef(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
            });
            this.finishFile();
        }
    }
    emitSourceStructure(proposedFilename) {
        this._generatedFiles.clear();
        /** Gather all the unique/custom types used by the schema */
        this._allTypeNames.clear();
        this.forEachDeclaration("none", (decl) => {
            const definedTypes = (0, TypeUtils_1.directlyReachableTypes)(decl.type, (t) => {
                if ((0, TypeUtils_1.isNamedType)(t) &&
                    (t instanceof Type_1.ClassType ||
                        t instanceof Type_1.EnumType ||
                        t instanceof Type_1.UnionType)) {
                    return new Set([
                        this.sourcelikeToString(this.cppType(t, {
                            needsForwardIndirection: false,
                            needsOptionalIndirection: false,
                            inJsonNamespace: false,
                        }, true, false, false)),
                    ]);
                }
                return null;
            });
            this._allTypeNames = (0, collection_utils_1.setUnion)(definedTypes, this._allTypeNames);
        });
        if (this._options.typeSourceStyle) {
            this.emitSingleSourceStructure(proposedFilename);
        }
        else {
            this.emitMultiSourceStructure(proposedFilename);
        }
    }
    isConversionRequired(t) {
        const originalType = this.cppType(t, {
            needsForwardIndirection: true,
            needsOptionalIndirection: true,
            inJsonNamespace: true,
        }, false, false, false);
        const newType = this.cppType(t, {
            needsForwardIndirection: true,
            needsOptionalIndirection: true,
            inJsonNamespace: true,
        }, false, true, false);
        return originalType !== newType;
    }
}
exports.CPlusPlusRenderer = CPlusPlusRenderer;
