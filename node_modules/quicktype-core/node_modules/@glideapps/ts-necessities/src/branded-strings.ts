/**
 * A branded string is a string that has a unique type, so that it can be
 * distinguished from other strings.  This is useful when you want to ensure
 * that a string is only used in a specific context.  When assigning to a
 * branded string type it's not allowed to assign a non-branded string, or a
 * string of the wrong brand:
 *
 * ```ts
 * type Apple = BrandedString<"apple">;
 * type Orange = BrandedString<"orange">;
 *
 * const apple: Apple = brandString("Pink Lady");
 * let orange: Orange = apple;           // error!
 * orange = "jalapeño";                  // error!
 * let justAString: string = apple;      // This is ok
 * ```
 */
export type BrandedString<T extends string> = string & { __brand: T };

/**
 * Brands a string with the specified brand.
 *
 * @param s The string to brand.
 */
export function brandString<T extends string>(s: string): BrandedString<T> {
    return s as BrandedString<T>;
}

/**
 * Returns a function that brands a string with the specified brand.  For
 * example:
 *
 * ```ts
 * type Apple = BrandedString<"apple">;
 * // `makeApple` will be of type `(s: string) => Apple`
 * const makeApple = makeBrandString<Apple>();
 * // `apple` will be of type `Apple`
 * const apple = makeApple("Pink Lady");
 * ```
 */
export function makeBrandString<T>(): T extends BrandedString<any> ? (s: string) => T : never {
    return brandString as any;
}
