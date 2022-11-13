import { Loader } from "@mantine/core";
import { useQueryUser } from "../hooks/useQueryUser";

export const UserInfo = () => {
  const { data: user, isLoading } = useQueryUser();
  if (isLoading) return <Loader />;
  return <p>{user?.email}</p>;
};
