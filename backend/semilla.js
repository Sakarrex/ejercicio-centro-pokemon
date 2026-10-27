// Carga datos de prueba: borra las dos colecciones y las vuelve a llenar.
// Se corre con: npm run semilla   (ya viene hecho: no hace falta tocarlo)
//
// Usa los modelos, así que los datos pasan por el esquema: si tu esquema de
// Pokémon tiene un error, lo vas a ver acá.
import mongoose from 'mongoose'
import Entrenador from './models/entrenador.model.js'
import Pokemon from './models/pokemon.model.js'

try {
  await mongoose.connect(process.env.MONGODB_URI)

  await Pokemon.deleteMany({})
  await Entrenador.deleteMany({})

  // insertMany devuelve los documentos creados, cada uno con su _id.
  const [ash, misty, brock] = await Entrenador.insertMany([
    { nombre: 'Ash', ciudad: 'Pueblo Paleta', medallas: 8 },
    { nombre: 'Misty', ciudad: 'Ciudad Celeste', medallas: 3 },
    { nombre: 'Brock', ciudad: 'Ciudad Plateada', medallas: 2 },
  ])

  // La relación: cada Pokémon guarda el _id de su entrenador.
  const pokemones = await Pokemon.insertMany([
    { numero: 25, nombre: 'Pikachu', tipos: ['eléctrico'], nivel: 12, region: 'Kanto', entrenador: ash._id },
    { numero: 1, nombre: 'Bulbasaur', tipos: ['planta', 'veneno'], nivel: 5, region: 'Kanto', entrenador: ash._id },
    { numero: 4, nombre: 'Charmander', tipos: ['fuego'], nivel: 8, region: 'Kanto', entrenador: ash._id },
    { numero: 120, nombre: 'Staryu', tipos: ['agua'], nivel: 14, region: 'Kanto', entrenador: misty._id },
    { numero: 54, nombre: 'Psyduck', tipos: ['agua'], nivel: 9, region: 'Kanto', entrenador: misty._id },
    { numero: 175, nombre: 'Togepi', tipos: ['hada'], nivel: 2, region: 'Johto', entrenador: misty._id },
    { numero: 95, nombre: 'Onix', tipos: ['roca', 'tierra'], nivel: 15, region: 'Kanto', entrenador: brock._id },
    { numero: 74, nombre: 'Geodude', tipos: ['roca', 'tierra'], nivel: 10, region: 'Kanto', entrenador: brock._id },
    // Salvajes: sin entrenador
    { numero: 39, nombre: 'Jigglypuff', tipos: ['normal', 'hada'], nivel: 10, region: 'Kanto' },
    { numero: 152, nombre: 'Chikorita', tipos: ['planta'], nivel: 5, region: 'Johto' },
    { numero: 155, nombre: 'Cyndaquil', tipos: ['fuego'], nivel: 7, region: 'Johto' },
    { numero: 158, nombre: 'Totodile', tipos: ['agua'], nivel: 9, region: 'Johto' },
    { numero: 150, nombre: 'Mewtwo', tipos: ['psíquico'], nivel: 100, region: 'Kanto' },
  ])

  // Si el esquema de Pokémon todavía está vacío, el modo strict descarta todos
  // los campos y se guardan documentos vacíos (sin error).
  if (!pokemones[0].nombre) {
    console.warn('⚠️  Los Pokémon se guardaron vacíos: completá el esquema (PASO 2) y volvé a correr la semilla.')
  }

  console.log(`🌱 Semilla lista: 3 entrenadores y ${pokemones.length} Pokémon en ${mongoose.connection.name}`)
} catch (err) {
  console.error('🔴 La semilla falló:', err.message)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
