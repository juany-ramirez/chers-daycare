import React, { Component } from 'react';
import {
  Button,
  CardImg,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

class PostModal extends Component {
  state = {
    modal: false,
    nestedModal: false,
    closeAll: false
  };

  componentDidMount() {}

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }));
  };

  toggleNested = () => {
    this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: false
    });
  };

  toggleAll = async () => {
    await this.setState({
      nestedModal: !this.state.nestedModal,
      closeAll: true
    });
    await new Promise((r) => setTimeout(r, 500));
    await this.props.handleAdoptButton(this.props.pet.id);
  };

  render() {
    return (
      <div>
        <Button color="info" onClick={this.toggle}>
          Ver Detalles
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Adopta</ModalHeader>
          <ModalBody>
            <CardImg
              top
              width="100%"
              src={this.props.pet.image}
              alt="Card image cap"
            />
            <CardTitle>
              <b>Capt:</b> {this.props.pet.name}
            </CardTitle>
            <CardTitle>
              <b>Especie:</b> {this.props.pet.species}
            </CardTitle>
            <CardTitle>
              <b>Raza:</b> {this.props.pet.breed}
            </CardTitle>
            <CardTitle>
              <b>Descripción:</b> {this.props.pet.description}
            </CardTitle>
            <br />
          </ModalBody>
          <ModalFooter>
            <Button color="success" onClick={this.toggleNested}>
              Adoptar
            </Button>
            <Modal
              isOpen={this.state.nestedModal}
              toggle={this.toggleNested}
              onClosed={this.state.closeAll ? this.toggle : undefined}
            >
              <ModalHeader>Transacción realizada con éxito</ModalHeader>
              <ModalBody>
                Felicidades! Has adoptado a tu nueva Mascota! :)
              </ModalBody>
              <ModalFooter>
                <Button color="info" onClick={this.toggleAll}>
                  Ok
                </Button>
              </ModalFooter>
            </Modal>
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default PostModal;
