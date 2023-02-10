import { configureStore } from "@reduxjs/toolkit"
import appConfigReducer from "./slices/appConfigSlice"
import postsReducer from "./slices/postsSlice"
import userProfileReducer from "./slices/userProfileSlice"

export default configureStore({
    reducer: {
        appConfigReducer,
        postsReducer,
        userProfileReducer
    }
})