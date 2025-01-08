import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { TimeSlot } from "../types/session-form";

interface TimeSlotManagerProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function TimeSlotManager({ value, onChange }: TimeSlotManagerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(value || []);

  useEffect(() => {
    setSlots(value || []);
  }, [value]);

  const addSlot = (day: number, e: React.MouseEvent) => {
    e.preventDefault();
    
    const newSlot: TimeSlot = {
      day,
      startTime: "09:00",
      endTime: "17:00"
    };
    const newSlots = [...slots, newSlot];
    setSlots(newSlots);
    onChange(newSlots);
  };

  const removeSlot = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
    onChange(newSlots);
  };

  const updateSlot = (index: number, field: keyof TimeSlot, newValue: string | number) => {
    const newSlots = slots.map((slot, i) => {
      if (i === index) {
        return { ...slot, [field]: newValue };
      }
      return slot;
    });
    setSlots(newSlots);
    onChange(newSlots);
  };

  const formatTimeForInput = (time: string) => {
    // Remove seconds if they exist
    return time.split(':').slice(0, 2).join(':');
  };

  return (
    <div className="space-y-4">
      {DAYS.map((day, index) => {
        const daySlots = slots.filter(slot => slot.day === index);
        
        return (
          <div key={day} className="flex items-center space-x-4">
            <div className="w-32">{day}</div>
            <div className="flex-1">
              {daySlots.length === 0 ? (
                <div className="text-sm text-muted-foreground">Not bookable</div>
              ) : (
                <div className="space-y-2">
                  {daySlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={formatTimeForInput(slot.startTime)}
                        onChange={(e) => updateSlot(slots.indexOf(slot), 'startTime', e.target.value)}
                        className="w-32"
                      />
                      <Input
                        type="time"
                        value={formatTimeForInput(slot.endTime)}
                        onChange={(e) => updateSlot(slots.indexOf(slot), 'endTime', e.target.value)}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={(e) => removeSlot(slots.indexOf(slot), e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(e) => addSlot(index, e)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}