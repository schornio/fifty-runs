-- CreateTable
CREATE TABLE "GarminAuth" (
    "oauthToken" TEXT NOT NULL,
    "oauthTokenSecret" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GarminAuth_pkey" PRIMARY KEY ("oauthToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "GarminAuth_userId_key" ON "GarminAuth"("userId");

-- AddForeignKey
ALTER TABLE "GarminAuth" ADD CONSTRAINT "GarminAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
