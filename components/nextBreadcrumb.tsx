// /components/NextBreadcrumb.tsx
'use client';

import React, { ReactNode } from 'react';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CaretLeftIcon } from '@radix-ui/react-icons';
import {
  ArrowRightFromLineIcon,
  ChevronLeft,
  ChevronRight,
  MenuIcon,
} from 'lucide-react';

type TBreadCrumbProps = {
  homeElement: ReactNode;
  separator: ReactNode;
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
        <li className={`${listClasses} flex md:hidden`}>{homeElement}</li>
        {pathNames.length > 0 && (
          <ChevronLeft className='h-4 w-4 text-gray-500' />
        )}
        {pathNames.map((link, index) => {
          let href = `/${pathNames.slice(0, index + 1).join('/')}`;
          let itemClasses =
            paths === href ? `${listClasses} ${activeClasses}` : listClasses;
          let itemLink = capitalizeLinks
            ? link[0].toUpperCase() + link.slice(1, link.length)
            : link;
          return (
            <React.Fragment key={index}>
              <li
                className={`${itemClasses} text-sm font-medium text-gray-600`}
              >
                <Link href={href}>{itemLink}</Link>
              </li>
              {/* {index} */}
              {pathNames.length > index + 2 && (
                <ChevronLeft className='h-4 w-4 text-gray-800' />
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default NextBreadcrumb;