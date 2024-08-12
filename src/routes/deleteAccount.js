const express = require('express');
const router = express.Router();

router.delete('/', (req, res) => {
    const userId = req.userId;

    req.db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.json({ message: 'User deleted' });
    });
});

module.exports = router;