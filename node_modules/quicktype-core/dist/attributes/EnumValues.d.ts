import type { JSONSchemaAttributes, JSONSchemaType, Ref } from "../input/JSONSchemaInput";
import type { JSONSchema } from "../input/JSONSchemaStore";
import type { EnumType } from "../Type/Type";
import { type AccessorNames } from "./AccessorNames";
import { TypeAttributeKind } from "./TypeAttributes";
export declare const enumValuesTypeAttributeKind: TypeAttributeKind<AccessorNames>;
export declare function enumCaseValues(e: EnumType, language: string): Map<string, [string, boolean] | undefined>;
export declare function enumValuesAttributeProducer(schema: JSONSchema, _canonicalRef: Ref | undefined, _types: Set<JSONSchemaType>): JSONSchemaAttributes | undefined;
