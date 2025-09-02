"use client";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandInput, CommandEmpty, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string; description?: string };

export function MultiSelect({
    label,
    options,
    values,
    onChange,
    className,
    searchable = true,
    emptyText = "No results",
}: {
    label: string;
    options: Option[];
    values: string[];
    onChange: (next: string[]) => void;
    className?: string;
    searchable?: boolean;
    emptyText?: string;
}) {
    const [open, setOpen] = React.useState(false);

    const toggle = (v: string) => {
        if (values.includes(v)) onChange(values.filter((x) => x !== v));
        else onChange([...values, v]);
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
    };

    const buttonText =
        values.length === 0
            ? label
            : values.length === 1
            ? options.find((o) => o.value === values[0])?.label ?? label
            : `${label} • ${values.length}`;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className={cn("justify-between w-[220px]", className)}>
                    <span className="truncate">{buttonText}</span>
                    <div className="flex items-center gap-1">
                        {values.length > 0 && (
                            <X
                                className="h-3.5 w-3.5 opacity-60 hover:opacity-100"
                                onClick={clear}
                                aria-label={`Clear ${label}`}
                            />
                        )}
                        <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[300px] p-0" align="start">
                <Command /* leave default filtering ON */>
                    {searchable && <CommandInput placeholder={`Search ${label.toLowerCase()}…`} />}
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((opt) => {
                                const active = values.includes(opt.value);
                                return (
                                    <CommandItem
                                        key={opt.value}
                                        value={`${opt.label} ${opt.value}`} // enable text search
                                        onSelect={() => toggle(opt.value)}
                                        className="flex items-start gap-2"
                                    >
                                        <Check className={cn("h-4 w-4 mt-0.5", active ? "opacity-100" : "opacity-0")} />
                                        <div className="flex flex-col">
                                            <span>{opt.label}</span>
                                            {opt.description && (
                                                <span className="text-xs text-muted-foreground">{opt.description}</span>
                                            )}
                                        </div>
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function SelectedChips({
    values,
    options,
    onRemove,
}: {
    values: string[];
    options: Option[];
    onRemove: (value: string) => void;
}) {
    const map = React.useMemo(() => new Map(options.map((o) => [o.value, o.label])), [options]);
    if (values.length === 0) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {values.map((v) => (
                <Badge key={v} variant="secondary" className="px-2 py-1">
                    {map.get(v) ?? v}
                    <button
                        className="ml-1 opacity-60 hover:opacity-100"
                        onClick={() => onRemove(v)}
                        aria-label="Remove"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
        </div>
    );
}
