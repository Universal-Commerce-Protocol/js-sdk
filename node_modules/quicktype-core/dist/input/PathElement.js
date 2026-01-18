"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathElementKind = void 0;
var PathElementKind;
(function (PathElementKind) {
    PathElementKind[PathElementKind["Root"] = 1] = "Root";
    PathElementKind[PathElementKind["KeyOrIndex"] = 2] = "KeyOrIndex";
    PathElementKind[PathElementKind["Type"] = 3] = "Type";
    PathElementKind[PathElementKind["Object"] = 4] = "Object";
})(PathElementKind || (exports.PathElementKind = PathElementKind = {}));
