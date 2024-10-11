-- DropForeignKey
ALTER TABLE "videos" DROP CONSTRAINT "videos_masterId_fkey";

-- AlterTable
ALTER TABLE "videos" ALTER COLUMN "masterId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
