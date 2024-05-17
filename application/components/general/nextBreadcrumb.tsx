'use client';

import React, { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

type TBreadCrumbProps = {
  homeElement: ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeClasses?: string;
  capitalizeLinks?: boolean;
};

const NextBreadcrumb = ({
  homeElement,
  containerClasses,
  listClasses,
  activeClasses,
  capitalizeLinks,
}: TBreadCrumbProps) => {
  const paths = usePathname();
  const pathNames = paths.split('/').filter((path) => path);

  return (
    <div>
      <ul className={containerClasses}>
        <li className={`${listClasses} flex lg:hidden`}>{homeElement}</li>
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join('/')}`;
          let itemClasses = paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          let itemLink = capitalizeLinks ? link[0].toUpperCase() + link.slice(1, link.length) : link;
          return (
            <React.Fragment key={index}>
              <li
                className={`${itemClasses} pl-0 text-sm font-medium  text-gray-600 dark:border-neutral-900 dark:text-neutral-300 `}
              >
                <Link href={href} shallow={true} className='p-0'>
                  {itemLink}
                </Link>
              </li>
              {/* {index} */}
              {pathNames.length > index + 2 && (
                <ChevronLeft className='h-4 w-4 text-gray-800  dark:border-neutral-900 dark:text-neutral-300' />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default NextBreadcrumb;
