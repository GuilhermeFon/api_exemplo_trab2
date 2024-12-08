/*
  Warnings:

  - The `status` column on the `reservas` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "StatusReservaEnum" AS ENUM ('PENDENTE', 'CONFIRMADA', 'CANCELADA');

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "status",
ADD COLUMN     "status" "StatusReservaEnum" NOT NULL DEFAULT 'PENDENTE';

-- DropEnum
DROP TYPE "StatusReserva";
