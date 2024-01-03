import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { NewIssue } from '../newIssue';

export default function IssuesTimelineView({
  issues,
  projectId,
}: {
  issues: any[];
  projectId?: number;
}) {
  const [dates, setDates] = useState([]);
  const [start, setStart] = useState(new Date());

  useEffect(() => {
    // Load initial dates
    loadMoreDates(start);
  }, []);

  const loadMoreDates = (fromDate) => {
    const newDates = [];
    for (let i = 0; i < 365; i++) {
      const newDate = new Date(fromDate);
      newDate.setDate(newDate.getDate() + i);
      newDates.push(newDate);
    }
    setDates((prevDates) => [...newDates, ...prevDates]);

    const newStart = new Date(newDates[newDates.length - 1]);
    newStart.setDate(newStart.getDate() + 1);
    setStart(newStart);
  };

  const handleScroll = (e) => {
    const right =
      e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
    if (right) {
      loadMoreDates(start);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  return (
    <div className='flex h-full w-full overflow-hidden  rounded-lg border border-gray-100 bg-white'>
      <div className='flex w-full flex-col overflow-hidden'>
        <div
          onScroll={handleScroll}
          style={{ width: '100%', overflowX: 'auto' }}
        >
          <div
            style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 2 }}
          >
            {dates.map((date, index) => {
              const year = format(date, 'yyyy');
              const shouldDisplayYear =
                index === 0 || year !== format(dates[index - 1], 'yyyy');
              return (
                <div
                  key={index}
                  className=' flex min-w-[400px] flex-col items-center justify-center border-b border-gray-100 p-1 text-sm font-medium'
                >
                  {shouldDisplayYear ? year : ''}
                </div>
              );
            })}
          </div>

          <div className='sticky z-10  flex'>
            {dates.map((date, index) => {
              const month = format(date, 'MMM');

              const shouldDisplayMonth =
                index === 0 || month !== format(dates[index - 1], 'MMM');
              return (
                <div
                  key={index}
                  className={`flex justify-center border-b border-gray-100 p-1 text-sm font-medium ${
                    shouldDisplayMonth
                      ? 'min-w-[50px] border-l border-gray-100'
                      : 'min-w-[50px]'
                  }`}
                >
                  {shouldDisplayMonth ? month : ''}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex' }}>
            {dates.map((date, index) => (
              <div
                key={index}
                className='flex min-w-[50px] flex-col items-center border-b border-gray-100 p-2 py-1 text-xs'
              >
                <div>{format(date, 'dd')}</div>
                <div>{format(date, 'EEE')}</div>
              </div>
            ))}
          </div>
          {issues.map((issue, index) => (
            <div key={index} className='left sticky flex w-fit bg-gray-50  '>
              <Link
                className='text-2xs sticky left-0 line-clamp-1  flex h-12 w-[200px] items-center border-b border-gray-200 bg-white p-1 px-2 hover:shadow-lg'
                href={`/projects/${issue.projectid}/issues/${issue.id}`}
                shallow={true}
              >
                {issue.title}
              </Link>
              {dates.map((date, index) => {
                const utcDate = new Date(date).toISOString();
                const dateStarted =
                  issue.datestarted || new Date().toISOString();
                const dateEnded = issue.deadline || new Date().toISOString();
                const isWithinProjectDuration =
                  utcDate >= dateStarted && utcDate <= issue.deadline;
                const isOnStartDate =
                  formatDate(utcDate) === formatDate(dateStarted);
                const isOnDeadline =
                  formatDate(utcDate) === formatDate(dateEnded);

                let className =
                  'h-12 min-w-[50px]  py-2 overflow-hidden flex justify-center items-center  ';

                switch (true) {
                  case isOnStartDate:
                    className += '  pl-4';
                    break;
                  case isOnDeadline:
                    className += '  pr-4';
                    break;
                  case isWithinProjectDuration:
                    className += '';
                    break;
                  default:
                    className += 'bg-transparent';
                    break;
                }

                let className2 = 'min-w-[50px] h-full py-2 overflow-hidden   ';

                switch (true) {
                  case isOnStartDate:
                    className2 +=
                      'bg-gray-100 pl-4 rounded-l-xl border-l border-y  ';
                    break;
                  case isOnDeadline:
                    className2 +=
                      ' bg-gray-100 pr-4 rounded-r-xl border-r border-y';
                    break;
                  case isWithinProjectDuration:
                    className2 += 'bg-gray-100  border-y ';
                    break;
                  default:
                    className2 += 'bg-transparent';
                    break;
                }

                return (
                  <div key={index} className={className}>
                    {/* {isWithinProjectDuration && ( */}
                    <Link
                      className={className2}
                      href={`/projects/${issue.projectid}/issues/${issue.id}`}
                      shallow={true}
                    />
                    {/* )} */}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className='flex w-full bg-gray-50  '>
          <div className=' text-2xs left-0 line-clamp-1  flex h-12 w-[200px] items-center border-b border-gray-200 bg-white p-1 px-2 '>
            <NewIssue button={false} projectid={projectId} />
          </div>
        </div>
      </div>
    </div>
  );
}
