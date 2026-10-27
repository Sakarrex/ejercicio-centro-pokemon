import mongoose from 'mongoose'

// 🚧 PASO 1 · a. Conectar Mongoose con MongoDB
//
// - La connection string está en process.env.MONGODB_URI (sale del archivo .env).
// - Si la conexión sale bien: mostrá en consola el nombre de la base
//   (mongoose.connection.name).
// - Si falla: mostrá err.message y cortá el proceso con process.exit(1).
export async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`🟢 MongoDB conectado · base: centro-pokemon`)
  } catch (err) {
    console.error('❌ Error al conectar a la base de datos:', err.message)
    process.exit(1)
  }
}
