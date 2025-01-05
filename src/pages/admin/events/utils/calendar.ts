import { createEvents } from 'ics';

export function generateICSString(event: any) {
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);

  const { error, value } = createEvents([{
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes()
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes()
    ],
    title: event.title,
    description: event.description,
    location: '',
    status: 'CONFIRMED',
  }]);

  if (error) {
    throw error;
  }

  return value;
}

export function generateVEVENTUrl(event: any) {
  const start = new Date(event.start_time);
  const end = new Date(event.end_time);
  
  // Format dates to YYYYMMDDTHHMMSSZ format
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const eventData = {
    title: encodeURIComponent(event.title),
    description: encodeURIComponent(event.description),
    startTime: formatDate(start),
    endTime: formatDate(end),
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
DTSTART:${eventData.startTime}
DTEND:${eventData.endTime}
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '%0A');
}

export function downloadICS(event: any) {
  const icsString = generateICSString(event);
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${event.title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}