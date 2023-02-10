import { createSlice } from "@reduxjs/toolkit";

const userProfileSlice = createSlice({
    name: 'userProfileSlice',
    initialState: {
        userProfile: null,
        allUserPosts: [],
        filteredPosts: [],
        selectedPostType: 'Photos'
    },
    reducers: {
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },

        setAllUserPosts: (state, action) => {
            state.allUserPosts = action.payload;
            state.allUserPosts.sort((a, b) => {
                return b.createdAt - a.createdAt
            });
            state.filteredPosts = state.allUserPosts.filter((post) => post.postType == 'img');
        },

        setSelectedPostType: (state, action) => {
            state.selectedPostType = action.payload;
            if(state.selectedPostType == 'Photos'){
                state.filteredPosts = state.allUserPosts.filter((post) => post.postType == 'img');
            }
            else{
                state.filteredPosts = state.allUserPosts.filter((post) => post.postType == 'video');
            }
            
        }
    },
})

export default userProfileSlice.reducer;

export const { setUserProfile, setAllUserPosts, setSelectedPostType } = userProfileSlice.actions;