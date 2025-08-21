// useMyLocation.js
import { useEffect, useState } from "react";

export default function MyLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보 에러:", error);
        }
      );
    }
  }, []);

  return location;
}
