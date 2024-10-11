-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_pictureSetId_fkey";

-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_thumbnailSetId_fkey";

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_thumbnailSetId_fkey" FOREIGN KEY ("thumbnailSetId") REFERENCES "image_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pictureSetId_fkey" FOREIGN KEY ("pictureSetId") REFERENCES "image_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
