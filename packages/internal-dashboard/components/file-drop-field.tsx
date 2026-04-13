import { ImagePlus } from "lucide-react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Form from "next/form";

type FileDropFieldProps = Omit<React.ComponentProps<"input">, "type" | "id" | "name"> & {
    id: string;
    name: string;
    label: string;
    helper?: string;
    description?: string;
    hint?: string;
    className?: string;
    dropzoneClassName?: string;
};

async function uploadFileAction() {}

export default function FileDropField({
    id,
    name,
    label,
    helper = "Accepts common product image formats like JPG, PNG, WEBP, and GIF.",
    description = "Drag and drop image files here",
    hint = "or click to browse from your device",
    className,
    dropzoneClassName,
    accept = "image/*",
    multiple = false,
    ...props
}: FileDropFieldProps) {
    return (
        <div className={cn("space-y-2", className)}>
            <Form action={uploadFileAction}>
                <Label htmlFor={id} className="text-sm font-medium text-foreground">
                    {label}
                </Label>

                <label
                    htmlFor={id}
                    className={cn(
                        "group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-slate-300/90 bg-slate-50/80 px-6 py-10 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition hover:border-primary/35 hover:bg-white",
                        dropzoneClassName,
                    )}
                >
                    <div className="flex size-14 items-center justify-center rounded-[20px] border border-slate-200/70 bg-white text-muted-foreground shadow-sm transition group-hover:text-primary">
                        <ImagePlus className="size-6" />
                    </div>

                    <div className="space-y-2">
                        <p className="text-base font-semibold tracking-tight text-foreground">{description}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 text-xs font-medium text-muted-foreground">
                        {["JPG", "PNG", "WEBP", "GIF"].map((format) => (
                            <span key={format} className="rounded-full border border-slate-200/70 bg-white px-3 py-1">
                                {format}
                            </span>
                        ))}
                    </div>

                    <input id={id} name={name} type="file" accept={accept} multiple={multiple} className="sr-only" {...props} />
                </label>

                {helper ? <p className="text-xs leading-5 text-muted-foreground">{helper}</p> : null}
            </Form>
        </div>
    );
}
