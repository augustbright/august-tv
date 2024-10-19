export declare class StorageService {
    private readonly storage;
    private readonly bucketName;
    private readonly transferManager;
    uploadFromFolder(folder: string, destination: string): Promise<import("@google-cloud/storage/build/cjs/src/file").File[]>;
    downloadFile(file: string, destination: string): Promise<string>;
    deleteFile(path: string): Promise<[import("teeny-request").Response<any>]>;
}
