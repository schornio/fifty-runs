-- CreateEnum
CREATE TYPE "DonationMultiplier" AS ENUM ('x1', 'x2', 'x5', 'x10');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "runDonationMultiplier" "DonationMultiplier";

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "amountInCent" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postingId" TEXT NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donation_postingId_key" ON "Donation"("postingId");

-- AddForeignKey
ALTER TABLE "Donation" ADD CONSTRAINT "Donation_postingId_fkey" FOREIGN KEY ("postingId") REFERENCES "Posting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
