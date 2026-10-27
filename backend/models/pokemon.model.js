import { Schema, model } from 'mongoose'

const TIPOS = [
  'normal', 'fuego', 'agua', 'planta', 'eléctrico', 'hielo', 'lucha', 'veneno', 'tierra',
  'volador', 'psíquico', 'bicho', 'roca', 'fantasma', 'dragón', 'siniestro', 'acero', 'hada',
]

const REGIONES = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea']

// 🚧 PASO 2 · El esquema de Pokémon. La tabla con los campos y las reglas está
// en el README. Mirá models/entrenador.model.js de ejemplo.
//
// Pistas:
// - Un mensaje propio se escribe como [valor, 'mensaje']: min: [1, 'El nivel mínimo es 1']
// - En enum, el mensaje va en un objeto: enum: { values: REGIONES, message: '"{VALUE}" no es…' }
// - tipos es un array de strings: tipos: [{ type: String, …reglas de cada elemento… }]
// - La referencia al entrenador: { type: Schema.Types.ObjectId, ref: '…' }
const pokemonSchema = new Schema({
  numero: {
    type: Number,
    required: [true, 'El número de Pokédex es obligatorio'],
    unique: true,
    min: [1, 'El número de Pokédex va de 1 a 1025'],
    max: [1025, 'El número de Pokédex va de 1 a 1025'],
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true,
    trim: true,
  },
  tipos: [{
    type: String,
    trim: true,
    lowercase: true,
    enum: {
      values: TIPOS,
      message: '"{VALUE}" no es un tipo válido',
    },
  }],
  nivel: {
    type: Number,
    min: [1, 'El nivel mínimo es 1'],
    max: [100, 'El nivel máximo es 100'],
    default: 1,
  },
  region: {
    type: String,
    required: [true, 'La región es obligatoria'],
    enum: {
      values: REGIONES,
      message: '"{VALUE}" no es una región válida',
    },
  },
  entrenador: {
    type: Schema.Types.ObjectId,
    ref: 'Entrenador'
  }
})

// 🚧 ¿Cómo se va a llamar la colección? Sin el tercer argumento, Mongoose
// pluraliza en inglés: 'Pokemon' → 'pokemons'. Queremos 'pokemones'.
export default model('Pokemon', pokemonSchema, 'pokemones')
