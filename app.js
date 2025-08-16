const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');

const app = express();
const PORT = 3000;

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'juandi092126',
  database: 'la_cima',
  charset: 'utf8mb4'  // Asegura compatibilidad con emojis y caracteres especiales
});

db.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL ✅');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'la-cima-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));

// Vistas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Bienvenida (solo si está logueado)
app.get('/bienvenida', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // si no hay sesión, a /login
  }
  res.sendFile(path.join(__dirname, 'public', 'bienvenida.html'));
});

// ============================
// API: Login / Registro / Logout
// ============================

// LOGIN
app.post('/login', (req, res) => {
  const { usuario, contraseña } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const sql = 'SELECT id_cliente, nombre_completo, usuario FROM clientes WHERE usuario = ? AND `contraseña` = ?';
  db.query(sql, [usuario, contraseña], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }

    if (rows.length > 0) {
      const u = rows[0];
      req.session.user = { id: u.id_cliente, nombre: u.nombre_completo, usuario: u.usuario };
       req.session.type = "login";
      return res.json({ success: true, nombre: u.nombre_completo || u.usuario });
    } else {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }
  });
});

// REGISTRO
app.post('/registro', (req, res) => {
  const { nombre_completo, usuario, contraseña } = req.body;
  if (!nombre_completo || !usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Completa todos los campos.' });
  }

  // ¿Usuario existente?
  db.query('SELECT id_cliente, nombre_completo FROM clientes WHERE usuario = ?', [usuario], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }

    if (rows.length > 0) {
      // Ya existe -> responde con el nombre para el mensaje que quieres
      const existente = rows[0];
      return res.json({
        success: false,
        message: `El usuario ya existe.`,
        nombre: existente.nombre_completo
      });
    }

    // Insertar nuevo
    const insertSql = 'INSERT INTO clientes (nombre_completo, usuario, `contraseña`) VALUES (?, ?, ?)';
    db.query(insertSql, [nombre_completo, usuario, contraseña], (err2, result) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ success: false, message: 'No se pudo registrar.' });
      }

      // Autologin opcional
      req.session.user = { id: result.insertId, nombre: nombre_completo, usuario };
      req.session.type = "registro";
      return res.json({ success: true, nombre: nombre_completo });
    });
  });
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// API para obtener la sesión activa
app.get('/api/session', (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      user: req.session.user,
      type: req.session.type || "login" // "login" o "registro"
    });
  } else {
    res.json({ loggedIn: false });
  }
});

// LOGOUT por GET (para el botón <a href="/logout">)
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/'); // vuelve a la pagina principal al cerrar sesión
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});