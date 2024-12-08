import { Project } from '../fs/project.js';
import { FilePreprocessor } from './file-preprocessor.js';
export declare class MultiPreprocessor implements FilePreprocessor {
    private readonly preprocessors;
    constructor(preprocessors: FilePreprocessor[]);
    preprocess(project: Project): Promise<void>;
}
//# sourceMappingURL=multi-preprocessor.d.ts.map