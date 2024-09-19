import { createSlice } from "@reduxjs/toolkit";

// Initial state for UI settings.
// Add more settings as needed (e.g., theme preferences, user settings)
const initialState = {
  monitors: {
    rowsPerPage: 10,
  },
  team: {
    rowsPerPage: 5,
  },
  sidebar: {
    collapsed: false,
  },
  mode: "light",
  greeting: { index: 0, lastUpdate: null },
  timezone: "America/Toronto",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setRowsPerPage: (state, action) => {
      const { table, value } = action.payload;
      if (state[table]) {
        state[table].rowsPerPage = value;
      }
    },
    toggleSidebar: (state) => {
      state.sidebar.collapsed = !state.sidebar.collapsed;
    },
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setGreeting(state, action) {
      state.greeting.index = action.payload.index;
      state.greeting.lastUpdate = action.payload.lastUpdate;
    },
    setTimezone(state, action) {
      state.timezone = action.payload.timezone;
    },
  },
});

export default uiSlice.reducer;
export const {
  setRowsPerPage,
  toggleSidebar,
  setMode,
  setGreeting,
  setTimezone,
} = uiSlice.actions;
