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
import { HiddenCropper } from "react-bootstrap-image-cropper";
import * as notification from "../../../utils/notifications";
import Auth from "../../../utils/auth";
import "./NewPostHeader.scss";

const NewPostHeader = props => {
  const defaultImage =
    "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22942%22%20height%3D%22250%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20942%20250%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16f18eb4d3b%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3A-apple-system%2CBlinkMacSystemFont%2C%26quot%3BSegoe%20UI%26quot%3B%2CRoboto%2C%26quot%3BHelvetica%20Neue%26quot%3B%2CArial%2C%26quot%3BNoto%20Sans%26quot%3B%2Csans-serif%2C%26quot%3BApple%20Color%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Emoji%26quot%3B%2C%26quot%3BSegoe%20UI%20Symbol%26quot%3B%2C%26quot%3BNoto%20Color%20Emoji%26quot%3B%2C%20monospace%3Bfont-size%3A47pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16f18eb4d3b%22%3E%3Crect%20width%3D%22942%22%20height%3D%22250%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22355.28125%22%20y%3D%22150.2%22%3E942x250%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
  const ValidationSchema = Yup.object().shape({
    text: Yup.string().max(255, "El texto es muy largo"),
    attachment_data: Yup.mixed()
  });

  const triggerRef = useRef();
  let [validation, setValidation] = useState("");
  let [request, setRequest] = useState({});
  let [image, setImage] = useState({});
  let [imageUrl, setImageUrl] = useState("");
  const [tagModal, setTagModal] = useState({
    show: false,
    loadingButton: false
  });
  const [faceIdImage, setFaceIdImage] = useState(defaultImage);
  const [state, setState] = useState({
    loadingTags: true,
    kids: [],
    identifiedKids: []
  });

  const handleClose = () => {
    setTagModal({ ...tagModal, show: false });
  };
  const handleShow = () => {
    setTagModal({ ...tagModal, show: true });
  };

  const submitPost = (values, { setSubmitting, resetForm }) => {
    handleShow();
    setSubmitting(true);
    setRequest(values);
    if (image.size) {
      uploadImage();
    } else {
      getKids();
    }
    resetForm();
    setSubmitting(false);
  };

  const uploadImage = () => {
    const fileName = `post_${moment().format("MM_DD_YYYY_hmmssa")}_chers_post`;
    const uploadTask = storage.ref(`images/${fileName}`);
    let task = uploadTask.put(image);
    task.on(
      "state_changed",
      () => {},
      error => {
        setValidation("Lo sentimos, ha ocurrido un error :(");
      },
      () => {
        setValidation("");
        storage
          .ref("images")
          .child(fileName)
          .getDownloadURL()
          .then(firebaseUrl => {
            setImageUrl(firebaseUrl);
            setFaceIdImage(firebaseUrl);
            createRequestInfo(firebaseUrl);
          });
      }
    );
  };

  const postPost = () => {
    setTagModal({ ...tagModal, loadingButton: true });
    let tags = state.identifiedKids.map(kid => kid._id);
    let data = {};
    if (image.size) {
      data = {
        image: { link: imageUrl, tags: [...tags] },
        caption: request.text
      };
    } else {
      data = {
        text_tags: [...tags],
        caption: request.text
      };
    }
    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/posts`, data)
      .then(response => {
        if (response.data.success) {
          props.handlePost();
          tagKids(tags, response.data.data._id)
          setRequest({});
          setImage({});
          setTagModal({ show: false, loadingButton: false });
          setFaceIdImage(defaultImage);
          createNotificationList(response.data.data);
        } else {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
  };

  const createNotificationList = (post) => {
    console.log("post",post);
    
    let user_data = Auth.decodeJWT();
    const message = "Estás etiquetado en una nueva publicación.";
    const notificationData = {
      text: message,
      link: post._id,
      type: 1,
      id_user: user_data.sub
    };
    const tags =
      post.text_tags.length > 0
        ? [...post.text_tags]
        : [...post.image.tags];
    notification.newParentNotification(notificationData, tags);
  };

  const tagKids = async (kids, postId) => {
    kids.forEach(async kid => {
      axios
        .patch(`${process.env.REACT_APP_NODE_API}/api/kids/${kid}`, {
          post_id: postId
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  const getKids = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/kids`)
      .then(response => {
        const kids = [...response.data.data];
        const identifiedKids = [];
        setState({
          ...state,
          loadingTags: false,
          kids: kids,
          identifiedKids: identifiedKids
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const selectIdentifiedKids = faceRecData => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/kids`)
      .then(response => {
        let kids = [],
          identifiedKids = [];
        let isSelected;
        response.data.data.forEach(kid => {
          isSelected = false;
          faceRecData.data.forEach(faceRecKid => {
            if (faceRecKid._id === kid._id) isSelected = true;
          });
          if (isSelected) {
            identifiedKids.push(kid);
          } else {
            kids.push(kid);
          }
        });
        setState({
          ...state,
          loadingTags: false,
          kids: kids,
          identifiedKids: identifiedKids
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const faceRecognitionData = payload => {
    axios
      .post(`${process.env.REACT_APP_FLASK_API}/face_identification`, payload)
      .then(response => {
        if (response.data.success) {
          selectIdentifiedKids(response.data);
        }
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
  };

  const createRequestInfo = async firebaseUrl => {
    let profileData = [];
    let payload = {};
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/kids`)
      .then(response => {
        response.data.data.forEach(element => {
          if (element.profiles.length) {
            profileData.push({
              _id: element._id,
              url: element.profiles[0],
              name: `${element.names} ${element.last_names}`
            });
          }
        });
        payload = { persons: [...profileData], image: firebaseUrl };
        faceRecognitionData(payload);
        faceRecognitionImage(payload);
      })
      .catch(err => {
        console.log(err);
        setState({ ...state, loadingTags: false });
        setFaceIdImage(firebaseUrl);
      });
  };

  const faceRecognitionImage = async payload => {
    axios
      .post(`${process.env.REACT_APP_FLASK_API}/image_recognition`, payload, {
        responseType: "arraybuffer"
      })
      .then(response => {
        let src = new Buffer(response.data, "binary").toString("base64");
        setFaceIdImage(`data:image/jpeg;charset=utf-8;base64,${src}`);
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
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
            setFieldValue
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
                          setFieldValue("attachment_data", file);
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
                    value="Submit"
                    variant="danger"
                    onClick={handleSubmit}
                  >
                    Publicar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Container>
      <Modal show={tagModal.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <PrimaryHeaderMedium title="Manejo de etiquetas"></PrimaryHeaderMedium>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Form>
            {image.size && <Image src={faceIdImage} fluid />}
            {state.loadingTags && (
              <div>
                <br></br>
                <Spinner animation="border" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            )}
            {!state.loadingTags && (
              <Form.Group controlId="formParents">
                <Form.Label as="legend" column sm={3}>
                  Etiqueta(s):
                </Form.Label>
                <div className="cd-chip-input">
                  {state.identifiedKids.map((kid, index) => (
                    <Button key={index} value={index} variant="light" size="sm">
                      {kid.names} {kid.last_names}{" "}
                      <option
                        className="badge"
                        onClick={e => {
                          const index = e.target.value;
                          const kid = state.identifiedKids[index];
                          state.kids.push(kid);
                          state.identifiedKids.splice(index, 1);
                          setState({
                            ...state,
                            identifiedKids: state.identifiedKids,
                            kids: state.kids
                          });
                        }}
                        value={index}
                      >
                        X
                      </option>
                    </Button>
                  ))}
                </div>
                <Form.Control
                  className="cd-multiple-option"
                  as="select"
                  multiple
                >
                  {state.kids.map((kid, index) => (
                    <option
                      key={index}
                      value={index}
                      onClick={e => {
                        const index = e.target.value;
                        const kid = state.kids[index];
                        state.identifiedKids.push(kid);
                        state.kids.splice(index, 1);
                        setState({
                          ...state,
                          identifiedKids: state.identifiedKids,
                          kids: state.kids
                        });
                      }}
                    >
                      {kid.names} {kid.last_names}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            style={{
              backgroundColor: "#4a4972",
              borderColor: "#4a4972"
            }}
            disabled={tagModal.loadingButton}
            onClick={postPost}
          >
            {!tagModal.loadingButton ? (
              "Publicar"
            ) : (
              <span>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Cargando...
              </span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NewPostHeader;
