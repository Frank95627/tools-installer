// routes/notes.js
const express = require('express');
const Joi = require('joi');
const router = express.Router();

const notes = []; // Esto debería estar en una base de datos en una aplicación real

const noteSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

// Obtener todas las notas
router.get('/', (req, res) => {
  res.json(notes);
});

// Crear una nueva nota
router.post('/', (req, res) => {
  const { error } = noteSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const newNote = req.body;
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Actualizar una nota existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updatedNote = req.body;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));
  if (noteIndex !== -1) {
    notes[noteIndex] = updatedNote;
    res.json(updatedNote);
  } else {
    res.status(404).json({ error: 'Nota no encontrada' });
  }
});

// Eliminar una nota
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const noteIndex = notes.findIndex(note => note.id === parseInt(id));
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    res.json({ message: 'Nota eliminada' });
  } else {
    res.status(404).json({ error: 'Nota no encontrada' });
  }
});

module.exports = router;
