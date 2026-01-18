"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseString = exports.WrappingCode = exports.MemberNames = exports.GlobalNames = exports.IncludeKind = exports.optionalFactoryAsSharedType = exports.optionalAsSharedType = exports.legalizeName = void 0;
exports.constraintsForType = constraintsForType;
exports.addQualifier = addQualifier;
const Constraints_1 = require("../../attributes/Constraints");
const Strings_1 = require("../../support/Strings");
function constraintsForType(t) {
    const minMax = (0, Constraints_1.minMaxValueForType)(t);
    const minMaxLength = (0, Constraints_1.minMaxLengthForType)(t);
    const pattern = (0, Constraints_1.patternForType)(t);
    if (minMax === undefined &&
        minMaxLength === undefined &&
        pattern === undefined)
        return undefined;
    return { minMax, minMaxLength, pattern };
}
exports.legalizeName = (0, Strings_1.legalizeCharacters)((cp) => (0, Strings_1.isAscii)(cp) && (0, Strings_1.isLetterOrUnderscoreOrDigit)(cp));
/// Type to use as an optional if cycle breaking is required
exports.optionalAsSharedType = "std::shared_ptr";
/// Factory to use when creating an optional if cycle breaking is required
exports.optionalFactoryAsSharedType = "std::make_shared";
/**
 * To be able to support circles in multiple files -
 * e.g. class#A using class#B using class#A (obviously not directly,
 * but in vector or in variant) we can forward declare them;
 */
var IncludeKind;
(function (IncludeKind) {
    IncludeKind["ForwardDeclare"] = "ForwardDeclare";
    IncludeKind["Include"] = "Include";
})(IncludeKind || (exports.IncludeKind = IncludeKind = {}));
// FIXME: make these string enums eventually
var GlobalNames;
(function (GlobalNames) {
    GlobalNames[GlobalNames["ClassMemberConstraints"] = 1] = "ClassMemberConstraints";
    GlobalNames[GlobalNames["ClassMemberConstraintException"] = 2] = "ClassMemberConstraintException";
    GlobalNames[GlobalNames["ValueTooLowException"] = 3] = "ValueTooLowException";
    GlobalNames[GlobalNames["ValueTooHighException"] = 4] = "ValueTooHighException";
    GlobalNames[GlobalNames["ValueTooShortException"] = 5] = "ValueTooShortException";
    GlobalNames[GlobalNames["ValueTooLongException"] = 6] = "ValueTooLongException";
    GlobalNames[GlobalNames["InvalidPatternException"] = 7] = "InvalidPatternException";
    GlobalNames[GlobalNames["CheckConstraint"] = 8] = "CheckConstraint";
})(GlobalNames || (exports.GlobalNames = GlobalNames = {}));
// FIXME: make these string enums eventually
var MemberNames;
(function (MemberNames) {
    MemberNames[MemberNames["MinIntValue"] = 1] = "MinIntValue";
    MemberNames[MemberNames["GetMinIntValue"] = 2] = "GetMinIntValue";
    MemberNames[MemberNames["SetMinIntValue"] = 3] = "SetMinIntValue";
    MemberNames[MemberNames["MaxIntValue"] = 4] = "MaxIntValue";
    MemberNames[MemberNames["GetMaxIntValue"] = 5] = "GetMaxIntValue";
    MemberNames[MemberNames["SetMaxIntValue"] = 6] = "SetMaxIntValue";
    MemberNames[MemberNames["MinDoubleValue"] = 7] = "MinDoubleValue";
    MemberNames[MemberNames["GetMinDoubleValue"] = 8] = "GetMinDoubleValue";
    MemberNames[MemberNames["SetMinDoubleValue"] = 9] = "SetMinDoubleValue";
    MemberNames[MemberNames["MaxDoubleValue"] = 10] = "MaxDoubleValue";
    MemberNames[MemberNames["GetMaxDoubleValue"] = 11] = "GetMaxDoubleValue";
    MemberNames[MemberNames["SetMaxDoubleValue"] = 12] = "SetMaxDoubleValue";
    MemberNames[MemberNames["MinLength"] = 13] = "MinLength";
    MemberNames[MemberNames["GetMinLength"] = 14] = "GetMinLength";
    MemberNames[MemberNames["SetMinLength"] = 15] = "SetMinLength";
    MemberNames[MemberNames["MaxLength"] = 16] = "MaxLength";
    MemberNames[MemberNames["GetMaxLength"] = 17] = "GetMaxLength";
    MemberNames[MemberNames["SetMaxLength"] = 18] = "SetMaxLength";
    MemberNames[MemberNames["Pattern"] = 19] = "Pattern";
    MemberNames[MemberNames["GetPattern"] = 20] = "GetPattern";
    MemberNames[MemberNames["SetPattern"] = 21] = "SetPattern";
})(MemberNames || (exports.MemberNames = MemberNames = {}));
function addQualifier(qualifier, qualified) {
    if (qualified.length === 0) {
        return [];
    }
    return [qualifier, qualified];
}
class WrappingCode {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
    wrap(qualifier, inner) {
        return [addQualifier(qualifier, this.start), inner, this.end];
    }
}
exports.WrappingCode = WrappingCode;
class BaseString {
    constructor(stringType, constStringType, smatch, regex, stringLiteralPrefix, toString, encodingClass, encodingFunction) {
        this._stringType = stringType;
        this._constStringType = constStringType;
        this._smatch = smatch;
        this._regex = regex;
        this._stringLiteralPrefix = stringLiteralPrefix;
        this._toString = toString;
        this._encodingClass = encodingClass;
        this._encodingFunction = encodingFunction;
    }
    getType() {
        return this._stringType;
    }
    getConstType() {
        return this._constStringType;
    }
    getSMatch() {
        return this._smatch;
    }
    getRegex() {
        return this._regex;
    }
    createStringLiteral(inner) {
        return [this._stringLiteralPrefix, '"', inner, '"'];
    }
    wrapToString(inner) {
        return this._toString.wrap([], inner);
    }
}
exports.BaseString = BaseString;
