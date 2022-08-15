import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice';

import PostAuthor from './PostAuthor';
import ReactionButtons from './ReactionButtons';
import TimeAgo from './TimeAgo';
import { useParams } from 'react-router-dom';


const SinglePostPage = () => {
    // retrieve postId
    const { postId } = useParams();
   

    const post = useSelector((state)=> selectPostById(state,postId));

    if(!post){
        return(
            <section>
                <h2>Page not found!</h2>
            </section>
        )
    }


    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body}</p>

            <p className="postCredit">
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
                <br />
                <ReactionButtons post={post} />
            </p>

        </article>
    )
}

export default SinglePostPage