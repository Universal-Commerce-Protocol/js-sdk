import type { JSONSchemaAttributes, JSONSchemaType, Ref } from "../input/JSONSchemaInput";
import type { JSONSchema } from "../input/JSONSchemaStore";
import { TypeAttributeKind, type TypeAttributes } from "./TypeAttributes";
type URIAttributes = [ReadonlySet<string>, ReadonlySet<string>];
export declare const uriTypeAttributeKind: TypeAttributeKind<URIAttributes>;
export declare function uriInferenceAttributesProducer(s: string): TypeAttributes;
export declare function uriSchemaAttributesProducer(schema: JSONSchema, _ref: Ref, types: Set<JSONSchemaType>): JSONSchemaAttributes | undefined;
export {};
