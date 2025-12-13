import React, { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import aircraftData from "@/data/aircraftTypes.json";

interface AircraftType {
  manufacturer_code: string;
  model_no: string | null;
  model_name: string;
  tdesig: string;
  engine_type: string;
  engine_count: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

export function AircraftTypeAutocomplete({ value, onChange, placeholder, id, name }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredAircraft = useMemo(() => {
    if (!inputValue || inputValue.length < 1) return [];
    
    const searchTerm = inputValue.toLowerCase();
    const results = (aircraftData as AircraftType[])
      .filter((aircraft) => {
        const manufacturer = aircraft.manufacturer_code?.toLowerCase() || "";
        const modelNo = aircraft.model_no?.toLowerCase() || "";
        const modelName = aircraft.model_name?.toLowerCase() || "";
        const tdesig = aircraft.tdesig?.toLowerCase() || "";
        
        return (
          manufacturer.includes(searchTerm) ||
          modelNo.includes(searchTerm) ||
          modelName.includes(searchTerm) ||
          tdesig.includes(searchTerm)
        );
      })
      .slice(0, 20);

    // Remove duplicates based on display text
    const seen = new Set<string>();
    return results.filter((aircraft) => {
      const displayText = formatAircraftDisplay(aircraft);
      if (seen.has(displayText)) return false;
      seen.add(displayText);
      return true;
    });
  }, [inputValue]);

  const formatAircraftDisplay = (aircraft: AircraftType): string => {
    const parts = [aircraft.manufacturer_code];
    if (aircraft.model_name) parts.push(aircraft.model_name);
    else if (aircraft.model_no) parts.push(aircraft.model_no);
    if (aircraft.tdesig) parts.push(`(${aircraft.tdesig})`);
    return parts.join(" ");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(newValue.length >= 1);
  };

  const handleSelect = (aircraft: AircraftType) => {
    const displayValue = formatAircraftDisplay(aircraft);
    setInputValue(displayValue);
    onChange(displayValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => inputValue.length >= 1 && setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      
      {isOpen && filteredAircraft.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
          <ScrollArea className="max-h-60">
            <div className="p-1">
              {filteredAircraft.map((aircraft, index) => (
                <button
                  key={`${aircraft.tdesig}-${index}`}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => handleSelect(aircraft)}
                >
                  <div className="font-medium">
                    {aircraft.manufacturer_code} {aircraft.model_name || aircraft.model_no}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {aircraft.tdesig} • {aircraft.engine_count}x {aircraft.engine_type}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
