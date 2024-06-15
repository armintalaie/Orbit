import React from 'react';
import { useWindowSize } from 'usehooks-ts';

export const ShortcutKeyboardContext = React.createContext<any | null>(null);
export default function ShortcutKeyboardProvider({ children }: { children: React.ReactNode }) {
  const [shortcutKeyboard, setShortcutKeyboard] = React.useState<any | null>(null);

  const ref = React.useRef<any | null>(null);
  const { width, height } = useWindowSize();

  return (
    <div
    // ref={ref}
    // onKeyDown={(e) => {
    //   if (window.innerWidth < 768 || window.innerHeight < 500) {
    //     return;
    //   }
    //   if (e.key === 'Escape') {
    //     setShortcutKeyboard((prev) => null);
    //   }
    //   if (e.key === 'k') {
    //     //   e.preventDefault();
    //     //   setShortcutKeyboard((prev) => 'k');
    //   }
    // }}
    // tabIndex={0}
    >
      <ShortcutKeyboardContext.Provider value={shortcutKeyboard}>{children}</ShortcutKeyboardContext.Provider>
    </div>
  );
}
