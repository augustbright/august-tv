/*
  Warnings:

  - A unique constraint covering the columns `[customThumbnailSetId]` on the table `videos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "customThumbnailSetId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "videos_customThumbnailSetId_key" ON "videos"("customThumbnailSetId");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_customThumbnailSetId_fkey" FOREIGN KEY ("customThumbnailSetId") REFERENCES "image_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
