/*
  Warnings:

  - You are about to drop the column `servicoId` on the `avaliacoes` table. All the data in the column will be lost.
  - You are about to drop the column `servicoId` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the `servicos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `prestadorId` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avaliacoes" DROP CONSTRAINT "avaliacoes_servicoId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_servicoId_fkey";

-- DropForeignKey
ALTER TABLE "servicos" DROP CONSTRAINT "servicos_prestadorId_fkey";

-- AlterTable
ALTER TABLE "avaliacoes" DROP COLUMN "servicoId";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "servicoId",
ADD COLUMN     "prestadorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "servicos";

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "prestadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
