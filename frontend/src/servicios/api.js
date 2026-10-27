// ════════════════════════════════════════════════════════════════════════════
// SERVICIO DE LA API DEL CENTRO POKÉMON (ya está hecho: no hace falta tocarlo)
//
// Las URL son RELATIVAS (/api/...): el pedido va al mismo origen del front
// (Vite, puerto 5173) y el proxy de vite.config.js lo reenvía a Express (3000).
//
// La API siempre responde { data, error }. Esta función devuelve data si salió
// bien, o tira un Error con el mensaje que mandó la API (y, si fue un error de
// validación, con los mensajes por campo en error.campos).
// ════════════════════════════════════════════════════════════════════════════
async function pedir(url, opciones) {
  const respuesta = await fetch(url, opciones)

  // Si la API está apagada, el proxy responde un error que no es JSON.
  const cuerpo = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    const error = new Error(cuerpo?.error?.message ?? `La API respondió ${respuesta.status}. ¿Está corriendo?`)
    error.campos = cuerpo?.error?.campos ?? {}
    throw error
  }

  return cuerpo.data
}

function conJSON(method, datos) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  }
}

// GET /api/pokemones  o  GET /api/pokemones?region=Johto
export function listarPokemones(region) {
  const query = region ? `?region=${encodeURIComponent(region)}` : ''
  return pedir(`/api/pokemones${query}`)
}

// GET /api/entrenadores
export function listarEntrenadores() {
  return pedir('/api/entrenadores')
}

// POST /api/pokemones
export function capturarPokemon(datos) {
  return pedir('/api/pokemones', conJSON('POST', datos))
}

// PATCH /api/pokemones/:id  (el id es el _id que generó MongoDB)
export function actualizarPokemon(id, cambios) {
  return pedir(`/api/pokemones/${id}`, conJSON('PATCH', cambios))
}

// DELETE /api/pokemones/:id
export function liberarPokemon(id) {
  return pedir(`/api/pokemones/${id}`, { method: 'DELETE' })
}
