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
            // En producción, quitar este bloque y dejar solo el fetch
            if (true) { // Forzar simulación por ahora
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
                    if ((email === 'usuario@cdata.com' && password === 'user123') ||
                        (email === 'admin@cdata.com' && password === 'admin123')) {
                        resolve({ token: 'fake-jwt-token', user: { name: email.split('@')[0], email: email } });
                    } else {
                        // Rejecting the promise to simulate 401
                        // But since we are inside a promise constructor, we can just resolve with an error object
                        // or throw if we want to catch it in the request method.
                        // Let's return a null token to signal failure in the login.js check
                        resolve({ token: null, message: 'Credenciales inválidas' });
                    }
                } else if (endpoint.includes('/reportes') && method === 'GET') {
                    resolve([
                        { id: 1, title: 'Fuga de agua', status: 'critical', date: '2024-06-25' },
                        { id: 2, title: 'Luminaria rota', status: 'pending', date: '2024-06-26' },
                        { id: 3, title: 'Bache reparado', status: 'completed', date: '2024-06-24' }
                    ]);
                } else {
                    resolve({ success: true, message: 'Operación simulada exitosa' });
                }
            }, 500);
        });
    }
}

const api = new ApiService();
window.api = api; // Expose globally for simplicity in this setup
