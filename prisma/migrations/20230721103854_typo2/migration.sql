/*
  Warnings:

  - You are about to drop the column `note` on the `RunningExercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RunningExercise" DROP COLUMN "note",
ADD COLUMN     "notes" TEXT;
