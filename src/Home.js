import React, { Component } from "react";
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
  }

  getPosts() {
    fetch("/api/posts")
      .then(res => res.json())
      .then(posts => {
        console.log(posts);
        posts.data.sort((a,b) => {
            return new Date(b.release_date) - new Date(a.release_date);
        });
        this.setState({ loading: false, posts: posts.data });
        console.log(this.state.posts);
      })
      .catch(err => {
        console.log(err);
      });
      
  }

  handlePost() {
    this.getPosts();
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
        <NewPost handlePost={()=>{this.handlePost()}}></NewPost>
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
