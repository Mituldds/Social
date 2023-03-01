import { createSlice } from "@reduxjs/toolkit";

const appConfigSlice = createSlice({
    name: 'appConfigSlice',
    initialState: {
        myProfile: {},
        menu: "Home"
    },
    
    reducers: {
        setMyProfile: (state, action) => {
            state.myProfile = action.payload;
        },

        setMenu: (state, action) => {
            state.menu = action.payload
        }
    },
})

export default appConfigSlice.reducer;

export const { setMyProfile, setMenu } = appConfigSlice.actions;