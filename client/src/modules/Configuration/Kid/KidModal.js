import React, { useState, useEffect } from "react";
import { Formik, ErrorMessage, Field } from "formik";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import axios from "axios";
import {
  Modal,
  Form,
  Card,
  Button,
  Row,
  Col,
  Collapse,
  Table,
  Alert,
  Spinner
} from "react-bootstrap";
import {
  EditRoundButton,
  DButton,
  DeleteRoundButton,
  CreateRoundButton
} from "../../../components";
import DModal from "../../../components/Modals";

const KidModal = props => {
  const [state, setState] = useState({
    monthlyPayment: false,
    singularPayment: false,
    loadingParents: true,
    parents: [],
    selectedParents: []
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
    profiles: Yup.array().of(Yup.mixed()),
    monthly_payment: Yup.object()
      .default(null)
      .nullable()
      .shape({
        first_date: Yup.date()
          .typeError("Debe especificar fecha de inicio.")
          .required("Fecha de inicio es requerida."),
        second_date: Yup.date()
          .typeError("Debe especificar fecha final.")
          .required("Fecha final es requerida."),
        payment: Yup.number()
          .min(0, "Monto debe ser mayor o igual a cero.")
          .typeError("Debe especificar un monto.")
          .required("Monto requerido")
      }),
    singular_payment_object: Yup.object()
      .default(null)
      .nullable()
      .shape({
        first_date: Yup.date()
          .typeError("Debe especificar fecha de inicio.")
          .required("Fecha es requerida."),
        payment: Yup.number()
          .min(0, "Monto debe ser mayor o igual a cero.")
          .typeError("Debe especificar un monto.")
          .required("Monto requerido")
      }),
    singular_payment: Yup.array()
      .nullable()
      .of(Yup.object()),
    parents: Yup.array()
      .min(1, "Debe seleccionar por lo menos un perfil.")
      .required("Padre(s) requeridos")
  });

  useEffect(() => {
    getParents();
    // eslint-disable-next-line
  }, []);

  const getParents = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users?rol=3`)
      .then(response => {
        console.log(response.data);
        let parents = [],
          selectedParents = [];
        let isSelected;
        response.data.data.map(parent => {
          isSelected = false;
          props.kid.parents.map(selectedParentId => {
            if (selectedParentId === parent._id) isSelected = true;
          });
          if (isSelected) {
            selectedParents.push(parent);
          } else {
            parents.push(parent);
          }
        });
        setState({
          ...state,
          loadingParents: false,
          parents: parents,
          selectedParents: selectedParents
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const createUser = (values, { resetForm }) => {
    values.monthly_payment = values.monthly_payment
      ? values.monthly_payment
      : {};

    values.singular_payment = values.singular_payment
      ? values.singular_payment
      : [];
    console.log("VALUES NEW KID", values);

    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/kids`, values)
      .then(response => {
        setValidation("");
        console.log(response);
        if (response.data.success) {
          setState({ ...state, monthlyPayment: false, singularPayment: false });
          resetForm();
          setMessage("Se ha ingresado nuevo niño");
          setSmShow(true);
          // EDITAR EL CONTEXT API DEL NINO
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
              monthly_payment:
                props.kid.monthly_payment.second_date === ""
                  ? null
                  : {
                      first_date: props.kid.monthly_payment.first_date,
                      second_date: props.kid.monthly_payment.second_date,
                      payment: props.kid.monthly_payment.payment,
                      payed: props.kid.monthly_payment.payed,
                      done: props.kid.monthly_payment.done
                    },
              singular_payment_object: null,
              singular_payment: props.kid.singular_payment,
              parents: props.kid.parents
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
              setFieldValue,
              setFieldTouched
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
                  <div className="cd-chip-input">
                    {state.selectedParents.map((parent, index) => (
                      <Button
                        key={index}
                        value={index}
                        variant="light"
                        size="sm"
                      >
                        {parent.names} {parent.last_names}{" "}
                        <option
                          className="badge"
                          onClick={e => {
                            const index = e.target.value;
                            const parent = state.selectedParents[index];
                            console.log(e.target.value);
                            let valueParents = [...values.parents];
                            console.log(values.parents);
                            valueParents.splice(
                              valueParents.indexOf(parent._id),
                              1
                            );
                            setFieldValue("parents", valueParents);
                            console.log(values.parents);

                            state.parents.push(parent);
                            state.selectedParents.splice(index, 1);
                            setState({
                              ...state,
                              selectedParents: state.selectedParents,
                              parents: state.parents
                            });
                          }}
                          value={index}
                        >
                          X
                        </option>
                      </Button>
                    ))}
                  </div>

                  {state.loadingParents && (
                    <div className="container text-center">
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="light" />
                      <Spinner animation="grow" variant="light" />
                    </div>
                  )}
                  {!state.loadingParents && (
                    <Form.Control
                      className="cd-multiple-option"
                      as="select"
                      multiple
                    >
                      {state.parents.map((parent, index) => (
                        <option
                          key={index}
                          value={index}
                          onClick={e => {
                            const index = e.target.value;
                            const parent = state.parents[index];
                            console.log(parent);
                            let valueParents = [...values.parents];
                            state.selectedParents.push(parent);
                            state.parents.splice(index, 1);
                            setState({
                              ...state,
                              selectedParents: state.selectedParents,
                              parents: state.parents
                            });
                            valueParents.push(parent._id);
                            setFieldValue("parents", valueParents);
                            setFieldTouched("parents", true);
                          }}
                        >
                          {parent.names} {parent.last_names} - {parent.email}
                        </option>
                      ))}
                    </Form.Control>
                  )}
                  {values.parents.length === 0 && touched.parents && (
                    <Form.Text className="text-muted">
                      Padre(s) requeridos
                    </Form.Text>
                  )}
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
                            aria-controls="monthly-form"
                            aria-expanded={state.monthlyPayment}
                            handleClick={() => {
                              setState({ ...state, monthlyPayment: true });
                              setFieldValue(
                                "monthly_payment.first_date",
                                false,
                                false
                              );
                              setFieldValue(
                                "monthly_payment.second_date",
                                false,
                                false
                              );
                              setFieldValue(
                                "monthly_payment.payment",
                                false,
                                false
                              );
                            }}
                          />
                        )}
                        {state.monthlyPayment && (
                          <DeleteRoundButton
                            aria-controls="monthly-form"
                            aria-expanded={state.monthlyPayment}
                            handleClick={() => {
                              setState({ ...state, monthlyPayment: false });
                              setFieldValue("monthly_payment", null, false);
                              setFieldTouched(
                                "monthly_payment.first_date",
                                false
                              );
                              setFieldTouched(
                                "monthly_payment.second_date",
                                false
                              );
                              setFieldTouched("monthly_payment.payment", false);
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card.Header>
                  <Collapse in={state.monthlyPayment}>
                    <div>
                      {state.monthlyPayment && (
                        <Card.Body id="monthly-form">
                          <Form.Group controlId="formMonthlyStartDate">
                            <Form.Label>Rango de Meses: </Form.Label>
                            <br></br>
                            <DatePicker
                              id="monthly_payment.first_date"
                              name="monthly_payment.first_date"
                              onBlur={handleBlur}
                              placeholderText="Fecha de inicio"
                              selected={values.monthly_payment.first_date}
                              onChange={date => {
                                setFieldTouched(
                                  "monthly_payment.first_date",
                                  true
                                );
                                setFieldValue(
                                  "monthly_payment.first_date",
                                  date
                                );
                              }}
                              selectsStart
                              value={values.monthly_payment.first_date}
                              startDate={values.monthly_payment.first_date}
                              endDate={values.monthly_payment.second_date}
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                            />
                            <DatePicker
                              id="monthly_payment.second_date"
                              name="monthly_payment.second_date"
                              onBlur={handleBlur}
                              placeholderText="Fecha de final"
                              selected={values.monthly_payment.second_date}
                              onChange={date => {
                                setFieldTouched(
                                  "monthly_payment.second_date",
                                  true
                                );
                                setFieldValue(
                                  "monthly_payment.second_date",
                                  date
                                );
                              }}
                              selectsEnd
                              value={values.monthly_payment.second_date}
                              startDate={values.monthly_payment.first_date}
                              endDate={values.monthly_payment.second_date}
                              dateFormat="MM/yyyy"
                              showMonthYearPicker
                            />
                            <Row>
                              <Col>
                                <ErrorMessage
                                  component="div"
                                  name="monthly_payment.first_date"
                                  className="text-muted"
                                />
                              </Col>
                              <Col>
                                <ErrorMessage
                                  component="div"
                                  name="monthly_payment.second_date"
                                  className="text-muted"
                                />
                              </Col>
                            </Row>
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
                    </div>
                  </Collapse>
                </Card>
                <br />
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
                          Cargos días individuales
                        </Card.Title>
                      </Col>
                      <Col sm={2}>
                        {!state.singularPayment && (
                          <CreateRoundButton
                            aria-controls="singular-payment-form"
                            aria-expanded={state.monthlyPayment}
                            handleClick={() => {
                              setState({ ...state, singularPayment: true });
                              setFieldValue(
                                "singular_payment_object.first_date",
                                false,
                                false
                              );
                              setFieldValue(
                                "singular_payment_object.payment",
                                false,
                                false
                              );
                            }}
                          />
                        )}
                        {state.singularPayment && (
                          <DeleteRoundButton
                            aria-controls="singular-payment-form"
                            aria-expanded={state.monthlyPayment}
                            handleClick={() => {
                              setState({ ...state, singularPayment: false });
                              setFieldValue(
                                "singular_payment_object",
                                null,
                                false
                              );
                              setFieldTouched(
                                "singular_payment_object.payment",
                                false
                              );
                              setFieldTouched(
                                "singular_payment_object.first_date",
                                false
                              );
                            }}
                          />
                        )}
                      </Col>
                    </Row>
                  </Card.Header>
                  <Collapse in={state.singularPayment}>
                    <div>
                      {state.singularPayment && (
                        <Card.Body id="singular-payment-form">
                          <Form.Group controlId="formSingularStartDate">
                            <Form.Label>Fecha: </Form.Label>
                            <br></br>
                            <DatePicker
                              id="singular_payment_object.first_date"
                              name="singular_payment_object.first_date"
                              onBlur={handleBlur}
                              placeholderText="Fecha"
                              selected={
                                values.singular_payment_object.first_date
                              }
                              onChange={date => {
                                setFieldTouched(
                                  "singular_payment_object.first_date",
                                  true
                                );
                                setFieldValue(
                                  "singular_payment_object.first_date",
                                  date
                                );
                              }}
                              value={values.singular_payment_object.first_date}
                              showTimeSelect
                              dateFormat="MMMM d, yyyy h:mm aa"
                            />
                            <ErrorMessage
                              component="div"
                              name="singular_payment_object.first_date"
                              className="text-muted"
                            />
                          </Form.Group>
                          <Form.Group controlId="formsingularPayment">
                            <Form.Label>Monto: </Form.Label>
                            <Form.Control
                              type="number"
                              name="singular_payment_object.payment"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.singular_payment_object.payment}
                              placeholder="Ingresar monto total"
                            />
                            <ErrorMessage
                              component="div"
                              name="singular_payment_object.payment"
                              className="text-muted"
                            />
                            <br />
                            <Button
                              onClick={() => {
                                setFieldTouched(
                                  "singular_payment_object.first_date",
                                  true
                                );
                                setFieldTouched(
                                  "singular_payment_object.payment",
                                  true
                                );
                                console.log(errors);
                                
                                if (
                                  !errors.singular_payment_object
                                ) {
                                  let data = {
                                    first_date:
                                      values.singular_payment_object.first_date,
                                    payment:
                                      values.singular_payment_object.payment
                                  };
                                  values.singular_payment.push(data);
                                  setFieldValue(
                                    "singular_payment",
                                    values.singular_payment
                                  );
                                  setState({
                                    ...state,
                                    singularPayment: false
                                  });
                                  setFieldValue(
                                    "singular_payment_object",
                                    null,
                                    false
                                  );
                                  setFieldValue(
                                    "singular_payment_object",
                                    null,
                                    false
                                  );
                                  setFieldTouched(
                                    "singular_payment_object.payment",
                                    false
                                  );
                                  setFieldTouched(
                                    "singular_payment_object.first_date",
                                    false
                                  );
                                }
                              }}
                              variant="info"
                              style={{
                                backgroundColor: "#d5e4f2",
                                color: "#4a4972",
                                border: "none"
                              }}
                            >
                              Agregar Cargo Individual
                            </Button>
                          </Form.Group>
                        </Card.Body>
                      )}
                    </div>
                  </Collapse>
                  {values.singular_payment.length > 0 && (
                    <Card.Body>
                      <Alert
                        style={{
                          backgroundColor: "#d5e4f2",
                          color: "#4a4972",
                          border: "none"
                        }}
                        variant="dark"
                      >
                        <h5 style={{ marginBottom: 0 }} className="text-center">
                          Lista de Cargos Individuales
                        </h5>
                      </Alert>
                      <Table responsive="sm" bordered variant="light" hover>
                        <thead>
                          <tr>
                            <th>Monto</th>
                            <th>Fecha</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.singular_payment.map(
                            (singular_payment, index) => (
                              <tr key={index}>
                                <td> {singular_payment.payment} Lps. </td>
                                <td>
                                  {" "}
                                  {singular_payment.first_date
                                    .toLocaleDateString("en-GB", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric"
                                    })
                                    .replace(/ /g, "-")}{" "}
                                </td>
                                <td>
                                  <Row className="d-flex justify-content-around">
                                    <DModal
                                      text="Estás seguro que deseas eliminar este cargo?"
                                      modalType={2}
                                      handleAffirmation={singular_payment => {
                                        console.log(singular_payment);
                                        console.log("borre el cargo");
                                      }}
                                    />
                                  </Row>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
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
