import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import NewPost from "./NewPost/NewPost";
import Post from "./Post/Post";
import Auth from '../../auth';

const Home = props => {

  const [state, setState] = useState({
    loading: true,
    posts: []
  });

  useEffect(() => {
    getPosts();
    
    console.log(Auth.decodeJWT());
    // eslint-disable-next-line
  }, []);

  const getPosts = () => {
    axios.get(`${process.env.REACT_APP_NODE_API}/api/posts`)
      .then(response => {
        console.log(response.data);
        response.data.data.sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
        setState({ ...state, loading: false, posts: response.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  const handlePost = (newPost) => {
    state.posts.push(newPost);
  }

  let loadingContent = (
    <div className="container text-center">
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="light" />
    </div>
  );

  let content = (
    <div className="daycare-home-page">
      <NewPost handlePost={(post) => { handlePost(post) }}></NewPost>
      <div className="post-container">
        {state.posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );

  return state.loading ? loadingContent : content;
}

export default Home;
