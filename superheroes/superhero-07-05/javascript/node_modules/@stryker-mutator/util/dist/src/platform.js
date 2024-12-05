export const platform = {
    /**
     * Tells whether the filesystem is case sensitive.
     *
     * @returns false on Win32, true elsewhere
     */
    caseSensitiveFs() {
        return process.platform != 'win32';
    },
};
//# sourceMappingURL=platform.js.map