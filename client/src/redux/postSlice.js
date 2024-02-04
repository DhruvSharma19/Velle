import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentPost: null,
};

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {

    postSuccess: (state, action) => {
      state.currentPost = action.payload;
    },
    addPost: (state, action) => {
      state.currentPost = [...state.currentPost, action.payload];
    },
    deletePost: (state, action) => {
      state.currentPost.splice(
        state.currentPost.findIndex((post) => post._id === action.payload)
        , 1
      )
    },
    like: (state, action) => {
      if (!state.currentPost[state.currentPost.findIndex((post) => post._id === action.payload.postId)].likes.includes(action.payload.userId)) {

        state.currentPost[state.currentPost.findIndex((post) => post._id === action.payload.postId)].likes.push(action.payload.userId);
      }
      else {
        state.currentPost[state.currentPost.findIndex((post) => post._id === action.payload.postId)].likes.splice(
          state.currentPost[state.currentPost.findIndex((post) => post._id === action.payload.postId)].likes.findIndex((userId) => userId === action.payload.userId), 1
        )
      }
    }

  },
});


export const { postSuccess, addPost, deletePost, like } = postSlice.actions
export default postSlice.reducer;