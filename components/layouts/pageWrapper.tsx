import React from 'react';

type PageWrapperProps = {
  children: React.ReactNode;
};

const Header = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SubHeader = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
const Content = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const PageWrapper = ({ children }: PageWrapperProps) => {
  const header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Header
  );
  const subHeader = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SubHeader
  );
  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Content
  );

  return (
    <div className='flex h-full w-full flex-col'>
      <div className=' flex h-full w-full flex-1 flex-col '>
        <div className='flex h-12 w-full items-center justify-between p-4  px-4 dark:border-neutral-800 dark:bg-neutral-900 '>
          {header}
        </div>

        <div className=' flex h-full w-full flex-1 flex-col bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900 '>
          <div className='h-15 flex flex-row items-center justify-between border-y border-gray-100 bg-white p-4 py-3 dark:border-neutral-800 dark:bg-neutral-900'>
            {subHeader}
          </div>
          <div className=' flex h-full flex-grow flex-col'>{content}</div>
        </div>
      </div>
    </div>
  );
};

PageWrapper.Header = Header;
PageWrapper.SubHeader = SubHeader;
PageWrapper.Content = Content;

export default PageWrapper;
