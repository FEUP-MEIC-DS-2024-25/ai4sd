/**
 * Observable for location changes on the hash part of the url
 * As soon as you subscribe you'll get a first event for the current location
 * @example
 * window.location.url === 'http://localhost:8080#foo/bar/baz.js' => ['foo', 'bar', 'baz.js ']
 */
export declare const locationChange$: import("rxjs").Observable<string[]>;
export declare enum View {
    mutant = "mutant",
    test = "test"
}
//# sourceMappingURL=router.d.ts.map