-- CreateEnum
CREATE TYPE "Rate" AS ENUM ('LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "dislikesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "ratings" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "Rate" NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" UUID NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Subscriptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ratings_userId_videoId_key" ON "ratings"("userId", "videoId");

-- CreateIndex
CREATE UNIQUE INDEX "_Subscriptions_AB_unique" ON "_Subscriptions"("A", "B");

-- CreateIndex
CREATE INDEX "_Subscriptions_B_index" ON "_Subscriptions"("B");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "videos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Subscriptions" ADD CONSTRAINT "_Subscriptions_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Subscriptions" ADD CONSTRAINT "_Subscriptions_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
