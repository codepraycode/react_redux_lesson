import {createSlice, nanoid, createAsyncThunk, createSelector}  from '@reduxjs/toolkit';
import {sub} from 'date-fns';
import axios from 'axios';

const POST_URL = 'https://jsonplaceholder.typicode.com/posts';

/* 
    {
        id: '1',
        title: 'Learning Redux Toolkit',
        content: "I've heard good things.",
        date:sub(new Date(), {minutes:10}).toISOString(),
        reactions:{
            thumbsUp:0,
            wow:0,
            heart:0,
            rocket:0,
            coffee:0
        }
    },
    {
        id: '2',
        title: 'Slices...',
        content: "The more I say slice, the more I want pizza.",
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0
        }
    }
*/

const initialState = {
    posts: [],
    status:'idle', // 'idle | 'loading' | 'succeeded' | 'failed'
    error:null,
    count:0,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=>{
    const response = await axios.get(POST_URL);
    return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost)=>{
    const response = await axios.post(POST_URL, initialPost);
    return response.data;
});
export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost)=>{
    const {id} = initialPost;

    try{
        const response = await axios.put(`${POST_URL}/${id}`, initialPost);
        return response.data;
    }
    catch(err){
        return initialPost; // only for testing
    }

    
});
export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost)=>{
    const {id} = initialPost;

    const response = await axios.delete(`${POST_URL}/${id}`, initialPost);
    if(response?.status === 200) return initialPost;
    return `${response?.status}: ${response?.statusText}`;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers:{
        postAdded: { // not in use anyway, but I'll keep it
            reducer(state,action){
                state.posts.push(action.payload)
            },
            prepare(title,content, userId){
                return {
                    payload:{
                        id:nanoid(),
                        title,
                        content,
                        userId,
                        date: new Date().toISOString(),
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state,action){
            const {postId, reaction} = action.payload;
            const existingPost = state.posts.find(post=>post.id === postId);

            if(existingPost){
                existingPost.reactions[reaction]++
            }
        },

        increaseCount(state,action){
            state.count = state.count + 1
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                // console.log("Loading...")
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                // console.log("Done!...")
                state.status = 'succeeded'

                // Adding date and reactions
                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }

                    return post;
                });

                // Add any fetched posts to the array
                // console.log(action.payload)
                state.posts = state.posts.concat(loadedPosts)

            })
            .addCase(fetchPosts.rejected, (state, action) => {
                console.log("Failed...")
                state.status = 'failed';

                state.error = action.error.message;
            })
            .addCase(addNewPost.fulfilled, (state,action)=>{
                // Fix the API post IDs:
                // Creating sortedPosts & assigning the id
                // would not be needed if the fake API
                // returned accurate new post IDs

                const sortedPosts = state.posts.sort((a,b)=>{
                    if(a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                });

                action.payload.id = sortedPosts[sortedPosts.length -1].id + 1;

                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }

                // console.log(action.payload);
                state.posts.push(action.payload);
            })
            .addCase(updatePost.fulfilled, (state,action)=>{

                if(!action.payload?.id){
                    console.log("Update could not complete")
                    console.log(action.payload)
                    return;
                }

                const {id} = action.payload;
                action.payload.date = new Date().toISOString();
                const posts = state.posts.filter(post=>post.id !== id);
                state.posts = [...posts,action.payload];

            })
            .addCase(deletePost.fulfilled, (state,action)=>{

                if(!action.payload?.id){
                    console.log("Delete could not complete")
                    console.log(action.payload)
                    return;
                }

                const {id} = action.payload;
                // action.payload.date = new Date().toISOString();
                state.posts = state.posts.filter(post=>post.id !== id);
                // state.posts = [...posts,action.payload];
                // state.posts = posts

            })
    }
});

// Selectors
export const selectAllPosts = (state)=> state.posts.posts;
export const getPostsStatus = (state)=> state.posts.status;
export const getPostsError = (state)=> state.posts.error;
export const getCount = (state)=> state.posts.count;


export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === parseInt(postId));
export const selectPostByUser = createSelector(
    [selectAllPosts, (state,userId)=>userId],
    (posts, userId) => posts.filter(post => post.userId === userId)
)
    


export const { postAdded, reactionAdded, increaseCount } = postsSlice.actions;
export default postsSlice.reducer;