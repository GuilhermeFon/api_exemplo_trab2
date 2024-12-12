/*
  Warnings:

  - The values [CANCELADA] on the enum `StatusReservaEnum` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusReservaEnum_new" AS ENUM ('PENDENTE', 'CONFIRMADO', 'CANCELADO', 'FINALIZADO');
ALTER TABLE "reservas" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "reservas" ALTER COLUMN "status" TYPE "StatusReservaEnum_new" USING ("status"::text::"StatusReservaEnum_new");
ALTER TYPE "StatusReservaEnum" RENAME TO "StatusReservaEnum_old";
ALTER TYPE "StatusReservaEnum_new" RENAME TO "StatusReservaEnum";
DROP TYPE "StatusReservaEnum_old";
ALTER TABLE "reservas" ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
COMMIT;
