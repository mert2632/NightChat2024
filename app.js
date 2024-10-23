const express = require('express');
const mongoose = require('mongoose');
const app = express();
const registerRoute = require('./routes/register'); // Kayıt rotasını içe aktarma

// MongoDB'ye bağlanma
mongoose.connect('mongodb://localhost:27017/chatapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statik dosyaları sunma (public klasörü)
app.use(express.static('public'));

// Rotayı kullanma
app.use('/register', registerRoute);

// Sunucuyu başlatma
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
