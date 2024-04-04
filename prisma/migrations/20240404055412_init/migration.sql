-- DropForeignKey
ALTER TABLE "ApiPush" DROP CONSTRAINT "ApiPush_user_id_fkey";

-- AddForeignKey
ALTER TABLE "ApiPush" ADD CONSTRAINT "ApiPush_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
