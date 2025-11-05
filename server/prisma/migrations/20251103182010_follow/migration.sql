-- CreateTable
CREATE TABLE "_userfollows" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_userfollows_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_userfollows_B_index" ON "_userfollows"("B");

-- AddForeignKey
ALTER TABLE "_userfollows" ADD CONSTRAINT "_userfollows_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userfollows" ADD CONSTRAINT "_userfollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
