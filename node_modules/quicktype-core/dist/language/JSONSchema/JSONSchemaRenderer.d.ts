import { ConvenienceRenderer } from "../../ConvenienceRenderer";
import type { Namer } from "../../Naming";
export declare class JSONSchemaRenderer extends ConvenienceRenderer {
    protected makeNamedTypeNamer(): Namer;
    protected namerForObjectProperty(): null;
    protected makeUnionMemberNamer(): null;
    protected makeEnumCaseNamer(): null;
    private nameForType;
    private makeOneOf;
    private makeRef;
    private addAttributesToSchema;
    private schemaForType;
    private definitionForObject;
    private definitionForUnion;
    private definitionForEnum;
    protected emitSourceStructure(): void;
}
