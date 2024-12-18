import path from 'path';
import { StrykerError } from '@stryker-mutator/util';
/**
 * Represents a file inside the project under test.
 * Has utility methods to help with copying it to the sandbox, or backing it up (when `--inPlace` is active)
 *
 * Assumes utf-8 as encoding when reading/writing content.
 */
export class ProjectFile {
    fs;
    name;
    mutate;
    #currentContent;
    #originalContent;
    #relativePath;
    constructor(fs, name, mutate) {
        this.fs = fs;
        this.name = name;
        this.mutate = mutate;
        this.#relativePath = path.relative(process.cwd(), this.name);
    }
    async #writeTo(to) {
        if (this.#currentContent === undefined) {
            await this.fs.copyFile(this.name, to);
        }
        else {
            await this.fs.writeFile(to, this.#currentContent, 'utf-8');
        }
    }
    setContent(content) {
        this.#currentContent = content;
    }
    async toInstrumenterFile() {
        return {
            content: await this.readContent(),
            mutate: this.mutate,
            name: this.name,
        };
    }
    async readContent() {
        if (this.#currentContent === undefined) {
            this.#currentContent = await this.readOriginal();
        }
        return this.#currentContent;
    }
    async readOriginal() {
        if (this.#originalContent === undefined) {
            try {
                this.#originalContent = await this.fs.readFile(this.name, 'utf-8');
            }
            catch (e) {
                throw new StrykerError(`Could not read file "${this.name}"`, e);
            }
            if (this.#currentContent === undefined) {
                this.#currentContent = this.#originalContent;
            }
        }
        return this.#originalContent;
    }
    async writeInPlace() {
        if (this.#currentContent !== undefined && this.hasChanges) {
            await this.fs.writeFile(this.name, this.#currentContent, 'utf-8');
        }
    }
    async writeToSandbox(sandboxDir) {
        const folderName = path.join(sandboxDir, path.dirname(this.#relativePath));
        const targetFileName = path.join(folderName, path.basename(this.#relativePath));
        await this.fs.mkdir(path.dirname(targetFileName), { recursive: true });
        await this.#writeTo(targetFileName);
        return targetFileName;
    }
    async backupTo(backupDir) {
        const backupFileName = path.join(backupDir, this.#relativePath);
        await this.fs.mkdir(path.dirname(backupFileName), { recursive: true });
        if (this.#originalContent === undefined) {
            await this.fs.copyFile(this.name, backupFileName);
        }
        else {
            await this.fs.writeFile(backupFileName, this.#originalContent);
        }
        return backupFileName;
    }
    get hasChanges() {
        return this.#currentContent !== this.#originalContent;
    }
}
//# sourceMappingURL=project-file.js.map