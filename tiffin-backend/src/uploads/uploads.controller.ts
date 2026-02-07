import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import type { Response } from 'express'; // Changed to import type
import * as fs from 'fs';

@Controller('uploads')
export class UploadsController {

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    uploadFile(@UploadedFile() file: any) {
        return {
            url: `/uploads/${file.filename}`
        };
    }

    @Get(':filename')
    serveFile(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = `./uploads/${filename}`;
        if (fs.existsSync(filePath)) {
            res.sendFile(filename, { root: './uploads' });
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    }
}
