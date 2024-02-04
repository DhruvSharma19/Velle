import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentComment: null,
};

export const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    commentSuccess: (state, action) => {
      state.currentComment = action.payload;
    },
  },
});

export const { commentSuccess } = commentSlice.actions;

export default commentSlice.reducer;