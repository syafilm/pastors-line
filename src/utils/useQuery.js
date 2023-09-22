import QueryString from 'qs';
import { useLocation } from 'react-router-dom';

export const useQuery = () => {
  return QueryString.parse(useLocation().search, { ignoreQueryPrefix: true });
};

export default useQuery;
