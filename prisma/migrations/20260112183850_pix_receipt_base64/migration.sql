/*
  Warnings:

  - You are about to drop the column `fileName` on the `PixReceipt` table. All the data in the column will be lost.
  - You are about to drop the column `fileSize` on the `PixReceipt` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `PixReceipt` table. All the data in the column will be lost.
  - Added the required column `base64` to the `PixReceipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PixReceipt" DROP COLUMN "fileName",
DROP COLUMN "fileSize",
DROP COLUMN "fileUrl",
ADD COLUMN     "base64" TEXT NOT NULL;
