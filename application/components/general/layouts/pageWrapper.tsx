'use client';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import React from 'react';

type PageWrapperProps = {
  children: React.ReactNode;
};

const Header = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SubHeader = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const Content = ({ children }: { children: React.ReactNode }) => <>{children}</>;
const SideContent = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const PageWrapper = ({ children }: PageWrapperProps) => {
  const header = React.Children.toArray(children).find((child) => React.isValidElement(child) && child.type === Header);
  const subHeader = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SubHeader
  );
  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Content
  );
  const sideContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === SideContent
  );

  return (
    <ResizablePanelGroup direction='horizontal' className='flex w-full flex-grow overflow-hidden'>
      <ResizablePanel className=' flex h-full w-full flex-1 flex-col overflow-hidden '>
        <div className='flex h-12 w-full items-center justify-between border-b  p-4 px-4 '>{header && header}</div>

        <div className=' flex w-full flex-1 flex-grow flex-col overflow-hidden  '>
          {subHeader && (
            <div className='h-15 flex flex-row items-center justify-between border-b   p-4 py-3 '>{subHeader}</div>
          )}
          <div className='flex flex-grow flex-col overflow-y-hidden'>{content}</div>
        </div>
      </ResizablePanel>
      {sideContent && (
        <>
          <ResizableHandle />

          <ResizablePanel collapsible minSize={10} defaultSize={25} className='flex w-60 flex-col border-l'>
            {sideContent && sideContent}
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

PageWrapper.Header = Header;
PageWrapper.SubHeader = SubHeader;
PageWrapper.Content = Content;
PageWrapper.SideContent = SideContent;

export default PageWrapper;
