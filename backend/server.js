import express from 'express'
import { conectarDB } from './config/db.js'
import pokemonesRouter from './routes/pokemones.routes.js'
import entrenadoresRouter from './routes/entrenadores.routes.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

app.use(express.json())

app.use('/api/pokemones', pokemonesRouter)
app.use('/api/entrenadores', entrenadoresRouter)
app.use(errorHandler)
const PORT = process.env.PORT ?? 3000

try {
  await conectarDB()
} catch (err) {
  console.error('❌ Error al conectar a la base de datos:', err.message)
  process.exit(1)
}



app.listen(PORT, () => {
  console.log(`🚀 API en http://localhost:${PORT}/api/pokemones`)
})
