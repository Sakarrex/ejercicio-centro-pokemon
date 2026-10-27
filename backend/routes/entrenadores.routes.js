import { Router } from 'express'
import { listarEntrenadores, obtenerEntrenador } from '../controllers/entrenadores.controller.js'

const router = Router()

router.get('/', listarEntrenadores)
router.get('/:id', obtenerEntrenador)

export default router
