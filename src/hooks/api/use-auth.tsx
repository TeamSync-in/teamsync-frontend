import { getCurrentUserQueryFn } from "@/lib/api";
import { useStore } from "@/store/store";
import { useQuery } from "@tanstack/react-query";

const useAuth = () => {
  const { accessToken } = useStore();

  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    enabled: !!accessToken, // Only run if we have a token
  });
  return query;
};

export default useAuth;
