import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { format, isAfter, isBefore, startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { SessionHeader } from "./components/SessionHeader";
import { TimeSlotSelector } from "./components/TimeSlotSelector";
import { BookingConfirmationDialog } from "./components/BookingConfirmationDialog";
import { useSessionBooking } from "./hooks/useSessionBooking";

export default function MentorSessionBookingPage() {
  const { sessionId } = useParams();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlotId, setSelectedSlotId] = useState<string>();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    session,
    isSessionError,
    availabilities,
    bookings,
    bookSlotMutation
  } = useSessionBooking(sessionId);

  // Calculate available dates based on session template and existing bookings
  const availableDates = useMemo(() => {
    if (!session || !availabilities) return [];

    const startDate = new Date(session.start_date);
    const endDate = new Date(session.end_date);
    const today = startOfToday();

    // Get unique days of the week that have availabilities
    // Note: day_of_week in database is 0-6 where 0 is Sunday
    const availableDays = new Set(availabilities.map(a => a.day_of_week));

    // Filter dates that have availabilities
    const dates = [];
    let currentDate = startDate;
    while (!isAfter(currentDate, endDate)) {
      if (!isBefore(currentDate, today) && availableDays.has(currentDate.getDay())) {
        dates.push(new Date(currentDate));
      }
      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return dates;
  }, [session, availabilities]);

  // Get available slots for selected date
  const availableSlotsForDate = useMemo(() => {
    if (!selectedDate || !availabilities) return [];
    const dayOfWeek = selectedDate.getDay();
    return availabilities.filter(slot => slot.day_of_week === dayOfWeek);
  }, [selectedDate, availabilities]);

  const isSlotBooked = (slotId: string) => {
    if (!selectedDate || !bookings) return false;
    return bookings.some(
      booking =>
        booking.availability_id === slotId &&
        booking.booking_date === format(selectedDate, 'yyyy-MM-dd')
    );
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setShowConfirmation(true);
  };

  const handleBookingConfirm = () => {
    if (!selectedDate || !selectedSlotId) return;
    
    bookSlotMutation.mutate({
      availabilityId: selectedSlotId,
      bookingDate: format(selectedDate, 'yyyy-MM-dd')
    });
  };

  // Reset selected date when session changes
  useEffect(() => {
    setSelectedDate(undefined);
    setSelectedSlotId(undefined);
    setShowConfirmation(false);
  }, [sessionId]);

  if (isSessionError) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent>
            <p>Session not found or has been removed.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session || !availabilities) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-start gap-6">
        <div className="flex-1">
          <SessionHeader session={session} />
          <Card className="mt-6">
            <CardContent className="pt-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => !availableDates.some(d => 
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
                )}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        <div className="w-[300px]">
          <TimeSlotSelector
            availableSlots={availableSlotsForDate}
            selectedDate={selectedDate}
            isSlotBooked={isSlotBooked}
            onSelectSlot={handleSlotSelect}
            isPending={bookSlotMutation.isPending}
          />
        </div>
      </div>

      <BookingConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleBookingConfirm}
        selectedDate={selectedDate}
        selectedSlot={availabilities.find(s => s.id === selectedSlotId)}
        isPending={bookSlotMutation.isPending}
      />
    </div>
  );
}