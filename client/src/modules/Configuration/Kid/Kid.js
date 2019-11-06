import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import KidModal from "./KidModal";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal, Button } from "react-bootstrap";

const Kid = props => {
    const [state, setState] = useState({
        loading: true,
        kids: [],
    });
    const [smShow, setSmShow] = useState(false);
    const [message, setMessage] = useState("");

    const deleteModal = useRef();

    const emptyKid = {
        names: '',
        last_names: '',
        parent: '',
        singular_payments: [],
        monthly_payment: [],
        tags: [],
        profiles:[]
    };

    const deleteKid = (id) => {
        axios.delete(`${process.env.REACT_APP_NODE_API}/api/kids/${id}`)
            .then(response => {
                if (response.data.success) {
                    setMessage("Se ha eliminado el Usuario");
                    setSmShow(true);
                    getKids();
                } else {
                    setMessage("Lo sentimos, ha ocurrido un error :(");
                    setSmShow(true);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const kidEdited = () => {
        getKids();
    };

    const kidCreated = () => {
        getKids();
    };

    const getKids = () => {
        axios.get(`${process.env.REACT_APP_NODE_API}/api/kids`)
            .then(response => {
                console.log(response.data);
                setState({ ...state, loading: false, kids: response.data.data });
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getKids();
        // eslint-disable-next-line
    }, []);

    let loadingContent = (
        <div className="container text-center">
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="light" />
            <Spinner animation="grow" variant="light" />
        </div>
    );

    let content = (
        <div className="text-center">
            <PrimaryHeaderLarge title="Niños" />
            {/* {/* <KidModal
                type="create"
                title="Crear nuevo usuario"
                kid={emptyKid}
            /> */}
            <Button variant="warning" >Agregar Niño</Button>
            <br />
            <br />
            <Table striped bordered variant="light" hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                    </tr>
                </thead>
                <tbody>
                    {state.kids.map((kid, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {kid.names} </td>
                            <td> {kid.last_names} </td>
                            <td>
                                <Row className="d-flex justify-content-around">
                                    {/* <KidModal
                                        index={index}
                                        type="edit"
                                        title="Editar usuario"
                                        kid={kid}
                                        isEdited={ () => { kidEdited() } }
                                        isCreated={ () => { kidCreated() } }
                                    /> */}
                                    <DModal
                                        index={index}
                                        ref={deleteModal}
                                        text="Estás seguro que deseas eliminar este usuario?"
                                        modalType={2}
                                        handleAffirmation={() => { deleteKid(kid._id) }}
                                    />
                                </Row>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table> 
            <Modal
                size="sm"
                show={smShow}
                onHide={() => {
                    deleteModal.current.closeModal();
                    setSmShow(false);
                }}
                aria-labelledby="example-modal-sizes-title-sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm">
                        {message}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="d-flex justify-content-end">
                        <DButton
                            handleClick={() => {
                                deleteModal.current.closeModal();
                                setSmShow(false);
                            }}
                            title="Ok"
                        />
                    </Row>
                </Modal.Body>
            </Modal>
        </div>
    );
    return state.loading ? loadingContent : content;
}

export default Kid;
