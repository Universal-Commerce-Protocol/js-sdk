import { ConvenienceRenderer, type ForbiddenWordsInfo } from "../../ConvenienceRenderer";
import type { Name, Namer } from "../../Naming";
import { type MultiWord } from "../../Source";
import { type ClassType, type EnumType, type Type, type UnionType } from "../../Type";
export declare class PikeRenderer extends ConvenienceRenderer {
    protected emitSourceStructure(): void;
    protected get enumCasesInGlobalNamespace(): boolean;
    protected makeEnumCaseNamer(): Namer;
    protected makeNamedTypeNamer(): Namer;
    protected makeUnionMemberNamer(): Namer;
    protected namerForObjectProperty(): Namer;
    protected forbiddenNamesForGlobalNamespace(): string[];
    protected forbiddenForObjectProperties(_c: ClassType, _className: Name): ForbiddenWordsInfo;
    protected forbiddenForEnumCases(_e: EnumType, _enumName: Name): ForbiddenWordsInfo;
    protected forbiddenForUnionMembers(_u: UnionType, _unionName: Name): ForbiddenWordsInfo;
    protected sourceFor(t: Type): MultiWord;
    protected emitClassDefinition(c: ClassType, className: Name): void;
    protected emitEnum(e: EnumType, enumName: Name): void;
    protected emitUnion(u: UnionType, unionName: Name): void;
    private emitBlock;
    private emitMappingBlock;
    private emitClassMembers;
    private emitInformationComment;
    private emitTopLevelTypedef;
    private emitTopLevelConverter;
    private emitEncodingFunction;
    private emitDecodingFunction;
}
