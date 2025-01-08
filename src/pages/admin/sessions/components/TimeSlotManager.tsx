import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeSlot {
  day: number;
  startTime: string;
  endTime: string;
}

interface TimeSlotManagerProps {
  value: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export function TimeSlotManager({ value, onChange }: TimeSlotManagerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>(value);

  useEffect(() => {
    setSlots(value);
  }, [value]);

  const addSlot = (day: number, e: React.MouseEvent) => {
    // Prevent the button from submitting the form
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
    // Prevent the button from submitting the form
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
                      <Select
                        value={slot.startTime}
                        onValueChange={(value) => updateSlot(slotIndex, 'startTime', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={slot.endTime}
                        onValueChange={(value) => updateSlot(slotIndex, 'endTime', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button" // Explicitly set type to button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => removeSlot(slotIndex, e)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              type="button" // Explicitly set type to button
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