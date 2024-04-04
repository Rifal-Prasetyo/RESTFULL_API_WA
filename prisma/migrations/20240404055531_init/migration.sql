-- DropForeignKey
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_user_id_fkey";

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
