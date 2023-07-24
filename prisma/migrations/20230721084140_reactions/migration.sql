-- AlterTable
ALTER TABLE "RunningExercise" ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'protected';

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_exerciseId_key" ON "Reaction"("userId", "exerciseId");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "RunningExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
