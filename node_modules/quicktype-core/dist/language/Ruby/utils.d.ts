export declare enum Strictness {
    Strict = "Strict::",
    Coercible = "Coercible::",
    None = "Types::"
}
export declare const forbiddenForObjectProperties: ("false" | "case" | "true" | "type" | "optional" | "default" | "module" | "end" | "display" | "meta" | "method" | "options" | "next" | "self" | "class" | "alias" | "clone" | "then" | "enum" | "and" | "break" | "do" | "else" | "for" | "if" | "not" | "or" | "return" | "try" | "while" | "begin" | "def" | "elsif" | "ensure" | "extend" | "in" | "nil" | "rescue" | "super" | "unless" | "until" | "when" | "with" | "yield" | "hash" | "__ENCODING__" | "__FILE__" | "__LINE__" | "BEGIN" | "defined?" | "END" | "redo" | "retry" | "undef" | "__id__" | "__send__" | "define_singleton_method" | "dup" | "enum_for" | "freeze" | "inspect" | "instance_eval" | "instance_exec" | "instance_variable_defined?" | "instance_variable_get" | "instance_variable_set" | "instance_variables" | "itself" | "methods" | "object_id" | "private_methods" | "protected_methods" | "public_method" | "public_methods" | "public_send" | "remove_instance_variable" | "send" | "singleton_class" | "singleton_method" | "singleton_methods" | "taint" | "tap" | "to_enum" | "to_s" | "trust" | "untaint" | "untrust" | "call" | "constrained_type" | "constrained?" | "constrained" | "constructor" | "gem" | "pristine" | "rule" | "safe" | "to_ast" | "to_json")[];
export declare const stringEscape: (s: string) => string;
export declare function simpleNameStyle(original: string, uppercase: boolean): string;
export declare function memberNameStyle(original: string): string;
