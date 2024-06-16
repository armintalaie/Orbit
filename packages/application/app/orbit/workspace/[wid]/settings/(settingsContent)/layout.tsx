import { ReactNode } from 'react';

type WrapperProps = {
  children: ReactNode;
};

export default function SettingsLayout({ children }: WrapperProps) {
  return <div className='flex flex-1 flex-col gap-2 divide-y overflow-hidden px-6 py-4 '>{children}</div>;
}

export const SettingsHeader = ({ children }: { children: ReactNode }) => {
  return <h1 className='  h-8  text-lg  font-semibold '>{children}</h1>;
};

export const SettingsContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className={'flex w-full justify-center'}>
      <section className='flex  w-full max-w-4xl flex-col justify-center gap-4  overflow-scroll py-5 '>
        {children}
      </section>
    </div>
  );
};
