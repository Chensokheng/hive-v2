"use client";

import React from "react";
import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from "@react-google-maps/api";

// import { GOOGLE_MAP_API_KEY } from './page';

const containerStyle = {
  width: "100%",
  height: "400px",
};

const origin = {
  lat: 37.437041393899676,
  lng: -4.191635586788259,
};

const destination = {
  lat: 37.440575591901045,
  lng: -4.231433159434073,
};

const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const GoogleMapRouteComponent = () => {
  const [directions, setDirections] = React.useState(null);
  const [travelTime, setTravelTime] = React.useState(null);

  /* `const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
        const route = response.routes[0].legs[0];
        setTravelTime(route.duration.text);
      } else {
        console.error('Directions request failed due to ' + response.status);
      }
    }
  };` */

  const directionsCallback = () => {};

  /* FIXME: 
  1. Add GoogleMap view-only
  2. Update
  
  */

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={origin} zoom={10}>
        <Marker position={origin} />
        <Marker position={destination} />
        <DirectionsService
          options={{
            destination: destination,
            origin: origin,
            travelMode: google.maps.TravelMode.DRIVING,
            // travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
        {directions && (
          <DirectionsRenderer
            options={{
              directions: directions,
            }}
          />
        )}
      </GoogleMap>
      {travelTime && <p>Estimated travel time: {travelTime}</p>}
    </LoadScript>
  );
};

export default GoogleMapRouteComponent;
