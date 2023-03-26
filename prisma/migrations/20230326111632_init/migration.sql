/*
  Warnings:

  - You are about to drop the column `name` on the `Import` table. All the data in the column will be lost.
  - Added the required column `mimetype` to the `Import` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Import` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Import` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Import" DROP COLUMN "name",
ADD COLUMN     "mimetype" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "size" INTEGER NOT NULL;
