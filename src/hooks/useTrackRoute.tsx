import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// global variable to store last non-detail route
let lastNonDetailRoute = "/";

export const useTrackRoute = () => {
  const location = useLocation();

  useEffect(() => {
    // if current path is NOT detail, remember it
    if (!location.pathname.startsWith("/detail")) {

      lastNonDetailRoute = location.pathname + location.search;
    }
  }, [location]);

  return lastNonDetailRoute;
};
