import { DependencyName, type Name } from "../../Naming";
import { type MultiWord, type Sourcelike } from "../../Source";
import { type Transformer } from "../../Transformers";
import type { ClassType, Type } from "../../Type";
import { PythonRenderer } from "./PythonRenderer";
export type ConverterFunction = "none" | "bool" | "int" | "from-float" | "to-float" | "str" | "to-enum" | "list" | "to-class" | "dict" | "union" | "from-datetime" | "from-stringified-bool" | "is-type";
export interface ValueOrLambda {
    lambda?: MultiWord;
    value: Sourcelike | undefined;
}
export declare class JSONPythonRenderer extends PythonRenderer {
    private readonly _deserializerFunctions;
    private readonly _converterNamer;
    private readonly _topLevelConverterNames;
    private _haveTypeVar;
    private _haveEnumTypeVar;
    private _haveDateutil;
    protected emitTypeVar(tvar: string, constraints: Sourcelike): void;
    protected typeVar(): string;
    protected enumTypeVar(): string;
    protected cast(type: Sourcelike, v: Sourcelike): Sourcelike;
    protected emitNoneConverter(): void;
    protected emitBoolConverter(): void;
    protected emitIntConverter(): void;
    protected emitFromFloatConverter(): void;
    protected emitToFloatConverter(): void;
    protected emitStrConverter(): void;
    protected emitToEnumConverter(): void;
    protected emitListConverter(): void;
    protected emitToClassConverter(): void;
    protected emitDictConverter(): void;
    protected emitUnionConverter(): void;
    protected emitFromDatetimeConverter(): void;
    protected emitFromStringifiedBoolConverter(): void;
    protected emitIsTypeConverter(): void;
    protected emitConverter(cf: ConverterFunction): void;
    protected conv(cf: ConverterFunction): Sourcelike;
    protected convFn(cf: ConverterFunction, arg: ValueOrLambda): ValueOrLambda;
    protected typeObject(t: Type): Sourcelike;
    protected transformer(inputTransformer: ValueOrLambda, xfer: Transformer, targetType: Type): ValueOrLambda;
    protected deserializer(value: ValueOrLambda, t: Type): ValueOrLambda;
    protected serializer(value: ValueOrLambda, t: Type): ValueOrLambda;
    protected emitClassMembers(t: ClassType): void;
    protected emitImports(): void;
    protected emitSupportCode(): void;
    protected makeTopLevelDependencyNames(_t: Type, topLevelName: Name): DependencyName[];
    protected emitDefaultLeadingComments(): void;
    protected emitClosingCode(): void;
}
