import React, { useEffect, useState } from 'react'
import './Post.scss'
import { Button } from '@mui/material'
import { AiOutlineHeart, AiFillMessage, AiFillHeart, AiOutlineSend } from 'react-icons/ai'
import { addComment, getAParticularUser, getCommnets, getMyDoc, postLikeUnlike, userFollowUnFollow } from '../../utils/FirebaseServices'
import { useDispatch, useSelector } from 'react-redux'
import { setLikeForPost } from '../../redux/slices/postsSlice'
import Avatar from '../avatar/Avatar'
import Comment from '../comment/Comment'

const Post = ({ post, isFollowing }) => {

    const [showComment, setShowComment] = useState(false);
    const [date, setDate] = useState([]);
    const [text, setText] = useState('');
    const [user, setUser] = useState();
    const dispatch = useDispatch();
    const myProfile = useSelector(state => state.appConfigReducer.myProfile);
    const currentComments = useSelector(state => state.postsReducer.currentComments);

    useEffect(() => {
        getAParticularUser(post.ownerId, setUser);
        setDate(new Date(Number(post?.createdAt)).toUTCString().split(" ").splice(0,4));
    }, []);

    const likeAndUnlike = (id) => {
        // setShowComment(false);
        dispatch(setLikeForPost({ id, currUserId: myProfile.id }));
        postLikeUnlike(id, myProfile?.id, myProfile);
    }

    const followAndUnfollow = (id) => {
        userFollowUnFollow(id, myProfile?.id);
    }

    const loadComments = (e, id) => {
        e.stopPropagation();
        setShowComment(!showComment);
        if (showComment) return;

        getCommnets(id);
        // console.log(date)
    }

    const handleComment = (e) => {
        e.preventDefault();
        if (!text) return;
        const d = new Date().toString();
        addComment(post, myProfile.id, text, d, myProfile);
        setText('');
    }

    return (
        <div className='post center' onClick={() => setShowComment(false)}>
            <div className="post-header">
                {/* <img src={user?.photoUrl ? user?.photoUrl : avatar} alt="Avatar" /> */}
                <Avatar width={'50px'} height={'50px'} src={user?.photoUrl} id={post?.ownerId} />
                <div className="post-info">
                    <div className="bio">
                        {
                            post?.title
                        }
                    </div>
                    <div className="time-stamp">
                        {/* March 13, 2021 at 5:16 PM */}
                        {
                            `${user?.name}, ${date[0]} ${date[1]} ${date[2]} ${date[3]}`
                        }
                    </div>
                </div>
                <div className='btn center'>
                    <Button size='small' disabled={post?.ownerId === myProfile?.id} onClick={() => followAndUnfollow(post?.ownerId)} variant='outlined'>
                        {
                            isFollowing ? 'Unfollow' : 'Follow'
                        }
                    </Button>
                </div>
            </div>
            <div className="post-content">
                <div className="post-left">
                    <img src={post?.postUrl} alt="" />
                </div>
                <div className="post-right">
                    <div className="likes center">
                        <button className='icon center' onClick={() => likeAndUnlike(post.id)}>
                            {
                                post?.likes?.includes(myProfile?.id) ? <AiFillHeart style={{ color: 'red' }} className='like-icon' /> :
                                    <AiOutlineHeart style={{ color: 'gray' }} className='like-icon' />
                            }
                        </button>
                        <p>{post.likes.length}</p>
                    </div>
                    <div className="comments center">
                        <button className='icon center' onClick={(e) => loadComments(e, post?.id)}>
                            <AiFillMessage className='comment-icon' />
                        </button>
                        <p>{post?.commentCount}</p>
                    </div>
                </div>
            </div>
            {
                showComment &&
                <div className="post-comments" onClick={(e) => e.stopPropagation()}>
                    <div className="comment-list">
                        {
                            post?.commentCount === 0 ? <div className='no-comment center'>No Comments</div> : <div>
                                {
                                    currentComments?.map((comment) => <Comment key={comment.id} comment={comment} />)
                                }
                            </div>
                        }

                    </div>
                    <div className="send-comment">
                        <form onSubmit={handleComment} className='comment-form'>
                            <input value={text} onChange={(e) => setText(e.target.value)} type="text" placeholder='Type something...' />
                            <button type='submit'><AiOutlineSend className='send-icon' /></button>
                        </form>
                    </div>
                </div>
            }
        </div>
    )
}

export default Post