// ./server.js
const connectDB = require('./utils/database.js');
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { saveMessage, getMessagesByRoom } = require('./utils/messages');
const { formatMessage } = require("./utils/messages.js");
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getActiveUserCount } = require('./utils/users');

// Yeni importlar
const bodyParser = require('body-parser');
const registerRoute = require('./routes/register');
const loginRoute = require('./routes/login');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Veritabanı bağlantısı
connectDB();

// Static klasör ayarı
app.use(express.static(path.join(__dirname, 'public')));

// Middleware eklemeleri
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes eklemesi
app.use('/register', registerRoute);
app.use('/login', loginRoute);

const botName = 'NightChat Bot';

io.on('connection', async (socket) => {
    socket.on('joinRoom', async ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(botName, `${user.username} NightChat'e hoşgeldin`));

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} adlı kullanıcı giriş yaptı`));

        // Send user and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
            activeUserCount: getActiveUserCount(),
        });

        // Deneme2
        socket.on('yaziyor', function (data) {
            io.to(user.room).emit('yaziyor', data);
        });

        // Get and emit previous messages
        const messages = await getMessagesByRoom(user.room);
        messages.forEach((message) => {
            socket.emit('message', formatMessage(message.username, message.text, message.time));
        });
    });

    socket.on('chatMessage', async (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));

        await saveMessage(user.username, msg, user.room);
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} adli kullanici sohbetten ayrıldı`));
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room),
                activeUserCount: getActiveUserCount(),
            });
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
