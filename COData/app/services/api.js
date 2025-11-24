class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:3000/api';
    }

    getHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders(),
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            // Simulación de respuesta para cuando no hay backend real
            if (true) {
                console.log(`[API Simulation] ${method} ${url}`, data);
                return await this.mockResponse(endpoint, method, data);
            }

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    post(endpoint, data) {
        return this.request(endpoint, 'POST', data);
    }

    put(endpoint, data) {
        return this.request(endpoint, 'PUT', data);
    }

    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }

    // Mock responses for demonstration purposes
    async mockResponse(endpoint, method, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (endpoint.includes('/auth/login')) {
                    const { email, password } = data;

                    // 1. Check hardcoded credentials
                    if ((email === 'usuario@cdata.com' && password === 'user123') ||
                        (email === 'admin@cdata.com' && password === 'admin123')) {
                        resolve({ token: 'fake-jwt-token-hardcoded', user: { name: email.split('@')[0], email: email } });
                        return;
                    }

                    // 2. Check registered users in localStorage
                    const users = JSON.parse(localStorage.getItem('db_users') || '[]');
                    const foundUser = users.find(u => u.email === email && u.password === password);

                    if (foundUser) {
                        resolve({ token: 'fake-jwt-token-registered', user: { name: foundUser.name, email: foundUser.email } });
                    } else {
                        resolve({ token: null, message: 'Credenciales inválidas' });
                    }

                } else if (endpoint.includes('/auth/register')) {
                    const { name, email, password } = data;
                    const users = JSON.parse(localStorage.getItem('db_users') || '[]');

                    if (users.find(u => u.email === email)) {
                        resolve({ success: false, message: 'El usuario ya existe' });
                    } else {
                        users.push({ name, email, password });
                        localStorage.setItem('db_users', JSON.stringify(users));
                        resolve({ success: true, message: 'Usuario registrado' });
                    }

                } else if (endpoint.includes('/reportes') && method === 'GET') {
                    resolve([
                        { id: 1, title: 'Fuga de agua', status: 'critical', date: '2024-06-25', description: 'Fuga en la calle principal', location: 'Centro' },
                        { id: 2, title: 'Luminaria rota', status: 'pending', date: '2024-06-26', description: 'No enciende por la noche', location: 'Norte' },
                        { id: 3, title: 'Bache reparado', status: 'completed', date: '2024-06-24', description: 'Bache cubierto', location: 'Sur' }
                    ]);
                } else if (endpoint.includes('/users/profile') && method === 'GET') {
                    // Return currently logged in user data if available
                    // For simulation, we just return a generic one if not found in local storage logic
                    resolve({ name: 'Usuario Demo', email: 'usuario@cdata.com' });
                } else {
                    resolve({ success: true, message: 'Operación simulada exitosa' });
                }
            }, 500);
        });
    }
}

const api = new ApiService();
window.api = api;
