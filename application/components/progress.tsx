export default function RadialProgress({ progress }: { progress: number }) {
  return (
    <div className='relative inline-block h-10 w-10'>
      <svg className='text-crimson-foreground absolute left-0 top-0 h-full w-full' viewBox='0 0 40 40'>
        <circle className='stroke-current stroke-2' cx='20' cy='20' r='18' fill='none'></circle>
        <circle
          className='stroke-current stroke-2'
          cx='20'
          cy='20'
          r='18'
          fill='none'
          strokeDasharray={`${progress * 113.097} 113.097`}
          strokeDashoffset='28.274'
        ></circle>
      </svg>
      <span className='text-crimson-foreground absolute left-0 top-0 flex h-full w-full items-center justify-center text-sm font-semibold'>
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}
