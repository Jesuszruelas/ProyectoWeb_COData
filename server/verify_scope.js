const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function verifyReportScope() {
    try {
        const timestamp = Date.now();

        // 1. Create Users
        console.log('Creating users...');
        const userA = { name: `User A ${timestamp}`, email: `usera${timestamp}@test.com`, password: 'password123' };
        const userB = { name: `User B ${timestamp}`, email: `userb${timestamp}@test.com`, password: 'password123' };
        const admin = { email: 'admin@cdata.com', password: 'admin123' }; // Assuming admin exists

        await axios.post(`${BASE_URL}/auth/register`, userA);
        await axios.post(`${BASE_URL}/auth/register`, userB);

        // 2. Login
        console.log('Logging in...');
        const tokenA = (await axios.post(`${BASE_URL}/auth/login`, { email: userA.email, password: userA.password })).data.token;
        const tokenB = (await axios.post(`${BASE_URL}/auth/login`, { email: userB.email, password: userB.password })).data.token;
        const tokenAdmin = (await axios.post(`${BASE_URL}/auth/login`, admin)).data.token;

        // 3. Create Reports
        console.log('Creating reports...');
        const reportA = await axios.post(`${BASE_URL}/reportes`, { title: 'Report A', description: 'Desc A' }, { headers: { Authorization: `Bearer ${tokenA}` } });
        const reportB = await axios.post(`${BASE_URL}/reportes`, { title: 'Report B', description: 'Desc B' }, { headers: { Authorization: `Bearer ${tokenB}` } });

        // 4. Verify Scoping
        console.log('Verifying scoping...');

        // User A should see Report A only (or at least NOT Report B if strict scoping, but definitely their own)
        // Actually, the requirement is "que se quede guardado solamente ahi, no en el demás usuarios".
        // So User A should NOT see Report B.
        const reportsA = (await axios.get(`${BASE_URL}/reportes`, { headers: { Authorization: `Bearer ${tokenA}` } })).data;
        const hasReportA = reportsA.some(r => r.id === reportA.data.id);
        const hasReportB = reportsA.some(r => r.id === reportB.data.id);

        if (hasReportA && !hasReportB) {
            console.log('User A scoping correct: Sees A, not B.');
        } else {
            console.error(`User A scoping failed: Sees A? ${hasReportA}, Sees B? ${hasReportB}`);
            process.exit(1);
        }

        // User B should see Report B only
        const reportsB = (await axios.get(`${BASE_URL}/reportes`, { headers: { Authorization: `Bearer ${tokenB}` } })).data;
        const hasReportA_forB = reportsB.some(r => r.id === reportA.data.id);
        const hasReportB_forB = reportsB.some(r => r.id === reportB.data.id);

        if (hasReportB_forB && !hasReportA_forB) {
            console.log('User B scoping correct: Sees B, not A.');
        } else {
            console.error(`User B scoping failed: Sees B? ${hasReportB_forB}, Sees A? ${hasReportA_forB}`);
            process.exit(1);
        }

        // Admin should see both
        const reportsAdmin = (await axios.get(`${BASE_URL}/reportes`, { headers: { Authorization: `Bearer ${tokenAdmin}` } })).data;
        const adminSeesA = reportsAdmin.some(r => r.id === reportA.data.id);
        const adminSeesB = reportsAdmin.some(r => r.id === reportB.data.id);

        if (adminSeesA && adminSeesB) {
            console.log('Admin scoping correct: Sees both.');
        } else {
            console.error(`Admin scoping failed: Sees A? ${adminSeesA}, Sees B? ${adminSeesB}`);
            process.exit(1);
        }

        console.log('All verification steps passed.');

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyReportScope();
