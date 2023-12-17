import { dateFormater } from '@/lib/util';
import { Badge } from '@radix-ui/themes';
import { Boxes } from 'lucide-react';
import Link from 'next/link';

export default function TeamGrid({ teams }: { teams: any[] }) {
  return (
    <div className='grid grid-cols-1 gap-4 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  );
}

function TeamCard({ team }: { team: any }) {
  return (
    <Link href={`/teams/${team.id}`}>
      <div className='relative flex  flex-col rounded border bg-white pb-0 shadow-sm hover:shadow-md'>
        <div className='z-10 flex items-center justify-between border-b px-4 py-2 '>
          <div className='flex items-center gap-2'>
            <Boxes size={15} className='text-gray-700' />
            <div className='text-sm font-medium'>{team.name}</div>
          </div>
        </div>

        <div className='z-10 flex h-10 w-full border-t  border-gray-100 bg-gray-100 bg-opacity-20 p-2'>
          <h2 className='center text-xs italic text-gray-600 '>
            {team.description}
          </h2>
        </div>
        <div className='z-10 flex h-fit w-full justify-end  bg-gray-100 bg-opacity-20 p-2 py-1'>
          <Badge color='gray' className='m-0 h-fit p-1'>
            Updated {dateFormater(team.updatedat)}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
