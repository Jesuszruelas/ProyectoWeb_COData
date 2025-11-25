const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function verifyProfile() {
    try {
        // 1. Login
        console.log('Logging in...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: 'usuario@cdata.com',
            password: 'user123'
        });

        const token = loginResponse.data.token;
        const originalName = loginResponse.data.user.name;
        console.log('Login successful. Token obtained.');
        console.log('Original Name:', originalName);

        // 2. Update Profile (Name)
        console.log('Updating profile name...');
        const newName = 'Updated User ' + Date.now();
        const updateResponse = await axios.put(`${BASE_URL}/profile`, {
            name: newName
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (updateResponse.data.success && updateResponse.data.user.name === newName) {
            console.log('Profile name update successful.');
        } else {
            console.error('Profile name update failed.');
            process.exit(1);
        }

        // 3. Verify Update
        console.log('Verifying update...');
        // We can't easily "get" the profile without a specific endpoint, but the login or update response returns it.
        // Let's login again to see if the name persists.
        const loginResponse2 = await axios.post(`${BASE_URL}/login`, {
            email: 'usuario@cdata.com',
            password: 'user123'
        });

        if (loginResponse2.data.user.name === newName) {
            console.log('Verification successful: Name persisted.');
        } else {
            console.error('Verification failed: Name did not persist.');
            process.exit(1);
        }

        // 4. Revert changes
        console.log('Reverting changes...');
        await axios.put(`${BASE_URL}/profile`, {
            name: 'Usuario Demo'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Changes reverted.');

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyProfile();
