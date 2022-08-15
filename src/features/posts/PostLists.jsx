import React,{useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PostsExcerpts from './PostsExcerpts';

import {
    selectAllPosts, fetchPosts,getPostsStatus,getPostsError
} from './postsSlice';


const PostsList = ()=>{
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);


    useEffect(()=>{
        if(postsStatus === 'idle'){
            dispatch(fetchPosts())
        }
    },[postsStatus, dispatch]);
    
    let content;

    
    
    if (postsStatus === 'succeeded'){

        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

        content = orderedPosts.map((post,i) => <PostsExcerpts key={i} post={post}/>);

    }else if(postsStatus === 'failed'){
        content = <p>{error}</p>
    }
    
    else{// if (postsStatus === 'loading')
        content = <p>Loading...</p>;
    }

    return (
        <section>
            {content}
        </section>
    )
}


export default PostsList;