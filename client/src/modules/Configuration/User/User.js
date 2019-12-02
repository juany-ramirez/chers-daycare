import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import UserModal from "./UserModal";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal } from "react-bootstrap";
import { UserContext } from "../../../contexts/UserContext";

const User = props => {
    const [users, setUsers] = useState([]);
  
    const value = useMemo(() => ({ users, setUsers }), [users, setUsers]);
    const [state, setState] = useState({
        loading: true
    });
    const [smShow, setSmShow] = useState(false);
    const [message, setMessage] = useState("");

    const deleteModal = useRef();

    const emptyUser = {
        names: '',
        last_names: '',
        email: '',
        password: '',
        phone: '',
        rol: 3
    };

    const deleteUser = (id) => {
        axios.delete(`${process.env.REACT_APP_NODE_API}/api/users/${id}`)
            .then(response => {
                if (response.data.success) {
                    setMessage("Se ha eliminado el Usuario");
                    setSmShow(true);
                    getUsers();
                } else {
                    setMessage("Lo sentimos, ha ocurrido un error :(");
                    setSmShow(true);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    const getUsers = () => {
        axios.get(`${process.env.REACT_APP_NODE_API}/api/users`)
            .then(response => {
                console.log(response.data);
                setState({ ...state, loading: false });
                setUsers(response.data.data);
            })
            .catch(err => {
                console.log(err);
            });
    }

    useEffect(() => {
        getUsers();
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
        <UserContext.Provider value={value}>
        <div className="text-center">
            <PrimaryHeaderLarge title="Usuarios" />
            <UserModal
                type="create"
                title="Crear nuevo usuario"
                user={emptyUser}
            />
            <br />
            <Table striped bordered variant="light" hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Tipo</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>
                                {user.names} {user.last_names}
                            </td>
                            <td>{user.phone ? user.phone : "-"}</td>
                            <td>{user.email ? user.email : "-"}</td>
                            <td>
                                {user.rol === 1 && "Administrador"}
                                {user.rol === 2 && "Maestro/a"}
                                {user.rol === 3 && "Padre de Familia"}
                            </td>
                            <td>
                                <Row className="d-flex justify-content-around">
                                    <UserModal
                                        index={index}
                                        type="edit"
                                        title="Editar usuario"
                                        user={user}
                                    />
                                    <DModal
                                        index={index}
                                        ref={deleteModal}
                                        text="Estás seguro que deseas eliminar este usuario?"
                                        modalType={2}
                                        handleAffirmation={() => { deleteUser(user._id) }}
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
    </UserContext.Provider>
    );
    return state.loading ? loadingContent : content;
}

export default User;
