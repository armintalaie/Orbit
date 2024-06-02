'use client';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import React from 'react';

const TEXTS = {
  LANDING_MESSAGE: `Out of this world\nproject management`,
  LANDING_SUB_MESSAGE: 'Manage your projects with ease',
};

export default function Home() {
  return (
    <main className='flex min-h-screen w-screen flex-col items-center  bg-neutral-950 text-white'>
      <NavigationMenuDemo />

      <div className='flex h-[60vh] max-w-[1500px] flex-col  items-center justify-center'>
        <h1 className='whitespace-pre-line text-center text-7xl font-bold '>{TEXTS.LANDING_MESSAGE}</h1>
        <p className='mt-10 text-3xl'>{TEXTS.LANDING_SUB_MESSAGE}</p>
        <Link href='/auth/signup' className='mt-10'>
          <div className=' rounded-[40px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800  p-1 text-lg'>
            <div className=' rounded-[36px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800  p-1 text-lg'>
              <Button className=' h-12 w-96 rounded-[32px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800 p-4 text-lg'>
                Get started
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </main>
  );
}
//
// function Hero() {
//   const ref = React.useRef<HTMLDivElement>(null);
//   const [width, setWidth] = React.useState('80%');
//
//   React.useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
//       const newWidth = Math.min(80 + scrollTop / 100, 100);
//       setWidth(`${newWidth}%`);
//     };
//
//     window.addEventListener('scroll', handleScroll);
//
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);
//
//   return (
//     <div
//       ref={ref}
//       className='relative flex min-h-0 justify-center p-4'
//       style={{
//         width: width,
//       }}
//     >
//       <Image
//         src={ImageHero}
//         alt='Orbit'
//         style={{
//           objectFit: 'contain',
//         }}
//       />
//     </div>
//   );
// }

const components: {
  title: string;
  href: string;
  description: string;
}[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description: 'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
];

export function NavigationMenuDemo() {
  return (
    <nav className='dark flex w-full  items-center p-2'>
      <div className='flex w-full items-center gap-4 '>
        {/* <Image src='/icons/icon.png' alt='Orbit' width={40} height={200} /> */}
        <h1 className='text-3xl font-bold'>Orbit</h1>
      </div>
      <NavigationMenu className='flex  w-full flex-1 justify-end'>
        <NavigationMenuList>
          <NavigationMenuItem className='flex gap-1'>
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
            </Link>
            <Link href='/auth/signup' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sign up</NavigationMenuLink>
            </Link>
            <Link href='/auth/signin' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>Sign in</NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = 'ListItem';
