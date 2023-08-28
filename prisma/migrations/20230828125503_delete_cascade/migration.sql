-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postingId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_postingId_fkey";

-- DropIndex
DROP INDEX "User_name_email_key";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postingId_fkey" FOREIGN KEY ("postingId") REFERENCES "Posting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_postingId_fkey" FOREIGN KEY ("postingId") REFERENCES "Posting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
