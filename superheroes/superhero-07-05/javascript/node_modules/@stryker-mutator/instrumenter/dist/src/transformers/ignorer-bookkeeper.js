/**
 * Responsible for keeping track of the active ignore message and node using the configured ignore-plugins.
 */
export class IgnorerBookkeeper {
    ignorers;
    activeIgnored;
    get currentIgnoreMessage() {
        return this.activeIgnored?.message;
    }
    constructor(ignorers) {
        this.ignorers = ignorers;
    }
    enterNode(path) {
        if (!this.activeIgnored) {
            this.ignorers.forEach((ignorer) => {
                const message = ignorer.shouldIgnore(path);
                if (message) {
                    this.activeIgnored = { node: path.node, message };
                }
            });
        }
    }
    leaveNode(path) {
        if (this.activeIgnored?.node === path.node) {
            this.activeIgnored = undefined;
        }
    }
}
//# sourceMappingURL=ignorer-bookkeeper.js.map