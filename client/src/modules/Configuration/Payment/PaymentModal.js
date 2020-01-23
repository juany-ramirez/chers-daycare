import React, { useState, useContext } from "react";
import { Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Modal, Form, InputGroup, Alert, Row } from "react-bootstrap";
import { CreateRoundButton, DButton } from "../../../components";
import { PaymentContext } from "../../../contexts/PaymentContext";

const PaymentModal = props => {
  const { payments, setPayment } = useContext(PaymentContext);

  const [lgShow, setLgShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [validation, setValidation] = useState("");
  const [message, setMessage] = useState("");

  const ValidationSchema = Yup.object().shape({
    payment: Yup.number()
      .min(0, "Monto debe ser mayor o igual a cero.")
      .typeError("Debe especificar un monto.")
      .required("Monto requerido"),
    description: Yup.string().max(255, "El texto es muy largo")
  });

  const submitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    let payment = values.payment;
    let newDebt, debt;
    const initialPayment = values.payment;
    let kids = props.payment.kids.map(kid => {
      if (payment > 0 && kid.charge > 0) {
        debt = kid.charge;
        newDebt = debt - payment;
        if (newDebt <= 0) {
          kid.charge = 0;
          kid.done = true;
          payment = payment - debt;
        } else {
          kid.charge = newDebt;
          payment = 0;
        }
        axios
          .put(`${process.env.REACT_APP_NODE_API}/api/kids/${kid._id}`, kid)
          .then(response => {
          })
          .catch(error => {
            setValidation("Ha ocurrido un error");
          });
      }
      return kid;
    });
    let data = {
      date: Date.now,
      payment: values.payment,
      description: values.description ? values.description : ""
    };
    if (props.payment.payments) {
      props.payment.payments.push(data);
    } else {
      props.payment.payments = [data];
    }

    axios
      .put(
        `${process.env.REACT_APP_NODE_API}/api/payment/${props.payment._id}`,
        props.payment.payments
      )
      .then(response => {
        if (response.data.success) {
          setMessage("Se ha creado el pago");
          setSmShow(true);
          let payment = props.payment;
          let donePayment = props.payment.charge - initialPayment;
          payment.kids = [...kids];
          payment.charge = donePayment < 0 ? 0 : donePayment;
          let paymentList = [...payments];
          paymentList[props.index] = { ...payment };
          setPayment(paymentList);
        } else {
          setMessage("Lo sentimos, ha ocurrido un error :(");
          setSmShow(true);
        }
        setValidation("");
      })
      .catch(error => {
        setValidation("Ha ocurrido un error");
      });
    resetForm();
    setSubmitting(false);
  };

  let content = (
    <div>
      <CreateRoundButton handleClick={() => setLgShow(true)} />
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            {props.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert
            style={{
              backgroundColor: "#d5e4f2",
              color: "#4a4972",
              border: "none"
            }}
            variant="dark"
          >
            <h5 style={{ marginBottom: 0 }} className="text-center">
              Deuda total: {props.payment.charge}
            </h5>
          </Alert>
          <Formik
            validationSchema={ValidationSchema}
            initialValues={{
              payment: props.payment.payment,
              description: props.payment.description
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              submitForm(values, { setSubmitting, resetForm });
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
              /* and other goodies */
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Monto: </Form.Label>
                  <InputGroup>
                    <InputGroup.Prepend>
                      <InputGroup.Text>Lps.</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      type="number"
                      name="payment"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.payment}
                      placeholder="Ingresar monto"
                    />
                  </InputGroup>
                  <ErrorMessage
                    component="div"
                    name="payment"
                    className="text-muted"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Descripción: </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.description}
                    placeholder="Descripción"
                  />
                  <Form.Text className="text-muted">
                    {errors.description &&
                      touched.description &&
                      errors.description}
                  </Form.Text>
                </Form.Group>
                {validation !== "" && (
                  <Form.Text className="text-muted">{validation}</Form.Text>
                )}
                <DButton
                  disabled={isSubmitting}
                  title={"Ingresar"}
                  type="submit"
                />
                <Modal
                  size="sm"
                  show={smShow}
                  onHide={() => {
                    setLgShow(false);
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
                          setLgShow(false);
                          setSmShow(false);
                        }}
                        title="Ok"
                      />
                    </Row>
                  </Modal.Body>
                </Modal>
              </Form>
            )}
          </Formik>
          <br />
        </Modal.Body>
      </Modal>
    </div>
  );

  return content;
};

export default PaymentModal;
