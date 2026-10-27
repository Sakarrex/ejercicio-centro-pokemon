import { Schema, model } from 'mongoose'

// Este modelo ya viene hecho: usalo de ejemplo para escribir el de Pokémon.

const entrenadorSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del entrenador es obligatorio'],
    trim: true,
  },
  ciudad: {
    type: String,
    trim: true,
  },
  medallas: {
    type: Number,
    min: [0, 'Las medallas no pueden ser negativas'],
    max: [8, 'Un entrenador tiene como máximo 8 medallas'],
    default: 0,
  },
})

// model(nombre, esquema, colección)
// - 'Entrenador' es el nombre del MODELO: es el que va en el ref de otros esquemas.
// - 'entrenadores' es el nombre de la COLECCIÓN. Si no lo pasamos, Mongoose
//   pluraliza en inglés: 'Entrenador' → 'entrenadors'.
export default model('Entrenador', entrenadorSchema, 'entrenadores')
