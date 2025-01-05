import { createEvents } from 'ics';
import { v4 as uuidv4 } from 'uuid';

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

  const now = new Date();
  const eventData = {
    uid: uuidv4().replace(/-/g, '').substring(0, 20), // Generate a shorter UID
    title: event.title.replace(/[,\n]/g, '\\,'),
    description: event.description.replace(/[,\n]/g, '\\,'),
    startTime: formatDate(start),
    endTime: formatDate(end),
    timestamp: formatDate(now)
  };

  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
PRODID:adamgibbons/ics
METHOD:PUBLISH
X-PUBLISHED-TTL:PT1H
BEGIN:VEVENT
UID:${eventData.uid}
SUMMARY:${eventData.title}
DTSTAMP:${eventData.timestamp}
DTSTART:${eventData.startTime}
DTEND:${eventData.endTime}
DESCRIPTION:${eventData.description}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`.replace(/\n/g, '\r\n');
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