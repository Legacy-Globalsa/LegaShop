import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { useGoogleMaps } from "./GoogleMapsProvider";
import type { Store } from "@/lib/api";

interface StoreMapProps {
  stores: Store[];
  selectedStoreId?: number;
  onStoreSelect?: (store: Store) => void;
  height?: string;
}

// Riyadh center
const RIYADH_CENTER = { lat: 24.7136, lng: 46.6753 };

const mapContainerStyle = {
  width: "100%",
  borderRadius: "12px",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

export default function StoreMap({
  stores,
  selectedStoreId,
  onStoreSelect,
  height = "400px",
}: StoreMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [activeStore, setActiveStore] = useState<Store | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    if (stores.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    stores.forEach((store) => {
      bounds.extend({ lat: store.latitude, lng: store.longitude });
    });
    map.fitBounds(bounds, 60);
  }, [stores]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-xl" style={{ height }}>
        <p className="text-sm text-muted-foreground">Failed to load map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center bg-muted rounded-xl animate-pulse" style={{ height }}>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ ...mapContainerStyle, height }}
      center={RIYADH_CENTER}
      zoom={12}
      options={mapOptions}
      onLoad={onMapLoad}
    >
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={{ lat: store.latitude, lng: store.longitude }}
          title={store.name}
          onClick={() => {
            setActiveStore(store);
            onStoreSelect?.(store);
          }}
          icon={
            store.id === selectedStoreId
              ? {
                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }
              : undefined
          }
        />
      ))}

      {activeStore && (
        <InfoWindow
          position={{ lat: activeStore.latitude, lng: activeStore.longitude }}
          onCloseClick={() => setActiveStore(null)}
        >
          <div className="p-1 min-w-[160px]">
            <h3 className="font-bold text-sm text-gray-900">{activeStore.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{activeStore.district}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
              <span>⭐ {activeStore.rating?.toFixed(1) ?? "—"}</span>
              <span>🕐 {activeStore.avg_delivery_min} min</span>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
