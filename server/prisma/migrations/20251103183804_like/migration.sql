-- CreateTable
CREATE TABLE "_postlikes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_postlikes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_postlikes_B_index" ON "_postlikes"("B");

-- AddForeignKey
ALTER TABLE "_postlikes" ADD CONSTRAINT "_postlikes_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_postlikes" ADD CONSTRAINT "_postlikes_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
