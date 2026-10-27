import Pokemon from '../models/pokemon.model.js'
import { crearError } from '../middlewares/errorHandler.js'

export async function listarPokemones(req, res) {
  const pokemones = await Pokemon.find(req.query.region ? { region: req.query.region } : {})
    .populate('entrenador', 'nombre ciudad')
  res.json({ data: pokemones, error: null })
}

export async function obtenerPokemon(req, res) {
  const pokemon = await Pokemon.findById(req.params.id)
    .populate('entrenador', 'nombre ciudad')

  if (!pokemon) {
    throw crearError('No existe un Pokémon con ese id', 404)
  }

  res.json({ data: pokemon, error: null })
}

export async function crearPokemon(req, res) {
  const pokemon = await new Pokemon(req.body).save()
  res.status(201).json({ data: pokemon, error: null })
}


export async function actualizarPokemon(req, res) {
  const pokemon = await Pokemon.findByIdAndUpdate(
    req.params.id,
    req.body,
    { returnDocument: 'after', runValidators: true }
  )

  if (!pokemon) {
    throw crearError('No existe un Pokémon con ese id', 404)
  }

  res.json({ data: pokemon, error: null })
}

export async function borrarPokemon(req, res) {
  const pokemon = await Pokemon.findByIdAndDelete(req.params.id)

  if (!pokemon) {
    throw crearError('No existe un Pokémon con ese id', 404)
  }

  res.json({ data: pokemon, error: null })
}
