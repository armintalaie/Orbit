'use client';
import { usePathname } from 'next/navigation';

export default function useLinkCreator({ destination }: { destination: string }) {
  const pathname = usePathname();
  return {
    href: {
      pathname: `${pathname}/${destination}`,
    },
  };
}
