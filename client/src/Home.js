import React, { Component } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import NewPost from "./modules/NewPost/NewPost.js";
import Post from "./modules/Post/Post.js";
import "./Home.scss";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      posts: []
    };
  }

  componentDidMount() {
    this.getPosts();
    console.log("env", process.env.REACT_APP_NODE_API);
  }

  getPosts() {
    axios.get(`${process.env.REACT_APP_NODE_API}/api/posts`)
      .then(response => {
        console.log(response.data);
        response.data.data.sort((a, b) => {
          return new Date(b.release_date) - new Date(a.release_date);
        });
        this.setState({ loading: false, posts: response.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handlePost(newPost) {
    this.state.posts.push(newPost);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container text-center">
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="light" />
        </div>
      );
    }
    return (
      <div className="daycare-home-page">
        <NewPost handlePost={(post) => { this.handlePost(post) }}></NewPost>
        <div className="post-container">
          {this.state.posts.map((post, index) => (
            <Post post={post} key={index} />
          ))}
        </div>
      </div>
    );
  }
}

export default Home;
