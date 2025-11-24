const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./database');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/reportes', reportRoutes);

// Serve static files from the 'app' directory
const path = require('path');
app.use(express.static(path.join(__dirname, '../app')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Handle SPA routing (optional, but good practice if we had client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

// Sync database and start server
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced');

    // Seed default users
    const User = require('./models/User');
    try {
        const admin = await User.findOne({ where: { email: 'admin@cdata.com' } });
        if (!admin) {
            await User.create({
                name: 'Admin',
                email: 'admin@cdata.com',
                password: 'admin123'
            });
            console.log('Default admin created');
        }

        const user = await User.findOne({ where: { email: 'usuario@cdata.com' } });
        if (!user) {
            await User.create({
                name: 'Usuario Demo',
                email: 'usuario@cdata.com',
                password: 'user123'
            });
            console.log('Default user created');
        }
    } catch (error) {
        console.error('Seeding error:', error);
    }

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
