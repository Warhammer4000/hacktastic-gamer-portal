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

  const addSlot = (day: number) => {
    const existingSlots = slots.filter(slot => slot.day === day);
    const newSlotIndex = existingSlots.length;
    
    const newSlot: TimeSlot = {
      day,
      slotIndex: newSlotIndex,
      startTime: "09:00",
      endTime: "17:00"
    };

    const newSlots = [...slots, newSlot];
    setSlots(newSlots);
    onChange(newSlots);
  };

  const removeSlot = (day: number, slotIndex: number) => {
    const newSlots = slots.filter(
      slot => !(slot.day === day && slot.slotIndex === slotIndex)
    ).map(slot => {
      if (slot.day === day && slot.slotIndex > slotIndex) {
        return { ...slot, slotIndex: slot.slotIndex - 1 };
      }
      return slot;
    });
    
    setSlots(newSlots);
    onChange(newSlots);
  };

  const updateSlot = (day: number, slotIndex: number, field: 'startTime' | 'endTime', newValue: string) => {
    const newSlots = slots.map(slot => {
      if (slot.day === day && slot.slotIndex === slotIndex) {
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
    <div className="space-y-6">
      {DAYS.map((dayName, dayIndex) => {
        const daySlots = slots
          .filter(slot => slot.day === dayIndex)
          .sort((a, b) => a.slotIndex - b.slotIndex);

        return (
          <div key={dayName} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">{dayName}</div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addSlot(dayIndex)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              {daySlots.map((slot) => (
                <div key={`${slot.day}-${slot.slotIndex}`} className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={formatTimeForInput(slot.startTime)}
                    onChange={(e) => updateSlot(dayIndex, slot.slotIndex, 'startTime', e.target.value)}
                    className="w-32"
                  />
                  <Input
                    type="time"
                    value={formatTimeForInput(slot.endTime)}
                    onChange={(e) => updateSlot(dayIndex, slot.slotIndex, 'endTime', e.target.value)}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSlot(dayIndex, slot.slotIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {daySlots.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No time slots added
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}