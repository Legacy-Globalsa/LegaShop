import { useRef, useEffect, useState } from "react";
import { useGoogleMaps } from "./GoogleMapsProvider";
import { MapPin, Loader2 } from "lucide-react";

interface AddressResult {
  street: string;
  district: string;
  city: string;
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: AddressResult) => void;
  placeholder?: string;
  defaultValue?: string;
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Search for your address...",
  defaultValue = "",
}: AddressAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "sa" }, // Saudi Arabia only
      types: ["address"],
      fields: ["address_components", "geometry", "formatted_address"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;

      const result = parseGooglePlace(place);
      setValue(result.formattedAddress);
      onAddressSelect(result);
    });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded, onAddressSelect]);

  // "Use my location" button
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geocoder = new google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: latitude, lng: longitude },
          });

          if (response.results[0]) {
            const result = parseGooglePlace(response.results[0]);
            result.latitude = latitude;
            result.longitude = longitude;
            setValue(result.formattedAddress);
            onAddressSelect(result);
          }
        } catch (err) {
          console.error("Geocoding failed:", err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.error("Geolocation failed:", err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isLoaded) {
    return (
      <div className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted animate-pulse text-sm text-muted-foreground">
        Loading address search...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>
      <button
        type="button"
        onClick={handleUseMyLocation}
        disabled={isLocating}
        className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
      >
        {isLocating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <MapPin className="w-3.5 h-3.5" />
        )}
        {isLocating ? "Getting your location..." : "Use my current location"}
      </button>
    </div>
  );
}

/** Parse a Google Place result into our Address fields */
function parseGooglePlace(place: google.maps.GeocoderResult | google.maps.places.PlaceResult): AddressResult {
  const components = place.address_components || [];
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name || "";

  const street = [get("street_number"), get("route")].filter(Boolean).join(" ") || get("premise");
  const district = get("sublocality_level_1") || get("sublocality") || get("neighborhood") || get("locality");
  const city = get("administrative_area_level_1") || get("locality") || "Riyadh";

  const lat = typeof place.geometry?.location?.lat === "function"
    ? place.geometry.location.lat()
    : (place.geometry?.location?.lat as number) || 0;

  const lng = typeof place.geometry?.location?.lng === "function"
    ? place.geometry.location.lng()
    : (place.geometry?.location?.lng as number) || 0;

  return {
    street: street || place.formatted_address || "",
    district,
    city,
    latitude: lat,
    longitude: lng,
    formattedAddress: place.formatted_address || `${street}, ${district}`,
  };
}
