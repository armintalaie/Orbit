import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { NewTemplate } from '../editor/popoverEditor';
import { useContext, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { FileTextIcon } from 'lucide-react';
import { OrbitContext } from '@/lib/context/OrbitContext';

export default function IssueTemplates({ teamid, sendTemplate }: { teamid: string; sendTemplate: Function }) {
  const [templates, setTemplates] = React.useState<any[]>([]);
  const { fetcher } = useContext(OrbitContext);

  async function fetchTemplates() {
    const res = await fetcher(`/api/teams/${teamid}/templates`, {
      next: {
        revalidate: 10,
      },
    });
    const templates = await res.json();
    setTemplates(templates);
  }

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className=' flex w-full flex-grow  flex-col px-4 '>
      <div className='flex w-full  flex-col   '>
        <div className='flex flex-row items-center gap-2 '>
          <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>Templates</h2>
          <NewTemplate button={true} reload={() => fetchTemplates()} teamid={teamid} />
        </div>

        <div className='flex flex-col items-center justify-center gap-2 py-5'>
          <Alert className='bg-inherit'>
            <AlertDescription>Choose a template to insert into the editor.</AlertDescription>
          </Alert>
        </div>

        {templates && templates.length > 0 ? (
          <div className='flex max-w-4xl flex-col items-center gap-2 overflow-hidden '>
            <Carousel
              opts={{
                align: 'start',
              }}
              orientation='vertical'
              className='w-full '
            >
              <div className='relative  flex w-24 items-center  justify-between p-2 pb-4'>
                <CarouselPrevious className='relative left-0 top-0 translate-x-0 translate-y-0' />
                <CarouselNext className='relative left-0 top-0 translate-x-0 translate-y-0' />
              </div>

              <CarouselContent className=' flex flex-col '>
                {templates.map((template, index) => (
                  <CarouselItem
                    key={index}
                    onClick={() => sendTemplate(template.contents)}
                    className=' flex w-full  flex-col'
                  >
                    <div className='rounded-lg'>
                      <Card className='rounded-lg border-gray-200 shadow-sm'>
                        <CardContent className='flex h-[100px] w-full  flex-col  gap-4 rounded-lg px-0 py-2'>
                          <div className='flex   flex-row items-center gap-2 border-b border-gray-100 px-3 text-neutral-600'>
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
            </Carousel>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center gap-2 py-5'>
            <Alert className='bg-inherit'>
              <AlertDescription>You have no templates for this team. Create one now.</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
