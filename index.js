const XLSX = require("xlsx");
const fs = require("fs");

// 📂 Lee el archivo Excel (cámbialo por el tuyo)
const workbook = XLSX.readFile("datos.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convierte a JSON (manteniendo vacíos como "")
const data = XLSX.utils.sheet_to_json(sheet, { defval: "" });

// Nombre de la tabla (puedes modificarlo o pasarlo como argumento)
// const tableName = "ticlientesnuevo";
const tableName = sheetName;

// Obtener columnas desde encabezados del Excel
const columns = Object.keys(data[0]);

// Función para dar formato a cada valor
function formatValue(value) {
  // if (value === "" || value === null || value === undefined) {
  //   return "''";
  // }
  // if (typeof value === "number") {
  //   console.log(value);
  //   return value;
  // }
  // if (!isNaN(value) && value !== "") {
  //   return value;
  // }
  return `'${String(value).replace(/'/g, "''")}'`;
}

// Construir los VALUES
const values = data.map((row) => {
  const fila = columns.map((col) => formatValue(row[col]));
  return `(${fila.join(", ")})`;
});

// Generar SQL final
const sql = `INSERT INTO ${tableName} (${columns.join(
  ", "
)}) VALUES\n${values.join(",\n")};`;

// Guardar en archivo
fs.writeFileSync("output.sql", sql);

console.log("✅ Archivo SQL generado: output.sql");
