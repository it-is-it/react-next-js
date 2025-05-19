import { useSearchParams } from 'react-router-dom';
import { subDays } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getStaysAfterDate } from '../../services/apiBookings';

export function useRecentStays() {
  const [searchParams] = useSearchParams();

  const numDays = !searchParams.get('last')
    ? 7
    : Number(searchParams.get('last'));
  const queryData = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: stays } = useQuery({
    queryFn: () => getStaysAfterDate(queryData),
    queryKey: ['stays', `last-${numDays}`],
  });

  const confirmedStays = stays?.filter(
    (stay) => stay.status === 'checked-in' || stay.status === 'checked-out'
  );

  return { isLoading, stays, confirmedStays, numDays };
}
