import { db } from "../db";
import { uploadedImages, type InsertUploadedImage, type UploadedImage } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createUploadedImage(image: InsertUploadedImage): Promise<UploadedImage>;
  getUploadedImage(id: string): Promise<UploadedImage | undefined>;
}

export class DatabaseStorage implements IStorage {
  async createUploadedImage(image: InsertUploadedImage): Promise<UploadedImage> {
    const [created] = await db.insert(uploadedImages).values(image).returning();
    return created;
  }

  async getUploadedImage(id: string): Promise<UploadedImage | undefined> {
    const [image] = await db.select().from(uploadedImages).where(eq(uploadedImages.id, id));
    return image;
  }
}

export const storage = new DatabaseStorage();
