import React, { useState } from 'react';

type PreviewModalType<P = any> = {
  issueid?: number;
  close: () => void;
  setIssueId: (issueid: number) => void;
};

export const PreviewModalContext = React.createContext<PreviewModalType>({
  close: () => {},
  setIssueId: () => {},
});

export default function PreviewModalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [issueid, setIssueId] = useState<number | undefined>(undefined);

  const updatedIssueId = (issueid?: number) => {
    if (issueid) {
      setIssueId(issueid);
    } else {
      setIssueId(undefined);
    }
  };

  const closeFunction = () => {
    setIssueId(undefined);
  }

  return (
    <PreviewModalContext.Provider
      value={{ close: closeFunction, setIssueId: updatedIssueId, issueid: issueid }}
    >
      <div className='relative flex h-full w-full'>{children}</div>
    </PreviewModalContext.Provider>
  );
}
