export const SUPPORTED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt']
};

export const SUPPORTED_EXTENSIONS = Object.values(SUPPORTED_FILE_TYPES).flat();
export const MAX_FILE_SIZE = 10 * 1024 * 1024;