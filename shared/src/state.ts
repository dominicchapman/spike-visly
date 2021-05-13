import { syncedState } from "@visly/state";
import { nanoid } from "nanoid";

interface AppState {
  items: string[];
}

const initialState: AppState = {
  items: [],
};

export const mutations = {
  addItem: (state: AppState) => {
    state.items.push(nanoid());
  },
};

export const selectors = {
  items: (state: AppState) => state.items,
};

export const appState = syncedState<AppState>("appState", initialState);
