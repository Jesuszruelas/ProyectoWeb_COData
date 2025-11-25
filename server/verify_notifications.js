const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function verifyNotifications() {
    try {
        const timestamp = Date.now();

        // 1. Setup Users
        console.log('Setting up users...');
        const userA = { name: `User Notif ${timestamp}`, email: `usernotif${timestamp}@test.com`, password: 'password123' };
        const admin = { email: 'admin@cdata.com', password: 'admin123' };

        await axios.post(`${BASE_URL}/auth/register`, userA);

        const tokenA = (await axios.post(`${BASE_URL}/auth/login`, { email: userA.email, password: userA.password })).data.token;
        const tokenAdmin = (await axios.post(`${BASE_URL}/auth/login`, admin)).data.token;

        // 2. User A creates a report
        console.log('User A creating report...');
        const report = await axios.post(`${BASE_URL}/reportes`, { title: 'Report for Notif', description: 'Testing notifications' }, { headers: { Authorization: `Bearer ${tokenA}` } });
        const reportId = report.data.id;

        // Verify 'success' notification for User A
        console.log('Verifying creation notification...');
        let notificationsA = (await axios.get(`${BASE_URL}/notifications`, { headers: { Authorization: `Bearer ${tokenA}` } })).data;
        const creationNotif = notificationsA.find(n => n.type === 'success' && n.message.includes(report.data.title));

        if (creationNotif) {
            console.log('Success: Creation notification found.');
        } else {
            console.error('Failed: Creation notification not found.');
            process.exit(1);
        }

        // 3. Admin updates the report
        console.log('Admin updating report...');
        await axios.put(`${BASE_URL}/reportes/${reportId}`, { status: 'in_progress' }, { headers: { Authorization: `Bearer ${tokenAdmin}` } });

        // Verify 'info' notification for User A
        console.log('Verifying update notification...');
        notificationsA = (await axios.get(`${BASE_URL}/notifications`, { headers: { Authorization: `Bearer ${tokenA}` } })).data;
        const updateNotif = notificationsA.find(n => n.type === 'info' && n.title === 'Reporte Actualizado');

        if (updateNotif) {
            console.log('Success: Update notification found.');
        } else {
            console.error('Failed: Update notification not found.');
            process.exit(1);
        }

        // 4. Admin deletes the report
        console.log('Admin deleting report...');
        await axios.delete(`${BASE_URL}/reportes/${reportId}`, { headers: { Authorization: `Bearer ${tokenAdmin}` } });

        // Verify 'warning' notification for User A
        console.log('Verifying deletion notification...');
        notificationsA = (await axios.get(`${BASE_URL}/notifications`, { headers: { Authorization: `Bearer ${tokenA}` } })).data;
        const deleteNotif = notificationsA.find(n => n.type === 'warning' && n.title === 'Reporte Eliminado');

        if (deleteNotif) {
            console.log('Success: Deletion notification found.');
        } else {
            console.error('Failed: Deletion notification not found.');
            process.exit(1);
        }

        console.log('All notification checks passed.');

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyNotifications();
