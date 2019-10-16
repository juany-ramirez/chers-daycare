import React, { Component } from "react";
import axios from "axios";
import {
  Card,
  Media,
  InputGroup,
  Button,
  FormControl,
  DropdownButton,
  Dropdown,
  Col,
  Row,
  Image
} from "react-bootstrap";
import { PrimaryHeaderSmall, TextSmall } from "../../components";
import "./Post.scss";

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateSince: "",
      toggleLike: false,
      likes: 0
    };
  }

  componentDidMount() {
    if (this.props.post) {
      this.setState({ dateSince: this.timeSince(), likes: this.props.post.likes.length });
      this.getLikedPost();
    }
  }

  getLikedPost() {
    if(this.props.post.likes.indexOf('5d5ee533acc36e3efc84a65c')) //******************* CAMBIAR A ID DEL USUARIO ACTIVO
      this.setState({ toggleLike: true});
  }

  likeAction() {
    const numberLikes = this.state.toggleLike ? this.state.likes+1 : this.state.likes-1;
    this.setState({ toggleLike: !this.state.toggleLike, likes: numberLikes });
    const data = {
      _id: '5d5ee533acc36e3efc84a65c'//******************* CAMBIAR A ID DEL USUARIO ACTIVO
    }
    axios.put(`${process.env.REACT_APP_NODE_API}/api/posts/like/${this.props.post._id}`, data)
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  }

  timeSince() {
    const seconds = Math.floor(
      (new Date() - new Date(this.props.post.release_date)) / 1000
    );
    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
      this.SetState({});
      return interval + " años";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " meses";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " dias";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " horas";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutos";
    }
    return Math.floor(seconds) + " segundos";
  }

  render() {
    return !this.props.post ? (
      ""
    ) : (
      <div className="styles-post">
        <Card className="daycare-center">
          <Card.Header>
            <Row>
              <Col lg={11} xs={10}>
                <PrimaryHeaderSmall
                  className="daycare-card-header"
                  title={`hace ${this.state.dateSince}`}
                  color="#6c757d"
                />
              </Col>
              <Col lg={1} xs={2}>
                <DropdownButton
                  alignRight
                  size="sm"
                  title=""
                  id="dropdown-menu-align-right"
                >
                  <Dropdown.Item eventKey="1">Editar Publicación</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item eventKey="4">Borrar publicación</Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Image
              src={this.props.post.image.link}
              fluid
            />
            <Media>
              <div
                onClick={() => {
                  this.likeAction();
                }}
                className={
                  this.state.toggleLike
                    ? `daycare-like-segment text-center`
                    : `daycare-like-segment text-center liked`
                }
              >
                <TextSmall title={`Likes: ${this.state.likes}`} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                >
                  <path fill="none" d="M0 0h24v24H0V0z" />
                  <path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z" />
                </svg>
              </div>
              <Media.Body>
                <p className="d-flex justify-content-center">
                  <br />
                  {this.props.post.caption}
                </p>
              </Media.Body>
            </Media>
            <hr></hr>
            <Row>
              <Col xs={4} className="text-center">
                <b>
                  <TextSmall title="Maria Rodriguez" color="#6c757d" />
                </b>
                <TextSmall title="5h" color="#6c757d" />
              </Col>
              <Col xs={8}>
                <TextSmall
                  title="Cras purus odio, vestibulum in vulputate at, tempus viverra turpis."
                  color="#6c757d"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4}>
                <b>
                  <TextSmall title="Mario Lopez" color="#6c757d" />
                </b>
                <TextSmall title="2h" color="#6c757d" />
              </Col>
              <Col xs={8}>
                <TextSmall
                  title="Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congueCras purus odio, vestibulum in vulputate at, tempus viverra turpis."
                  color="#6c757d"
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="text-muted">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Agregar comentario..."
                aria-label="Agregar comentario..."
                aria-describedby="basic-addon2"
              />
              <InputGroup.Append>
                <Button disabled variant="outline-secondary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    <path d="M0 0h24v24H0z" fill="none" />
                  </svg>
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}

export default Post;
