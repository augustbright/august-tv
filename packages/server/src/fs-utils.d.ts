export declare const UPLOAD_PATH = "./tmp/";
export declare const resolveUploadPath: (...paths: string[]) => string;
export declare function ensureDir(dir: string): Promise<string>;
export declare function ensureUploadPath(...paths: string[]): Promise<string>;
export declare function moveUploadedFile(filename: string, ...paths: string[]): Promise<string>;
export declare function getManyFiles(folder: string, filter?: (filename: string) => boolean): Promise<string[]>;
export declare function cleanUp(path: string): Promise<void>;
