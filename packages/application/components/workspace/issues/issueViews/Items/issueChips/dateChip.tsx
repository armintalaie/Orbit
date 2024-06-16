import { Badge } from '@/components/ui/badge';
import { isOverdue, dateFormater } from '@/lib/util';

export default function DateChip({
  date,
  shouldConvert = true,
  shouldColor = true,
}: {
  date: string;
  shouldConvert?: boolean;
  shouldColor?: boolean;
}) {
  const convertedDate = shouldConvert ? dateFormater(date) : date;
  const shownLabel = date ? convertedDate : 'No date';
  const color = shouldColor && isOverdue(date) ? 'red' : 'none';
  return (
    <Badge
      variant={'outline'}
      className={`primary-surface border text-xs font-normal ${date ? 'border-solid' : 'borde-dashed'}`}
      color={color}
    >
      {shownLabel}
    </Badge>
  );
}
