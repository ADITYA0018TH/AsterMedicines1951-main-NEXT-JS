"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface VisitorMapProps {
    locations: {
        city: string;
        country: string;
        lat: number;
        lon: number;
        count: number;
    }[];
}

const VisitorMap = ({ locations }: VisitorMapProps) => {
    const sizeScale = useMemo(() => {
        const max = Math.max(...locations.map(l => l.count), 0);
        return scaleLinear().domain([0, max]).range([4, 12]);
    }, [locations]);

    return (
        <div className="glass-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Visitor Locations</h3>
            <div className="h-[400px] w-full bg-blue-50/50 dark:bg-blue-900/10 rounded-xl overflow-hidden">
                <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#EAEAEC"
                                    stroke="#D6D6DA"
                                    style={{
                                        default: { fill: "#D6D6DA", outline: "none" },
                                        hover: { fill: "#F53", outline: "none" },
                                        pressed: { fill: "#E42", outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                    {locations.map((loc, index) => (
                        <Marker key={index} coordinates={[loc.lon, loc.lat]}>
                            <circle r={sizeScale(loc.count)} fill="#F53" stroke="#FFF" strokeWidth={2} />
                            <title>{`${loc.city}, ${loc.country}: ${loc.count} visits`}</title>
                        </Marker>
                    ))}
                </ComposableMap>
            </div>
        </div>
    );
};

export default VisitorMap;
