import { type ClassProperty } from "../../Type";
export declare const upperNamingFunction: import("../../Naming").Namer;
export declare const lowerNamingFunction: import("../../Naming").Namer;
interface RequiredOrOptional {
    fallback: string;
    reqOrOpt: string;
}
export declare function requiredOrOptional(p: ClassProperty): RequiredOrOptional;
export {};
