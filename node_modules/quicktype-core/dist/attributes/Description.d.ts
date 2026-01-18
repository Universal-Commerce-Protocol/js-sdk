import type { JSONSchemaAttributes, JSONSchemaType, Ref } from "../input/JSONSchemaInput";
import type { JSONSchema } from "../input/JSONSchemaStore";
import { TypeAttributeKind } from "./TypeAttributes";
export declare function addDescriptionToSchema(schema: {
    [name: string]: unknown;
}, description: Iterable<string> | undefined): void;
export declare const descriptionTypeAttributeKind: TypeAttributeKind<ReadonlySet<string>>;
export declare const propertyDescriptionsTypeAttributeKind: TypeAttributeKind<Map<string, ReadonlySet<string>>>;
export declare function descriptionAttributeProducer(schema: JSONSchema, ref: Ref, types: Set<JSONSchemaType>): JSONSchemaAttributes | undefined;
