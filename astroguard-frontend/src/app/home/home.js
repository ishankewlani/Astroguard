// script.js
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initialize Chart.js (Left Panel)
    const ctx = document.getElementById('lightCurveChart').getContext('2d');
    
    // Generate dummy curve data
    const labels = Array.from({length: 30}, (_, i) => i);
    const dataPoints = labels.map(i => {
        if(i < 10) return 20 + Math.random() * 5;
        if(i < 15) return 20 + Math.pow(i - 9, 2) * 2; 
        return 70 - (i - 15) * 2 + Math.random() * 5; 
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Intensity',
                data: dataPoints,
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                pointHoverRadius: 3,
                fill: true,
                tension: 0.4
            },{
                label: 'Baseline',
                data: labels.map(() => 22),
                borderColor: '#ff9d00',
                borderWidth: 1,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            scales: {
                x: { display: false },
                y: { 
                    display: true, 
                    position: 'right',
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#6b86a1', font: { size: 9 } }
                }
            },
            layout: { padding: 0 }
        }
    });

    // 2. Initialize Leaflet Map (Right Panel)
    const map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView([15.0, 45.0], 3); // Centered between Africa and India

    // Add Dark Matter tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom Icon Generator
    const createMarker = (type) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="marker-pulse marker-${type}"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    // Add Markers based on reference image
    // Africa (Red - Wildfire/Critical)
    L.marker([5.0, 20.0], { icon: createMarker('red') }).addTo(map);
    
    // India (Red - Coastal/Critical)
    L.marker([19.0, 73.0], { icon: createMarker('red') }).addTo(map);
    
    // SE Asia (Orange - High)
    L.marker([15.0, 105.0], { icon: createMarker('orange') }).addTo(map);

    // Heatmap zones simulation using circles
    L.circle([5.0, 20.0], {
        color: 'rgba(255, 51, 68, 0.2)',
        fillColor: '#ff3344',
        fillOpacity: 0.1,
        radius: 800000
    }).addTo(map);

    L.circle([15.0, 105.0], {
        color: 'rgba(255, 157, 0, 0.2)',
        fillColor: '#ff9d00',
        fillOpacity: 0.1,
        radius: 600000
    }).addTo(map);

    // 3. Simple UI Interactions
    const uiButtons = document.querySelectorAll('.icon-btn, .map-ctrl-group i');
    uiButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.style.color = 'white';
            setTimeout(() => { this.style.color = ''; }, 200);
        });
    });
});