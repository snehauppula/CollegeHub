export interface EventData {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendees: number;
  category: string;
}

export const fetchEventsFromSheets = async (): Promise<EventData[]> => {
  try {
    const csvUrl = 'https://docs.google.com/spreadsheets/d/1JTee6s9iILn_dz8zd4IlMWINiYF4Z5yqQyP7Y8eheMU/export?format=csv&gid=0';
    
    const response = await fetch(csvUrl);
    const csvText = await response.text();
    
    // Parse CSV data
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
    
    const events: EventData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
      
      if (values.length >= headers.length) {
        const event: EventData = {
          id: values[0] || `event-${i}`,
          title: values[1] || 'Untitled Event',
          club: values[2] || 'Unknown Club',
          date: values[3] || new Date().toISOString().split('T')[0],
          time: values[4] || '12:00 PM',
          location: values[5] || 'TBD',
          description: values[6] || 'No description available',
          attendees: parseInt(values[7]) || 0,
          category: values[8] || 'General'
        };
        events.push(event);
      }
    }
    
    return events;
  } catch (error) {
    console.error('Error fetching events from Google Sheets:', error);
    // Return fallback data if sheets are unavailable
    return [
      {
        id: '1',
        title: 'Tech Innovation Workshop',
        club: 'Computer Science Club',
        date: '2025-01-15',
        time: '2:00 PM',
        location: 'Engineering Building, Room 201',
        description: 'Learn about the latest trends in AI and machine learning with hands-on coding sessions.',
        attendees: 45,
        category: 'Workshop'
      }
    ];
  }
};