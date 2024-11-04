
document.addEventListener('DOMContentLoaded', () => {

    
    if (typeof mapboxgl !== 'undefined') {
        mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12', // Add a style
            center: listing.geometry.coordinates, //[lng,ltd]
            zoom: 9
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());

        // Add a marker
        new mapboxgl.Marker({color: "red"})
            .setLngLat(listing.geometry.coordinates)
            .setPopup(new mapboxgl.Popup({offset: 25,})
            .setHTML(`<h5>${listing.title}</h5><p>Exact location provided after booking</p>`))
            .addTo(map)
    } else {
        console.error('Mapbox GL JS not loaded');
    }
});

