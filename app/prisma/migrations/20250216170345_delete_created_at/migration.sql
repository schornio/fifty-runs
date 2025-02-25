/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ReadNotification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReadNotification" DROP COLUMN "createdAt",
ALTER COLUMN "readAt" SET DEFAULT CURRENT_TIMESTAMP;
