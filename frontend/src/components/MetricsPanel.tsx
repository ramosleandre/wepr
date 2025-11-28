import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EntropyChart } from './EntropyChart';
import { TokenDistributionChart } from './TokenDistributionChart';

interface TokenData {
    token: string;
    entropy: number;
    normalized_entropy?: number;
    candidates: { token: string; prob: number }[];
}

interface MetricsPanelProps {
    epr: number | null;
    risk_score: number | null;
    tokens: TokenData[];
}

export function MetricsPanel({ epr, risk_score, tokens }: MetricsPanelProps) {
    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number | null>(null);

    // Reset selection when tokens change (new message)
    useEffect(() => {
        if (tokens.length > 0) {
            setSelectedTokenIndex(null);
        }
    }, [tokens]);

    const handlePrev = () => {
        if (selectedTokenIndex !== null && selectedTokenIndex > 0) {
            setSelectedTokenIndex(selectedTokenIndex - 1);
        } else if (selectedTokenIndex === null && tokens.length > 0) {
            setSelectedTokenIndex(tokens.length - 1);
        }
    };

    const handleNext = () => {
        if (selectedTokenIndex !== null && selectedTokenIndex < tokens.length - 1) {
            setSelectedTokenIndex(selectedTokenIndex + 1);
        } else if (selectedTokenIndex === null && tokens.length > 0) {
            setSelectedTokenIndex(0);
        }
    };

    if (epr === null || risk_score === null) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground p-4 text-center">
                Start a conversation to see hallucination metrics.
            </div>
        );
    }

    const isHighRisk = epr > 1.5; // Arbitrary threshold for raw entropy
    const chartData = tokens.map((t, i) => ({
        token: t.token,
        entropy: t.entropy,
        index: i
    }));

    const selectedToken = selectedTokenIndex !== null ? tokens[selectedTokenIndex] : null;

    // Calculate Running EPR (Average Entropy up to selected token)
    let runningEpr = epr;
    if (selectedTokenIndex !== null) {
        const slicedTokens = tokens.slice(0, selectedTokenIndex + 1);
        const sumEntropy = slicedTokens.reduce((acc, t) => acc + t.entropy, 0);
        runningEpr = sumEntropy / slicedTokens.length;
    }

    return (
        <div className="h-full flex flex-col gap-4 p-4 overflow-y-auto">
            {/* Summary Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {selectedTokenIndex !== null ? `Running EPR (Token ${selectedTokenIndex + 1}/${tokens.length})` : "Total EPR"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold">{runningEpr.toFixed(4)}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <Badge variant={isHighRisk ? "destructive" : "default"}>
                                {isHighRisk ? "High Uncertainty" : "Low Uncertainty"}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                                Risk: {(Math.min(epr / 2.5, 1.0)).toFixed(2)} / 1.0
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                        Final EPR: {epr.toFixed(4)}
                    </div>
                </CardContent>
            </Card>

            {/* Entropy Chart */}
            <Card className="flex-1 min-h-[250px]">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium">Entropy Flow</CardTitle>
                    <div className="flex gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={handlePrev} disabled={!tokens.length}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={handleNext} disabled={!tokens.length}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="h-[200px]">
                    <EntropyChart
                        data={chartData}
                        onTokenSelect={setSelectedTokenIndex}
                        selectedIndex={selectedTokenIndex}
                    />
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Click chart or use arrows to trace entropy.
                    </p>
                </CardContent>
            </Card>

            {/* Token Detail Chart */}
            <Card className="flex-1 min-h-[300px]">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between items-center">
                        <span>{selectedToken ? `Distribution: "${selectedToken.token}"` : "Token Distribution"}</span>
                        {selectedToken && (
                            <div className="flex gap-2 text-xs font-normal">
                                <span className="text-muted-foreground">Entropy: <span className="font-mono text-foreground">{selectedToken.entropy.toFixed(4)}</span></span>
                                <span className="text-muted-foreground">Norm: <span className="font-mono text-foreground">{selectedToken.normalized_entropy?.toFixed(2) ?? 'N/A'}</span></span>
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px]">
                    {selectedToken ? (
                        <TokenDistributionChart
                            candidates={selectedToken.candidates}
                            actualToken={selectedToken.token}
                        />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                            Select a token to see top candidates.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
