const express = require('express');
const router = express.Router();

// Obtener todos los usuarios
router.get('/', (req, res) => {
  res.json([{ id: 1, name: 'John Doe' }]);
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ id: userId, name: `Usuario ${userId}` });
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
  const newUser = req.body;
  res.status(201).json(newUser);
});

// Actualizar un usuario
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;
  res.json({ id: userId, ...updatedUser });
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ message: `Usuario ${userId} eliminado` });
});

module.exports = router;
