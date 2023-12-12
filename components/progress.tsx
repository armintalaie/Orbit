



export default function RadialProgress({ progress }: { progress: number }) {

    return (
        <div className="relative inline-block w-10 h-10">
        <svg
            className="absolute top-0 left-0 w-full h-full text-crimson-foreground"
            viewBox="0 0 40 40"
        >
            <circle
            className="stroke-current stroke-2"
            cx="20"
            cy="20"
            r="18"
            fill="none"
            ></circle>
            <circle
            className="stroke-current stroke-2"
            cx="20"
            cy="20"
            r="18"
            fill="none"
            strokeDasharray={`${progress * 113.097} 113.097`}
            strokeDashoffset="28.274"
            ></circle>
        </svg>
        <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-semibold text-crimson-foreground">
            {Math.round(progress * 100)}%
        </span>
        </div>
    )
    }

    