"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLanguageName = exports.languageNamed = exports.defaultTargetLanguages = void 0;
__exportStar(require("./CJSON"), exports);
__exportStar(require("./CPlusPlus"), exports);
__exportStar(require("./Crystal"), exports);
__exportStar(require("./CSharp"), exports);
__exportStar(require("./Dart"), exports);
__exportStar(require("./Elixir"), exports);
__exportStar(require("./Elm"), exports);
__exportStar(require("./Golang"), exports);
__exportStar(require("./Haskell"), exports);
__exportStar(require("./Java"), exports);
__exportStar(require("./JavaScript"), exports);
__exportStar(require("./JavaScriptPropTypes"), exports);
__exportStar(require("./JSONSchema"), exports);
__exportStar(require("./Kotlin"), exports);
__exportStar(require("./Objective-C"), exports);
__exportStar(require("./Php"), exports);
__exportStar(require("./Pike"), exports);
__exportStar(require("./Python"), exports);
__exportStar(require("./Ruby"), exports);
__exportStar(require("./Rust"), exports);
__exportStar(require("./Scala3"), exports);
__exportStar(require("./Smithy4s"), exports);
__exportStar(require("./Swift"), exports);
__exportStar(require("./TypeScriptFlow"), exports);
__exportStar(require("./TypeScriptEffectSchema"), exports);
__exportStar(require("./TypeScriptZod"), exports);
var All_1 = require("./All");
Object.defineProperty(exports, "defaultTargetLanguages", { enumerable: true, get: function () { return All_1.all; } });
Object.defineProperty(exports, "languageNamed", { enumerable: true, get: function () { return All_1.languageNamed; } });
Object.defineProperty(exports, "isLanguageName", { enumerable: true, get: function () { return All_1.isLanguageName; } });
