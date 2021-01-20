mapboxgl.accessToken = mapToken;
var map = new mapboxgl.Map({
	container: "map",
	style: "mapbox://styles/porschi/ckk53f3ww5zo517sia21nm79z", // stylesheet location
	center: campground.geometry.coordinates, // starting position [lng, lat]
	zoom: 10, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(
	new mapboxgl.Popup({offset:25})
	.setHTML(
		`<h3>${campground.title}</h3>`
	)
)
.addTo(map);
