// import Counter from './features/counter/Counter';
import PostsList from './features/posts/PostLists';
import AddPostForm from './features/posts/AddPostForm';
import Layout from './components/Layout';
import {Routes,Route} from 'react-router-dom';
import SinglePostPage from './features/posts/SinglePostPage';
import EditPostPage from './features/posts/EditPostPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<PostsList/>}/>

        <Route path="post">
          <Route index element={<AddPostForm/>}/>
          <Route path=":postId" element={<SinglePostPage/>}/>

          <Route path="edit/:postId" element={<EditPostPage />}/>
        </Route>

      </Route>      
    </Routes>
  );
}

export default App;
