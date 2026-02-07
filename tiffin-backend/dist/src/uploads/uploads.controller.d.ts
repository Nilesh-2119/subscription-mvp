import type { Response } from 'express';
export declare class UploadsController {
    uploadFile(file: any): {
        url: string;
    };
    serveFile(filename: string, res: Response): void;
}
