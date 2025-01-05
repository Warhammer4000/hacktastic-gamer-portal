export function parseICSFile(icsContent: string) {
  const lines = icsContent.split('\n');
  let event = {
    title: '',
    description: '',
    start_time: '',
    end_time: '',
  };

  let inEvent = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      continue;
    }
    
    if (line === 'END:VEVENT') {
      break;
    }
    
    if (inEvent) {
      if (line.startsWith('SUMMARY:')) {
        event.title = line.substring(8);
      } else if (line.startsWith('DESCRIPTION:')) {
        event.description = line.substring(12).replace(/\\n/g, '\n');
      } else if (line.startsWith('DTSTART:')) {
        const dateStr = line.substring(8);
        event.start_time = formatICSDate(dateStr);
      } else if (line.startsWith('DTEND:')) {
        const dateStr = line.substring(6);
        event.end_time = formatICSDate(dateStr);
      }
    }
  }

  return event;
}

function formatICSDate(dateStr: string) {
  // ICS dates are in format: YYYYMMDDTHHMMSSZ
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(9, 11);
  const minute = dateStr.substring(11, 13);
  const second = dateStr.substring(13, 15);

  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}