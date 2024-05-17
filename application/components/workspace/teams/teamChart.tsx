import React, { PureComponent } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

export default function Analytics() {
  //   const demoUrl = 'https://codesandbox.io/s/tiny-bar-chart-35meb';

  return (
    <div className='flex w-full flex-col border-t border-gray-200 p-3 '>
      <h2 className='text-md  py-3 font-medium leading-tight text-gray-700'>Members</h2>
      <div className='flex h-[400px] w-full flex-col border border-gray-100'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart width={150} height={40} data={data}>
            <Bar dataKey='uv' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
