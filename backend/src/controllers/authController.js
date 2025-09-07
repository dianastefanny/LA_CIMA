const db = require('../config/db');

// LOGIN
exports.login = (req, res) => {
  console.log("Datos recibidos en login:", req.body);  // 👈 Mira en la terminal
  
  const { usuario, contraseña } = req.body;
  if (!usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const sql = 'SELECT id_cliente, nombre_completo, usuario FROM clientes WHERE usuario = ? AND `contraseña` = ?';
  db.query(sql, [usuario, contraseña], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en el servidor.' });

    if (rows.length > 0) {
      const u = rows[0];
      req.session.user = { id: u.id_cliente, nombre: u.nombre_completo, usuario: u.usuario };
      req.session.type = "login";
      return res.json({ success: true, nombre: u.nombre_completo || u.usuario });
    } else {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }
  });
};

// REGISTRO
exports.registro = (req, res) => {
  const { nombre_completo, usuario, contraseña } = req.body;
  if (!nombre_completo || !usuario || !contraseña) {
    return res.status(400).json({ success: false, message: 'Completa todos los campos.' });
  }

  db.query('SELECT id_cliente, nombre_completo FROM clientes WHERE usuario = ?', [usuario], (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en el servidor.' });

    if (rows.length > 0) {
      const existente = rows[0];
      return res.json({ success: false, message: 'El usuario ya existe.', nombre: existente.nombre_completo });
    }

    const insertSql = 'INSERT INTO clientes (nombre_completo, usuario, `contraseña`) VALUES (?, ?, ?)';
    db.query(insertSql, [nombre_completo, usuario, contraseña], (err2, result) => {
      if (err2) return res.status(500).json({ success: false, message: 'No se pudo registrar.' });

      req.session.user = { id: result.insertId, nombre: nombre_completo, usuario };
      req.session.type = "registro";
      return res.json({ success: true, nombre: nombre_completo });
    });
  });
};

// LOGOUT
exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
};

// SESIÓN ACTIVA
exports.getSession = (req, res) => {
  if (req.session.user) {
    res.json({
      loggedIn: true,
      user: req.session.user,
      type: req.session.type || "login"
    });
  } else {
    res.json({ loggedIn: false });
  }
};