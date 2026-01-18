"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertIsObject = assertIsObject;
exports.assertIsClass = assertIsClass;
exports.setOperationMembersRecursively = setOperationMembersRecursively;
exports.makeGroupsToFlatten = makeGroupsToFlatten;
exports.combineTypeAttributesOfTypes = combineTypeAttributesOfTypes;
exports.isAnyOrNull = isAnyOrNull;
exports.removeNullFromUnion = removeNullFromUnion;
exports.removeNullFromType = removeNullFromType;
exports.nullableFromUnion = nullableFromUnion;
exports.nonNullTypeCases = nonNullTypeCases;
exports.getNullAsOptional = getNullAsOptional;
exports.isNamedType = isNamedType;
exports.separateNamedTypes = separateNamedTypes;
exports.directlyReachableTypes = directlyReachableTypes;
exports.directlyReachableSingleNamedType = directlyReachableSingleNamedType;
exports.stringTypesForType = stringTypesForType;
exports.matchTypeExhaustive = matchTypeExhaustive;
exports.matchType = matchType;
exports.matchCompoundType = matchCompoundType;
const collection_utils_1 = require("collection-utils");
const StringTypes_1 = require("../attributes/StringTypes");
const TypeAttributes_1 = require("../attributes/TypeAttributes");
const Support_1 = require("../support/Support");
const TransformedStringType_1 = require("./TransformedStringType");
const Type_1 = require("./Type");
function assertIsObject(t) {
    if (t instanceof Type_1.ObjectType) {
        return t;
    }
    return (0, Support_1.panic)("Supposed object type is not an object type");
}
function assertIsClass(t) {
    if (!(t instanceof Type_1.ClassType)) {
        return (0, Support_1.panic)("Supposed class type is not a class type");
    }
    return t;
}
function setOperationMembersRecursively(oneOrMany, combinationKind) {
    const setOperations = Array.isArray(oneOrMany) ? oneOrMany : [oneOrMany];
    const kind = setOperations[0].kind;
    const includeAny = kind !== "intersection";
    const processedSetOperations = new Set();
    const members = new Set();
    let attributes = TypeAttributes_1.emptyTypeAttributes;
    function process(t) {
        if (t.kind === kind) {
            const so = t;
            if (processedSetOperations.has(so))
                return;
            processedSetOperations.add(so);
            if (combinationKind !== undefined) {
                attributes = (0, TypeAttributes_1.combineTypeAttributes)(combinationKind, attributes, t.getAttributes());
            }
            for (const m of so.members) {
                process(m);
            }
        }
        else if (includeAny || t.kind !== "any") {
            members.add(t);
        }
        else {
            if (combinationKind !== undefined) {
                attributes = (0, TypeAttributes_1.combineTypeAttributes)(combinationKind, attributes, t.getAttributes());
            }
        }
    }
    for (const so of setOperations) {
        process(so);
    }
    return [members, attributes];
}
function makeGroupsToFlatten(setOperations, include) {
    const typeGroups = new collection_utils_1.EqualityMap();
    for (const u of setOperations) {
        // FIXME: We shouldn't have to make a new set here once we got rid
        // of immutable.
        const members = new Set(setOperationMembersRecursively(u, undefined)[0]);
        if (include !== undefined) {
            if (!include(members))
                continue;
        }
        let maybeSet = typeGroups.get(members);
        if (maybeSet === undefined) {
            maybeSet = new Set();
            if (members.size === 1) {
                maybeSet.add((0, Support_1.defined)((0, collection_utils_1.iterableFirst)(members)));
            }
        }
        maybeSet.add(u);
        typeGroups.set(members, maybeSet);
    }
    return Array.from(typeGroups.values()).map((ts) => Array.from(ts));
}
function combineTypeAttributesOfTypes(combinationKind, types) {
    return (0, TypeAttributes_1.combineTypeAttributes)(combinationKind, Array.from(types).map((t) => t.getAttributes()));
}
function isAnyOrNull(t) {
    return t.kind === "any" || t.kind === "null";
}
// FIXME: We shouldn't have to sort here.  This is just because we're not getting
// back the right order from JSON Schema, due to the changes the intersection types
// introduced.
function removeNullFromUnion(t, sortBy = false) {
    function sort(s) {
        if (sortBy === false)
            return s;
        if (sortBy === true)
            return (0, collection_utils_1.setSortBy)(s, (m) => m.kind);
        return (0, collection_utils_1.setSortBy)(s, sortBy);
    }
    const nullType = t.findMember("null");
    if (nullType === undefined) {
        return [null, sort(t.members)];
    }
    return [
        nullType,
        sort((0, collection_utils_1.setFilter)(t.members, (m) => m.kind !== "null")),
    ];
}
function removeNullFromType(t) {
    if (t.kind === "null") {
        return [t, new Set()];
    }
    if (!(t instanceof Type_1.UnionType)) {
        return [null, new Set([t])];
    }
    return removeNullFromUnion(t);
}
function nullableFromUnion(t) {
    const [hasNull, nonNulls] = removeNullFromUnion(t);
    if (hasNull === null)
        return null;
    if (nonNulls.size !== 1)
        return null;
    return (0, Support_1.defined)((0, collection_utils_1.iterableFirst)(nonNulls));
}
function nonNullTypeCases(t) {
    return removeNullFromType(t)[1];
}
function getNullAsOptional(cp) {
    const [maybeNull, nonNulls] = removeNullFromType(cp.type);
    if (cp.isOptional) {
        return [true, nonNulls];
    }
    return [maybeNull !== null, nonNulls];
}
// FIXME: Give this an appropriate name, considering that we don't distinguish
// between named and non-named types anymore.
function isNamedType(t) {
    return ["class", "union", "enum", "object"].includes(t.kind);
}
function separateNamedTypes(types) {
    const objects = (0, collection_utils_1.setFilter)(types, (t) => t.kind === "object" || t.kind === "class");
    const enums = (0, collection_utils_1.setFilter)(types, (t) => t instanceof Type_1.EnumType);
    const unions = (0, collection_utils_1.setFilter)(types, (t) => t instanceof Type_1.UnionType);
    return { objects, enums, unions };
}
function directlyReachableTypes(t, setForType) {
    const set = setForType(t);
    if (set !== null)
        return set;
    return (0, collection_utils_1.setUnion)(...Array.from(t.getNonAttributeChildren()).map((c) => directlyReachableTypes(c, setForType)));
}
function directlyReachableSingleNamedType(type) {
    const definedTypes = directlyReachableTypes(type, (t) => {
        if ((!(t instanceof Type_1.UnionType) && isNamedType(t)) ||
            (t instanceof Type_1.UnionType && nullableFromUnion(t) === null)) {
            return new Set([t]);
        }
        return null;
    });
    (0, Support_1.assert)(definedTypes.size <= 1, "Cannot have more than one defined type per top-level");
    return (0, collection_utils_1.iterableFirst)(definedTypes);
}
function stringTypesForType(t) {
    (0, Support_1.assert)(t.kind === "string", "Only strings can have string types");
    const stringTypes = StringTypes_1.stringTypesTypeAttributeKind.tryGetInAttributes(t.getAttributes());
    if (stringTypes === undefined) {
        return (0, Support_1.panic)("All strings must have a string type attribute");
    }
    return stringTypes;
}
function matchTypeExhaustive(t, noneType, anyType, nullType, boolType, integerType, doubleType, stringType, arrayType, classType, mapType, objectType, enumType, unionType, transformedStringType) {
    if (t.isPrimitive()) {
        if ((0, TransformedStringType_1.isPrimitiveStringTypeKind)(t.kind)) {
            if (t.kind === "string") {
                return stringType(t);
            }
            return transformedStringType(t);
        }
        const kind = t.kind;
        const f = {
            none: noneType,
            any: anyType,
            null: nullType,
            bool: boolType,
            integer: integerType,
            double: doubleType,
        }[kind];
        if (f !== undefined)
            return f(t);
        return (0, Support_1.assertNever)(f);
    }
    if (t instanceof Type_1.ArrayType)
        return arrayType(t);
    if (t instanceof Type_1.ClassType)
        return classType(t);
    if (t instanceof Type_1.MapType)
        return mapType(t);
    if (t instanceof Type_1.ObjectType)
        return objectType(t);
    if (t instanceof Type_1.EnumType)
        return enumType(t);
    if (t instanceof Type_1.UnionType)
        return unionType(t);
    return (0, Support_1.panic)(`Unknown type ${t.kind}`);
}
function matchType(type, anyType, nullType, boolType, integerType, doubleType, stringType, arrayType, classType, mapType, enumType, unionType, transformedStringType) {
    function typeNotSupported(t) {
        return (0, Support_1.panic)(`Unsupported type ${t.kind} in non-exhaustive match`);
    }
    return matchTypeExhaustive(type, typeNotSupported, anyType, nullType, boolType, integerType, doubleType, stringType, arrayType, classType, mapType, typeNotSupported, enumType, unionType, transformedStringType !== null && transformedStringType !== void 0 ? transformedStringType : typeNotSupported);
}
function matchCompoundType(t, arrayType, classType, mapType, objectType, unionType) {
    function ignore(_) {
        return;
    }
    matchTypeExhaustive(t, ignore, ignore, ignore, ignore, ignore, ignore, ignore, arrayType, classType, mapType, objectType, ignore, unionType, ignore);
}
