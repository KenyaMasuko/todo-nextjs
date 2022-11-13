import { Task } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useStore } from "../store";
import { EditedTask } from "../types/types";

export const useMutateTasks = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const reset = useStore((state) => state.resetEditedTask);

  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, "id">) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/todo`,
        task
      );
      return res.data;
    },
    {
      onSuccess: (res) => {
        const prevTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        if (prevTodos) {
          queryClient.setQueryData(["tasks"], [res, ...prevTodos]);
        }
        reset();
      },
      onError: (error: any) => {
        reset();
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const res = await axios.patch<Task>(
        `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
        task
      );
      return res.data;
    },
    {
      onSuccess: (res, variables) => {
        const prevTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        if (prevTodos) {
          queryClient.setQueryData(
            ["tasks"],
            prevTodos.map((task) => (variables.id === task.id ? res : task))
          );
        }
        reset();
      },
      onError: (error: any) => {
        reset();
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  const deleteTaskMutation = useMutation(
    async (id: number) => {
      axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`);
    },
    {
      onSuccess: (_, variables) => {
        const prevTodos = queryClient.getQueryData<Task[]>(["tasks"]);
        if (prevTodos) {
          queryClient.setQueryData(
            ["tasks"],
            prevTodos.filter((task) => task.id !== variables)
          );
        }
        reset();
      },
      onError: (error: any) => {
        if (error.response.status === 401 || error.response.status === 403) {
          router.push("/");
        }
      },
    }
  );

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};
