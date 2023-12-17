import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';
import * as matter from 'gray-matter';

export function dateFormater(date: string) {
  // if within a week, return day of week (e.g. Monday)
  // if within a year, return month and day (e.g. Jan 1)
  // if more than a year, return "sometime in year" (e.g. sometime in 2021)
  // if no date, return "no date"
  // if overdue, return "overdue by x days" (e.g. overdue by 2 days)

  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);
  const diffMonths = Math.ceil(diffDays / 30);
  const diffYears = Math.ceil(diffDays / 365);
  const day = dueDate.toLocaleString('default', { weekday: 'long' });
  const month = dueDate.toLocaleString('default', { month: 'long' });
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
  const today = new Date();
  const dueDate = new Date(date);
  const diffTime = Number(dueDate) - Number(today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays < 0) {
    return true;
  }
  return false;
}


export async function getStatus() {
  const res = await fetch('/api/status');
  const data = await res.json();

  return data;
}


export let STATUS;

const setStatus = async () => {
  STATUS = await getStatus();
};

setStatus();
// export async function getPostData(id) {
//   const fullPath = path.join(postsDirectory, `${id}.md`);
//   const fileContents = fs.readFileSync(fullPath, 'utf8');

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Use remark to convert markdown into HTML string
//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   // Combine the data with the id and contentHtml
//   return {
//     id,
//     contentHtml,
//     ...matterResult.data,
//   };
// }
