import { Primitive } from './primitive.js';
type ImmutablePrimitive = Primitive | ((...args: any[]) => any);
export type Immutable<T> = T extends ImmutablePrimitive ? T : T extends Array<infer U> ? ImmutableArray<U> : T extends Map<infer K, infer V> ? ImmutableMap<K, V> : T extends Set<infer M> ? ImmutableSet<M> : T extends RegExp ? Readonly<RegExp> : ImmutableObject<T>;
export type ImmutableArray<T> = ReadonlyArray<Immutable<T>>;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};
export declare function deepFreeze<T>(target: T): Immutable<T>;
export {};
//# sourceMappingURL=immutable.d.ts.map