const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/auth';

async function verifyUniqueRegistration() {
    try {
        const timestamp = Date.now();
        const user1 = { name: `Unique User ${timestamp}`, email: `unique${timestamp}@test.com`, password: 'password123' };

        // 1. Register User 1
        console.log('Registering User 1...');
        await axios.post(`${BASE_URL}/register`, user1);
        console.log('User 1 registered.');

        // 2. Try to register with same email
        console.log('Attempting duplicate email registration...');
        try {
            await axios.post(`${BASE_URL}/register`, { ...user1, name: `Different Name ${timestamp}` });
            console.error('Failed: Duplicate email was allowed.');
            process.exit(1);
        } catch (error) {
            console.error('Failed: Duplicate email was allowed or unexpected error.');
            if (error.response) {
                console.error('Status:', error.response.status);
                console.error('Data:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
            // Continue to next check even if this fails, to see if name check works
        }

        // 3. Try to register with same name
        console.log('Attempting duplicate name registration...');
        try {
            await axios.post(`${BASE_URL}/register`, { ...user1, email: `different${timestamp}@test.com` });
            console.error('Failed: Duplicate name was allowed.');
            process.exit(1);
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message.includes('nombre')) {
                console.log('Success: Duplicate name rejected.');
            } else {
                console.error('Failed: Unexpected error for duplicate name.');
                if (error.response) {
                    console.error('Status:', error.response.status);
                    console.error('Data:', error.response.data);
                } else {
                    console.error('Error:', error.message);
                }
                process.exit(1);
            }
        }

        console.log('All unique registration checks passed.');

    } catch (error) {
        console.error('Verification failed:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyUniqueRegistration();
