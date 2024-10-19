interface TConfig {
    onProgress: (percent: number) => void;
    outputFolder: string;
    filename: string;
}
export declare class TranscodeService {
    constructor();
    transcode(inputPath: string, config: TConfig): Promise<{
        videoFolder: string;
        thumbnailsFolder: string;
        masterName: string;
    }>;
    private transcodeForStreaming;
}
export {};
