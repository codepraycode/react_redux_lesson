import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';

import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';

const PostsExcerpt = ({ postId }) => {

  const post = useSelector(state=>selectPostById(state,postId));

  return (
      <article>
            <h2>{post.title}</h2>

            <p className='excerpt'>{post.body.substring(0, 75)}</p>

            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
                <br />
                <ReactionButtons post={post} />
            </p>

      </article>
  )
}

// using memo will make the component re-render only when it props changes
// PostsExcerpt = React.memo(PostsExcerpt);

export default PostsExcerpt