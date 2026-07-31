const express = require('express');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. CREATE: Naya item add karne ke liye
app.post('/api/items', (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title dena zaroori hai.' });
  }

  const query = `INSERT INTO items (title, description) VALUES (?, ?)`;
  db.run(query, [title.trim(), description || ''], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    
    res.status(201).json({
      message: 'Item kamyabi se ban gaya',
      data: { id: this.lastID, title: title.trim(), description: description || '', status: 'pending' }
    });
  });
});

// 2. READ: Saare items dekhne ke liye
app.get('/api/items', (req, res) => {
  db.all(`SELECT * FROM items ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ data: rows });
  });
});

// 3. UPDATE: Item update karne ke liye
app.put('/api/items/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  db.get(`SELECT * FROM items WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Item nahi mila.' });

    const updatedTitle = title !== undefined ? title.trim() : row.title;
    const updatedDesc = description !== undefined ? description : row.description;
    const updatedStatus = status !== undefined ? status : row.status;

    const query = `UPDATE items SET title = ?, description = ?, status = ? WHERE id = ?`;
    db.run(query, [updatedTitle, updatedDesc, updatedStatus, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: 'Item update ho gaya' });
    });
  });
});

// 4. DELETE: Item delete karne ke liye
app.delete('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM items WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Item nahi mila.' });
    res.status(200).json({ message: `ID ${id} delete ho gaya.` });
  });
});

app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});