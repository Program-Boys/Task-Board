/*
  Warnings:

  - A unique constraint covering the columns `[groupName]` on the table `GroupTask` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GroupTask_groupName_key" ON "GroupTask"("groupName");
