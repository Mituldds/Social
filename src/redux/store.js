import { configureStore } from "@reduxjs/toolkit"
import appConfigReducer from "./slices/appConfigSlice"
import postsReducer from "./slices/postsSlice"
import userProfileReducer from "./slices/userProfileSlice"
import chatReducer from "./slices/chatSlice"
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import notificationReducer from "./slices/notificationSlice"

export default configureStore({
    reducer: {
        appConfigReducer,
        postsReducer,
        userProfileReducer,
        chatReducer,
        notificationReducer
    },
    middleware: getDefaultMiddleware(),
})