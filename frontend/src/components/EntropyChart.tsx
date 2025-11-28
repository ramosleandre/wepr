import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface EntropyChartProps {
    data: { token: string; entropy: number; index: number }[];
    onTokenSelect: (index: number) => void;
    selectedIndex: number | null;
}

export function EntropyChart({ data, onTokenSelect, selectedIndex }: EntropyChartProps) {
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    onClick={(e) => {
                        if (e && e.activeTooltipIndex !== undefined && e.activeTooltipIndex !== null) {
                            onTokenSelect(Number(e.activeTooltipIndex));
                        }
                    }}
                    margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                        dataKey="index"
                        hide
                    />
                    <YAxis
                        className="text-xs"
                        domain={[0, 'auto']}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-popover border text-popover-foreground p-2 rounded shadow-md text-xs">
                                        <p className="font-bold">{d.token}</p>
                                        <p>Entropy: {d.entropy.toFixed(3)}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="entropy"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6 }}
                    />
                    {selectedIndex !== null && (
                        <ReferenceLine x={selectedIndex} stroke="hsl(var(--destructive))" strokeDasharray="3 3" />
                    )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
