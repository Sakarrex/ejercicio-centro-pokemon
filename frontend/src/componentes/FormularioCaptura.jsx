import { useEffect, useState } from 'react'
import { capturarPokemon, listarEntrenadores } from '../servicios/api.js'

const REGIONES = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea']
const VACIO = { numero: '', nombre: '', tipos: '', nivel: '', region: '', entrenador: '' }

// A propósito, este formulario NO valida nada: manda lo que se escriba y deja
// que valide el esquema de Mongoose. Los mensajes que se ven debajo de cada
// campo son los que escribiste en el esquema (llegan en error.campos).
function FormularioCaptura({ onCapturado }) {
  const [form, setForm] = useState(VACIO)
  const [entrenadores, setEntrenadores] = useState([])
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Las opciones del <select> también salen de la base.
  useEffect(() => {
    listarEntrenadores()
      .then(setEntrenadores)
      .catch(() => setEntrenadores([]))
  }, [])

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setErrores({})
    setMensaje(null)

    // Solo mandamos los campos que tienen algo. Los números viajan como texto
    // ('25'): Mongoose los castea a Number. Los tipos van como array.
    const datos = {}
    for (const [campo, valor] of Object.entries(form)) {
      if (valor.trim() !== '') datos[campo] = valor
    }
    if (datos.tipos) datos.tipos = datos.tipos.split(',')

    try {
      const nuevo = await capturarPokemon(datos)
      setForm(VACIO)
      onCapturado(nuevo)
    } catch (err) {
      setErrores(err.campos)
      setMensaje(err.message)
    } finally {
      setEnviando(false)
    }
  }

  // Los errores de los tipos llegan como 'tipos.0', 'tipos.1'… (uno por elemento).
  const errorTipos = Object.entries(errores)
    .filter(([campo]) => campo.startsWith('tipos'))
    .map(([, msg]) => msg)
    .join(' · ')

  return (
    <form className="captura" onSubmit={enviar}>
      <h2>Capturar un Pokémon</h2>

      <label>
        Número de Pokédex
        <input name="numero" type="number" value={form.numero} onChange={cambiar} placeholder="133" />
        {errores.numero && <span className="error-campo">{errores.numero}</span>}
      </label>

      <label>
        Nombre
        <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Eevee" />
        {errores.nombre && <span className="error-campo">{errores.nombre}</span>}
      </label>

      <label>
        Tipos (separados por coma)
        <input name="tipos" value={form.tipos} onChange={cambiar} placeholder="normal" />
        {errorTipos && <span className="error-campo">{errorTipos}</span>}
      </label>

      <label>
        Nivel
        <input name="nivel" type="number" value={form.nivel} onChange={cambiar} placeholder="(si lo dejás vacío: 1)" />
        {errores.nivel && <span className="error-campo">{errores.nivel}</span>}
      </label>

      <label>
        Región
        <select name="region" value={form.region} onChange={cambiar}>
          <option value="">— Elegí una —</option>
          {REGIONES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        {errores.region && <span className="error-campo">{errores.region}</span>}
      </label>

      <label>
        Entrenador
        <select name="entrenador" value={form.entrenador} onChange={cambiar}>
          <option value="">🌿 Ninguno (salvaje)</option>
          {entrenadores.map((ent) => (
            <option key={ent._id} value={ent._id}>
              {ent.nombre}
            </option>
          ))}
        </select>
      </label>

      {mensaje && <p className="error-general">{mensaje}</p>}

      <button disabled={enviando}>{enviando ? 'Lanzando la Pokébola…' : 'Capturar'}</button>
    </form>
  )
}

export default FormularioCaptura
