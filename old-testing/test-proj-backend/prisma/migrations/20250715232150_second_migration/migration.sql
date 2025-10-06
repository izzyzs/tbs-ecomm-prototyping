/*
  Warnings:

  - You are about to drop the `_AddressToOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AddressToOrder" DROP CONSTRAINT "_AddressToOrder_A_fkey";

-- DropForeignKey
ALTER TABLE "_AddressToOrder" DROP CONSTRAINT "_AddressToOrder_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address_id" INTEGER;

-- DropTable
DROP TABLE "_AddressToOrder";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
