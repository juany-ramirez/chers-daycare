import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spinner, Container } from "react-bootstrap";
import NewPostHeader from "./NewPostHeader/NewPostHeader";
import Post from "./Post/Post";
import Auth from "../../utils/auth";
import { PostContext } from "../../contexts/PostContext";

const Home = props => {
  const [posts, setPosts] = useState([]);

  const value = useMemo(() => ({ posts, setPosts }), [posts, setPosts]);

  const [state, setState] = useState({
    loading: true
  });

  useEffect(() => {
    getCorrectInfo();
    // eslint-disable-next-line
  }, []);

  const getCorrectInfo = () => {
    let authData = Auth.decodeJWT();
    if (authData.rol === 3) {
      axios
        .get(
          `${process.env.REACT_APP_NODE_API}/api/parents/${authData.user_type}`
        )
        .then(response => {
          if (response.data.success) {
            const data = {
              rol: 3,
              kid_ids: response.data.data.kids
            };
            axios
              .patch(`${process.env.REACT_APP_NODE_API}/api/posts`, data)
              .then(response => {
                setState({ ...state, loading: false });
                setPosts(response.data.data);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      axios
        .get(`${process.env.REACT_APP_NODE_API}/api/posts`)
        .then(response => {
          setState({ ...state, loading: false });
          setPosts(response.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const handlePost = () => {};

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
          {Auth.decodeJWT().rol === 1 && (
            <NewPostHeader
              handlePost={() => {
                handlePost();
              }}
            ></NewPostHeader>
          )}
          <div className="post-container">
            {posts.map((post, index) => (
              <Post
                key={post.post ? post.post._id : post._id}
                handlePost={() => {
                  handlePost();
                }}
                post={post.post ? post.post : post}
                index={index}
              />
            ))}
          </div>
        </Container>
      </div>
    </PostContext.Provider>
  );

  return state.loading ? loadingContent : content;
};

export default Home;
