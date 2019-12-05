import React, { useState } from "react";
import { Formik, ErrorMessage, getIn } from "formik";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import axios from "axios";
import { Modal, Form, Card, Button, Row, Col } from "react-bootstrap";
import {
  EditRoundButton,
  DButton,
  DeleteRoundButton,
  CreateRoundButton
} from "../../../components";

const KidModal = props => {
  const [state, setState] = useState({
    monthlyPayment: false,
    singularPayment: false
  });
  const [lgShow, setLgShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [validation, setValidation] = useState("");
  const [message, setMessage] = useState("");

  const ValidationSchema = Yup.object().shape({
    names: Yup.string()
      .max(255, "El texto es muy largo")
      .required("Nombres requeridos"),
    last_names: Yup.string()
      .max(255, "El texto es muy largo")
      .required("Apellidos requeridos"),
    profiles: Yup.mixed(),
    monthly_payment: Yup.object().shape({
      first_date: Yup.date().required("Fecha de inicio es requerida."),
      second_date: Yup.date().required("Fecha final es requerida."),
      payment: Yup.number()
        .min(0, "Monto debe ser mayor o igual a cero.")
        .typeError("Debe especificar un monto.")
        .required("Monto requerido")
    }),
    singular_payment: Yup.array().of(
      Yup.object().shape({
        first_date: Yup.string().required("Fecha es requerida."),
        payment: Yup.number().required("Monto requerido")
      })
    ),
    parent: Yup.array()
      .min(1, "Debe seleccionar por lo menos un perfil.")
      .required("Padre(s) requeridos")
  });

  const createUser = (values, { resetForm }) => {
    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/auth/signup`, values)
      .then(response => {
        setValidation("");
        console.log(response);
        if (response.data.success) {
          resetForm();
          setMessage("Se ha creado nuevo Usuario");
          setSmShow(true);
          props.isEdited();
        } else {
          setMessage("Lo sentimos, ha ocurrido un error :(");
          setSmShow(true);
        }
      })
      .catch(error => {
        setValidation("Ha ocurrido un error");
      });
  };

  const modifyUser = values => {
    const kid = props.kid;
    console.log(kid);
    kid.names = values.names;
    kid.last_names = values.last_names;
    kid.profiles = values.profiles;
    kid.phone = values.phone;
    kid.rol = values.rol;
    console.log(kid);
    axios
      .put(`${process.env.REACT_APP_NODE_API}/api/auth/kids/${kid._id}`, kid)
      .then(response => {
        console.log(response);
        if (response.data.success) {
          setMessage("Se ha actualizado el Usuario");
          setSmShow(true);
          props.isCreated();
        } else {
          setMessage("Lo sentimos, ha ocurrido un error :(");
          setSmShow(true);
        }
        setValidation("");
      })
      .catch(error => {
        setValidation("Ha ocurrido un error");
      });
  };

  const submitForm = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    props.type === "create"
      ? createUser(values, { resetForm })
      : modifyUser(values, { resetForm });
    setSubmitting(false);
  };

  let content = (
    <div>
      {props.type === "edit" && (
        <EditRoundButton handleClick={() => setLgShow(true)} />
      )}
      {props.type === "create" && (
        <DButton title="Agregar Niño" handleClick={() => setLgShow(true)} />
      )}
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
          <Formik
            validationSchema={ValidationSchema}
            initialValues={{
              names: props.kid.names,
              last_names: props.kid.last_names,
              profiles: props.kid.profiles,
              tags: props.kid.tags,
              monthly_payment: {
                first_date: props.kid.monthly_payment.first_date,
                second_date: props.kid.monthly_payment.second_date,
                payment: props.kid.monthly_payment.payment,
                payed: props.kid.monthly_payment.payed,
                done: props.kid.monthly_payment.done
              },
              singular_payment: props.kid.singular_payment,
              parent: props.kid.parent
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
                <Form.Group controlId="formNames">
                  <Form.Label>Nombres: </Form.Label>
                  <Form.Control
                    type="text"
                    name="names"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.names}
                    placeholder="Ingresar nombres"
                  />
                  <Form.Text className="text-muted">
                    {errors.names && touched.names && errors.names}
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formLastNames">
                  <Form.Label>Apellidos: </Form.Label>
                  <Form.Control
                    type="text"
                    name="last_names"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_names}
                    placeholder="Ingresar apellidos"
                  />
                  <Form.Text className="text-muted">
                    {errors.last_names &&
                      touched.last_names &&
                      errors.last_names}
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formParents">
                  <Form.Label as="legend" column sm={3}>
                    Padre(s):
                  </Form.Label>
                  <Form.Control as="select" multiple>
                    <option select="true">Carlos Ramos</option>
                    <option>Cali Ramirez </option>
                    <option select="true">Maria Gonzales </option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    {errors.parent && touched.parent && errors.parent}
                  </Form.Text>
                </Form.Group>
                <Card>
                  <Card.Header>
                    <Row>
                      <Col sm={10}>
                        <Card.Title
                          style={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%"
                          }}
                        >
                          Mensualidad
                        </Card.Title>
                      </Col>
                      <Col sm={2}>
                        {!state.monthlyPayment && (
                          <CreateRoundButton
                            handleClick={() =>
                              setState({ ...state, monthlyPayment: true })
                            }
                          />
                        )}
                        {state.monthlyPayment && (
                          <DeleteRoundButton
                            handleClick={() =>
                              setState({ ...state, monthlyPayment: false })
                            }
                          />
                        )}
                      </Col>
                    </Row>
                  </Card.Header>
                  {state.monthlyPayment && (
                    <Card.Body>
                      <Form.Group controlId="formMonthlyStartDate">
                        <Form.Label>Rango de Meses: </Form.Label>
                        <br></br>
                        <DatePicker
                          selected={values.monthly_payment.first_date}
                          onChange={date =>
                            setFieldValue("monthly_payment.first_date", date)
                          }
                          selectsStart
                          value={values.monthly_payment.first_date}
                          startDate={values.monthly_payment.first_date}
                          endDate={values.monthly_payment.second_date}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                        />
                        <DatePicker
                          selected={values.monthly_payment.second_date}
                          onChange={date =>
                            setFieldValue("monthly_payment.second_date", date)
                          }
                          selectsEnd
                          value={values.monthly_payment.second_date}
                          startDate={values.monthly_payment.first_date}
                          endDate={values.monthly_payment.second_date}
                          dateFormat="MM/yyyy"
                          showMonthYearPicker
                        />
                        <ErrorMessage
                          component="div"
                          name="monthly_payment.first_date"
                          className="text-muted"
                        />
                        <ErrorMessage
                          component="div"
                          name="monthly_payment.second_date"
                          className="text-muted"
                        />
                      </Form.Group>
                      <Form.Group controlId="formMonthlyPayment">
                        <Form.Label>Mensualidad: </Form.Label>
                        <Form.Control
                          type="number"
                          name="monthly_payment.payment"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.monthly_payment.payment}
                          placeholder="Ingresar mensualidad"
                        />
                        <ErrorMessage
                          component="div"
                          name="monthly_payment.payment"
                          className="text-muted"
                        />
                      </Form.Group>
                    </Card.Body>
                  )}
                </Card>
                <br />
                {validation !== "" && (
                  <Form.Text className="text-muted">{validation}</Form.Text>
                )}
                <DButton
                  disabled={isSubmitting}
                  title={props.type === "edit" ? "Modificar" : "Ingresar"}
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

export default KidModal;
