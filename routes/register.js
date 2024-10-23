const express = require('express');
const router = express.Router();
const Member = require('../utils/models/member'); // Modeli içe aktarma

// Kayıt rotası
router.post('/register', async (req, res) => {
    const { username, password, password2 } = req.body;

    // Şifrelerin eşleşip eşleşmediğini kontrol etme
    if (password !== password2) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        // Aynı kullanıcı adına sahip bir kullanıcı olup olmadığını kontrol etme
        const existingUser = await Member.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Yeni kullanıcı oluşturma ve MongoDB'ye kaydetme
        const newUser = new Member({ username, password });
        await newUser.save();

        // Başarılı kayıt sonrası login sayfasına yönlendirme
        res.redirect('/login.html');
    } catch (err) {
        res.status(500).send('Error saving user');
    }
});

module.exports = router;
