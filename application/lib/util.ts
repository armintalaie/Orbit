export function dateFormater(date: string) {
  // if within a week, return day of week (e.g. Monday)
  // if within a year, return month and day (e.g. Jan 1)
  // if more than a year, return "sometime in year" (e.g. sometime in 2021)
  // if no date, return "no date"
  // if overdue, return "overdue by x days" (e.g. overdue by 2 days)

  if (!date || date === 'null') {
    return '';
  }

  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);
  const diffMonths = Math.ceil(diffDays / 30);
  const diffYears = Math.ceil(diffDays / 365);
  const day = dueDate.toLocaleString('default', { weekday: 'short' });
  const month = dueDate.toLocaleString('default', { month: 'short' });
  const year = dueDate.getFullYear();
  const dayOfMonth = dueDate.getDate();
  const formattedDate = `${day}, ${month} ${dayOfMonth}`;
  const formattedYear = `sometime in ${year}`;
  const formattedWeek = `${diffWeeks} weeks`;
  const formattedMonth = `${diffMonths} months`;
  const formattedYearDiff = `${diffYears} years`;
  const overdue = `${Math.abs(diffDays)} days ago`;
  if (diffDays === 0) {
    return 'today';
  }
  if (diffDays === 1) {
    return 'tomorrow';
  }
  if (diffDays === -1) {
    return 'yesterday';
  }
  if (diffDays < 0) {
    return overdue;
  }
  if (diffDays < 7) {
    return formattedDate;
  }
  if (diffDays < 30) {
    return formattedWeek;
  }
  if (diffDays < 365) {
    return formattedMonth;
  }
  if (diffDays > 365) {
    return formattedYear;
  }
  if (diffDays > 365 * 2) {
    return formattedYearDiff;
  }
  return 'no date';
}

export function isOverdue(date: string) {
  if (!date || date === 'null') {
    return false;
  }

  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = Number(dueDate) - Number(today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return true;
  }
  return false;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('');
}

export function getFirstNameAndLastInitial(name: string) {
  const [first, last] = name.split(' ');
  return `${first} ${last? last[0]: ''}`;
}


export function setDocumentMeta(title: string, description?: string) {
  'use client';
  document.title = title;
  if (description) {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description);
  }
}
