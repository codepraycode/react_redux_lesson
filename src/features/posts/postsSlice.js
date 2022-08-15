import {createSlice, nanoid, createAsyncThunk}  from '@reduxjs/toolkit';
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
    error:null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async()=>{
    const response = await axios.get(POST_URL);
    return response.data;
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost)=>{
    const response = await axios.post(POST_URL, initialPost);
    return response.data;
});

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers:{
        postAdded: {
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

                console.log(action.payload);
                state.posts.push(action.payload);
            })
    }
});

// Selectors
export const selectAllPosts = (state)=> state.posts.posts;
export const getPostsStatus = (state)=> state.posts.status;
export const getPostsError = (state)=> state.posts.error;
export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === parseInt(postId));


export const { postAdded, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;