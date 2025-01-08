import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { TimeSlot } from "../types/session-form";

interface TimeSlotManagerProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimeSlotManager({ value, onChange }: TimeSlotManagerProps) {
  // Initialize slots with all days, ensuring each day has a slot
  const initializeSlots = (inputSlots: TimeSlot[]) => {
    const initializedSlots: TimeSlot[] = DAYS.map((_, index) => {
      const existingSlot = inputSlots.find(slot => slot.day === index);
      return existingSlot || {
        day: index,
        startTime: null,
        endTime: null
      };
    });
    return initializedSlots;
  };

  const [slots, setSlots] = useState<TimeSlot[]>(initializeSlots(value || []));

  useEffect(() => {
    setSlots(initializeSlots(value || []));
  }, [value]);

  const toggleBookable = (day: number) => {
    const newSlots = slots.map(slot => {
      if (slot.day === day) {
        if (slot.startTime === null) {
          return {
            ...slot,
            startTime: "09:00",
            endTime: "17:00"
          };
        } else {
          return {
            ...slot,
            startTime: null,
            endTime: null
          };
        }
      }
      return slot;
    });
    setSlots(newSlots);
    onChange(newSlots);
  };

  const updateSlot = (day: number, field: 'startTime' | 'endTime', newValue: string) => {
    const newSlots = slots.map(slot => {
      if (slot.day === day) {
        return { ...slot, [field]: newValue };
      }
      return slot;
    });
    setSlots(newSlots);
    onChange(newSlots);
  };

  const formatTimeForInput = (time: string | null) => {
    if (!time) return "";
    return time.split(':').slice(0, 2).join(':');
  };

  return (
    <div className="space-y-4">
      {DAYS.map((day, index) => {
        const slot = slots.find(s => s.day === index)!;
        const isBookable = slot.startTime !== null && slot.endTime !== null;
        
        return (
          <div key={day} className="flex items-center space-x-4">
            <div className="w-32">{day}</div>
            <div className="flex-1">
              {!isBookable ? (
                <div className="text-sm text-muted-foreground">Not bookable</div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={formatTimeForInput(slot.startTime)}
                    onChange={(e) => updateSlot(index, 'startTime', e.target.value)}
                    className="w-32"
                  />
                  <Input
                    type="time"
                    value={formatTimeForInput(slot.endTime)}
                    onChange={(e) => updateSlot(index, 'endTime', e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => toggleBookable(index)}
            >
              {isBookable ? <X className="h-4 w-4" /> : <span className="text-xs">+</span>}
            </Button>
          </div>
        );
      })}
    </div>
  );
}