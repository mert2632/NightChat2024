const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Kullanıcı şemasını tanımlama
const MemberSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Modeli oluşturma
const Member = mongoose.model('Member', MemberSchema);

module.exports = Member;
