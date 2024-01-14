import { NextFunction, Request, Response } from 'express';
import StreamModel from '../models/stream.model';
import { User } from '@prisma/client';
import { CreateStreamSchema } from '../DTOs/stream.dto';
import { fromZodError } from 'zod-validation-error';
import fs from 'fs';
import path from 'path';
import { WebSocket, WebSocketServer } from 'ws';

class StreamController {
    async createVideo(req: Request, res: Response) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const vpath = files.video[0].path
            const video = vpath.slice(15,vpath.length);
            const thumpath = files.thumbnail[0].path;
            const thumbnail = thumpath.slice(19,thumpath.length)
            console.log(thumbnail);
            
            
            
            const user = req.user as User;
            const loggedUserId = user.id
            console.log(loggedUserId);
            
            const streamData = req.body;
            req.body.video=video;
            req.body.thumbnail=thumbnail;
            req.body.categoriesIds=[1,2,3];
            console.log(req.body);
            
            const validatedStream = CreateStreamSchema.safeParse(req.body);
            if (validatedStream.success) {
                const stream = await StreamModel.createStream(streamData, loggedUserId);
                res.status(201).json(stream);
            }
            else
                res.send(fromZodError(validatedStream.error).message)
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async getAllVideos(req: Request, res: Response) {
        try {
            const streams = await StreamModel.GetAllStreams();
            if (streams.length != 0)
                res.json(streams);
            else
                res.status(404).json({ message: "No stream Found" });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getVideoById(req: Request, res: Response) {
        try {

            const stream = await StreamModel.findStreamById(parseInt(req.params.videoId));
            if (stream) {
                res.json(stream);
            } else {
                res.status(404).json({ message: 'Stream not found' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async getVideoByCategoryId(req: Request, res: Response) {
        try {
            const streams = await StreamModel.findStreamsByCategoryId(parseInt(req.params.categoryId));
            if (streams.length != 0) {
                res.json(streams);
            } else {
                res.status(404).json({ message: 'no streams found in this category' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async updateVideo(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const loggedUserId = user.id
            const stream = await StreamModel.updateStream(parseInt(req.params.videoId), req.body, loggedUserId);
            res.json(stream);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async deleteVideo(req: Request, res: Response) {
        try {
            const user = req.user as User;
            const loggedUserId = user.id
            await StreamModel.deleteStream(parseInt(req.params.videoId), loggedUserId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}

export default new StreamController();
