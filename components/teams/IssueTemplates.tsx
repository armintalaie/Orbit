import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '../ui/button';

export default function IssueTemplates() {
  return (
    <div className=' flex w-full  flex-col px-4'>
      <div className='flex w-full  flex-col '>
        <div className='flex flex-row items-center justify-between  '>
          <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>
            Issue Templates
          </h2>

          <Button variant='outline' className='m-0 h-6 p-2 text-xs'>
            New Template
          </Button>
        </div>

        <div className='flex max-w-4xl flex-row items-center gap-2 '>
          <Carousel
            opts={{
              align: 'start',
            }}
            className='w-full '
          >
            <CarouselContent className=''>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index} className='md:basis-1/2 lg:basis-1/4'>
                  <div className='p-1'>
                    <Card>
                      <CardContent className='flex aspect-square flex-col justify-between   p-6'>
                        <h6>Design Issue</h6>
                        <span className='text-md font-semibold'>
                          Starter template for design issues
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className='relative  flex w-24 items-center  justify-between p-2'>
              <CarouselPrevious className='relative left-0 top-0 translate-x-0 translate-y-0' />
              <CarouselNext className='relative left-0 top-0 translate-x-0 translate-y-0' />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
