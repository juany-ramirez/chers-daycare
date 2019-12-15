import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal, Button} from "react-bootstrap";

const Payment = props => {
    const [state, setState] = useState({
        loading: true,
        payments: [],
    });
    const [smShow, setSmShow] = useState(false);
    const [message, setMessage] = useState("");

    const emptyPayment = {
        names: '',
        last_names: '',
        parent: '',
        singular_payments: [],
        monthly_payment: [],
        tags: [],
        profiles:[]
    };

    const paymentEdited = () => {
        getPayments();
    };

    const paymentCreated = () => {
        getPayments();
    };

    const getPayments = () => {
        axios.get(`${process.env.REACT_APP_NODE_API}/api/users?rol=3`, {
                headers: {
                    'Authorization': "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDVlZTUzM2FjYzM2ZTNlZmM4NGE2NWMiLCJleHAiOjE1NzE4NzMzMTgxNTcsIm5hbWVzIjoiQ2hlcidzIERheWNhcmUiLCJsYXN0X25hbWVzIjpudWxsLCJlbWFpbCI6ImNoZXJzZGF5Y2FyZS5sZWFybmluZ2NlbnRlckBnbWFpbC5jb20iLCJ0aGlyZF9wYXJ0eV9ub3RpZmljYXRpb24iOm51bGwsIm5vdGlmaWNhdGlvbnMiOltdLCJyb2wiOjEsImlhdCI6MTU3MTc4NjkxOH0.rvfM4GELHQPCu9wRBplglRWXd8CPfC7_DObom1q73d8"
                }
            })
            .then(response => {
                console.log(response.data);
                setState({ ...state, loading: false, payments: response.data.data });
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getPayments();
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
            <PrimaryHeaderLarge title="Pagos" />
            <Button variant="warning" >Ingresar nuevo pago</Button>
            <br />
            <br />
            <Table responsive="sm" striped bordered variant="light" hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                    </tr>
                </thead>
                <tbody>
                    {state.payments.map((payment, index) => (
                        <tr key={index}>
                            <td> {index + 1} </td>
                            <td> {payment.names} </td>
                            <td> {payment.last_names} </td>
                        </tr>
                    ))}
                </tbody>
            </Table> 
            <Modal
                size="sm"
                show={smShow}
                onHide={() => {
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

export default Payment;
