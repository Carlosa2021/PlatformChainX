/*
  Warnings:

  - A unique constraint covering the columns `[txHash]` on the table `Investment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Investment_txHash_key" ON "Investment"("txHash");
