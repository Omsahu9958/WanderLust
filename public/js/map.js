mapboxgl.accessToken = maptoken;

const fallbackCoordinates = [77.209, 28.6139]; // [lng, lat]
const validCoordinates =
  Array.isArray(coordinates) &&
  coordinates.length === 2 &&
  Number.isFinite(coordinates[0]) &&
  Number.isFinite(coordinates[1]);
const center = validCoordinates ? coordinates : fallbackCoordinates;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center,
  zoom: 9,
});

const popup = new mapboxgl.Popup({ offset: 25 }).setText("Listing location");
new mapboxgl.Marker().setLngLat(center).setPopup(popup).addTo(map);
        


        