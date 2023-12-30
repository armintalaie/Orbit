import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { NewTemplate } from '../editor/popoverEditor';
import { useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { FileTextIcon } from 'lucide-react';

export default function IssueTemplates({
  teamid,
  sendTemplate,
}: {
  teamid: string;
  sendTemplate: Function;
}) {
  const [templates, setTemplates] = React.useState<any[]>([]);

  async function fetchTemplates() {
    const res = await fetch(`/api/teams/${teamid}/templates`, {
      next: { revalidate: 10 },
    });
    const templates = await res.json();
    setTemplates(templates);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className=' flex w-full  flex-col px-4'>
      <div className='flex w-full  flex-col '>
        <div className='flex flex-row items-center justify-between  '>
          <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>
            Issue Templates
          </h2>
          <NewTemplate
            button={true}
            reload={() => fetchTemplates()}
            teamid={teamid}
          />
        </div>

        {templates && templates.length > 0 ? (
          <div className='flex max-w-4xl flex-row items-center gap-2 '>
            <Carousel
              opts={{
                align: 'start',
              }}
              className='w-full '
            >
              <CarouselContent className=''>
                {templates.map((template, index) => (
                  <CarouselItem
                    key={index}
                    onClick={() => sendTemplate(template.contents)}
                    className=' xs:basis-1/1 sm:basis-1/2 md:basis-1/2 lg:basis-1/3'
                  >
                    <div className='rounded-lg'>
                      <Card className='rounded-lg border-gray-200 shadow-md'>
                        <CardContent className='flex h-32 w-full  flex-col  gap-4 rounded-lg px-0 py-2'>
                          <div className='flex  h-12 flex-row items-center gap-2 border-b border-gray-100 px-3 text-neutral-600'>
                            <FileTextIcon className='h-5 w-5 ' />
                            <h6 className='text-lg'>{template.title}</h6>
                          </div>

                          <span className='line-clamp-2 flex h-10 flex-grow flex-col justify-start px-3 text-xs'>
                            {template.description}
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
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-5'>
            <Alert className='bg-inherit'>
              <AlertDescription>
                You have no templates for this team. Create one now.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
