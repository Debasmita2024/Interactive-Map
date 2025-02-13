// Initialize Map (Using OpenStreetMap)
const map = L.map('map').setView([28.7041, 77.1025], 5); // Default (New Delhi)

// Define tile layers
const tileLayers = {
    "streets-v11": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }),
    "dark-v11": L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png?theme=dark', { attribution: '© OpenStreetMap contributors' }),
    "satellite-v9": L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }),
    "light-v10": L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png?theme=light', { attribution: '© OpenStreetMap contributors' })
};

// Add default tile layer (streets)
let currentLayer = tileLayers["streets-v11"];
currentLayer.addTo(map);

// Change map style based on dropdown selection
document.getElementById('map-style').addEventListener('change', function () {
    map.removeLayer(currentLayer);  // Remove current tile layer
    currentLayer = tileLayers[this.value]; // Get the new layer
    currentLayer.addTo(map); // Add the selected layer to the map
});

// Load saved markers from localStorage
let markers = [];
const savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
savedMarkers.forEach(({ lat, lng }) => addMarker(lat, lng));

// Function to add a marker
function addMarker(lat, lng) {
    const marker = L.marker([lat, lng]).addTo(map);
    markers.push(marker);

    // Save to localStorage
    let savedMarkers = JSON.parse(localStorage.getItem('markers')) || [];
    savedMarkers.push({ lat, lng });
    localStorage.setItem('markers', JSON.stringify(savedMarkers));
}

// Click on map to add a marker
map.on('click', (event) => {
    const { lat, lng } = event.latlng;
    addMarker(lat, lng);
});

// Search Feature (Using Free Nominatim API)
document.getElementById('search-btn').addEventListener('click', () => {
    let location = document.getElementById('search').value;
    if (location) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    let { lat, lon } = data[0];
                    map.setView([lat, lon], 10);
                    addMarker(lat, lon);
                } else {
                    alert("Location not found!");
                }
            })
            .catch(error => console.error("Error fetching location:", error));
    }
});

// Locate User Button
document.getElementById('locate-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 12);
            addMarker(latitude, longitude);
        }, () => alert("Location access denied."));
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});

// Clear Markers Button
document.getElementById('clear-markers').addEventListener('click', () => {
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    localStorage.removeItem('markers');
    alert("All markers cleared!");
});
