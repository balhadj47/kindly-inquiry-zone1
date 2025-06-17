
// Format date to "dd month yyyy hh:mm:ss" format
// Example: "12 Juin 2025 14:52:33"
export const formatDateTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

// Split the formatted date into separate date and time parts
export const formatDateTimeParts = (timestamp: string) => {
  const formatted = formatDateTime(timestamp);
  const parts = formatted.split(' ');
  const date = `${parts[0]} ${parts[1]} ${parts[2]}`;
  const time = parts[3];
  
  return { date, time };
};

// Format date to "dd month yyyy" format only (no time)
// Example: "12 Juin 2025"
export const formatDateOnly = (timestamp: string | Date): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

// Calculate time ago in a readable format
export const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const tripTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - tripTime.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours} heure${hours === 1 ? '' : 's'} ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days} jour${days === 1 ? '' : 's'} ago`;
  }
};
