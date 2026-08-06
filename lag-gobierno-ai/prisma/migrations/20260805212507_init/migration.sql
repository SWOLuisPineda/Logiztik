-- CreateTable
CREATE TABLE "herramientas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "proveedor" TEXT NOT NULL,
    "categoria" TEXT,
    "nivelMaximo" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'Activa',
    "dpa" TEXT NOT NULL DEFAULT 'No aplica',
    "razonRetiro" TEXT,
    "creadoEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "herramientas_nombre_proveedor_key" ON "herramientas"("nombre", "proveedor");
