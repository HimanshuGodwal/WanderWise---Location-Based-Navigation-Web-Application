// map fun.
let map, directionsService, directionsRenderer, service, infowindow, markers = [];

function initMap() {
    const initialLocation = { lat: 26.84395, lng: 75.56521 };

    
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 15,
    });


    

    // Initialize Service
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);


    service = new google.maps.places.PlacesService(map);
    infowindow = new google.maps.InfoWindow();






    //  autocomplete......
    const fromInput = document.getElementById("from");
    const toInput = document.getElementById("to");
    new google.maps.places.Autocomplete(fromInput);
    new google.maps.places.Autocomplete(toInput);


    //   buttons
    document.getElementById("restaurantBtn").addEventListener("click", () => findNearbyPlaces("restaurant"));
    document.getElementById("cafeBtn").addEventListener("click", () => findNearbyPlaces("cafe"));
    document.getElementById("hospitalBtn").addEventListener("click", () => findNearbyPlaces("hospital"));
    document.getElementById("stationeryBtn").addEventListener("click", () => findNearbyPlaces("stationery_store"));
    document.getElementById("clubBtn").addEventListener("click", () => findNearbyPlaces("night_club"));
    document.getElementById("hostelBtn").addEventListener("click", () => findNearbyPlaces("lodging"));
    document.getElementById("templeBtn").addEventListener("click", () => findNearbyPlaces("hindu_temple"));

    
    document.getElementById("routeBtn").addEventListener("click", calculateRoute);
}








// Find nearby places fun,
function findNearbyPlaces(type) {
    const request = {
        location: map.getCenter(),
        radius: 3000,
        type: type,
    };

    service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            clearMarkers(); // Remove old markers
            results.forEach(place => {
                if (place.geometry && place.geometry.location) {
                    createMarker(place);
                }
            });
        } else {
            alert("No places found.");
        }
    });
}



// Create  marker 
function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });
    markers.push(marker);

    google.maps.event.addListener(marker, "click", function () {
        displayPlaceDetails(place);
    });
}




// Display place details in the side panel
function displayPlaceDetails(place) {
    service.getDetails({ placeId: place.place_id }, (details, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && details) {
            const sidePanel = document.getElementById("placeDetails");
            sidePanel.innerHTML = `
                <h2>${details.name}</h2>
                <p><strong>Address:</strong> ${details.formatted_address || "N/A"}</p>
                <p><strong>Phone:</strong> ${details.formatted_phone_number || "N/A"}</p>
                <p><strong>Rating:</strong> ${details.rating || "N/A"}</p>
                <p><strong>Website:</strong> 
                    ${details.website ? `<a href="${details.website}" target="_blank">${details.website}</a>` : "N/A"}
                </p>
                <p><strong>Opening Hours:</strong></p>
                <ul>
                    ${details.opening_hours
                        ? details.opening_hours.weekday_text.map(day => `<li>${day}</li>`).join("")
                        : "N/A"}
                </ul>
            `;
        } else {
            alert("Details not available for this place.");
        }
    });
}



// Clear all markers
function clearMarkers() {
    markers.forEach(marker => marker.setMap(null));
    markers = [];
}




// Calculate route from text fields

function calculateRoute() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;

    if (!from || !to) {
        alert("Please enter both 'From' and 'To' locations.");
        return;
    }

    const request = {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            const distance = result.routes[0].legs[0].distance.text;
            const duration = result.routes[0].legs[0].duration.text;

            document.getElementById("output").innerHTML = `
                <div>
                    <p><strong>From:</strong> ${from}</p>
                    <p><strong>To:</strong> ${to}</p>
                    <p><strong>Distance:</strong> ${distance}</p>
                    <p><strong>Driving Time:</strong> ${duration}</p>
                </div>
            `;
        } else {
            alert("Unable to find route. Please check the locations and try again.");
        }
    });
}

// Initialize map on page load
google.maps.event.addDomListener(window, "load", initMap);




