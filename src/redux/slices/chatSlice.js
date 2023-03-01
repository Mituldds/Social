import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chatSlice',
    initialState: {
        allUsers: [],
        userToShow: [],
        chatId: "",
        allMessages: [],
        currChatUser: {}
    },
    reducers: {
        setAllUsers: (state, action) => {
            state.allUsers = action.payload;
            state.userToShow = action.payload;
            state.currChatUser = state.userToShow[0];
        },
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },

        setAllMessages: (state, action) => {
            state.allMessages = action.payload;
            state.allMessages.sort((a, b) => {
                return a.createdAt - b.createdAt;
            })
        },

        setCurrentChatUser: (state, action) => {
            state.currChatUser = action.payload;
        },

        setUserToShow: (state, action) => {
            if (action.payload) {
                state.userToShow = state.userToShow.filter((user) => {
                    const userName = user.name.toLowerCase();
                    return userName.includes(action.payload.toLowerCase());
                });
            }
            else {
                state.userToShow = state.allUsers;
            }
        }
    },
})

export default chatSlice.reducer;

export const { setAllUsers, setChatId, setAllMessages, setCurrentChatUser, setUserToShow } = chatSlice.actions;