import { Router } from 'express'
import {
  listarPokemones,
  obtenerPokemon,
  crearPokemon,
  actualizarPokemon,
  borrarPokemon,
} from '../controllers/pokemones.controller.js'

const router = Router()

router.get('/', listarPokemones)
router.get('/:id', obtenerPokemon)
router.post('/', crearPokemon)
router.patch('/:id', actualizarPokemon)
router.delete('/:id', borrarPokemon)

export default router
