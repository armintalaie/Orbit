'use client';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import React from 'react';
type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapper = ({ children }: PageWrapperProps) => {
  React.Children.toArray(children).map((child) => {
    console.log(child);
  });
  const header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.key === '.$header' || child.props.type === 'header')
  );
  const subHeader = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.key === '.$subHeader' || child.props.type === 'subHeader')
  );
  const content = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.key === '.$content' || child.props.type === 'content')
  );
  const sideContent = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && (child.key === '.$sideContent' || child.props.type === 'sideContent')
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

export default PageWrapper;
