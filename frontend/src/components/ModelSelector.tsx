import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface Model {
    id: string;
    name: string;
}

interface ModelSelectorProps {
    models: Model[];
    selectedModel: string;
    onModelChange: (value: string) => void;
    disabled?: boolean;
}

export function ModelSelector({ models, selectedModel, onModelChange, disabled }: ModelSelectorProps) {
    return (
        <div className="w-[250px]">
            <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                    {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                            {model.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
