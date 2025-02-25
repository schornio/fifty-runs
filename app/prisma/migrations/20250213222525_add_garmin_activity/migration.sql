/*
  Warnings:

  - A unique constraint covering the columns `[garminActivityId]` on the table `RunningExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RunningExercise" ADD COLUMN     "garminActivityId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RunningExercise_garminActivityId_key" ON "RunningExercise"("garminActivityId");
