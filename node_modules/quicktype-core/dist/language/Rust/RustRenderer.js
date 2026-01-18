"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RustRenderer = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const collection_utils_1 = require("collection-utils");
const Annotation_1 = require("../../Annotation");
const ConvenienceRenderer_1 = require("../../ConvenienceRenderer");
const Source_1 = require("../../Source");
const Support_1 = require("../../support/Support");
const Type_1 = require("../../Type");
const TypeUtils_1 = require("../../Type/TypeUtils");
const constants_1 = require("./constants");
const utils_1 = require("./utils");
class RustRenderer extends ConvenienceRenderer_1.ConvenienceRenderer {
    constructor(targetLanguage, renderContext, _options) {
        super(targetLanguage, renderContext);
        this._options = _options;
    }
    makeNamedTypeNamer() {
        return utils_1.camelNamingFunction;
    }
    namerForObjectProperty() {
        return utils_1.snakeNamingFunction;
    }
    makeUnionMemberNamer() {
        return utils_1.camelNamingFunction;
    }
    makeEnumCaseNamer() {
        return utils_1.camelNamingFunction;
    }
    forbiddenNamesForGlobalNamespace() {
        return constants_1.keywords;
    }
    forbiddenForObjectProperties(_c, _className) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForUnionMembers(_u, _unionName) {
        return { names: [], includeGlobalForbidden: true };
    }
    forbiddenForEnumCases(_e, _enumName) {
        return { names: [], includeGlobalForbidden: true };
    }
    get commentLineStart() {
        return "/// ";
    }
    nullableRustType(t, withIssues) {
        return ["Option<", this.breakCycle(t, withIssues), ">"];
    }
    isImplicitCycleBreaker(t) {
        const kind = t.kind;
        return kind === "array" || kind === "map";
    }
    rustType(t, withIssues = false) {
        return (0, TypeUtils_1.matchType)(t, (_anyType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.anyTypeIssueAnnotation, "Option<serde_json::Value>"), (_nullType) => (0, Source_1.maybeAnnotated)(withIssues, Annotation_1.nullTypeIssueAnnotation, "Option<serde_json::Value>"), (_boolType) => "bool", (_integerType) => "i64", (_doubleType) => "f64", (_stringType) => "String", (arrayType) => [
            "Vec<",
            this.rustType(arrayType.items, withIssues),
            ">",
        ], (classType) => this.nameForNamedType(classType), (mapType) => [
            "HashMap<String, ",
            this.rustType(mapType.values, withIssues),
            ">",
        ], (enumType) => this.nameForNamedType(enumType), (unionType) => {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(unionType);
            if (nullable !== null)
                return this.nullableRustType(nullable, withIssues);
            const [hasNull] = (0, TypeUtils_1.removeNullFromUnion)(unionType);
            const isCycleBreaker = this.isCycleBreakerType(unionType);
            const name = isCycleBreaker
                ? ["Box<", this.nameForNamedType(unionType), ">"]
                : this.nameForNamedType(unionType);
            return hasNull !== null
                ? ["Option<", name, ">"]
                : name;
        });
    }
    breakCycle(t, withIssues) {
        const rustType = this.rustType(t, withIssues);
        const isCycleBreaker = this.isCycleBreakerType(t);
        return isCycleBreaker ? ["Box<", rustType, ">"] : rustType;
    }
    emitRenameAttribute(propName, jsonName, defaultNamingStyle, preferedNamingStyle) {
        const escapedName = (0, utils_1.rustStringEscape)(jsonName);
        const name = utils_1.namingStyles[defaultNamingStyle].fromParts(this.sourcelikeToString(propName).split(" "));
        const styledName = (0, utils_1.nameWithNamingStyle)(name, preferedNamingStyle);
        const namesDiffer = escapedName !== styledName;
        if (namesDiffer) {
            this.emitLine('#[serde(rename = "', escapedName, '")]');
        }
    }
    emitSkipSerializeNone(t) {
        if (t instanceof Type_1.UnionType) {
            const nullable = (0, TypeUtils_1.nullableFromUnion)(t);
            if (nullable !== null)
                this.emitLine('#[serde(skip_serializing_if = "Option::is_none")]');
        }
    }
    get visibility() {
        if (this._options.visibility === utils_1.Visibility.Crate) {
            return "pub(crate) ";
        }
        if (this._options.visibility === utils_1.Visibility.Public) {
            return "pub ";
        }
        return "";
    }
    emitStructDefinition(c, className) {
        this.emitDescription(this.descriptionForType(c));
        this.emitLine("#[derive(", this._options.deriveDebug ? "Debug, " : "", this._options.deriveClone ? "Clone, " : "", this._options.derivePartialEq ? "PartialEq, " : "", "Serialize, Deserialize)]");
        // List the possible naming styles for every class property
        const propertiesNamingStyles = {};
        this.forEachClassProperty(c, "none", (_name, jsonName, _prop) => {
            propertiesNamingStyles[jsonName] =
                (0, utils_1.listMatchingNamingStyles)(jsonName);
        });
        // Set the default naming style on the struct
        const defaultStyle = "snake_case";
        const preferedNamingStyle = (0, utils_1.getPreferredNamingStyle)(Object.values(propertiesNamingStyles).flat(), defaultStyle);
        if (preferedNamingStyle !== defaultStyle) {
            this.emitLine(`#[serde(rename_all = "${preferedNamingStyle}")]`);
        }
        const blankLines = this._options.density === utils_1.Density.Dense ? "none" : "interposing";
        const structBody = () => this.forEachClassProperty(c, blankLines, (name, jsonName, prop) => {
            this.emitDescription(this.descriptionForClassProperty(c, jsonName));
            this.emitRenameAttribute(name, jsonName, defaultStyle, preferedNamingStyle);
            if (this._options.skipSerializingNone) {
                this.emitSkipSerializeNone(prop.type);
            }
            this.emitLine(this.visibility, name, ": ", this.breakCycle(prop.type, true), ",");
        });
        this.emitBlock(["pub struct ", className], structBody);
    }
    emitBlock(line, f) {
        this.emitLine(line, " {");
        this.indent(f);
        this.emitLine("}");
    }
    emitUnion(u, unionName) {
        const isMaybeWithSingleType = (0, TypeUtils_1.nullableFromUnion)(u);
        if (isMaybeWithSingleType !== null) {
            return;
        }
        this.emitDescription(this.descriptionForType(u));
        this.emitLine("#[derive(", this._options.deriveDebug ? "Debug, " : "", this._options.deriveClone ? "Clone, " : "", this._options.derivePartialEq ? "PartialEq, " : "", "Serialize, Deserialize)]");
        this.emitLine("#[serde(untagged)]");
        const [, nonNulls] = (0, TypeUtils_1.removeNullFromUnion)(u);
        const blankLines = this._options.density === utils_1.Density.Dense ? "none" : "interposing";
        this.emitBlock(["pub enum ", unionName], () => this.forEachUnionMember(u, nonNulls, blankLines, null, (fieldName, t) => {
            const rustType = this.breakCycle(t, true);
            this.emitLine([fieldName, "(", rustType, "),"]);
        }));
    }
    emitEnumDefinition(e, enumName) {
        this.emitDescription(this.descriptionForType(e));
        this.emitLine("#[derive(", this._options.deriveDebug ? "Debug, " : "", this._options.deriveClone ? "Clone, " : "", this._options.derivePartialEq ? "PartialEq, " : "", "Serialize, Deserialize)]");
        // List the possible naming styles for every enum case
        const enumCasesNamingStyles = {};
        this.forEachEnumCase(e, "none", (_name, jsonName) => {
            enumCasesNamingStyles[jsonName] =
                (0, utils_1.listMatchingNamingStyles)(jsonName);
        });
        // Set the default naming style on the enum
        const defaultStyle = "PascalCase";
        const preferedNamingStyle = (0, utils_1.getPreferredNamingStyle)(Object.values(enumCasesNamingStyles).flat(), defaultStyle);
        if (preferedNamingStyle !== defaultStyle) {
            this.emitLine(`#[serde(rename_all = "${preferedNamingStyle}")]`);
        }
        const blankLines = this._options.density === utils_1.Density.Dense ? "none" : "interposing";
        this.emitBlock(["pub enum ", enumName], () => this.forEachEnumCase(e, blankLines, (name, jsonName) => {
            this.emitRenameAttribute(name, jsonName, defaultStyle, preferedNamingStyle);
            this.emitLine([name, ","]);
        }));
    }
    emitTopLevelAlias(t, name) {
        this.emitLine("pub type ", name, " = ", this.rustType(t), ";");
    }
    emitLeadingComments() {
        if (this.leadingComments !== undefined) {
            this.emitComments(this.leadingComments);
            return;
        }
        const topLevelName = (0, Support_1.defined)((0, collection_utils_1.mapFirst)(this.topLevels)).getCombinedName();
        this.emitMultiline(`// Example code that deserializes and serializes the model.
// extern crate serde;
// #[macro_use]
// extern crate serde_derive;
// extern crate serde_json;
//
// use generated_module::${topLevelName};
//
// fn main() {
//     let json = r#"{"answer": 42}"#;
//     let model: ${topLevelName} = serde_json::from_str(&json).unwrap();
// }`);
    }
    emitSourceStructure() {
        if (this._options.leadingComments) {
            this.emitLeadingComments();
        }
        this.ensureBlankLine();
        if (this._options.edition2018) {
            this.emitLine("use serde::{Serialize, Deserialize};");
        }
        else {
            this.emitLine("extern crate serde_derive;");
        }
        if (this.haveMaps) {
            this.emitLine("use std::collections::HashMap;");
        }
        this.forEachTopLevel("leading", (t, name) => this.emitTopLevelAlias(t, name), (t) => this.namedTypeToNameForTopLevel(t) === undefined);
        this.forEachNamedType("leading-and-interposing", (c, name) => this.emitStructDefinition(c, name), (e, name) => this.emitEnumDefinition(e, name), (u, name) => this.emitUnion(u, name));
    }
}
exports.RustRenderer = RustRenderer;
