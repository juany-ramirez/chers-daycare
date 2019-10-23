import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import { PrimaryHeaderMedium } from "../../../components/Headers";
import { storage } from '../../../firebase';
import "./NewPost.scss";

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      file: {}
    };
    this.handleChanges = this.handleChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChanges(selectorFiles: FileList) {
    this.setState({ file: selectorFiles[0] });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.managePostType();
  }

  managePostType() {
    if (this.state.file) {
      const data = {
        caption: this.state.value
      };
      this.postPost(data);
    } else {
      const uploadTask = storage.ref(`images/${this.state.file.name}`);
      let task = uploadTask.put(this.state.file);
      task.on('state_changed', () => { },
        (error) => {
          console.log(error);
        },
        () => {
          storage.ref('images').child(this.state.file.name).getDownloadURL().then((firebaseUrl) => {
            console.log(firebaseUrl);
            const data = {
              caption: this.state.value,
              image: {
                link: firebaseUrl
              },
            };
            this.postPost(data);
          })
        });

    }
  }

  postPost(data) {
    axios.post(`${process.env.REACT_APP_NODE_API}/api/posts`, data)
      .then(response => {
        console.log("Success:", JSON.stringify(response))
        this.props.handlePost(response);
      })
      .catch(error => console.error("Error:", error));
    this.setState({ file: {}, value: '' });
  }

  render() {
    return (
      <div className="styles-new-post">
        <Container className="text-center">
          <PrimaryHeaderMedium title="Nueva Publicación"></PrimaryHeaderMedium>
          <form onSubmit={this.handleSubmit}>
            <Row>
              <Col xs={12}>
                <textarea
                  value={this.state.value}
                  onChange={this.handleChange}
                  placeholder="Descripcion..."
                  aria-label="Descripcion..."
                ></textarea>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <div className="custom-file">
                  <input
                    type="file"
                    className="custom-file-input"
                    id="customFileLang"
                    lang="es"
                    onChange={e => this.handleChanges(e.target.files)}
                  />
                  <label className="custom-file-label" htmlFor="customFileLang">
                    {this.state.file.length !== 0 && <div>{this.state.file.name}</div>}
                    {this.state.file.length === 0 && <div>Seleccionar Archivo</div>}
                  </label>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Button type="submit" value="Submit" variant="danger">
                  Publicar
                </Button>
              </Col>
            </Row>
          </form>
        </Container>
      </div>
    );
  }
}

export default NewPost;
