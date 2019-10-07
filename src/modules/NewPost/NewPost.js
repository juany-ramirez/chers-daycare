import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { PrimaryHeaderMedium } from "../../components/Headers";
import "./NewPost.scss";

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      files: []
    };
    this.handleChanges = this.handleChanges.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChanges(selectorFiles: FileList) {
    this.setState({ files: selectorFiles });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.postPost();
  }

  postPost() {
    const url = "http://localhost:4000";
    const data = {
      caption: this.state.value
    };
    fetch(`${url}/api/posts`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(response => console.log("Success:", JSON.stringify(response)))
      .catch(error => console.error("Error:", error));
    this.setState({ files: {}, value:'' });
    this.props.handlePost();
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
                    {this.state.files.length !== 0 && <div>{this.state.files[0].name}</div>}
                    {this.state.files.length === 0 && <div>Seleccionar Archivo</div>}
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
