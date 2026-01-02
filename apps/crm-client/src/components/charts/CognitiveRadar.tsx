import React from 'react';

interface CognitiveRadarProps {
    labels: string[];
    dataInitial: number[]; // 0-3
    dataCurrent: number[]; // 0-3
    max?: number;
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({ labels, dataInitial, dataCurrent, max = 3 }) => {
    const size = 300;
    const center = size / 2;
    const radius = 120; // Padding ensures labels fit
    const angleSlice = (Math.PI * 2) / labels.length;

    // Helper: Convert "Score + Index" to {x, y}
    const getPoint = (value: number, index: number) => {
        const angle = index * angleSlice - Math.PI / 2; // Start at 12 o'clock
        const r = (value / max) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    // Helper: Generate SVG Path string
    const createPath = (data: number[]) => {
        const points = data.map((val, i) => {
            const { x, y } = getPoint(val, i);
            return `${x},${y}`;
        });
        return points.join(' ');
    };

    // Helper: Generate Grid Levels (1, 2, 3)
    const gridLevels = [1, 2, 3].map(level => {
        const points = labels.map((_, i) => {
            const { x, y } = getPoint(level, i);
            return `${x},${y}`;
        }).join(' ');
        return points;
    });

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                {/* 1. Grid Levels (Polygons) */}
                {gridLevels.map((points, i) => (
                    <polygon
                        key={i}
                        points={points}
                        fill="none"
                        stroke="#e2e8f0" // slate-200
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* 2. Axis Lines */}
                {labels.map((_, i) => {
                    const { x, y } = getPoint(max, i);
                    return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#f1f5f9" strokeWidth="1" />;
                })}

                {/* 3. Initial Data (Gray Layer) */}
                <polygon
                    points={createPath(dataInitial)}
                    fill="#94a3b8" // slate-400
                    fillOpacity="0.2"
                    stroke="#64748b" // slate-500
                    strokeWidth="2"
                />

                {/* 4. Current Data (Pink Layer - Premium) */}
                <polygon
                    points={createPath(dataCurrent)}
                    fill="#EC008C" // Magenta Activa
                    fillOpacity="0.3"
                    stroke="#EC008C"
                    strokeWidth="3"
                    className="drop-shadow-lg" // SVG Shadow for 3D effect
                />

                {/* 5. Points (Knobs) */}
                {dataCurrent.map((val, i) => {
                    const { x, y } = getPoint(val, i);
                    return <circle key={i} cx={x} cy={y} r="4" fill="#EC008C" stroke="white" strokeWidth="2" />;
                })}

                {/* 6. Labels */}
                {labels.map((label, i) => {
                    const { x, y } = getPoint(max + 0.4, i); // Push out slightly
                    const anchor = x < center ? 'end' : x > center ? 'start' : 'middle';
                    const baseline = y < center ? 'baseline' : 'hanging';

                    // Simple logic to adjust text overlap
                    const adjX = x < center ? -10 : x > center ? 10 : 0;
                    const adjY = y < center ? -5 : 5;

                    return (
                        <text
                            key={i}
                            x={x + adjX}
                            y={y + adjY}
                            textAnchor={anchor}
                            dominantBaseline={baseline as any} // Better than dy for precision
                            className="text-[10px] font-bold fill-slate-500 uppercase tracking-tight"
                            style={{ fontSize: '10px' }} // SVG text sizing
                        >
                            {label}
                        </text>
                    );
                })}
            </svg>

            {/* Legend */}
            <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-400/30 border border-slate-500 rounded-sm"></div>
                    <span className="text-xs font-bold text-slate-500">Inicial</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#EC008C]/30 border border-[#EC008C] rounded-sm"></div>
                    <span className="text-xs font-bold text-[#EC008C]">Actual</span>
                </div>
            </div>
        </div>
    );
};
