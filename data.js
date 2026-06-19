var fs = require('fs');
var path = require('path');

var tareasPath = path.join(__dirname, 'tareas.json');
var usuariosPath = path.join(__dirname, 'usuarios.json');

function leerTareas() {
  var raw = fs.readFileSync(tareasPath, 'utf8');
  return JSON.parse(raw);
}

function leerUsuarios() {
  var raw = fs.readFileSync(usuariosPath, 'utf8');
  return JSON.parse(raw);
}

function getCategorias() {
  var tareas = leerTareas();
  var categorias = [];
  var mapa = {};
  tareas.forEach(function (t) {
    if (!mapa[t.categoria]) {
      mapa[t.categoria] = true;
      categorias.push(t.categoria);
    }
  });
  return categorias.sort();
}

function getTareasHoyYFuturo() {
  var tareas = leerTareas();
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  var hoyStr = formatearFecha(hoy);

  var filtradas = tareas.filter(function (t) {
    return t.fecha >= hoyStr;
  });

  filtradas.sort(function (a, b) {
    if (a.fecha === hoyStr && b.fecha !== hoyStr) return -1;
    if (a.fecha !== hoyStr && b.fecha === hoyStr) return 1;
    return a.fecha.localeCompare(b.fecha);
  });

  return filtradas;
}

function getTareasVencidas() {
  var tareas = leerTareas();
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  var hoyStr = formatearFecha(hoy);

  var filtradas = tareas.filter(function (t) {
    return t.fecha < hoyStr;
  });

  filtradas.sort(function (a, b) {
    return b.fecha.localeCompare(a.fecha);
  });

  return filtradas;
}

function getTareasPorCategoria(nombre) {
  var tareas = leerTareas();
  var hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  var hoyStr = formatearFecha(hoy);

  var filtradas = tareas.filter(function (t) {
    return t.categoria.toLowerCase() === nombre.toLowerCase();
  });

  var hoyYFuturo = filtradas.filter(function (t) {
    return t.fecha >= hoyStr;
  });
  hoyYFuturo.sort(function (a, b) {
    if (a.fecha === hoyStr && b.fecha !== hoyStr) return -1;
    if (a.fecha !== hoyStr && b.fecha === hoyStr) return 1;
    return a.fecha.localeCompare(b.fecha);
  });

  var vencidas = filtradas.filter(function (t) {
    return t.fecha < hoyStr;
  });
  vencidas.sort(function (a, b) {
    return b.fecha.localeCompare(a.fecha);
  });

  return { hoyYFuturo: hoyYFuturo, vencidas: vencidas };
}

function getTareaById(id) {
  var tareas = leerTareas();
  var numId = parseInt(id, 10);
  for (var i = 0; i < tareas.length; i++) {
    if (tareas[i].id === numId) {
      return tareas[i];
    }
  }
  return null;
}

function getUsuarioById(id) {
  var usuarios = leerUsuarios();
  var numId = parseInt(id, 10);
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === numId) {
      return { id: usuarios[i].id, email: usuarios[i].email };
    }
  }
  return null;
}

function findByEmail(email) {
  var usuarios = leerUsuarios();
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email === email) {
      return usuarios[i];
    }
  }
  return null;
}

function validateLogin(email, contraseña) {
  var usuario = findByEmail(email);
  if (!usuario) {
    return { ok: false, error: 'Credenciales incorrectas' };
  }
  if (usuario.contraseña !== contraseña) {
    return { ok: false, error: 'Credenciales incorrectas' };
  }
  return { ok: true, user: { id: usuario.id, email: usuario.email } };
}

function formatearFecha(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

module.exports = {
  getCategorias: getCategorias,
  getTareasHoyYFuturo: getTareasHoyYFuturo,
  getTareasVencidas: getTareasVencidas,
  getTareasPorCategoria: getTareasPorCategoria,
  getTareaById: getTareaById,
  getUsuarioById: getUsuarioById,
  findByEmail: findByEmail,
  validateLogin: validateLogin
};
