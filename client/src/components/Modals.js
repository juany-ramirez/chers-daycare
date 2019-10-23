import React, { useState, forwardRef, useImperativeHandle } from 'react';
import styled from 'styled-components'
import { Modal, Row } from 'react-bootstrap';
import { DeleteRoundButton, DButton } from './Buttons';

const Styles = styled.div`
    .styles-button {
        background-color: ${ props => props.bg ? props.bg : '#4A4972'};
        color: ${ props => props.color ? props.color : '#D5E4F2'};
        border: none;
    }
`

const DModal = forwardRef((props, ref) => {

  useImperativeHandle(ref, () => ({
    closeModal() {
      setLoadingButton("");
      setSmShow(false);
    },
    onLoading() {
      setLoadingButton("loading");
    },
    offLoading() {
      setLoadingButton("");
    }
  }));

  const [smShow, setSmShow] = useState(false);
  
  const [loadingButton, setLoadingButton] = useState("");

  const affirmativeStatement = () =>{
    setLoadingButton("loading");
    props.handleAffirmation();
  }

  let content = (
    <Styles
      color={props.color}
      bg={props.bg}
    >
      <DeleteRoundButton handleClick={() => setSmShow(true)} />
      <Modal
        size="sm"
        show={smShow}
        onHide={() => setSmShow(false)}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            {props.text}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {(!props.modalType || props.modalType === 1) && (
            <Row className="d-flex justify-content-end">
              <DButton
                handleClick={() => setSmShow(false)}
                title="Ok"
              />
            </Row>
          )}
          {props.modalType === 2 && (
            <Row className="d-flex justify-content-end">
              <DButton
                handleClick={() => affirmativeStatement()}
                loading={loadingButton}
                title="Eliminar"
                bg="#F23C3C"
                color="white"
              />
              <DButton
                handleClick={() => setSmShow(false)}
                title="Cancelar"
                bg="#F2B441"
                color="white"
              />
            </Row>

          )}
        </Modal.Body>
      </Modal>
    </Styles>
  );
  return content;
});

export default DModal;