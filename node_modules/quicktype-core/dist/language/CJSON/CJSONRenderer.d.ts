import { ConvenienceRenderer, type ForbiddenWordsInfo } from "../../ConvenienceRenderer";
import { type Name, type Namer } from "../../Naming";
import type { RenderContext } from "../../Renderer";
import type { OptionValues } from "../../RendererOptions";
import type { Sourcelike } from "../../Source";
import { type NamingStyle } from "../../support/Strings";
import type { TargetLanguage } from "../../TargetLanguage";
import { ClassType, EnumType, type Type, UnionType } from "../../Type";
import type { cJSONOptions } from "./language";
import { type IncludeMap, type TypeCJSON, type TypeRecord } from "./utils";
export declare class CJSONRenderer extends ConvenienceRenderer {
    private readonly _options;
    private currentFilename;
    private readonly memberNameStyle;
    private readonly namedTypeNameStyle;
    private readonly forbiddenGlobalNames;
    protected readonly typeIntegerSize: string;
    protected readonly hashtableSize: string;
    protected readonly typeNamingStyle: NamingStyle;
    protected readonly enumeratorNamingStyle: NamingStyle;
    private includes;
    /**
     * Constructor
     * @param targetLanguage: target language
     * @param renderContext: render context
     * @param _options: renderer options
     */
    constructor(targetLanguage: TargetLanguage, renderContext: RenderContext, _options: OptionValues<typeof cJSONOptions>);
    /**
     * Build forbidden names for namespace
     * @return Forbidden names for namespace
     */
    protected forbiddenNamesForGlobalNamespace(): string[];
    /**
     * Build forbidden names for enums
     * @return Forbidden names for enums
     */
    protected forbiddenForEnumCases(_enumType: EnumType, _enumName: Name): ForbiddenWordsInfo;
    /**
     * Build forbidden names for unions members
     * @return Forbidden names for unions members
     */
    protected forbiddenForUnionMembers(_u: UnionType, _unionName: Name): ForbiddenWordsInfo;
    /**
     * Build forbidden names for objects
     * @return Forbidden names for objects
     */
    protected forbiddenForObjectProperties(_c: ClassType, _className: Name): ForbiddenWordsInfo;
    /**
     * Build types member names
     * @return types member namer
     */
    protected makeNamedTypeNamer(): Namer;
    /**
     * Build object properties member names
     * @return object properties member namer
     */
    protected namerForObjectProperty(): Namer;
    /**
     * Build union member names
     * @return union member namer
     */
    protected makeUnionMemberNamer(): Namer;
    /**
     * Build enum member names
     * @return enum member namer
     */
    protected makeEnumCaseNamer(): Namer;
    /**
     * Override of super proposeUnionMemberName function
     * @param unionType: union type
     * @param unionName: union name
     * @param fieldType: field type
     * @param lookup: Lookup function
     * @return Proposed union member name
     */
    protected proposeUnionMemberName(unionType: UnionType, unionName: Name, fieldType: Type, lookup: (n: Name) => string): string;
    /**
     * Function called to emit typedef alias for a a given type
     * @param fieldType: the variable type
     * @param fieldName: name of the variable
     */
    protected emitTypedefAlias(fieldType: Type, fieldName: Name): void;
    /**
     * Function called to create header file(s)
     * @param proposedFilename: source filename provided from stdin
     */
    protected emitSourceStructure(proposedFilename: string): void;
    /**
     * Function called to create a single header file with types and generators
     * @param proposedFilename: source filename provided from stdin
     */
    protected emitSingleSourceStructure(proposedFilename: string): void;
    /**
     * Function called to create a multiple header files with types and generators
     */
    protected emitMultiSourceStructure(): void;
    /**
     * Function called to create an enum header files with types and generators
     * @param enumType: enum type
     */
    protected emitEnum(enumType: EnumType): void;
    /**
     * Function called to create enum typedef
     * @param enumType: enum type
     */
    protected emitEnumTypedef(enumType: EnumType): void;
    /**
     * Function called to create enum prototypes
     * @param enumType: enum type
     */
    protected emitEnumPrototypes(enumType: EnumType): void;
    /**
     * Function called to create enum functions
     * @param enumType: enum type
     */
    protected emitEnumFunctions(enumType: EnumType): void;
    /**
     * Function called to create a union header files with types and generators
     * @param unionType: union type
     */
    protected emitUnion(unionType: UnionType): void;
    /**
     * Function called to create union typedef
     * @param unionType: union type
     */
    protected emitUnionTypedef(unionType: UnionType): void;
    /**
     * Function called to create union prototypes
     * @param unionType: union type
     */
    protected emitUnionPrototypes(unionType: UnionType): void;
    /**
     * Function called to create union functions
     * @param unionType: union type
     */
    protected emitUnionFunctions(unionType: UnionType): void;
    /**
     * Function called to create a class header files with types and generators
     * @param classType: class type
     */
    protected emitClass(classType: ClassType): void;
    /**
     * Function called to create class typedef
     * @param classType: class type
     */
    protected emitClassTypedef(classType: ClassType): void;
    /**
     * Function called to create class prototypes
     * @param classType: class type
     */
    protected emitClassPrototypes(classType: ClassType): void;
    /**
     * Function called to create class functions
     * @param classType: class type
     */
    protected emitClassFunctions(classType: ClassType): void;
    /**
     * Function called to create a top level header files with types and generators
     * @param type: type of the top level element
     * @param className: top level class name
     * @param includes: Array of includes
     */
    protected emitTopLevel(type: Type, className: Name, includes: string[]): void;
    /**
     * Function called to create top level typedef
     * @param type: type of the top level element
     * @param className: top level class name
     */
    protected emitTopLevelTypedef(type: Type, className: Name): void;
    /**
     * Function called to create top level prototypes
     * @param type: type of the top level element
     * @param className: top level class name
     */
    protected emitTopLevelPrototypes(_type: Type, className: Name): void;
    /**
     * Function called to create top level functions
     * @param type: type of the top level element
     * @param className: top level class name
     */
    protected emitTopLevelFunctions(type: Type, className: Name): void;
    /**
     * Convert quicktype type to cJSON type
     * @param t: quicktype type
     * @param isOptional: true if the field is optional
     * @param isNullable: true if the field is nullable
     * @return cJSON type
     */
    protected quicktypeTypeToCJSON(t: Type, isOptional: boolean, isNullable?: boolean): TypeCJSON;
    /**
     * Function called to create a file
     * @param proposedFilename: source filename provided from stdin
     */
    protected startFile(proposedFilename: Sourcelike): void;
    /**
     * Function called to close current file
     */
    protected finishFile(): void;
    /**
     * Check if type need declaration before use
     * @note If returning true, canBeForwardDeclared must be declared
     * @return Always returns true
     */
    protected get needsTypeDeclarationBeforeUse(): boolean;
    /**
     * Check if type can be forward declared
     * @return true for classes, false otherwise
     */
    protected canBeForwardDeclared(type: Type): boolean;
    /**
     * Add const to wanted Sourcelike
     * @return Const Sourcelike
     */
    protected withConst(s: Sourcelike): Sourcelike;
    /**
     * Emit include line
     * @param name: filename to include
     * @pram global: true if global include, false otherwise (default)
     */
    protected emitIncludeLine(name: Sourcelike, global?: boolean): void;
    /**
     * Emit description block
     * @param lines: description block lines
     */
    protected emitDescriptionBlock(lines: Sourcelike[]): void;
    /**
     * Emit code block
     * @param line: code block line
     * @param f: callback function
     * @param withName: name of the block as string
     * @param withSemicolon: true to add semicolon at the end of the block, false otherwise
     * @param withIndent: true to indent the block (default), false otherwise
     */
    protected emitBlock(line: Sourcelike, f: () => void, withName?: string, withSemicolon?: boolean, withIndent?: boolean): void;
    /**
     * Emit includes
     * @param type: class, union or enum type
     * @param filename: current file name
     */
    protected emitIncludes(type: ClassType | UnionType | EnumType, filename: string): void;
    /**
     * Compute includes
     * @param isClassMender: true if class, false otherwise
     * @param includes: include map
     * @param propertyType: property type
     */
    protected updateIncludes(isClassMember: boolean, includes: IncludeMap, propertyType: Type): void;
    /**
     * Compute generated types
     * @param isClassMender: true if class, false otherwise
     * @param type: type
     * @return Type record array
     */
    protected generatedTypes(isClassMember: boolean, type: Type): TypeRecord[];
}
