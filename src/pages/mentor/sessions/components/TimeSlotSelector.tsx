import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface TimeSlot {
  id: string;
  start_time: string | null;
  end_time: string | null;
}

interface TimeSlotSelectorProps {
  availableSlots: TimeSlot[];
  selectedDate: Date | undefined;
  isSlotBooked: (slotId: string) => boolean;
  onSelectSlot: (slotId: string) => void;
  isPending: boolean;
}

export function TimeSlotSelector({ 
  availableSlots, 
  selectedDate, 
  isSlotBooked, 
  onSelectSlot,
  isPending 
}: TimeSlotSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Slots</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {!selectedDate ? (
          <p className="text-sm text-muted-foreground">
            Select a date to see available slots
          </p>
        ) : (
          availableSlots.map((slot) => {
            const isBooked = isSlotBooked(slot.id);
            return (
              <Button
                key={slot.id}
                variant="outline"
                className="w-full justify-start"
                disabled={isBooked || isPending}
                onClick={() => onSelectSlot(slot.id)}
              >
                {slot.start_time && format(parseISO(`2000-01-01T${slot.start_time}`), 'h:mm a')} -{' '}
                {slot.end_time && format(parseISO(`2000-01-01T${slot.end_time}`), 'h:mm a')}
                {isBooked && <span className="ml-2 text-muted-foreground">(Booked)</span>}
              </Button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}