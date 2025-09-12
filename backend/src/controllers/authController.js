const db = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 🔑 Clave secreta (ponla en .env)
const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta";

// LOGIN
exports.login = (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan datos.' });
  }

  const sql = 'SELECT id_cliente, nombre_completo, usuario, contrasena FROM clientes WHERE usuario = ?';
  db.query(sql, [usuario], async (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en el servidor.' });

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    const u = rows[0];
    let match = false;

    try {
      // 🔒 Comparar con hash bcrypt
      match = await bcrypt.compare(contrasena, u.contrasena);
    } catch (e) {
      match = false;
    }

    // Si no coincide con hash, probamos texto plano (usuarios viejos)
    if (!match && contrasena === u.contrasena) {
      match = true;

      // 👉 actualizar la BD a hash para futuras veces
      const nuevoHash = await bcrypt.hash(contrasena, 10);
      db.query(
        'UPDATE clientes SET contrasena = ? WHERE id_cliente = ?',
        [nuevoHash, u.id_cliente]
      );
    }

    if (!match) {
      return res.json({ success: false, message: 'Usuario o contraseña incorrectos.' });
    }

    // 🔑 Generar token
    const token = jwt.sign(
      { id: u.id_cliente, usuario: u.usuario },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: {
        id: u.id_cliente,
        nombre: u.nombre_completo,
        usuario: u.usuario
      }
    });
  });
};

// REGISTRO
exports.registro = async (req, res) => {
  const { nombre_completo, usuario, contrasena } = req.body;
  if (!nombre_completo || !usuario || !contrasena) {
    return res.status(400).json({ success: false, message: 'Completa todos los campos.' });
  }

  db.query('SELECT id_cliente FROM clientes WHERE usuario = ?', [usuario], async (err, rows) => {
    if (err) return res.status(500).json({ success: false, message: 'Error en el servidor.' });

    if (rows.length > 0) {
      return res.json({ success: false, message: 'El usuario ya existe.' });
    }

    // 🔒 Hashear contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const insertSql = 'INSERT INTO clientes (nombre_completo, usuario, contrasena) VALUES (?, ?, ?)';
    db.query(insertSql, [nombre_completo, usuario, hashedPassword], (err2, result) => {
      if (err2) return res.status(500).json({ success: false, message: 'No se pudo registrar.' });

      // 🔑 Generar token inmediato
      const token = jwt.sign(
        { id: result.insertId, usuario },
        JWT_SECRET,
        { expiresIn: '2h' }
      );

      return res.json({
        success: true,
        message: "Registro exitoso",
        token,
        usuario: {
          id: result.insertId,
          nombre: nombre_completo,
          usuario
        }
      });
    });
  });
};

// 🔓 Verificar token
exports.getSession = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.json({ loggedIn: false });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.json({ loggedIn: false });

    res.json({
      loggedIn: true,
      user
    });
  });
};