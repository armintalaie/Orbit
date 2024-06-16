import moment from 'moment';
export function dateFormater(date: string) {
  console.log('date', date);
  // timestamz to locale date
  const timestampz = '1716009508000';

  // Parse the timestamp
  const parsedDate = moment(parseInt(timestampz, 10)); // Convert string to integer and parse
  return parsedDate.format('YYYY-MM-DD');
}

export function isOverdue(date: string) {
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
  return `${first} ${last ? last[0] : ''}`;
}

export function setDocumentMeta(title: string, description?: string) {
  'use client';
  document.title = title;
  if (description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }
}

export const toCamelCase = (str: string): string => {
  return str.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
};
