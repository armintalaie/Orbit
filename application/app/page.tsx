'use client';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import * as React from 'react';
import { cn } from '@/lib/utils';
import ImageHero from 'public/images/signin.jpeg';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';

// export const metadata: Metadata = {
//   title: 'Orbit',
//   description: 'Project management app for teams',
// };

const TEXTS = {
  LANDING_MESSAGE: `Out of this world\nproject management`,
  LANDING_SUB_MESSAGE: 'Manage your projects with ease',
};

export default function Home() {
  return (
    <main className='flex min-h-screen w-screen flex-col items-center justify-center bg-neutral-950 text-white'>
      <NavigationMenuDemo />

      <div className='flex h-[60vh] max-w-[1500px] flex-col  items-center justify-center'>
        <h1 className='whitespace-pre-line text-center text-7xl font-bold '>
          {TEXTS.LANDING_MESSAGE}
        </h1>
        <p className='mt-10 text-3xl'>{TEXTS.LANDING_SUB_MESSAGE}</p>
        <div className='mt-10 rounded-[40px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800  p-1 text-lg'>
          <div className=' rounded-[36px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800  p-1 text-lg'>
            <Button
              className=' h-12 w-96 rounded-[32px] border-4 border-black bg-gradient-to-r from-teal-900 to-teal-800 p-4 text-lg
        '
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
      <Hero />

      <Hero />

      <Hero />

      <Hero />
    </main>
  );
}


function Hero() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState('80%');

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const newWidth = Math.min(80 + scrollTop / 100, 100);
      setWidth(`${newWidth}%`);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      ref={ref}
      className='relative flex min-h-0 justify-center p-4'
      style={{
        width: width,
      }}
    >
      <Image
        src={ImageHero}
        alt='Orbit'
  
        
        
       style={{
         
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
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
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
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
    <nav className='flex w-full  items-center p-2'>
      <div className='flex items-center gap-4'>
        <Image src='/icons/icon.png' alt='Orbit' width={40} height={200} />
        <h1 className='text-3xl font-bold'>Orbit</h1>
      </div>
      <NavigationMenu className='dark absolute left-1/2 flex-1 -translate-x-1/2 transform'>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                <li className='row-span-3'>
                  <NavigationMenuLink asChild>
                    <a
                      className='from-muted/50 to-muted flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none focus:shadow-md'
                      href='/'
                    >
                      {/* <Icons.logo className="h-6 w-6" /> */}
                      <div className='mb-2 mt-4 text-lg font-medium'>
                        shadcn/ui
                      </div>
                      <p className='text-muted-foreground text-sm leading-tight'>
                        Beautifully designed components that you can copy and
                        paste into your apps. Accessible. Customizable. Open
                        Source.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href='/docs' title='Introduction'>
                  Re-usable components built using Radix UI and Tailwind CSS.
                </ListItem>
                <ListItem href='/docs/installation' title='Installation'>
                  How to install dependencies and structure your app.
                </ListItem>
                <ListItem href='/docs/primitives/typography' title='Typography'>
                  Styles for headings, paragraphs, lists...etc
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                {components.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href='/docs' legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Documentation
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
            className
          )}
          {...props}
        >
          <div className='text-sm font-medium leading-none'>{title}</div>
          <p className='text-muted-foreground line-clamp-2 text-sm leading-snug'>
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
