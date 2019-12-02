import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import localization from "moment/locale/es";
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
  Image,
  Form,
  Modal
} from "react-bootstrap";
import { PrimaryHeaderSmall, TextXS } from "../../../components";
import Comment from "./Comment/Comment";
import Auth from "../../../auth";
import { DButton } from "../../../components";
import { PostContext } from "../../../contexts/PostContext";
import "./Post.scss";

const Post = props => {
  const { posts, setPosts } = useContext(PostContext);

  const [state, setState] = useState({
    dateSince: "",
    liked: false
  });

  let [comments, setComments] = useState([]);
  const [smShow, setSmShow] = useState(false);
  const [message, setMessage] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const ValidationSchema = Yup.object().shape({
    comment: Yup.string()
      .max(255, "El texto es muy largo")
      .required("Comentario requerido")
  });

  let [validation, setValidation] = useState("");

  useEffect(() => {
    if (props.post) {
      getCommenters();
      const postDate = moment(props.post.release_date)
        .locale("es", localization)
        .fromNow();
      setState({ ...state, dateSince: postDate, liked: isLiked() });
    }
    // eslint-disable-next-line
  }, [props.post]);

  const getCommenters = () => {
    let commentList = [];
    props.post.comments.map((data, index) => {
      if (data.commenter) {
        const idPerson = data.commenter;
        axios
          .get(`${process.env.REACT_APP_NODE_API}/api/users/${idPerson}`)
          .then(response => {
            const comment = {
              commenterId: data.commenter,
              commenter: `${response.data.data.names} ${response.data.data.last_names}`,
              comment: data.comment,
              date: data.date,
              _id: data._id
            };
            commentList.push(comment);

            if (index + 1 === props.post.comments.length)
              setComments(commentList);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const onDeletePost = () => {
    setMessage("Desea eliminar publicacion?");
    setSmShow(true);
  };

  const deletePost = () => {
    setLoadingModal(true);
    axios
      .delete(`${process.env.REACT_APP_NODE_API}/api/posts/${props.post._id}`)
      .then(response => {
        setLoadingModal(false);
        if (response.data.success) {
          setMessage("Se ha eliminado la Publicacion");
          props.handlePost();
        } else {
          setMessage("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const submitComment = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    values.commenter = Auth.decodeJWT().sub;
    axios
      .put(
        `${process.env.REACT_APP_NODE_API}/api/posts/${props.post._id}/comment`,
        values
      )
      .then(response => {
        if (response.data.success) {
          resetForm();
          const commentList = response.data.data.comments;
          const lastComment = commentList.length - 1;
          const comment = {
            commenter: `${Auth.decodeJWT().names} ${
              Auth.decodeJWT().last_names
            }`,
            commenterId: commentList[lastComment].commenter,
            comment: commentList[lastComment].comment,
            date: commentList[lastComment].date,
            _id: commentList[lastComment]._id
          };
          let postCopy = [...posts];
          postCopy[props.index].comments.push(response.data.data);
          comments.push(comment);
          setComments(comments);
          setPosts(postCopy);
        } else {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(error => {
        setValidation("Lo sentimos, ha ocurrido un error :(");
      });
    setSubmitting(false);
  };

  const deleteComment = id => {
    let commentList = comments.filter(comment => {
      return comment._id != id;
    });
    setComments(commentList);
  };

  const isLiked = () => {
    if (props.post.likes.indexOf(Auth.decodeJWT().sub) !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const onLike = () => {
    setState({ ...state, liked: !state.liked });
    const data = {
      _id: Auth.decodeJWT().sub
    };
    axios
      .put(
        `${process.env.REACT_APP_NODE_API}/api/posts/like/${props.post._id}`,
        data
      )
      .then(response => {
        if (response.data.success) {
          const currentUserId = Auth.decodeJWT().sub;
          let postCopy = [...posts];
          if (!state.liked) {
            postCopy[props.index].likes.push(currentUserId);
            setPosts(postCopy);
          } else {
            postCopy[props.index].likes.splice(
              posts[props.index].likes.indexOf(currentUserId),
              1
            );
          }
          setPosts(postCopy);
        }
      })
      .catch(error => console.error("Error:", error));
  };

  return !props.post ? (
    ""
  ) : (
    <div className="styles-post">
      <Card className="daycare-center">
        <Card.Header>
          <Row>
            <Col lg={11} xs={10}>
              <PrimaryHeaderSmall
                className="daycare-card-header"
                title={state.dateSince}
                color="#6c757d"
              />
            </Col>
            <Col lg={1} xs={2}>
              {Auth.decodeJWT().rol === 1 && (
                <DropdownButton
                  alignRight
                  size="sm"
                  title=""
                  variant="warning"
                  id="dropdown-menu-align-right"
                >
                  <Dropdown.Item
                    onClick={() => {
                      onDeletePost();
                    }}
                    eventKey="4"
                  >
                    Borrar publicación
                  </Dropdown.Item>
                </DropdownButton>
              )}
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Image src={props.post.image.link} fluid />
          <Media>
            <Media.Body>
              <Row>
                <Col xs={2}>
                  <div
                    onClick={d => {
                      onLike();
                    }}
                    className={
                      state.liked
                        ? `daycare-like-segment text-center liked`
                        : `daycare-like-segment text-center `
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="4rem"
                      height="4rem"
                      viewBox="0 0 24 24"
                    >
                      <path fill="none" d="M0 0h24v24H0V0z" />
                      <path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z" />
                    </svg>
                    <TextXS title={`Likes: ${props.post.likes.length}`} />
                  </div>
                </Col>
                <Col xs={10}>
                  <p className="d-flex justify-content-center">
                    {props.post.caption}
                  </p>
                </Col>
              </Row>
            </Media.Body>
          </Media>
          {comments.length > 0 && (
            <Comment
              postId={props.post._id}
              handleCommentDeleted={data => {
                deleteComment(data);
              }}
              comments={comments}
            />
          )}
        </Card.Body>
        {validation !== "" && <p className="text-muted">{validation}</p>}
        <Card.Footer className="text-muted">
          <Formik
            validationSchema={ValidationSchema}
            initialValues={{
              comment: ""
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              submitComment(values, { setSubmitting, resetForm });
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder={
                      errors.comment && touched.comment && errors.comment
                        ? errors.comment && touched.comment && errors.comment
                        : "Agregar comentario..."
                    }
                    aria-label="Agregar comentario..."
                    aria-describedby="basic-addon2"
                    type="text"
                    name="comment"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.comment}
                  />
                  <InputGroup.Append>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      variant="outline-secondary"
                    >
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
              </Form>
            )}
          </Formik>
        </Card.Footer>
      </Card>

      <Modal
        size="sm"
        show={smShow}
        onHide={() => {
          setSmShow(false);
        }}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">{message}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="d-flex justify-content-end">
            <DButton
              handleClick={() => {
                deletePost();
              }}
              loading={loadingModal ? "loading" : ""}
              bg="#f23c3c"
              color="#ffff"
              title="Si"
            />
            <DButton
              handleClick={() => {
                setSmShow(false);
              }}
              bg="#4a4972"
              title="No"
            />
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Post;
