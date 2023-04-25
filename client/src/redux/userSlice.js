import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentUser:null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      loginSuccess:(state,action)=>{
        
        state.currentUser=action.payload;
      },
      logout:(state)=>{ 
        state.currentUser=null;
      },
      reject:(state,action)=>{

        state.currentUser.requests.splice(
          state.currentUser.requests.findIndex(
            (userId)=>userId===action.payload
          ),
          1
        )
      },
      accept:(state,action)=>{
        if(!state.currentUser.friends.includes(action.payload)){

          state.currentUser.friends.push(action.payload);
        }
          state.currentUser.requests.splice(
            state.currentUser.requests.findIndex(
              (userId)=>userId===action.payload
            ),
            1
          )
      },
      remove:(state,action)=>{
          state.currentUser.friends.splice(
            state.currentUser.friends.findIndex(
              (userId)=>userId===action.payload
            ),
            1
          )
      },
      bannerUrl:(state,action)=>{
        state.currentUser.banner=action.payload
      },
      imgUrl:(state,action)=>{
        state.currentUser.img=action.payload
      }
      
    },
  });


  export const {loginStart,loginSuccess,loginFailure,logout,reject,accept,remove,bannerUrl,imgUrl}=userSlice.actions
  export default userSlice.reducer;