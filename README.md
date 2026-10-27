# 🏥 Ejercicio · Centro Pokémon: la API con MongoDB y Mongoose

⏱ **35 minutos** · 🛠 Express 5 + Mongoose 9 (backend) · Vite + React (frontend, ya hecho) · Node 22.12+ · MongoDB local o Atlas

## La situación

El Centro Pokémon tiene su catálogo en React y su API en Express… pero la API no tiene base de datos: el modelo de Pokémon está vacío y el controller no hace nada. Tu misión: **conectar la API a MongoDB con Mongoose, escribir el esquema con sus validaciones y la relación con el entrenador, y completar el CRUD**. Cuando termines, el catálogo funciona solo.

Ya está hecho: las rutas, el modelo y el controller de **entrenadores** (usalos de ejemplo), la semilla con datos de prueba y **todo el frontend**. Los archivos que tenés que completar tienen 🚧.

```
backend/
├── config/db.js                        🚧 PASO 1
├── server.js                           🚧 PASO 1
├── models/pokemon.model.js             🚧 PASO 2
├── models/entrenador.model.js          ✅ ejemplo
├── controllers/pokemones.controller.js 🚧 PASO 3
├── controllers/entrenadores.controller.js ✅ ejemplo
├── middlewares/errorHandler.js         🚧 PASO 4
├── routes/                             ✅
└── semilla.js                          ✅ npm run semilla
frontend/                               ✅ el catálogo (no se toca)
```

## Para arrancar

Dos terminales, una para cada proyecto:

```bash
# Terminal 1 · la API
cd backend
npm install
cp .env.example .env    # en Windows: copy .env.example .env
npm run dev             # → http://localhost:3000/api/pokemones

# Terminal 2 · el catálogo
cd frontend
npm install
npm run dev             # → http://localhost:5173
```

## Pasos

**1 · Conectar (`config/db.js` y `server.js`).**
- a. Abrí `.env` y dejá la `MONGODB_URI` local (`mongodb://127.0.0.1:27017/centro-pokemon`) o la de tu cluster de Atlas.
- b. En `conectarDB`, conectá con `mongoose.connect(…)` usando esa variable. Si sale bien, mostrá el nombre de la base; si falla, mostrá el error y cortá con `process.exit(1)`.
- c. En `server.js`, que la API empiece a escuchar **recién cuando la base esté conectada**.

👉 En la terminal tiene que aparecer `🟢 MongoDB conectado · base: centro-pokemon`.
 
**2 · El esquema (`models/pokemon.model.js`).**

| Campo | Tipo | Reglas (con estos mensajes) |
|---|---|---|
| `numero` | Number | obligatorio (`El número de Pokédex es obligatorio`) · entre 1 y 1025 (`El número de Pokédex va de 1 a 1025`) · único |
| `nombre` | String | obligatorio (`El nombre es obligatorio`) · sin espacios a los costados |
| `tipos` | array de String | cada uno: sin espacios a los costados, en minúscula, y de la lista `TIPOS` (`"{VALUE}" no es un tipo válido`) |
| `nivel` | Number | entre 1 y 100 (`El nivel mínimo es 1` · `El nivel máximo es 100`) · por defecto, 1 |
| `region` | String | obligatoria (`La región es obligatoria`) · de la lista `REGIONES` (`"{VALUE}" no es una región válida`) |
| `entrenador` | ObjectId | referencia al modelo `Entrenador` · no es obligatorio (los salvajes no tienen) |

Y que la colección se llame `pokemones`. Después corré, en la terminal 1 (cortando el `dev` con Ctrl + C o en otra terminal):

```bash
npm run semilla     # 🌱 Semilla lista: 3 entrenadores y 13 Pokémon en centro-pokemon
```

Si querés, mirá los datos en Compass: ¿qué guarda el campo `entrenador` de Pikachu?

**3 · El CRUD (`controllers/pokemones.controller.js`).**

| | Ruta | Método de Mongoose | Responde |
|---|---|---|---|
| a | `GET /api/pokemones` (y `?region=Johto`) | `find(filtro)` + `populate('entrenador', 'nombre ciudad')` | 200 |
| b | `GET /api/pokemones/:id` | `findById` + `populate` | 200 · 404 |
| c | `POST /api/pokemones` | `new Pokemon(…)` + `save()` | 201 |
| d | `PATCH /api/pokemones/:id` | `findByIdAndUpdate` con `returnDocument: 'after'` y `runValidators: true` | 200 · 404 |
| e | `DELETE /api/pokemones/:id` | `findByIdAndDelete` | 200 · 404 |

**4 · Los errores de Mongoose (`middlewares/errorHandler.js`).** `ValidationError` → 400 con los mensajes por campo, `CastError` → 400, `11000` → 409. El detalle está en los comentarios del archivo.

**5 · Probalo desde el catálogo** (http://localhost:5173): filtrá por región, subí de nivel, liberá y capturá Pokémon nuevos.

## ✅ Listo cuando…

- El catálogo muestra los 13 Pokémon, y los de Ash, Misty y Brock dicen el **nombre** del entrenador. (Si todos dicen 🌿 Salvaje, ¿qué te falta?)
- "Kanto" y "Johto" filtran.
- Capturar con el formulario vacío muestra los tres mensajes de tu esquema; con el número 25, avisa que ya existe.
- Capturar con tipos `Normal ` (mayúscula y espacio) guarda `normal`; con `electrico` (sin tilde), muestra tu mensaje.
- ⬆️ en Mewtwo (nivel 100) muestra `El nivel máximo es 100`.
- `http://localhost:3000/api/pokemones/abc` responde 400, y `http://localhost:3000/api/pokemones/000000000000000000000000` responde 404.

## ➕ Plus

1. Filtro por tipo: `GET /api/pokemones?tipo=fuego`. ¿Cómo se filtra un campo que es un array?
2. `POST /api/pokemones/:id/entrenar`, que sube 1 nivel con `$inc` (sin leer el nivel antes). Probalo con Mewtwo: ¿lo frena `runValidators`?

## 🧠 Para pensar

1. Sacá `runValidators: true` y tocá ⬆️ en Mewtwo. ¿Qué pasa? ¿Y si sacás `returnDocument: 'after'`?
2. Capturá un Pokémon mandando también `{ "shiny": true }` (con Postman o curl). ¿Se guarda? ¿Por qué?
3. Borrá a Ash desde Compass y recargá el catálogo. ¿Qué muestra Pikachu? ¿Qué hay en su campo `entrenador` en la base?
4. ¿Por qué el formulario del catálogo no valida nada, y aun así no se puede guardar un Pokémon inválido?
