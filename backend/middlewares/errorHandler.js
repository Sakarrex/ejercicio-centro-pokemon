// Crea un error con un status HTTP, para tirarlo con throw desde los controllers.
export function crearError(message, status = 500) {
  const error = new Error(message)
  error.status = status
  return error
}

// Express reconoce un middleware de errores porque tiene CUATRO parámetros.
export function errorHandler(err, req, res, next) {
  const status =
    err.name === 'ValidationError' ? 400 :
    err.name === 'CastError' ? 400 :
    err.code === 11000 ? 409 :
    err.status || 500

  console.error('[Error API]', {
    method: req.method,
    path: req.originalUrl,
    status,
    name: err.name,
    message: err.message,
    stack: err.stack,
  })

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      data: null,
      error: {
        message: 'Hay datos inválidos',
        campos: Object.fromEntries(
          Object.entries(err.errors).map(([campo, error]) => [campo, error.message])
        ),
      },
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      data: null,
      error: { message: `"${err.value}" no es un valor válido para ${err.path}` },
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      data: null,
      error: {
        message: `Ya existe un registro con ${Object.keys(err.keyValue)[0]} = ${Object.values(err.keyValue)[0]}`,
      },
    });
  }
 
  res.status(status).json({
    data: null,
    error: {
      message: status >= 500 ? 'Error interno del servidor' : err.message || 'Error en la solicitud',
    },
  })
}
