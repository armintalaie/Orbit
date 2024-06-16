export default function LinearSkeleton() {
  return (
    <div className='flex w-full flex-col items-center justify-center'>
      <div className='tertiary-surface mb-4 h-2.5 w-full rounded-full dark:bg-gray-700'></div>
      <div className='tertiary-surface mb-2.5 h-2 max-w-[360px] rounded-full dark:bg-gray-700'></div>
      <div className='tertiary-surface mb-2.5 h-2 rounded-full dark:bg-gray-700'></div>
      <div className='tertiary-surface mb-2.5 h-2 max-w-[330px] rounded-full dark:bg-gray-700'></div>
      <div className='tertiary-surface mb-2.5 h-2 max-w-[300px] rounded-full dark:bg-gray-700'></div>
      <div className='tertiary-surface h-2 max-w-[360px] rounded-full dark:bg-gray-700'></div>
    </div>
  );
}
