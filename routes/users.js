const express = require('express');
const router = express.Router();
const Member = require('../utils/models/member'); // Modeli içe aktarma

// Kullanıcıların listelendiği rota
router.get('/users', async (req, res) => {
    try {
        const users = await Member.find(); // Tüm kullanıcıları çekme
        res.render('users', { users }); // 'users' adında bir template render etme
    } catch (err) {
        res.status(500).send('Error fetching users');
    }
});

module.exports = router;
