"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acronymOption = exports.AcronymStyleOptions = void 0;
exports.acronymStyle = acronymStyle;
const RendererOptions_1 = require("../RendererOptions");
const Strings_1 = require("./Strings");
var AcronymStyleOptions;
(function (AcronymStyleOptions) {
    AcronymStyleOptions["Camel"] = "camel";
    AcronymStyleOptions["Lower"] = "lowerCase";
    AcronymStyleOptions["Original"] = "original";
    AcronymStyleOptions["Pascal"] = "pascal";
})(AcronymStyleOptions || (exports.AcronymStyleOptions = AcronymStyleOptions = {}));
const acronymOption = (defaultOption) => new RendererOptions_1.EnumOption("acronym-style", "Acronym naming style", {
    [AcronymStyleOptions.Original]: AcronymStyleOptions.Original,
    [AcronymStyleOptions.Pascal]: AcronymStyleOptions.Pascal,
    [AcronymStyleOptions.Camel]: AcronymStyleOptions.Camel,
    [AcronymStyleOptions.Lower]: AcronymStyleOptions.Lower,
}, defaultOption, "secondary");
exports.acronymOption = acronymOption;
const options = {
    [AcronymStyleOptions.Pascal]: Strings_1.allUpperWordStyle,
    [AcronymStyleOptions.Camel]: Strings_1.firstUpperWordStyle,
    [AcronymStyleOptions.Original]: Strings_1.originalWord,
    [AcronymStyleOptions.Lower]: Strings_1.allLowerWordStyle,
};
function acronymStyle(style) {
    return options[style];
}
