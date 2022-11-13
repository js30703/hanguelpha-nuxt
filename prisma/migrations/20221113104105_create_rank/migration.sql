-- CreateTable
CREATE TABLE "DailyRank" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "date" DATE NOT NULL,
    "rank" STRING NOT NULL,

    CONSTRAINT "DailyRank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyRank_date_key" ON "DailyRank"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRank_rank_key" ON "DailyRank"("rank");
