-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "importMapId" INTEGER;

-- CreateTable
CREATE TABLE "Mapper" (
    "id" SERIAL NOT NULL,
    "config" JSONB NOT NULL,
    "schemaId" INTEGER NOT NULL,

    CONSTRAINT "Mapper_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Import" ADD CONSTRAINT "Import_importMapId_fkey" FOREIGN KEY ("importMapId") REFERENCES "Mapper"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mapper" ADD CONSTRAINT "Mapper_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
