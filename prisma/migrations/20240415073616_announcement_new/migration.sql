-- CreateTable
CREATE TABLE "Announcements" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "isShow" INTEGER NOT NULL,

    CONSTRAINT "Announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Announcements_user_id_key" ON "Announcements"("user_id");

-- AddForeignKey
ALTER TABLE "Announcements" ADD CONSTRAINT "Announcements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
