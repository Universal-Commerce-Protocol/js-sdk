"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noneToAny = noneToAny;
exports.optionalToNullable = optionalToNullable;
exports.removeIndirectionIntersections = removeIndirectionIntersections;
const collection_utils_1 = require("collection-utils");
const TypeNames_1 = require("../attributes/TypeNames");
const Support_1 = require("../support/Support");
const Type_1 = require("./Type");
const TypeUtils_1 = require("./TypeUtils");
function noneToAny(graph, stringTypeMapping, debugPrintReconstitution) {
    const noneTypes = (0, collection_utils_1.setFilter)(graph.allTypesUnordered(), (t) => t.kind === "none");
    if (noneTypes.size === 0) {
        return graph;
    }
    (0, Support_1.assert)(noneTypes.size === 1, "Cannot have more than one none type");
    return graph.rewrite("none to any", stringTypeMapping, false, [Array.from(noneTypes)], debugPrintReconstitution, (types, builder, forwardingRef) => {
        const attributes = (0, TypeUtils_1.combineTypeAttributesOfTypes)("union", types);
        const tref = builder.getPrimitiveType("any", attributes, forwardingRef);
        return tref;
    });
}
function optionalToNullable(graph, stringTypeMapping, debugPrintReconstitution) {
    function rewriteClass(c, builder, forwardingRef) {
        const properties = (0, collection_utils_1.mapMap)(c.getProperties(), (p, name) => {
            const t = p.type;
            let ref;
            if (!p.isOptional || t.isNullable) {
                ref = builder.reconstituteType(t);
            }
            else {
                const nullType = builder.getPrimitiveType("null");
                let members;
                if (t instanceof Type_1.UnionType) {
                    members = (0, collection_utils_1.setMap)(t.members, (m) => builder.reconstituteType(m)).add(nullType);
                }
                else {
                    members = new Set([builder.reconstituteType(t), nullType]);
                }
                const attributes = TypeNames_1.namesTypeAttributeKind.setDefaultInAttributes(t.getAttributes(), () => TypeNames_1.TypeNames.make(new Set([name]), new Set(), true));
                ref = builder.getUnionType(attributes, members);
            }
            return builder.makeClassProperty(ref, p.isOptional);
        });
        if (c.isFixed) {
            return builder.getUniqueClassType(c.getAttributes(), true, properties, forwardingRef);
        }
        else {
            return builder.getClassType(c.getAttributes(), properties, forwardingRef);
        }
    }
    const classesWithOptional = (0, collection_utils_1.setFilter)(graph.allTypesUnordered(), (t) => t instanceof Type_1.ClassType &&
        (0, collection_utils_1.mapSome)(t.getProperties(), (p) => p.isOptional));
    const replacementGroups = Array.from(classesWithOptional).map((c) => [
        c,
    ]);
    if (classesWithOptional.size === 0) {
        return graph;
    }
    return graph.rewrite("optional to nullable", stringTypeMapping, false, replacementGroups, debugPrintReconstitution, (setOfClass, builder, forwardingRef) => {
        (0, Support_1.assert)(setOfClass.size === 1);
        const c = (0, Support_1.defined)((0, collection_utils_1.iterableFirst)(setOfClass));
        return rewriteClass(c, builder, forwardingRef);
    });
}
function removeIndirectionIntersections(graph, stringTypeMapping, debugPrintRemapping) {
    const map = [];
    for (const t of graph.allTypesUnordered()) {
        if (!(t instanceof Type_1.IntersectionType))
            continue;
        const seen = new Set([t]);
        let current = t;
        while (current.members.size === 1) {
            const member = (0, Support_1.defined)((0, collection_utils_1.iterableFirst)(current.members));
            if (!(member instanceof Type_1.IntersectionType)) {
                map.push([t, member]);
                break;
            }
            if (seen.has(member)) {
                // FIXME: Technically, this is an any type.
                return (0, Support_1.panic)("There's a cycle of intersection types");
            }
            seen.add(member);
            current = member;
        }
    }
    return graph.remap("remove indirection intersections", stringTypeMapping, false, new Map(map), debugPrintRemapping);
}
