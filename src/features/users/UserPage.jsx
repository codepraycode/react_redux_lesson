import React from 'react';
import { useSelector } from 'react-redux';
import { selectUserById } from './usersSlice';
import { selectPostByUser } from '../posts/postsSlice';
import { Link, useParams } from 'react-router-dom';

const UserPage = () => {
    const {userId} = useParams();
    const user = useSelector(state=>selectUserById(state,Number(userId)));
    
    const postsForUser = useSelector(state=>selectPostByUser(state,Number(userId)));
    // useSelector(state=>{
    //     const allPosts = selectAllPosts(state);
    //     return allPosts.filter(post=>post.userId === Number(userId));
    // });

    const postTitles = postsForUser.map(post=>(
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>
                {post.title}
            </Link>
        </li>
    ))
  return (
    <section>
        <h2>{user?.name}</h2>
        <ol>{postTitles}</ol>
    </section>
  )
}

export default UserPage;