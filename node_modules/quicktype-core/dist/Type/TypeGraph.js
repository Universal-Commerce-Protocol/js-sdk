"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeGraph = exports.TypeAttributeStoreView = exports.TypeAttributeStore = void 0;
const collection_utils_1 = require("collection-utils");
const TypeAttributes_1 = require("../attributes/TypeAttributes");
const Graph_1 = require("../Graph");
const GraphRewriting_1 = require("../GraphRewriting");
const Messages_1 = require("../Messages");
const Support_1 = require("../support/Support");
const ProvenanceTypeAttributeKind_1 = require("./ProvenanceTypeAttributeKind");
const TypeBuilderUtils_1 = require("./TypeBuilderUtils");
const TypeGraphUtils_1 = require("./TypeGraphUtils");
const TypeRef_1 = require("./TypeRef");
const TypeUtils_1 = require("./TypeUtils");
class TypeAttributeStore {
    constructor(_typeGraph, _values) {
        this._typeGraph = _typeGraph;
        this._values = _values;
        this._topLevelValues = new Map();
    }
    getTypeIndex(t) {
        const tref = t.typeRef;
        (0, TypeRef_1.assertTypeRefGraph)(tref, this._typeGraph);
        return (0, TypeRef_1.typeRefIndex)(tref);
    }
    attributesForType(t) {
        const index = this.getTypeIndex(t);
        const maybeAttributes = this._values[index];
        if (maybeAttributes !== undefined) {
            return maybeAttributes;
        }
        return TypeAttributes_1.emptyTypeAttributes;
    }
    attributesForTopLevel(name) {
        const maybeAttributes = this._topLevelValues.get(name);
        if (maybeAttributes !== undefined) {
            return maybeAttributes;
        }
        return TypeAttributes_1.emptyTypeAttributes;
    }
    setInMap(attributes, kind, value) {
        // FIXME: This is potentially super slow
        return new Map(attributes).set(kind, value);
    }
    set(kind, t, value) {
        const index = this.getTypeIndex(t);
        while (index >= this._values.length) {
            this._values.push(undefined);
        }
        this._values[index] = this.setInMap(this.attributesForType(t), kind, value);
    }
    setForTopLevel(kind, topLevelName, value) {
        this._topLevelValues.set(topLevelName, this.setInMap(this.attributesForTopLevel(topLevelName), kind, value));
    }
    tryGetInMap(attributes, kind) {
        return attributes.get(kind);
    }
    tryGet(kind, t) {
        return this.tryGetInMap(this.attributesForType(t), kind);
    }
    tryGetForTopLevel(kind, topLevelName) {
        return this.tryGetInMap(this.attributesForTopLevel(topLevelName), kind);
    }
}
exports.TypeAttributeStore = TypeAttributeStore;
class TypeAttributeStoreView {
    constructor(_attributeStore, _definition) {
        this._attributeStore = _attributeStore;
        this._definition = _definition;
    }
    set(t, value) {
        this._attributeStore.set(this._definition, t, value);
    }
    setForTopLevel(name, value) {
        this._attributeStore.setForTopLevel(this._definition, name, value);
    }
    tryGet(t) {
        return this._attributeStore.tryGet(this._definition, t);
    }
    get(t) {
        return (0, Support_1.defined)(this.tryGet(t));
    }
    tryGetForTopLevel(name) {
        return this._attributeStore.tryGetForTopLevel(this._definition, name);
    }
    getForTopLevel(name) {
        return (0, Support_1.defined)(this.tryGetForTopLevel(name));
    }
}
exports.TypeAttributeStoreView = TypeAttributeStoreView;
class TypeGraph {
    constructor(typeBuilder, serial, _haveProvenanceAttributes) {
        this.serial = serial;
        this._haveProvenanceAttributes = _haveProvenanceAttributes;
        this._attributeStore = undefined;
        // FIXME: OrderedMap?  We lose the order in PureScript right now, though,
        // and maybe even earlier in the TypeScript driver.
        this._topLevels = new Map();
        this._parents = undefined;
        this._printOnRewrite = false;
        this._typeBuilder = typeBuilder;
    }
    get isFrozen() {
        return this._typeBuilder === undefined;
    }
    get attributeStore() {
        return (0, Support_1.defined)(this._attributeStore);
    }
    freeze(topLevels, types, typeAttributes) {
        (0, Support_1.assert)(!this.isFrozen, "Tried to freeze TypeGraph a second time");
        for (const t of types) {
            (0, TypeRef_1.assertTypeRefGraph)(t.typeRef, this);
        }
        this._attributeStore = new TypeAttributeStore(this, typeAttributes);
        // The order of these three statements matters.  If we set _typeBuilder
        // to undefined before we deref the TypeRefs, then we need to set _types
        // before, also, because the deref will call into typeAtIndex, which requires
        // either a _typeBuilder or a _types.
        this._types = types;
        this._typeBuilder = undefined;
        this._topLevels = (0, collection_utils_1.mapMap)(topLevels, (tref) => (0, TypeRef_1.derefTypeRef)(tref, this));
    }
    get topLevels() {
        (0, Support_1.assert)(this.isFrozen, "Cannot get top-levels from a non-frozen graph");
        return this._topLevels;
    }
    typeAtIndex(index) {
        if (this._typeBuilder !== undefined) {
            return this._typeBuilder.typeAtIndex(index);
        }
        return (0, Support_1.defined)(this._types)[index];
    }
    atIndex(index) {
        if (this._typeBuilder !== undefined) {
            return this._typeBuilder.atIndex(index);
        }
        const t = this.typeAtIndex(index);
        return [t, (0, Support_1.defined)(this._attributeStore).attributesForType(t)];
    }
    filterTypes(predicate) {
        const seen = new Set();
        const types = [];
        function addFromType(t) {
            if (seen.has(t)) {
                return;
            }
            seen.add(t);
            const required = predicate === undefined || predicate(t);
            if (required) {
                types.push(t);
            }
            for (const c of t.getChildren()) {
                addFromType(c);
            }
        }
        for (const [, t] of this.topLevels) {
            addFromType(t);
        }
        return new Set(types);
    }
    allNamedTypes() {
        return this.filterTypes(TypeUtils_1.isNamedType);
    }
    allNamedTypesSeparated() {
        const types = this.allNamedTypes();
        return (0, TypeUtils_1.separateNamedTypes)(types);
    }
    allProvenance() {
        (0, Support_1.assert)(this._haveProvenanceAttributes);
        const view = new TypeAttributeStoreView(this.attributeStore, ProvenanceTypeAttributeKind_1.provenanceTypeAttributeKind);
        const sets = Array.from(this.allTypesUnordered()).map((t) => {
            const maybeSet = view.tryGet(t);
            if (maybeSet !== undefined)
                return maybeSet;
            return new Set();
        });
        const result = new Set();
        (0, collection_utils_1.setUnionManyInto)(result, sets);
        return result;
    }
    setPrintOnRewrite() {
        this._printOnRewrite = true;
    }
    checkLostTypeAttributes(builder, newGraph) {
        if (!this._haveProvenanceAttributes || builder.lostTypeAttributes) {
            return;
        }
        const oldProvenance = this.allProvenance();
        const newProvenance = newGraph.allProvenance();
        if (oldProvenance.size !== newProvenance.size) {
            const difference = (0, collection_utils_1.setSubtract)(oldProvenance, newProvenance);
            const indexes = Array.from(difference);
            (0, Messages_1.messageError)("IRTypeAttributesNotPropagated", {
                count: difference.size,
                indexes,
            });
        }
    }
    printRewrite(title) {
        if (!this._printOnRewrite) {
            return;
        }
        console.log(`\n# ${title}`);
    }
    // Each array in `replacementGroups` is a bunch of types to be replaced by a
    // single new type.  `replacer` is a function that takes a group and a
    // TypeBuilder, and builds a new type with that builder that replaces the group.
    // That particular TypeBuilder will have to take as inputs types in the old
    // graph, but return types in the new graph.  Recursive types must be handled
    // carefully.
    rewrite(title, stringTypeMapping, alphabetizeProperties, replacementGroups, debugPrintReconstitution, replacer, force = false) {
        this.printRewrite(title);
        if (!force && replacementGroups.length === 0) {
            return this;
        }
        const builder = new GraphRewriting_1.GraphRewriteBuilder(this, stringTypeMapping, alphabetizeProperties, this._haveProvenanceAttributes, replacementGroups, debugPrintReconstitution, replacer);
        builder.typeGraph = new TypeGraph(builder, this.serial + 1, this._haveProvenanceAttributes);
        const newGraph = builder.finish();
        this.checkLostTypeAttributes(builder, newGraph);
        if (this._printOnRewrite) {
            newGraph.setPrintOnRewrite();
            newGraph.printGraph();
        }
        if (!builder.didAddForwardingIntersection) {
            return newGraph;
        }
        return (0, TypeGraphUtils_1.removeIndirectionIntersections)(newGraph, stringTypeMapping, debugPrintReconstitution);
    }
    remap(title, stringTypeMapping, alphabetizeProperties, map, debugPrintRemapping, force = false) {
        this.printRewrite(title);
        if (!force && map.size === 0) {
            return this;
        }
        const builder = new GraphRewriting_1.GraphRemapBuilder(this, stringTypeMapping, alphabetizeProperties, this._haveProvenanceAttributes, map, debugPrintRemapping);
        builder.typeGraph = new TypeGraph(builder, this.serial + 1, this._haveProvenanceAttributes);
        const newGraph = builder.finish();
        this.checkLostTypeAttributes(builder, newGraph);
        if (this._printOnRewrite) {
            newGraph.setPrintOnRewrite();
            newGraph.printGraph();
        }
        (0, Support_1.assert)(!builder.didAddForwardingIntersection);
        return newGraph;
    }
    garbageCollect(alphabetizeProperties, debugPrintReconstitution) {
        const newGraph = this.remap("GC", (0, TypeBuilderUtils_1.getNoStringTypeMapping)(), alphabetizeProperties, new Map(), debugPrintReconstitution, true);
        return newGraph;
    }
    rewriteFixedPoint(alphabetizeProperties, debugPrintReconstitution) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        let graph = this;
        for (;;) {
            const newGraph = this.rewrite("fixed-point", (0, TypeBuilderUtils_1.getNoStringTypeMapping)(), alphabetizeProperties, [], debugPrintReconstitution, Support_1.mustNotHappen, true);
            if (graph.allTypesUnordered().size ===
                newGraph.allTypesUnordered().size) {
                return graph;
            }
            graph = newGraph;
        }
    }
    allTypesUnordered() {
        (0, Support_1.assert)(this.isFrozen, "Tried to get all graph types before it was frozen");
        return new Set((0, Support_1.defined)(this._types));
    }
    makeGraph(invertDirection, childrenOfType) {
        return new Graph_1.Graph((0, Support_1.defined)(this._types), invertDirection, childrenOfType);
    }
    getParentsOfType(t) {
        (0, TypeRef_1.assertTypeRefGraph)(t.typeRef, this);
        if (this._parents === undefined) {
            const parents = (0, Support_1.defined)(this._types).map((_) => new Set());
            for (const p of this.allTypesUnordered()) {
                for (const c of p.getChildren()) {
                    const index = c.index;
                    parents[index] = parents[index].add(p);
                }
            }
            this._parents = parents;
        }
        return this._parents[t.index];
    }
    printGraph() {
        const types = (0, Support_1.defined)(this._types);
        for (let i = 0; i < types.length; i++) {
            const t = types[i];
            const parts = [];
            parts.push(`${t.debugPrintKind}${t.hasNames ? ` ${t.getCombinedName()}` : ""}`);
            const children = t.getChildren();
            if (children.size > 0) {
                parts.push(`children ${Array.from(children)
                    .map((c) => c.index)
                    .join(",")}`);
            }
            for (const [kind, value] of t.getAttributes()) {
                const maybeString = kind.stringify(value);
                if (maybeString !== undefined) {
                    parts.push(maybeString);
                }
            }
            console.log(`${i}: ${parts.join(" | ")}`);
        }
    }
}
exports.TypeGraph = TypeGraph;
