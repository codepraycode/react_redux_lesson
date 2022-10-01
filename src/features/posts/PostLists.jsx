import React from 'react';
import {useSelector} from 'react-redux';
import PostsExcerpts from './PostsExcerpts';

import {
    selectPostIds, getPostsStatus,getPostsError
} from './postsSlice';


const PostsList = ()=>{
    // const dispatch = useDispatch();
    const orderedPostIds = useSelector(selectPostIds);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);
    
    let content;
    
    if (postsStatus === 'succeeded'){

        content = orderedPostIds.map((postId) => <PostsExcerpts key={postId} postId={postId} />);

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