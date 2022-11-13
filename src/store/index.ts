import { EditedTask } from "../types/types";
import create from "zustand";

type State = {
  editedTask: EditedTask;
  updateEditedTask: (payload: EditedTask) => void;
  resetEditedTask: () => void;
};

export const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: "", description: "" },
  updateEditedTask: (payload) =>
    set({
      editedTask: {
        id: payload.id,
        title: payload.title,
        description: payload.description,
      },
    }),
  resetEditedTask: () =>
    set({
      editedTask: {
        id: 0,
        title: "",
        description: "",
      },
    }),
}));
