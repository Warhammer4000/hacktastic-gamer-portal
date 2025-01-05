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