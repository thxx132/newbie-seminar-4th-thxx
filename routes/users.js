const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 사용자 목록 가져오기
router.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// 사용자 저장 (중복 ID 확인 포함)
router.post('/', (req, res) => {
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res.status(400).json({ error: 'Name and ID are required!' });
  }

  // 중복된 userId 확인
  const checkQuery = 'SELECT * FROM users WHERE userId = ?';
  db.query(checkQuery, [userId], (err, results) => {
    if (err) {
      console.error('Error checking user ID:', err);
      return res.status(500).json({ error: 'Failed to check user ID' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'User ID already exists!' });
    }

    // 중복되지 않으면 사용자 저장
    const insertQuery = 'INSERT INTO users (name, userId, trustScore) VALUES (?, ?, 0)';
    db.query(insertQuery, [name, userId], (err, result) => {
      if (err) {
        console.error('Error saving user:', err);
        return res.status(500).json({ error: 'Failed to save user' });
      }
      res.json({ message: 'User saved successfully!' });
    });
  });
});

// 신뢰도 점수 조정
router.patch('/:id/trust', (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  const query = 'UPDATE users SET trustScore = trustScore + ? WHERE id = ?';
  db.query(query, [amount, id], (err, result) => {
    if (err) {
      console.error('Error updating trust score:', err);
      return res.status(500).json({ error: 'Failed to update trust score' });
    }
    res.json({ message: 'Trust score updated successfully!' });
  });
});

// 사용자 삭제
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Failed to delete user' });
    }
    res.json({ message: 'User deleted successfully!' });
  });
});

module.exports = router;
