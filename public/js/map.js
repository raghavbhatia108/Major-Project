mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [74.8723, 31.6340], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// const marker1 = new mapboxgl.Marker()
// .setLngLat([12.554729, 55.70651])
// .addTo(map);
console.log(coordinates);