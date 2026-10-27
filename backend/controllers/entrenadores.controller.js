import Entrenador from '../models/entrenador.model.js'
import Pokemon from '../models/pokemon.model.js'
import { crearError } from '../middlewares/errorHandler.js'

// Este controller ya viene hecho: miralo de ejemplo antes de escribir el de Pokémon.

// GET /api/entrenadores
export async function listarEntrenadores(req, res) {
  const entrenadores = await Entrenador.find()
  res.json({ data: entrenadores, error: null })
}

// GET /api/entrenadores/:id → el entrenador y sus Pokémon
//
// La relación se guarda de un solo lado: cada Pokémon tiene el _id de su
// entrenador, pero el entrenador NO tiene una lista de Pokémon. Para ir "del
// otro lado", se busca en pokemones por ese campo: find({ entrenador: id }).
// El segundo argumento de find es la proyección, como en mongosh, pero en
// formato texto: 'numero nombre nivel' = { numero: 1, nombre: 1, nivel: 1 }.
export async function obtenerEntrenador(req, res) {
  const entrenador = await Entrenador.findById(req.params.id)

  if (!entrenador) {
    throw crearError('No existe un entrenador con ese id', 404)
  }

  const pokemones = await Pokemon.find({ entrenador: entrenador._id }, 'numero nombre nivel')

  // toObject() convierte el documento de Mongoose en un objeto común, para
  // poder sumarle el campo pokemones (que no está en el esquema de Entrenador).
  res.json({ data: { ...entrenador.toObject(), pokemones }, error: null })
}
