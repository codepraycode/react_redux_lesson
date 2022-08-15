import React from 'react';
import {useSelector} from 'react-redux';
import PostsExcerpts from './PostsExcerpts';

import {
    selectAllPosts, getPostsStatus,getPostsError
} from './postsSlice';


const PostsList = ()=>{
    // const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    
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