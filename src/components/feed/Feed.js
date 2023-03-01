import React, { useEffect } from 'react'
import './Feed.scss'
import Post from '../post/Post'
import { getAllPosts } from '../../utils/FirebaseServices'
import { useDispatch, useSelector } from 'react-redux'
import { setFeedType, updateAllPosts } from '../../redux/slices/postsSlice'
import { setMenu } from '../../redux/slices/appConfigSlice'

const Feed = () => {

    const allPosts = useSelector(state => state.postsReducer.allPosts);
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const feedType = useSelector(state => state.postsReducer.feedType);

    const dispatch = useDispatch();

    useEffect(() => {
        if(allPosts.length === 0){
            getAllPosts();
        }
        dispatch(setMenu('Home'));
    }, [])


    const changeFeed = (type) => {
        dispatch(setFeedType(type));
        dispatch(updateAllPosts(type));
    }

    return (
        <div className='feed'>
            <div className="tab-btn center">
                <button className={feedType === "Newest" ? 'btn selected' : 'btn'} onClick={() => changeFeed("Newest")}>Newest</button>
                <button className={feedType === "Trending" ? 'btn selected' : 'btn'} onClick={() => changeFeed("Trending")}>Trending</button>
                <button className={feedType === "Discover" ? 'btn selected' : 'btn'} onClick={() => changeFeed("Discover")}>Discover</button>
            </div>
            <div className="feed-content">
                {/* <Post/>
                <Post/>
                <Post/>
                <Post/> */}
                {
                    allPosts.map((post) => <Post key={post.id} post={post} isFollowing={myProfile?.followings?.includes(post.ownerId)} />)
                }
            </div>
        </div>
    )
}

export default Feed