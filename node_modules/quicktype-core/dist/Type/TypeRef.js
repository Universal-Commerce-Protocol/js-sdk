"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTypeRef = isTypeRef;
exports.makeTypeRef = makeTypeRef;
exports.typeRefIndex = typeRefIndex;
exports.assertTypeRefGraph = assertTypeRefGraph;
exports.derefTypeRef = derefTypeRef;
exports.attributesForTypeRef = attributesForTypeRef;
exports.typeAndAttributesForTypeRef = typeAndAttributesForTypeRef;
const Support_1 = require("../support/Support");
const indexBits = 26;
const indexMask = (1 << indexBits) - 1;
const serialBits = 31 - indexBits;
const serialMask = (1 << serialBits) - 1;
function isTypeRef(x) {
    return typeof x === "number";
}
function makeTypeRef(graph, index) {
    (0, Support_1.assert)(index <= indexMask, "Too many types in graph");
    return ((graph.serial & serialMask) << indexBits) | index;
}
function typeRefIndex(tref) {
    return tref & indexMask;
}
function assertTypeRefGraph(tref, graph) {
    (0, Support_1.assert)(((tref >> indexBits) & serialMask) === (graph.serial & serialMask), "Mixing the wrong type reference and graph");
}
function getGraph(graphOrBuilder) {
    if ("originalGraph" in graphOrBuilder) {
        return graphOrBuilder.originalGraph;
    }
    // do not use `graphOrBuilder instanceof TypeGraph` to check if is TypeGraph to prevent import cycle
    return graphOrBuilder;
}
function derefTypeRef(tref, graphOrBuilder) {
    const graph = getGraph(graphOrBuilder);
    assertTypeRefGraph(tref, graph);
    return graph.typeAtIndex(typeRefIndex(tref));
}
function attributesForTypeRef(tref, graphOrBuilder) {
    const graph = getGraph(graphOrBuilder);
    assertTypeRefGraph(tref, graph);
    return graph.atIndex(typeRefIndex(tref))[1];
}
function typeAndAttributesForTypeRef(tref, graphOrBuilder) {
    const graph = getGraph(graphOrBuilder);
    assertTypeRefGraph(tref, graph);
    return graph.atIndex(typeRefIndex(tref));
}
