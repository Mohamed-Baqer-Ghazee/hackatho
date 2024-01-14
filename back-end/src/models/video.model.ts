import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class StreamModel {
    async createStream(streamData: { title: string; description: string; categoriesIds: number[];video:string; thumbnail:string}, loggedUserId: number) {
        try {
            const { categoriesIds, ...otherData } = streamData;
        
            // Create the stream instance first
            const stream = await prisma.stream.create({
                data: {
                    ...otherData,
                    userId: loggedUserId
                },
            });
        
            // Then, link the stream with categories
            const categoryConnections = categoriesIds.map(categoryId => {
                return prisma.streamCategory.create({
                    data: {
                        streamId: stream.id,
                        categoryId: categoryId
                    }
                });
            });
        
            // Execute all category connections
            await Promise.all(categoryConnections);
        
            return stream;
        } catch (error) {
            throw new Error("Error creating stream");
        }
    }

    async GetAllStreams() {
        try {
            return await prisma.stream.findMany();
        } catch (error) {
            throw new Error("Error getting all streams");
        }
    }

    async findStreamById(streamId: number) {
        try {
            return await prisma.stream.findFirst({
                where: { id: streamId }
            });
        } catch (error) {
            throw new Error("Error finding stream by ID");
        }
    }

    async findStreamsByCategoryId(categoryId: number) {
        try {
            return await prisma.stream.findMany({
                where: { 
                    categories: {
                        some: {
                            categoryId
                        }
                    }}
            });
        } catch (error) {
            throw new Error("Error finding streams by category ID");
        }
    }

    async updateStream(streamId: number, updateData: { title?: string; description?: string;},loggedUserId:number) {
        try {
            const stream = await prisma.stream.findUnique({
                where: { id: streamId }
            });

            // Check if the stream exists and if the user is the owner
            if (!stream) {
                throw new Error("Stream not found.");
            }

            if (stream.userId !== loggedUserId) {
                throw new Error("You are not authorized to update this stream.");
            }

            return await prisma.stream.update({
                where: { id: streamId},
                data: updateData
            });
        } catch (error) {
            throw new Error("Error updating stream");
        }
    }

    async deleteStream(streamId: number,loggedUserId:number) {
        try {
            const stream = await prisma.stream.findUnique({
                where: { id: streamId }
            });

            // Check if the stream exists and if the user is the owner
            if (!stream) {
                throw new Error("Stream not found.");
            }

            if (stream.userId !== loggedUserId) {
                throw new Error("You are not authorized to delete this stream.");
            }

            // Proceed with the deletion
            return await prisma.stream.delete({
                where: { id: streamId }
            });
        } catch (error) {
            throw new Error("Error deleting stream");
        }
    }
}

export default new StreamModel();
