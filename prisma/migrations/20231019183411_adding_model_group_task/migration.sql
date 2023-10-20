/*
  Warnings:

  - Added the required column `groupId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "groupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "GroupTask" (
    "id" TEXT NOT NULL,
    "groupName" TEXT NOT NULL,

    CONSTRAINT "GroupTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupTask"("id") ON DELETE CASCADE ON UPDATE CASCADE;
