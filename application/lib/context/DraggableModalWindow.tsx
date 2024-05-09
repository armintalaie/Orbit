import IssuePage from '@/components/issues/issue/IssuePage';
import { useState, useRef, useEffect, useContext } from 'react';
import { Rnd } from 'react-rnd';
import { PreviewModalContext } from './PreviewModalProvider';
import { useWindowSize } from 'usehooks-ts';
import {
  ExternalLinkIcon,
  Maximize,
  Maximize2Icon,
  Minimize2Icon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';

export function DraggableModalWindow() {
  const { issueid, close } = useContext(PreviewModalContext);
  const [isMinimized, setIsMinimized] = useState(false);
  const [coordinates, setCoordinates] = useState({
    x: window.innerWidth - 410,
    y: 10,
  });
  const [size, setSize] = useState({ width: 400, height: 700 });
  const [issueComponent, setIssueComponent] = useState<JSX.Element | null>(
    null
  );

  const onDragStop = (e, d) => {
    setCoordinates({ x: d.x, y: d.y });
    setSize({ width: size.width, height: size.height });
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  useEffect(() => {
    if (isMinimized) {
      setSize({ width: 400, height: 30 });
    } else {
      setSize({ width: 400, height: 700 });
    }
  }, [isMinimized]);

  useEffect(() => {
    if (!issueid) {
      setIsMinimized(true);
    }
    if (issueid) {
      setIsMinimized(false);
      setIssueComponent(null);
      setIssueComponent(<IssuePage issueId={issueid} />);
    }
  }, [issueid]);

  if (!issueid) {
    return null;
  }

  return (
    <Rnd
      position={coordinates}
      size={size}
      onDragStop={onDragStop}
      //   enableResizing={{
      //     top: true,
      //     right: true,
      //     bottom: true,
      //     left: true,
      //     topRight: true,
      //     bottomRight: true,
      //     bottomLeft: true,
      //     topLeft: true,
      //   }}
      minWidth={400}
      maxHeight={'90%'}
      maxWidth={400}
      className='h-90svh !dark:border-neutral-700 z-50 flex h-fit flex-1 flex-col gap-2 overflow-hidden overflow-y-scroll  rounded-lg border border-neutral-300 bg-white  px-2  pb-2 text-gray-800 shadow-sm dark:bg-neutral-800 dark:text-gray-200'
      allowAnyClick={true}
    >
      {issueid && (
        <div className='flex w-full  flex-row items-center justify-between bg-gray-300  p-1'>
          <div className='flex   flex-row items-center gap-3  bg-gray-300'>
            <button
              onClick={close}
              className='text-sm font-semibold text-black'
            >
              <XIcon size={15} />
            </button>

            <button
              onClick={toggleMinimize}
              className='text-sm font-semibold text-black'
            >
              {!isMinimized ? (
                <Minimize2Icon size={15} />
              ) : (
                <Maximize2Icon size={15} />
              )}
            </button>
          </div>

          <div
            //   href={`/issues/${issueid}`}
            //   shallow={true}
            className='flex flex-row items-center gap-2'
          >
            {/* <ExternalLinkIcon size={15} /> */}
            <span className='text-2xs font-medium '>{`Issue #${issueid}`}</span>
          </div>
        </div>
      )}
      {!isMinimized && (
        <div className='flex flex-1  flex-col overflow-y-scroll rounded-lg border border-neutral-100  p-1 shadow-sm dark:border-neutral-700 dark:bg-neutral-800'>
          {issueComponent}
        </div>
      )}
    </Rnd>
  );
}
