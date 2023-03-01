import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: 'notificationSlice',
    initialState: {
        allNotifications: [],
        notificationMenu: 'New'
    },
    reducers: {
        setAllNotifications: (state, action) => {
            state.allNotifications = action.payload;
            if(state.notificationMenu == "All"){
                state.allNotifications.reverse();
            }
        },

        setNotificationMenu: (state, action) => {
            state.notificationMenu = action.payload;
            if(state.notificationMenu == "New"){
                state.allNotifications.sort((a, b) => {
                    return b.createdAt - a.createdAt;
                })
            }
            else{
                state.allNotifications.reverse();
            }
        }
    },
})

export default notificationSlice.reducer;

export const { setAllNotifications, setNotificationMenu } = notificationSlice.actions;