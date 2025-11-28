import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface TokenDistributionChartProps {
    candidates: { token: string; prob: number }[];
    actualToken?: string;
}

export function TokenDistributionChart({ candidates, actualToken }: TokenDistributionChartProps) {
    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={candidates}
                    margin={{ top: 15, right: 5, left: 5, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                    <XAxis
                        dataKey="token"
                        tick={{ fontSize: 10 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        tickFormatter={(value) => value.length > 8 ? value.substring(0, 8) + '...' : value}
                    />
                    <YAxis type="number" domain={[0, 1]} hide />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-popover border text-popover-foreground p-2 rounded shadow-md text-xs">
                                        <p className="font-bold font-mono">{d.token}</p>
                                        <p>Prob: {(d.prob * 100).toFixed(2)}%</p>
                                        {actualToken === d.token && <p className="text-primary font-semibold">(Selected)</p>}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                        <LabelList
                            dataKey="prob"
                            position="top"
                            formatter={(value: any) => `${(Number(value) * 100).toFixed(1)}%`}
                            style={{ fontSize: '10px', fill: 'hsl(var(--foreground))' }}
                        />
                        {candidates.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.token === actualToken ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'}
                                opacity={entry.token === actualToken ? 1 : 0.5}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
