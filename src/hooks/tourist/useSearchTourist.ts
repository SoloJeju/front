import { useMutation } from '@tanstack/react-query';
import { getTouristSearch } from '../../apis/tourist';

export const useSearchTourist = () => {
  return useMutation({
    mutationFn: (keyword: string) => getTouristSearch(keyword),
  });
};