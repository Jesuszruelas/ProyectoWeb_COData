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

// Handle SPA routing (optional, but good practice if we had client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../app/index.html'));
});

// Sync database and start server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
