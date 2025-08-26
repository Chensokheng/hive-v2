import getUserInfo from "@/services/auth/get-user-info";
import { useQuery } from "@tanstack/react-query";

export default function useGetUserInfo() {
  return useQuery({
    queryKey: ["user-info"],
    queryFn: () => getUserInfo(),
  });
}
