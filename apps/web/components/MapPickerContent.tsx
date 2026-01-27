"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default leaflet marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapPickerContentProps {
    value?: { lat: number; lng: number };
    onChange: (val: { lat: number; lng: number }) => void;
    defaultCenter?: [number, number];
}

function LocationMarker({ value, onChange }: { value?: { lat: number; lng: number }, onChange: (val: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click(e) {
            onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
        },
    });

    return value ? <Marker position={[value.lat, value.lng]} /> : null;
}

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

export default function MapPickerContent({ value, onChange, defaultCenter = [-6.200000, 106.816666] }: MapPickerContentProps) {
    const currentCenter: [number, number] = value ? [value.lat, value.lng] : defaultCenter;

    return (
        <div className="w-full h-full min-h-[300px] relative">
            <MapContainer
                center={currentCenter}
                zoom={13}
                scrollWheelZoom={true}
                className="w-full h-full rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker value={value} onChange={onChange} />
                <ChangeView center={currentCenter} />
            </MapContainer>
        </div>
    );
}
