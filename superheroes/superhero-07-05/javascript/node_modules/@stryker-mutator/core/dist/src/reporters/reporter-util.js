import path from 'path';
import { createReadStream, createWriteStream, promises as fs } from 'fs';
export const reporterUtil = {
    copyFile(fromFilename, toFilename) {
        return new Promise((resolve, reject) => {
            const readStream = createReadStream(fromFilename);
            const writeStream = createWriteStream(toFilename);
            readStream.on('error', reject);
            writeStream.on('error', reject);
            readStream.pipe(writeStream);
            readStream.on('end', resolve);
        });
    },
    async writeFile(fileName, content) {
        await fs.mkdir(path.dirname(fileName), { recursive: true });
        await fs.writeFile(fileName, content, 'utf8');
    },
};
//# sourceMappingURL=reporter-util.js.map