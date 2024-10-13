-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "parentJobId" UUID;

-- CreateIndex
CREATE INDEX "jobs_parentJobId_idx" ON "jobs"("parentJobId");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_parentJobId_fkey" FOREIGN KEY ("parentJobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
