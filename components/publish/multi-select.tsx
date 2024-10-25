import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type MultiSelectProps = {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  maxItems?: number;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  maxItems = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);

  const handleSelect = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else if (selected.length < maxItems) {
      onChange([...selected, item]);
    }
  };

  const handleRemove = (item: string) => {
    onChange(selected.filter((i) => i !== item));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="justify-between w-full"
        >
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((item) => (
                <Badge key={item} variant="secondary" className="mr-1">
                  {item}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleRemove(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleRemove(item)}
                  >
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="w-full p-0"
        align="start"
        side="bottom"
        sideOffset={5} // Ajusta la distancia entre el botón y el popover
      >
        <div className="overflow-auto max-h-60">
          {options.map((option) => (
            <div
              key={option}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                selected.includes(option) ? "bg-accent" : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {option}
              {selected.includes(option) && (
                <X className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
