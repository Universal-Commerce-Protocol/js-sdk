"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertersOptions = void 0;
exports.convertersOption = convertersOption;
const RendererOptions_1 = require("../RendererOptions");
var ConvertersOptions;
(function (ConvertersOptions) {
    ConvertersOptions["AllObjects"] = "all-objects";
    ConvertersOptions["TopLevel"] = "top-level";
})(ConvertersOptions || (exports.ConvertersOptions = ConvertersOptions = {}));
function convertersOption() {
    return new RendererOptions_1.EnumOption("converters", "Which converters to generate (top-level by default)", {
        [ConvertersOptions.TopLevel]: ConvertersOptions.TopLevel,
        [ConvertersOptions.AllObjects]: ConvertersOptions.AllObjects,
    }, ConvertersOptions.TopLevel, "secondary");
}
