let map;
let markers = [];
let infoWindow;

// Initialize Google Map
window.initMap = async function () {
    console.log("Mapa component loaded");

    // Default center (Mexico City)
    const defaultCenter = { lat: 19.4326, lng: -99.1332 };

    // Create map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultCenter,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    infoWindow = new google.maps.InfoWindow();

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
};

function displayReportsOnMap(reports) {
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    reports.forEach((report, index) => {
        // Simulate coordinates (in real app, these would come from the report)
        const lat = 19.4326 + (Math.random() - 0.5) * 0.1;
        const lng = -99.1332 + (Math.random() - 0.5) * 0.1;

        const position = { lat, lng };

        // Determine marker color based on status
        let markerColor = '#eab308'; // yellow for pending
        if (report.status === 'critical') markerColor = '#dc2626'; // red
        if (report.status === 'completed') markerColor = '#16a34a'; // green

        // Create custom marker icon
        const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: markerColor,
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: 2
        };

        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: report.title,
            icon: markerIcon,
            reportData: report
        });

        // Add click listener to show info window
        marker.addListener('click', () => {
            const content = `
                <div style="padding: 10px; max-width: 250px;">
                    <h3 style="margin: 0 0 10px 0; color: #333; font-size: 1.1rem;">${report.title}</h3>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;"><strong>Estado:</strong> ${getStatusText(report.status)}</p>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;"><strong>Fecha:</strong> ${report.date}</p>
                    <p style="margin: 5px 0; color: #666; font-size: 0.9rem;"><strong>Descripción:</strong> ${report.description || 'Sin descripción'}</p>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    });

    // Adjust map bounds to show all markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.getPosition()));
        map.fitBounds(bounds);
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
    document.getElementById('count-all').textContent = reports.length;

    // You can add logic to count by category if your reports have categories
    // For now, showing all in each category
    document.getElementById('count-infra').textContent = reports.filter(r => r.title.toLowerCase().includes('bache') || r.title.toLowerCase().includes('luminaria')).length;
    document.getElementById('count-services').textContent = reports.filter(r => r.title.toLowerCase().includes('agua') || r.title.toLowerCase().includes('basura')).length;
    document.getElementById('count-security').textContent = reports.filter(r => r.title.toLowerCase().includes('seguridad')).length;
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
            marker.setVisible(true);
        } else {
            // Implement filtering logic based on report category
            // For now, show all markers
            marker.setVisible(true);
        }
    });
}
