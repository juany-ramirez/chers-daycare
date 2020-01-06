import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Spinner,
  Image
} from "react-bootstrap";
import { Formik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import { PrimaryHeaderMedium } from "../../../components/Headers";
import { storage } from "../../../firebase";
// import { decode, encode } from "base-64";
// import base64Img from "base64-img";
import { HiddenCropper } from "react-bootstrap-image-cropper";
import "./NewPostHeader.scss";

const NewPostHeader = props => {
  const supportedFormats = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png"
  ];

  let [validation, setValidation] = useState("");
  let [image, setImage] = useState({});
  const triggerRef = useRef();

  const ValidationSchema = Yup.object().shape({
    text: Yup.string().max(255, "El texto es muy largo"),
    attachment_data: Yup.mixed()
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [faceIdImage, setFaceIdImage] = useState(
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22942%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20942%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16f18eb4d3b%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A47pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16f18eb4d3b%22%3E%3Crect%20width%3D%22942%22%20height%3D%22250%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22355.28125%22%20y%3D%22150.2%22%3E942x250%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
  );

  const submitPost = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    setLoading(true);
    console.log(values);
    const data = {
      caption: values.text
    };
    if (image.size) {
      const fileName = `post_${moment().format(
        "MM_DD_YYYY_hmmssa"
      )}_chers_post`;
      console.log("hay attached data = ", `images/${fileName}`);
      const uploadTask = storage.ref(`images/${fileName}`);
      let task = uploadTask.put(values.attachment_data);
      task.on(
        "state_changed",
        () => {},
        error => {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        },
        () => {
          setValidation("");
          resetForm();
          storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(firebaseUrl => {
              data.image = {
                link: firebaseUrl
              };
              // getProfiles(firebaseUrl);
              postPost(data);
            });
        }
      );
    } else {
      postPost(data);
    }
    setSubmitting(false);
  };

  const postPost = data => {
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/posts`, data)
      .then(response => {
        if (response.data.success) {
          props.handlePost();
        } else {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
  };

  const machineLearningNPost = data => {
    handleShow();
    axios
      .post(`${process.env.REACT_APP_FLASK_API}/image_recognition`, data)
      .then(response => {
        console.log("Y esto?");
        console.log(response);
        console.log(response.data);
        console.log(window);
        var filepath = base64Img.imgSync("data:image/png;base64,...", "", "2");
        let b64Response = window.btoa(response.data);
        console.log("Y esto?");

        console.log(response.data);

        let imageData = "data:image/png;base64," + b64Response;
        console.log(imageData);

        setFaceIdImage(imageData);
        if (response.data.success) {
          setLoading(false);
          console.log(response.data.data);
          postPost(data);
        } else {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
  };

  const getProfiles = firebaseUrl => {
    let data = [];
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/kids`)
      .then(response => {
        response.data.data.map(element => {
          if (element.profiles.length) {
            data.push({
              _id: element._id,
              profiles: element.profiles[0],
              names: `${element.names} ${element.last_names}`
            });
            // {persons:[...data], image:firebaseUrl}
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className="styles-new-post">
      <Container className="text-center">
        <PrimaryHeaderMedium title="Nueva Publicación"></PrimaryHeaderMedium>
        <Formik
          validationSchema={ValidationSchema}
          initialValues={{
            attachment_data: undefined,
            text: undefined,
            tags: [],
            text_tags: []
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            submitPost(values, { setSubmitting, resetForm });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            setFieldError
          }) => (
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={11}>
                  <Form.Group controlId="formText">
                    <textarea
                      type="text"
                      name="text"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.text}
                      placeholder="Descripcion..."
                      aria-label="Descripcion..."
                    ></textarea>
                    <Form.Text className="text-muted">
                      {errors.text && touched.text && errors.text}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col sm={1}>
                  <Form.Group controlId="formImage">
                    <div className="image-cropper">
                      <svg
                        onClick={() => triggerRef.current.trigger()}
                        className={image.size ? "active" : ""}
                        xmlns="http://www.w3.org/2000/svg"
                        width="42"
                        height="42"
                        viewBox="0 0 24 24"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                      </svg>
                      <HiddenCropper
                        triggerRef={triggerRef}
                        outputOptions={{
                          width: 300,
                          height: 300,
                          quality: 0.4
                        }}
                        name="attachment_data"
                        onCropped={file => {
                          setImage(file);
                          setFieldValue("attachment_data", image);
                        }}
                        cropOptions={{ aspect: 1, maxZoom: 10 }}
                        displayOptions={{
                          title: "Cortar Imagen",
                          removeButtonText: "Remover",
                          confirmButtonText: "Confirmar"
                        }}
                        previewOptions={{
                          maxWidth: "100",
                          maxHeight: "100",
                          children: "Seleccionar Imagen"
                        }}
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Text className="text-muted">
                {errors.attachment_data &&
                  touched.attachment_data &&
                  errors.attachment_data}
              </Form.Text>
              <Row>
                <Col xs={12}>
                  {validation !== "" && (
                    <Form.Text className="text-muted">{validation}</Form.Text>
                  )}
                  <Button
                    disabled={isSubmitting}
                    type="submit"
                    value="Submit"
                    variant="danger"
                  >
                    Analisis
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Etiquetas y reconocimiento facial</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Image src={faceIdImage} fluid />
          {loading && (
            <div>
              <br></br>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Publicar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewPostHeader;
