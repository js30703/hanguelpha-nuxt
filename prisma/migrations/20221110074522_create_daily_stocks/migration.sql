/*
  Warnings:

  - You are about to drop the `Verbs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerbsOnUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerbsOnUsers" DROP CONSTRAINT "VerbsOnUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerbsOnUsers" DROP CONSTRAINT "VerbsOnUsers_verbId_fkey";

-- DropTable
DROP TABLE "Verbs";

-- DropTable
DROP TABLE "VerbsOnUsers";

-- CreateTable
CREATE TABLE "DailyStocks" (
    "id" INT4 NOT NULL,
    "date" DATE NOT NULL,
    "stocks" STRING NOT NULL,

    CONSTRAINT "DailyStocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyStocks_date_key" ON "DailyStocks"("date");
