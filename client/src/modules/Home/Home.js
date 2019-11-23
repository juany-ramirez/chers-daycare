import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spinner, Container } from "react-bootstrap";
import NewPostHeader from "./NewPostHeader/NewPostHeader";
import Post from "./Post/Post";
import Auth from '../../auth';
import { PostContext } from '../../contexts/PostContext';

const Home = props => {
  const [posts, setPosts] = useState([]);

  const value = useMemo(() => ({ posts, setPosts }), [posts, setPosts]);

  const [state, setState] = useState({
    loading: true
  });

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);

  const getPosts = () => {
    axios.get(`${process.env.REACT_APP_NODE_API}/api/posts`)
      .then(response => {
        console.log(response.data);
        response.data.data.sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
        setState({ ...state, loading: false });
        setPosts(response.data.data)
      })
      .catch(err => {
        console.log(err);
      });
  }

  const handlePost = () => {
    getPosts();
  }

  const handleNewComment = (data) => {
    console.log(data);
  }

  let loadingContent = (
    <div className="container text-center">
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="light" />
    </div>
  );

  let content = (
    <PostContext.Provider value={value}>
      <div className="daycare-home-page styles-layout">
        <Container>
          <NewPostHeader handlePost={() => { handlePost() }}></NewPostHeader>
          <div className="post-container">
            {posts.map((post, index) => (
              <Post
                key={post._id}
                handlePost={() => { handlePost() }}
                handleNewComment={(data) => { handleNewComment(data) }}
                post={post}
                index={index} />
            ))}
          </div>
        </Container>
      </div>
    </PostContext.Provider>
  );

  return state.loading ? loadingContent : content;
}

export default Home;
