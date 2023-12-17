import { CheckCircle2, CheckCircleIcon, InfoIcon } from "lucide-react";



export const statusIconMapper = (status: string, className: string) => {
    switch (status) {
        case 'Backlog':
            return <InfoIcon className={className} />;
            case 'Todo':
            return <InfoIcon className={className} />;
            case 'In Progress':
            return <InfoIcon className={className} />;
            case 'Done':
        return <CheckCircle2  className={className}/>;
        case 'Archived':
        return <InfoIcon className={className} />;
        case 'Canceled':
        return <InfoIcon className={className} />;
        case 'Duplicate':
        return <InfoIcon className={className} />;
        case 'In Review':
        return <InfoIcon className={className} />;
        default:
        return <InfoIcon className={className} />;
    }
    }