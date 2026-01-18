"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncludeKind = exports.GlobalNames = exports.legalizeName = void 0;
const Strings_1 = require("../../support/Strings");
/* Function used to format names */
exports.legalizeName = (0, Strings_1.legalizeCharacters)((cp) => (0, Strings_1.isAscii)(cp) && (0, Strings_1.isLetterOrUnderscoreOrDigit)(cp));
/* Used to build forbidden global names */
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
/* To be able to support circles in multiple files - e.g. class#A using class#B using class#A (obviously not directly) we can forward declare them */
var IncludeKind;
(function (IncludeKind) {
    IncludeKind["ForwardDeclare"] = "ForwardDeclare";
    IncludeKind["Include"] = "Include";
})(IncludeKind || (exports.IncludeKind = IncludeKind = {}));
