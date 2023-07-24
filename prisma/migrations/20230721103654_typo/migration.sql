/*
  Warnings:

  - You are about to drop the column `distanceInMeter` on the `RunningExercise` table. All the data in the column will be lost.
  - Added the required column `distanceInMeters` to the `RunningExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RunningExercise" DROP COLUMN "distanceInMeter",
ADD COLUMN     "distanceInMeters" INTEGER NOT NULL;
