import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
    name: 'postsSlice',
    initialState: {
        allPosts: [],
        currentComments: [],
        feedType: "Newest"
    },
    reducers: {
        setAllPosts: (state, action) => {
            state.allPosts = action.payload;
            state.allPosts.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
        },

        updateAllPosts: (state, action) => {
            if (action.payload == "Newest") {
                state.allPosts.sort((a, b) => {
                    return b.createdAt - a.createdAt
                })
            }
            else if (action.payload == "Trending") {
                state.allPosts.sort((a, b) => {
                    return b.likes.length - a.likes.length
                })
            }
            else if (action.payload == "Discover") {
                state.allPosts.sort((a, b) => {
                    return a.likes.length - b.likes.length
                })
            }
        },

        setLikeForPost: (state, action) => {
            const index = state?.allPosts?.findIndex(item => item.id === action.payload.id);
            if (index != undefined && index != -1) {

                if (state.allPosts[index].likes.includes(action.payload.currUserId)) {
                    const postIndex = state.allPosts[index].likes.indexOf(action.payload.currUserId);
                    state.allPosts[index].likes.splice(postIndex, 1);
                }
                else {
                    state.allPosts[index].likes.push(action.payload.currUserId);
                }
            }
        },

        setCurrentComments: (state, action) => {
            const index = state?.allPosts?.findIndex(item => item.id === action.payload.postId);
            if (index != undefined && index != -1) {
                state.allPosts[index].commentCount = action.payload.result.length;
            }
            state.currentComments = action.payload.result;
        },

        setFeedType: (state, action) => {
            state.feedType = action.payload;
            // console.log(action.payload);
        },

        addAPost: (state, action) => {
            // console.log(action.payload);
            state.allPosts.unshift(action.payload);
        }
    },
})

export default postsSlice.reducer;

export const { setAllPosts, setLikeForPost, setCurrentComments, updateAllPosts, setFeedType, addAPost } = postsSlice.actions;