import React from 'react';

type PageWrapperType = 'header' | 'subHeader' | 'content' | 'sideContent';

export default function PageWrapperComponent({
  children,
  type = 'content',
}: {
  children: React.ReactNode;
  type: PageWrapperType;
}) {
  return <React.Fragment key={type}>{children}</React.Fragment>;
}
