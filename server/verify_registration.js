const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function verifyRegistrationAndProfile() {
    try {
        const timestamp = Date.now();
        const newUser = {
            name: `New User ${timestamp}`,
            email: `newuser${timestamp}@test.com`,
            password: 'password123'
        };

        // 1. Register
        console.log('Registering new user...');
        const registerResponse = await axios.post(`${BASE_URL}/register`, newUser);

        if (registerResponse.data.success) {
            console.log('Registration successful.');
        } else {
            console.error('Registration failed:', registerResponse.data.message);
            process.exit(1);
        }

        // 2. Login
        console.log('Logging in as new user...');
        const loginResponse = await axios.post(`${BASE_URL}/login`, {
            email: newUser.email,
            password: newUser.password
        });

        const token = loginResponse.data.token;
        console.log('Login successful. Token obtained.');

        // 3. Update Profile (Name)
        console.log('Updating profile name for new user...');
        const updatedName = `Updated New User ${timestamp}`;
        const updateResponse = await axios.put(`${BASE_URL}/profile`, {
            name: updatedName
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (updateResponse.data.success && updateResponse.data.user.name === updatedName) {
            console.log('Profile name update successful.');
        } else {
            console.error('Profile name update failed.');
            process.exit(1);
        }

        // 4. Verify Update via Login
        console.log('Verifying update via re-login...');
        const loginResponse2 = await axios.post(`${BASE_URL}/login`, {
            email: newUser.email,
            password: newUser.password
        });

        if (loginResponse2.data.user.name === updatedName) {
            console.log('Verification successful: Name persisted for new user.');
        } else {
            console.error('Verification failed: Name did not persist.');
            process.exit(1);
        }

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyRegistrationAndProfile();
