import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


interface InputFileProps {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputFile({ onChange }: InputFileProps) {
return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">File</Label>
        <Input id="file" type="file" onChange={onChange} />
    </div>
);
}