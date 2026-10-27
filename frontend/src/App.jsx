import { useEffect, useState } from 'react'
import { actualizarPokemon, liberarPokemon, listarPokemones } from './servicios/api.js'
import TarjetaPokemon from './componentes/TarjetaPokemon.jsx'
import FormularioCaptura from './componentes/FormularioCaptura.jsx'

const REGIONES = ['Todas', 'Kanto', 'Johto']

function App() {
  const [pokemones, setPokemones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [region, setRegion] = useState('Todas')
  const [aviso, setAviso] = useState(null) // mensaje de la última acción
  const [recargar, setRecargar] = useState(0) // se incrementa para volver a pedir la lista

  // Pide el catálogo a NUESTRA API (que le pide a MongoDB con Mongoose).
  // Se repite cuando cambia la región o cuando algo cambió en la base.
  useEffect(() => {
    let ignorar = false

    async function cargar() {
      setCargando(true)
      setError(null)
      try {
        const lista = await listarPokemones(region === 'Todas' ? null : region)
        if (!ignorar) setPokemones(lista)
      } catch (err) {
        if (!ignorar) setError(err.message)
      } finally {
        if (!ignorar) setCargando(false)
      }
    }

    cargar()
    return () => {
      ignorar = true
    }
  }, [region, recargar])

  async function subirNivel(pokemon) {
    try {
      const actualizado = await actualizarPokemon(pokemon._id, { nivel: pokemon.nivel + 1 })
      setAviso({ tipo: 'ok', texto: `⬆️ ${actualizado.nombre} subió al nivel ${actualizado.nivel}` })
      setRecargar((n) => n + 1)
    } catch (err) {
      // Si la API validó (runValidators), acá llega "El nivel máximo es 100".
      const detalle = Object.values(err.campos).join(' · ')
      setAviso({ tipo: 'error', texto: detalle || err.message })
    }
  }

  async function liberar(pokemon) {
    try {
      const liberado = await liberarPokemon(pokemon._id)
      setAviso({ tipo: 'ok', texto: `🕊️ Liberaste a ${liberado.nombre}` })
      setRecargar((n) => n + 1)
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message })
    }
  }

  function alCapturar(nuevo) {
    setAviso({ tipo: 'ok', texto: `🎉 ¡${nuevo.nombre} fue capturado!` })
    setRecargar((n) => n + 1)
  }

  return (
    <>
      <header className="cabecera">
        <h1 className="logo">Centro Pokémon</h1>
        <nav className="filtros">
          {REGIONES.map((r) => (
            <button key={r} className={r === region ? 'activo' : ''} onClick={() => setRegion(r)}>
              {r}
            </button>
          ))}
        </nav>
      </header>

      <main className="contenido">
        {aviso && (
          <p className={`aviso ${aviso.tipo}`} onClick={() => setAviso(null)}>
            {aviso.texto}
          </p>
        )}

        {cargando && <p className="estado">Cargando el catálogo…</p>}
        {error && <p className="estado error">{error}</p>}

        {!cargando && !error && (
          <>
            <p className="subtitulo">{pokemones.length} Pokémon en la base</p>
            <section className="grilla">
              {/* key: el _id de MongoDB (no hay campo id) */}
              {pokemones.map((p) => (
                <TarjetaPokemon key={p._id} pokemon={p} onSubirNivel={subirNivel} onLiberar={liberar} />
              ))}
            </section>
          </>
        )}

        <FormularioCaptura onCapturado={alCapturar} />
      </main>
    </>
  )
}

export default App
