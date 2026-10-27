const ARTE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

function TarjetaPokemon({ pokemon, onSubirNivel, onLiberar }) {
  // Gracias a populate, entrenador llega como objeto: { _id, nombre, ciudad }.
  // Si el Pokémon es salvaje, el campo no existe (undefined); si se borró el
  // entrenador, populate deja null. Por eso el ?.
  const entrenador = pokemon.entrenador?.nombre

  return (
    <article className="tarjeta">
      <img src={`${ARTE}/${pokemon.numero}.png`} alt={pokemon.nombre} loading="lazy" />
      <p className="numero">#{String(pokemon.numero).padStart(4, '0')}</p>
      <h2>{pokemon.nombre}</h2>
      <p className="tipos">
        {pokemon.tipos.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
      <p className="datos">
        Nivel <b>{pokemon.nivel}</b> · {pokemon.region}
      </p>
      <p className="entrenador">{entrenador ? `🧢 ${entrenador}` : '🌿 Salvaje'}</p>
      <div className="acciones">
        <button onClick={() => onSubirNivel(pokemon)}>⬆️ Nivel</button>
        <button className="secundario" onClick={() => onLiberar(pokemon)}>
          🕊️ Liberar
        </button>
      </div>
    </article>
  )
}

export default TarjetaPokemon
