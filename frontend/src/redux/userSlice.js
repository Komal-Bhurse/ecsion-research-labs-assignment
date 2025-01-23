import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

export const fetchUser = createAsyncThunk("fetchUser", async()=>{
    const response = await axios.get(`/api/user`,{withCredentials:true});
    const data =  response?.data?.data;
    return data;
})

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        error: null,
        loading: false,
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchUser.pending, (state)=>{
               state.loading  = true;
        })

        builder.addCase(fetchUser.fulfilled, (state,action)=>{
        state.loading = false;
        state.user = action.payload;
        })

        builder.addCase(fetchUser.rejected, (state)=>{
            state.error = true;
        })
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload
        },
        logout: (state) => {
            state.user = null
        }
    }
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer