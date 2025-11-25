(function () {
    // Use a global variable to store the map instance so we can clean it up
    // If it doesn't exist, initialize it
    if (!window.appMapInstance) {
        window.appMapInstance = null;
    }

    let markers = [];

    // Initialize Leaflet Map
    window.initMap = async function () {
        console.log("Mapa component loaded (Leaflet)");

        // Default center (Ciudad Obregón, Sonora)
        const defaultCenter = [27.4828, -109.9304];

        // Create map
        // Check if map is already initialized
        if (window.appMapInstance) {
            window.appMapInstance.remove();
            window.appMapInstance = null;
        }

        // Ensure the map container exists
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        window.appMapInstance = L.map('map').setView(defaultCenter, 12);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(window.appMapInstance);

        // Load reports and display on map
        try {
            const reports = await window.api.get('/reportes');

            if (reports && reports.length > 0) {
                displayReportsOnMap(reports);
                updateFilterCounts(reports);
            }
        } catch (error) {
            console.error("Error loading map data:", error);
        }

        // Setup filter buttons
        setupFilters();

        // Check if we are in "Location Selection Mode"
        if (localStorage.getItem('selectingLocation') === 'true') {
            // Show instruction
            const instruction = document.createElement('div');
            instruction.style.position = 'absolute';
            instruction.style.top = '20px';
            instruction.style.left = '50%';
            instruction.style.transform = 'translateX(-50%)';
            instruction.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            instruction.style.color = 'white';
            instruction.style.padding = '10px 20px';
            instruction.style.borderRadius = '20px';
            instruction.style.zIndex = '1000';
            instruction.style.fontWeight = 'bold';
            instruction.innerText = 'Toca el mapa para seleccionar la ubicación';
            document.getElementById('map').appendChild(instruction);

            // Change cursor
            document.getElementById('map').style.cursor = 'crosshair';

            // Add click listener for selection
            window.appMapInstance.on('click', function (e) {
                const lat = e.latlng.lat.toFixed(6);
                const lng = e.latlng.lng.toFixed(6);

                if (confirm(`¿Usar esta ubicación?\n${lat}, ${lng}`)) {
                    localStorage.setItem('selectedLocation', `${lat}, ${lng}`);
                    localStorage.removeItem('selectingLocation');

                    // Redirect back to registro
                    if (typeof window.loadView === 'function') {
                        window.loadView('registro');
                    } else {
                        // Fallback if loadView is not global (it should be based on app.js)
                        console.error("loadView not found");
                    }
                }
            });
        }
    };

    function displayReportsOnMap(reports) {
        // Clear existing markers
        markers.forEach(marker => window.appMapInstance.removeLayer(marker));
        markers = [];

        reports.forEach((report, index) => {
            let lat = 27.4828;
            let lng = -109.9304;

            // Parse location string (expected format: "lat, lng")
            if (report.location && report.location.includes(',')) {
                const [latStr, lngStr] = report.location.split(',');
                const parsedLat = parseFloat(latStr.trim());
                const parsedLng = parseFloat(lngStr.trim());

                if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
                    lat = parsedLat;
                    lng = parsedLng;
                } else {
                    // Fallback: Default center (no random)
                    console.warn(`Invalid coordinates for report ${report.id}: ${report.location}. Using default center.`);
                    lat = 27.4828;
                    lng = -109.9304;
                }
            } else {
                // Fallback: Default center (no random)
                console.warn(`Missing or invalid location format for report ${report.id}. Using default center.`);
                lat = 27.4828;
                lng = -109.9304;
            }

            // Determine marker color (Leaflet uses default blue, but we can use circle markers for colors)
            let color = '#eab308'; // yellow
            if (report.status === 'critical') color = '#dc2626'; // red
            if (report.status === 'completed') color = '#16a34a'; // green

            const marker = L.circleMarker([lat, lng], {
                radius: 10,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(window.appMapInstance);

            // Add popup
            const content = `
                <div style="padding: 5px; max-width: 200px;">
                    <h3 style="margin: 0 0 5px 0; color: #333; font-size: 1rem;">${report.title}</h3>
                    <p style="margin: 3px 0; color: #666; font-size: 0.8rem;"><strong>Estado:</strong> ${getStatusText(report.status)}</p>
                    <p style="margin: 3px 0; color: #666; font-size: 0.8rem;"><strong>Fecha:</strong> ${report.date}</p>
                    <p style="margin: 3px 0; color: #666; font-size: 0.8rem;">${report.description || 'Sin descripción'}</p>
                </div>
            `;

            marker.bindPopup(content);

            // Store report data for filtering
            marker.reportData = report;
            markers.push(marker);
        });

        // Adjust map bounds to show all markers
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            window.appMapInstance.fitBounds(group.getBounds());
        }
    }

    function getStatusText(status) {
        const statusMap = {
            'critical': 'Crítico',
            'pending': 'Pendiente',
            'completed': 'Completado'
        };
        return statusMap[status] || 'Desconocido';
    }

    function updateFilterCounts(reports) {
        const countAll = document.getElementById('count-all');
        if (countAll) countAll.textContent = reports.length;

        const countInfra = document.getElementById('count-infra');
        if (countInfra) countInfra.textContent = reports.filter(r => r.title.toLowerCase().includes('bache') || r.title.toLowerCase().includes('luminaria')).length;

        const countServices = document.getElementById('count-services');
        if (countServices) countServices.textContent = reports.filter(r => r.title.toLowerCase().includes('agua') || r.title.toLowerCase().includes('basura')).length;

        const countSecurity = document.getElementById('count-security');
        if (countSecurity) countSecurity.textContent = reports.filter(r => r.title.toLowerCase().includes('seguridad')).length;
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.map-filters .pill');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                filterMarkers(filter);
            });
        });
    }

    function filterMarkers(filter) {
        markers.forEach(marker => {
            if (filter === 'all') {
                if (!window.appMapInstance.hasLayer(marker)) {
                    marker.addTo(window.appMapInstance);
                }
            } else {
                // Simple filtering logic based on title keywords (matching updateFilterCounts)
                const report = marker.reportData;
                let category = 'other';

                if (report.title.toLowerCase().includes('bache') || report.title.toLowerCase().includes('luminaria')) {
                    category = 'infra';
                } else if (report.title.toLowerCase().includes('agua') || report.title.toLowerCase().includes('basura')) {
                    category = 'services';
                } else if (report.title.toLowerCase().includes('seguridad')) {
                    category = 'security';
                }

                if (filter === category) {
                    if (!window.appMapInstance.hasLayer(marker)) {
                        marker.addTo(window.appMapInstance);
                    }
                } else {
                    if (window.appMapInstance.hasLayer(marker)) {
                        window.appMapInstance.removeLayer(marker);
                    }
                }
            }
        });
    }

    // Call initMap directly since we are not using Google Maps callback anymore
    if (document.getElementById('map')) {
        window.initMap();
    }
})();
