/**
 * The read-only interface of [[DefaultMap]].
 *
 * @typeParam K The key type.
 * @typeParam V The value type.
 */
export interface ReadonlyDefaultMap<K, V> extends ReadonlyMap<K, V> {
    get(k: K): V;
}

/**
 * A `Map` that returns default values for keys that are not present.
 *
 * To map strings to `Set`s of numbers, for example, `DefaultMap` can
 * be used like this:
 *
 * ```
 * const m = new DefaultMap<string, Set<number>>(() => new Set());
 * m.get("foo"); // returns an empty `Set`
 * m.get("bar").add(1);
 * m.get("bar"); // returns a `Set` containing `1`.
 * ```
 *
 * @typeParam K The key type.
 * @typeParam V The value type.
 */
export class DefaultMap<K, V> extends Map<K, V> implements ReadonlyDefaultMap<K, V> {
    /**
     *
     * @param _defaultFunc Must return the default value for key `k`.  Will only be called when necessary.
     * @param initKVPs An array of [key, value] arrays to initialize the map with.
     */
    constructor(private readonly _defaultFunc: (k: K) => V, initKVPs?: readonly (readonly [K, V])[]) {
        super(initKVPs);
    }

    /**
     * Returns the value for `k`.  If `k` is not present, creates
     * the default value via [[_defaultFunc]], sets that default
     * as the value for `k` and returns it.
     */
    public get(k: K): V {
        let v = super.get(k);
        if (v === undefined) {
            // There's an edge case here, which is that the value
            // for `k` exists, but it's `undefined`.  To guard
            // against that we have this extra check.
            if (this.has(k)) return v as V;

            v = this._defaultFunc(k);
            this.set(k, v);
        }
        return v;
    }

    /**
     * Sets the value for `k` to `f(v)` where `v` is the previous
     * value for `k`, or the default if not present.  Returns the new
     * value.
     *
     * These two lines are equivalent:
     *
     * ```
     * m.set("foo", m.get("foo") + 1);
     * m.update("foo", x => x + 1);
     * ```
     */
    public update(k: K, f: (v: V) => V): V {
        const v = f(this.get(k));
        this.set(k, v);
        return v;
    }
}
