import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface GenerationSettingsProps {
    temperature: number;
    setTemperature: (val: number) => void;
    topK: number;
    setTopK: (val: number) => void;
    seed: string;
    setSeed: (val: string) => void;
    disabled?: boolean;
}

export function GenerationSettings({
    temperature,
    setTemperature,
    topK,
    setTopK,
    seed,
    setSeed,
    disabled
}: GenerationSettingsProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" disabled={disabled}>
                    <Settings2 className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Generation Settings</h4>
                        <p className="text-sm text-muted-foreground">
                            Adjust model parameters.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="temp">Temperature</Label>
                            <div className="col-span-2 flex items-center gap-2">
                                <Slider
                                    id="temp"
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    value={[temperature]}
                                    onValueChange={(vals) => setTemperature(vals[0])}
                                    className="flex-1"
                                />
                                <span className="w-8 text-right text-sm">{temperature}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="topk">Top K</Label>
                            <Input
                                id="topk"
                                type="number"
                                value={topK}
                                onChange={(e) => setTopK(Number(e.target.value))}
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="seed">Seed</Label>
                            <Input
                                id="seed"
                                type="number"
                                placeholder="Random"
                                value={seed}
                                onChange={(e) => setSeed(e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
