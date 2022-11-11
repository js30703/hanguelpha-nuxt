/*
  Warnings:

  - You are about to alter the column `id` on the `DailyStocks` table. The data in that column will be cast from `Int` to `BigInt`. This cast may fail. Please make sure the data in the column can be cast.

*/
-- RedefineTables
CREATE TABLE "_prisma_new_DailyStocks" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "date" DATE NOT NULL,
    "stocks" STRING NOT NULL,

    CONSTRAINT "DailyStocks_pkey" PRIMARY KEY ("id")
);
DROP INDEX "DailyStocks_date_key";
INSERT INTO "_prisma_new_DailyStocks" ("date","id","stocks") SELECT "date","id","stocks" FROM "DailyStocks";
DROP TABLE "DailyStocks" CASCADE;
ALTER TABLE "_prisma_new_DailyStocks" RENAME TO "DailyStocks";
CREATE UNIQUE INDEX "DailyStocks_date_key" ON "DailyStocks"("date");
