import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { CalendarIcon } from "lucide-react";

const MONTHS = [
    "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
    "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2);
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface ScrollColumnProps {
    items: { value: number; label: string }[];
    selected: number;
    onChange: (value: number) => void;
}

function ScrollColumn({ items, selected, onChange }: ScrollColumnProps) {
    const selectedIndex = items.findIndex((i) => i.value === selected);
    // offset represents the pixel offset from the "0th item at center" position
    // When offset = index * ITEM_HEIGHT, that index is centered.
    const [offset, setOffset] = useState(selectedIndex * ITEM_HEIGHT);
    const offsetRef = useRef(offset);
    const animFrameRef = useRef<number>(0);
    const velocityRef = useRef(0);
    const lastTouchRef = useRef(0);
    const isDraggingRef = useRef(false);

    // Sync offset when selected changes externally
    useEffect(() => {
        const targetOffset = selectedIndex * ITEM_HEIGHT;
        if (Math.abs(offsetRef.current - targetOffset) > 1) {
            animateTo(targetOffset);
        }
    }, [selectedIndex]);

    const clampOffset = useCallback((o: number) => {
        return Math.max(0, Math.min((items.length - 1) * ITEM_HEIGHT, o));
    }, [items.length]);

    const snapToNearest = useCallback((currentOffset: number) => {
        const index = Math.round(currentOffset / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(items.length - 1, index));
        const targetOffset = clampedIndex * ITEM_HEIGHT;
        animateTo(targetOffset);
        if (items[clampedIndex] && items[clampedIndex].value !== selected) {
            onChange(items[clampedIndex].value);
        }
    }, [items, selected, onChange]);

    const animateTo = useCallback((target: number) => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        const step = () => {
            const current = offsetRef.current;
            const diff = target - current;
            if (Math.abs(diff) < 0.5) {
                offsetRef.current = target;
                setOffset(target);
                return;
            }
            // Smooth spring-like easing
            const next = current + diff * 0.18;
            offsetRef.current = next;
            setOffset(next);
            animFrameRef.current = requestAnimationFrame(step);
        };
        animFrameRef.current = requestAnimationFrame(step);
    }, []);

    // Momentum deceleration after touch release
    const startMomentum = useCallback(() => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        const step = () => {
            const v = velocityRef.current;
            if (Math.abs(v) < 0.5) {
                snapToNearest(offsetRef.current);
                return;
            }
            velocityRef.current *= 0.92; // friction
            const next = clampOffset(offsetRef.current + velocityRef.current);
            offsetRef.current = next;
            setOffset(next);
            animFrameRef.current = requestAnimationFrame(step);
        };
        animFrameRef.current = requestAnimationFrame(step);
    }, [clampOffset, snapToNearest]);

    // Wheel handler
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

        const delta = e.deltaY * 0.3;
        const next = clampOffset(offsetRef.current + delta);
        offsetRef.current = next;
        setOffset(next);

        // Debounced snap
        velocityRef.current = 0;
        setTimeout(() => {
            if (!isDraggingRef.current) {
                snapToNearest(offsetRef.current);
            }
        }, 120);
    }, [clampOffset, snapToNearest]);

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        isDraggingRef.current = true;
        lastTouchRef.current = e.touches[0].clientY;
        velocityRef.current = 0;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDraggingRef.current) return;
        e.preventDefault();
        const y = e.touches[0].clientY;
        const delta = lastTouchRef.current - y;
        velocityRef.current = delta;
        lastTouchRef.current = y;
        const next = clampOffset(offsetRef.current + delta);
        offsetRef.current = next;
        setOffset(next);
    }, [clampOffset]);

    const handleTouchEnd = useCallback(() => {
        isDraggingRef.current = false;
        startMomentum();
    }, [startMomentum]);

    const handleClick = useCallback((index: number) => {
        const targetOffset = index * ITEM_HEIGHT;
        animateTo(targetOffset);
        if (items[index]) {
            onChange(items[index].value);
        }
    }, [items, onChange, animateTo]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, []);

    // Calculate translateY so that the selected item appears centered
    const translateY = CENTER_INDEX * ITEM_HEIGHT - offset;

    return (
        <div
            className="relative flex-1 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            style={{ height: CONTAINER_HEIGHT }}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Selection highlight */}
            <div
                className="absolute inset-x-1 pointer-events-none z-10 rounded-lg bg-primary/8 border border-primary/15"
                style={{ top: CENTER_INDEX * ITEM_HEIGHT, height: ITEM_HEIGHT }}
            />
            {/* Fade top */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-popover via-popover/80 to-transparent z-20 pointer-events-none" />
            {/* Fade bottom */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-popover via-popover/80 to-transparent z-20 pointer-events-none" />

            <div
                className="will-change-transform"
                style={{ transform: `translateY(${translateY}px)` }}
            >
                {items.map((item, index) => {
                    const distFromCenter = Math.abs(offset - index * ITEM_HEIGHT) / ITEM_HEIGHT;
                    const opacity = Math.max(0.2, 1 - distFromCenter * 0.3);
                    const scale = Math.max(0.85, 1 - distFromCenter * 0.06);

                    return (
                        <div
                            key={item.value}
                            className="flex items-center justify-center text-sm font-medium cursor-pointer select-none transition-none"
                            style={{
                                height: ITEM_HEIGHT,
                                opacity,
                                transform: `scale(${scale})`,
                            }}
                            onClick={() => handleClick(index)}
                        >
                            {item.label}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

interface ScrollDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    monthYearOnly?: boolean;
}

export function ScrollDatePicker({
    value,
    onChange,
    placeholder = "Sélectionner",
    className,
}: ScrollDatePickerProps) {
    const [open, setOpen] = useState(false);

    const parseValue = () => {
        const now = new Date();
        if (!value) return { month: now.getMonth() + 1, year: now.getFullYear() };
        const parts = value.split(/[\/\-\.]/);
        if (parts.length === 2) {
            return { month: parseInt(parts[0]) || 1, year: parseInt(parts[1]) || now.getFullYear() };
        }
        if (parts.length === 3) {
            return { month: parseInt(parts[1]) || 1, year: parseInt(parts[2]) || now.getFullYear() };
        }
        return { month: now.getMonth() + 1, year: now.getFullYear() };
    };

    const parsed = parseValue();
    const [month, setMonth] = useState(parsed.month);
    const [year, setYear] = useState(parsed.year);

    useEffect(() => {
        const p = parseValue();
        setMonth(p.month);
        setYear(p.year);
    }, [value]);

    const months = MONTHS.map((label, i) => ({ value: i + 1, label }));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => {
        const y = currentYear - 30 + i;
        return { value: y, label: String(y) };
    });

    const handleConfirm = () => {
        const m = String(month).padStart(2, "0");
        onChange(`${m}/${year}`);
        setOpen(false);
    };

    const displayValue = value || "";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "justify-start text-left font-normal hover:bg-transparent hover:text-foreground",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                    <span className="truncate">{displayValue || placeholder}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 pointer-events-auto" align="start">
                <div className="p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                        Sélectionner une date
                    </p>
                    <div className="flex gap-2">
                        <ScrollColumn items={months} selected={month} onChange={setMonth} />
                        <div className="w-px bg-border/50 my-4" />
                        <ScrollColumn items={years} selected={year} onChange={setYear} />
                    </div>
                    <Button size="sm" className="w-full mt-3 rounded-lg text-xs h-8" onClick={handleConfirm}>
                        Confirmer
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
