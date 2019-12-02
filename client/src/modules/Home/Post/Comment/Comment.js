import React, { useEffect, useState } from "react";
import { Col, Row, Modal, DropdownButton, Dropdown } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import localization from "moment/locale/es";
import Auth from "../../../../auth";
import { DButton } from "../../../../components";
import { TextSmall, TextXS } from "../../../../components";

const Comment = props => {
  const [smShow, setSmShow] = useState(false);
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");
  const [loadingModal, setLoadingModal] = useState(false);

  const onDeleteComment = data => {
    setMessage("Desea eliminar el comentario?");
    setSmShow(true);
    setData(data);
  };

  const deleteComment = () => {
    setLoadingModal(true);
    axios
      .delete(
        `${process.env.REACT_APP_NODE_API}/api/posts/${props.postId}/comment/${data._id}`
      )
      .then(response => {
        setLoadingModal(false);
        if (!response.data.success) {
          setMessage("Lo sentimos, ha ocurrido un error :(");
        } else {
          props.handleCommentDeleted(data._id);
        }
        setSmShow(false);
      })
      .catch(err => {
        setMessage("Lo sentimos, ha ocurrido un error :(");
      });
  };

  useEffect(() => {}, []);

  return !props.comments ? (
    ""
  ) : (
    <div className="styles-post">
      <hr />
      {props.comments.map(comment => (
        <div key={comment._id}>
          <Row style={{ paddingBottom: "5px" }}>
            <Col xs={4} className="text-center">
              <b>
                <TextSmall title={comment.commenter} color="#6c757d" />
              </b>
              <TextXS
                title={moment(comment.date)
                  .locale("es", localization)
                  .fromNow()}
                color="#6c757d"
              />
            </Col>
            <Col xs={7}>
              <TextSmall title={comment.comment} color="#6c757d" />
            </Col>
            <Col xs={1}>
              {comment.commenterId === Auth.decodeJWT().sub && (
                <DropdownButton
                  alignRight
                  size="sm"
                  title=""
                  className="cdc-light-blue"
                  id="dropdown-menu-align-right"
                >
                  <Dropdown.Item
                    onClick={() => {
                      onDeleteComment(comment);
                    }}
                    eventKey="4"
                  >
                    Borrar comentario
                  </Dropdown.Item>
                </DropdownButton>
              )}
            </Col>
          </Row>
        </div>
      ))}
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
                deleteComment();
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

export default Comment;
