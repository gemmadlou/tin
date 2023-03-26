-- CreateTable
CREATE TABLE "ImportData" (
    "id" SERIAL NOT NULL,
    "importId" INTEGER NOT NULL,
    "row" JSONB NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportData" ADD CONSTRAINT "ImportData_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
