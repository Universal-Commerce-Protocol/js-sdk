"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.provenanceTypeAttributeKind = void 0;
const collection_utils_1 = require("collection-utils");
const TypeAttributes_1 = require("../attributes/TypeAttributes");
// FIXME: Don't infer provenance.  All original types should be present in
// non-inferred form in the final graph.
class ProvenanceTypeAttributeKind extends TypeAttributes_1.TypeAttributeKind {
    constructor() {
        super("provenance");
    }
    appliesToTypeKind(_kind) {
        return true;
    }
    combine(arr) {
        return (0, collection_utils_1.setUnionManyInto)(new Set(), arr);
    }
    makeInferred(p) {
        return p;
    }
    stringify(p) {
        return Array.from(p)
            .sort()
            .map((i) => i.toString())
            .join(",");
    }
}
exports.provenanceTypeAttributeKind = new ProvenanceTypeAttributeKind();
