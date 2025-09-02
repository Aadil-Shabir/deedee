"use client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MultiSelect, SelectedChips } from "@/components/common/multi-select";
import {
    industries as sectorsOpts,
    geographies as regionsOpts,
    businessTypes as businessTypeOpts,
    companyStages as stageOpts,
    businessModels as modelOpts,
    salesTypes as salesTypeOpts,
    investmentRanges as rangeOpts,
} from "@/lib/constants/investor-constants";
import { Button } from "@/components/ui/button";
export type InvestorsFilterState = {
    q: string;
    sectors: string[];
    regions: string[];
    business_type: string[];
    stage: string[];
    model: string[];
    sales_type: string[];
    ranges: string[]; // slugs from investmentRanges
};

export function defaultInvestorsFilters(): InvestorsFilterState {
    return { q: "", sectors: [], regions: [], business_type: [], stage: [], model: [], sales_type: [], ranges: [] };
}

export function InvestorsFiltersBar({
    value,
    onChange,
}: {
    value: InvestorsFilterState;
    onChange: (next: InvestorsFilterState) => void;
}) {
    const set = <K extends keyof InvestorsFilterState>(key: K, val: InvestorsFilterState[K]) =>
        onChange({ ...value, [key]: val });

    return (
        <div className="mb-4 space-y-3">
            <div className="flex items-center gap-3">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={value.q}
                        onChange={(e) => set("q", e.target.value)}
                        placeholder="Search by investor name, email, or firm…"
                        className="pl-9"
                    />
                </div>
                <MultiSelect
                    label="Sectors"
                    options={sectorsOpts}
                    values={value.sectors}
                    onChange={(v) => set("sectors", v)}
                />
                <MultiSelect
                    label="Regions"
                    options={regionsOpts}
                    values={value.regions}
                    onChange={(v) => set("regions", v)}
                />
                <MultiSelect
                    label="Business Type"
                    options={businessTypeOpts}
                    values={value.business_type}
                    onChange={(v) => set("business_type", v)}
                />
                <MultiSelect label="Stage" options={stageOpts} values={value.stage} onChange={(v) => set("stage", v)} />
                <MultiSelect label="Model" options={modelOpts} values={value.model} onChange={(v) => set("model", v)} />
                <MultiSelect
                    label="Sales Type"
                    options={salesTypeOpts}
                    values={value.sales_type}
                    onChange={(v) => set("sales_type", v)}
                />
                <MultiSelect
                    label="Range"
                    options={rangeOpts}
                    values={value.ranges}
                    onChange={(v) => set("ranges", v)}
                />
                <div className="flex-1" /> {/* spacer */}
                <Button
                    variant="outline"
                    onClick={() => onChange(defaultInvestorsFilters())}
                    aria-label="Clear all filters"
                >
                    Clear all
                </Button>
            </div>

            {/* Selected chips row */}
            <div className="flex flex-wrap gap-3">
                <SelectedChips
                    values={value.sectors}
                    options={sectorsOpts}
                    onRemove={(v) =>
                        set(
                            "sectors",
                            value.sectors.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.regions}
                    options={regionsOpts}
                    onRemove={(v) =>
                        set(
                            "regions",
                            value.regions.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.business_type}
                    options={businessTypeOpts}
                    onRemove={(v) =>
                        set(
                            "business_type",
                            value.business_type.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.stage}
                    options={stageOpts}
                    onRemove={(v) =>
                        set(
                            "stage",
                            value.stage.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.model}
                    options={modelOpts}
                    onRemove={(v) =>
                        set(
                            "model",
                            value.model.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.sales_type}
                    options={salesTypeOpts}
                    onRemove={(v) =>
                        set(
                            "sales_type",
                            value.sales_type.filter((x) => x !== v)
                        )
                    }
                />
                <SelectedChips
                    values={value.ranges}
                    options={rangeOpts}
                    onRemove={(v) =>
                        set(
                            "ranges",
                            value.ranges.filter((x) => x !== v)
                        )
                    }
                />
            </div>
        </div>
    );
}
