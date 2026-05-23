import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Circle, GoogleMap, Marker } from "@react-google-maps/api";
import { Loader2, LocateFixed, MapPin } from "lucide-react";
import { reverseGeocode, type ReverseGeocodeResult } from "@/lib/api";
import AddressAutocomplete from "./AddressAutocomplete";
import { useGoogleMaps } from "./GoogleMapsProvider";

export interface AddressPickerLocation {
  lat: number;
  lng: number;
  formatted_address: string;
  street: string;
  district: string;
  city: string;
}

interface AddressPickerMapProps {
  initialLat?: number | null;
  initialLng?: number | null;
  height?: string;
  radiusKm?: number;
  showRadius?: boolean;
  readOnly?: boolean;
  onLocationSelect: (location: AddressPickerLocation) => void;
}

const RIYADH_CENTER = { lat: 24.7136, lng: 46.6753 };

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function AddressPickerMap({
  initialLat,
  initialLng,
  height = "260px",
  radiusKm,
  showRadius = false,
  readOnly = false,
  onLocationSelect,
}: AddressPickerMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const mapRef = useRef<google.maps.Map | null>(null);
  const [position, setPosition] = useState(() => ({
    lat: typeof initialLat === "number" ? initialLat : RIYADH_CENTER.lat,
    lng: typeof initialLng === "number" ? initialLng : RIYADH_CENTER.lng,
  }));
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasInitialPin = typeof initialLat === "number" && typeof initialLng === "number";

  useEffect(() => {
    if (typeof initialLat !== "number" || typeof initialLng !== "number") return;
    const nextPosition = { lat: initialLat, lng: initialLng };
    setPosition(nextPosition);
    mapRef.current?.panTo(nextPosition);
  }, [initialLat, initialLng]);

  const selectLocation = useCallback(
    async (lat: number, lng: number, knownAddress?: Partial<AddressPickerLocation>) => {
      const nextPosition = { lat, lng };
      setPosition(nextPosition);
      mapRef.current?.panTo(nextPosition);
      setError(null);

      if (knownAddress?.street || knownAddress?.formatted_address) {
        onLocationSelect({
          lat,
          lng,
          formatted_address: knownAddress.formatted_address || knownAddress.street || "",
          street: knownAddress.street || knownAddress.formatted_address || "",
          district: knownAddress.district || "",
          city: knownAddress.city || "Riyadh",
        });
        return;
      }

      setIsResolving(true);
      try {
        const result = await reverseGeocode(lat, lng);
        if (result.is_estimate && !result.street) {
          throw new Error("Reverse geocode fallback only");
        }
        onLocationSelect(mapReverseResult(lat, lng, result));
      } catch {
        try {
          const fallback = await clientReverseGeocode(lat, lng);
          onLocationSelect(fallback);
        } catch {
          setError("Could not read this address. You can still enter the fields manually.");
          onLocationSelect({
            lat,
            lng,
            formatted_address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            street: "",
            district: "",
            city: "Riyadh",
          });
        }
      } finally {
        setIsResolving(false);
      }
    },
    [onLocationSelect]
  );

  const handleAutocompleteSelect = useCallback(
    (address: {
      street: string;
      district: string;
      city: string;
      latitude: number;
      longitude: number;
      formattedAddress: string;
    }) => {
      void selectLocation(address.latitude, address.longitude, {
        formatted_address: address.formattedAddress,
        street: address.street,
        district: address.district,
        city: address.city,
      });
    },
    [selectLocation]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Your browser does not support location access.");
      return;
    }

    setIsResolving(true);
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        void selectLocation(geoPosition.coords.latitude, geoPosition.coords.longitude).finally(() => {
          setIsResolving(false);
        });
      },
      () => {
        setIsResolving(false);
        setError("Location access was not allowed.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [selectLocation]);

  const radiusMeters = useMemo(() => {
    if (!showRadius || !radiusKm || radiusKm <= 0) return null;
    return radiusKm * 1000;
  }, [radiusKm, showRadius]);

  if (loadError) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
        {loadError.message || "Map could not be loaded. Check your Google Maps browser key."}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-muted/40" style={{ height }}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {!readOnly && (
        <AddressAutocomplete
          onAddressSelect={handleAutocompleteSelect}
          placeholder="Search for a delivery address..."
          showCurrentLocation={false}
        />
      )}

      <div className="relative overflow-hidden rounded-lg border border-border">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height }}
          center={position}
          zoom={hasInitialPin ? 15 : 12}
          options={mapOptions}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onClick={(event) => {
            if (readOnly || !event.latLng) return;
            void selectLocation(event.latLng.lat(), event.latLng.lng());
          }}
        >
          {radiusMeters && (
            <Circle
              center={position}
              radius={radiusMeters}
              options={{
                strokeColor: "#2563eb",
                strokeOpacity: 0.55,
                strokeWeight: 2,
                fillColor: "#2563eb",
                fillOpacity: 0.08,
              }}
            />
          )}
          <Marker
            position={position}
            draggable={!readOnly}
            onDragEnd={(event) => {
              if (!event.latLng) return;
              void selectLocation(event.latLng.lat(), event.latLng.lng());
            }}
          />
        </GoogleMap>
        {isResolving && (
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-md bg-background/95 px-3 py-2 text-xs font-medium shadow">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            Reading location...
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
        </p>
        {!readOnly && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isResolving}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-60"
          >
            {isResolving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
            Use current location
          </button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function mapReverseResult(lat: number, lng: number, result: ReverseGeocodeResult): AddressPickerLocation {
  return {
    lat,
    lng,
    formatted_address: result.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    street: result.street || result.formatted_address || "",
    district: result.district || "",
    city: result.city || "Riyadh",
  };
}

async function clientReverseGeocode(lat: number, lng: number): Promise<AddressPickerLocation> {
  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode({ location: { lat, lng } });
  const place = response.results[0];
  if (!place) throw new Error("No address result");

  const components = place.address_components || [];
  const get = (type: string) => components.find((component) => component.types.includes(type))?.long_name || "";
  const street = [get("street_number"), get("route")].filter(Boolean).join(" ") || get("premise") || place.formatted_address || "";
  const district = get("sublocality_level_1") || get("sublocality") || get("neighborhood") || get("locality");
  const city = get("administrative_area_level_1") || get("locality") || "Riyadh";

  return {
    lat,
    lng,
    formatted_address: place.formatted_address || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    street,
    district,
    city,
  };
}
