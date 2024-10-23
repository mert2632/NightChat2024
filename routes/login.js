// routes/login.js
const express = require('express');
const router = express.Router();
const Member = require('../utils/models/member');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const member = await Member.findOne({ username });
        if (!member) {
            return res.status(400).send('Invalid credentials');
        }

        const isMatch = await member.comparePassword(password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Implement session or JWT authentication here

        res.redirect('/chat.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
