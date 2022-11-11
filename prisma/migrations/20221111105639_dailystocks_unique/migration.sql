/*
  Warnings:

  - A unique constraint covering the columns `[stocks]` on the table `DailyStocks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DailyStocks_stocks_key" ON "DailyStocks"("stocks");
