import mssql from "mssql";

const config = {
  user: "App",
  password: "Vision123",
  server: "vision10.database.windows.net",
  database: "App",
  options: { // ✅ minúsculo!
    encrypt: true, // Na nuvem tem que estar em true
    trustServerCertificate: false //Local tem que estar como true
  }
}
async function conectar() {
  try {
    await mssql.connect(config);
    console.log("Conectei com o bd!");
  } catch (error) {
    console.error(error.message);
  }
}

export {conectar}