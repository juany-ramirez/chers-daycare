import React, { useState, useEffect, useRef, useContext } from "react";
import { Formik, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import * as Yup from "yup";
import axios from "axios";
import { ImageCropper } from "react-bootstrap-image-cropper";
import moment from "moment";
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
  Spinner,
  InputGroup
} from "react-bootstrap";
import { storage } from "../../../firebase";
import DModal from "../../../components/Modals";
import {
  EditRoundButton,
  DButton,
  DeleteRoundButton,
  CreateRoundButton
} from "../../../components";
import { KidContext } from "../../../contexts/KidContext";

const KidModal = props => {
  const { kids, setKids } = useContext(KidContext);
  const [state, setState] = useState({
    monthlyPayment:
      props.type === "edit" && props.kid.monthly_payment ? true : false,
    singularPayment: false,
    loadingParents: true,
    parents: [],
    selectedParents: []
  });
  const [lgShow, setLgShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [validation, setValidation] = useState("");
  const [message, setMessage] = useState("");
  const [avatar, setAvatar] = useState("");
  const [newSingular, setNewSingular] = useState([]);

  const emptyMonthlyPayment = [
    {
      field: "monthly_payment",
      value: {}
    },
    {
      field: "monthly_payment.first_date",
      value: false
    },
    {
      field: "monthly_payment.second_date",
      value: false
    },
    {
      field: "monthly_payment.payment",
      value: ""
    },
    {
      field: "monthly_payment.due_date",
      value: ""
    }
  ];
  const emptySingularPayment = [
    {
      field: "singular_payment_object",
      value: {}
    },
    {
      field: "singular_payment_object.first_date",
      value: false
    },
    {
      field: "singular_payment_object.payment",
      value: ""
    }
  ];

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
          .typeError(
            "Fecha de inicio inválida, fecha debe ser antes que la fecha final."
          )
          .required("Debe especificar fecha de inicio."),
        second_date: Yup.date()
          .typeError(
            "Fecha final inválida, escoger fecha posterior a fecha inicial."
          )
          .required("Fecha final es requerida."),
        due_date: Yup.number()
          .min(1, "Fecha debe ser entre los dias disponibles del mes (1-28).")
          .max(28, "Fecha debe ser entre los dias disponibles del mes (1-28).")
          .typeError("Debe especificar una fecha.")
          .required("Fecha requerida"),
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
    if (props.kid.profiles.length > 0) {
      setAvatar(props.kid.profiles[0]);
    }
    // eslint-disable-next-line
  }, []);

  const getParents = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users?rol=3`)
      .then(response => {
        let parents = [],
          selectedParents = [];
        let isSelected;
        response.data.data.map(parent => {
          isSelected = false;
          props.kid.parents.map(selectedParentId => {
            if (selectedParentId === parent.user_type) isSelected = true;
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

  const deleteCharge = (index, values) => {
    values.singular_payment.splice(index, 1);
    return values.singular_payment;
  };

  const createKid = async (values, { resetForm }, firebaseUrl) => {
    if (firebaseUrl.length > 0) {
      values.profiles = [];
      values.profiles.push(firebaseUrl);
    }
    values.monthly_payment = values.monthly_payment
      ? values.monthly_payment
      : null;
    values.singular_payment = values.singular_payment
      ? values.singular_payment
      : [];

    if (values.singular_payment.length > 0) {
      let charge = 0;
      newSingular.forEach(payment => {
        charge += payment.payment;
      });
      values.done = false;
      values.charge = charge;
    }
    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/kids`, values)
      .then(async response => {
        setValidation("");
        if (response.data.success) {
          let resp = await parentRelation(
            state.selectedParents,
            response.data.data
          );
          if (resp) {
            setState({
              ...state,
              monthlyPayment: false,
              singularPayment: false
            });
            resetForm();
            setMessage("Se ha ingresado nuevo niño");
            setSmShow(true);

            let KidList = [...kids];
            KidList.push(response.data.data);
            setKids(KidList);
          }
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

  const parentRelationUpdate = async kid => {
    const ogParents = props.kid.parents;
    let parentRelationUpdate = [];
    console.log("ogParents", ogParents);
    state.selectedParents.forEach(parent => {
      if (ogParents.indexOf(parent.user_type) === -1) {
        parentRelationUpdate.push(parent.user_type);
      }
    });
    ogParents.forEach(parent => {
      const result = state.selectedParents.find(
        ({ user_type }) => user_type === parent
      );
      if (!result) {
        parentRelationUpdate.push(parent);
      }
    });
    parentRelation(parentRelationUpdate, kid);
  };

  const parentRelation = async (parents, kid) => {
    parents.forEach(async parent => {
      const parentId = parent.user_type ? parent.user_type : parent;
      axios
        .patch(`${process.env.REACT_APP_NODE_API}/api/parents/${parentId}`, {
          kid_id: kid._id
        })
        .then(response => {
          if (!response.data.success) {
            return false;
          }
        })
        .catch(error => {
          return false;
        });
    });
    return true;
  };

  const modifyKid = (values, { resetForm }, firebaseUrl) => {
    parentRelationUpdate(props.kid);
    const kid = props.kid;
    kid.names = values.names;
    kid.last_names = values.last_names;
    kid.monthly_payment = values.monthly_payment;
    if (newSingular.length > 0) {
      let charge = 0;
      newSingular.forEach(payment => {
        charge += payment.payment;
      });
      kid.done = false;
      kid.charge += charge;
    }
    kid.parents = values.parents;
    if (firebaseUrl.length > 0) {
      kid.profiles = [];
      kid.profiles.push(firebaseUrl);
    }
    axios
      .put(`${process.env.REACT_APP_NODE_API}/api/kids/${kid._id}`, kid)
      .then(response => {
        if (response.data.success) {
          setMessage("Se ha actualizado el Usuario");
          setSmShow(true);
          let kidList = [...kids];
          kidList[props.index] = kid;
          setKids(kidList);
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
    if (fileRef.current) {
      const fileName = `post_${moment().format(
        "MM_DD_YYYY_hmmssa"
      )}_${values.names.replace(/ /g, "_")}_${values.last_names.replace(
        / /g,
        "_"
      )}`;
      const uploadTask = storage.ref(`profiles/${fileName}`);
      let task = uploadTask.put(fileRef.current);
      task.on(
        "state_changed",
        () => {},
        error => {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        },
        () => {
          setValidation("");
          storage
            .ref("profiles")
            .child(fileName)
            .getDownloadURL()
            .then(firebase_url => {
              props.type === "create"
                ? createKid(values, { resetForm }, "")
                : modifyKid(values, { resetForm }, firebase_url);
            });
        }
      );
    } else {
      props.type === "create"
        ? createKid(values, { resetForm }, "")
        : modifyKid(values, { resetForm }, "");
    }
    setSubmitting(false);
  };
  const fileRef = useRef();

  const handleChangeImage = croppedFile => {
    if (fileRef.current) {
      setAvatar("");
    }
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
                props.type === "edit" && props.kid.monthly_payment
                  ? {
                      first_date: new Date(
                        props.kid.monthly_payment.first_date
                      ),
                      second_date: new Date(
                        props.kid.monthly_payment.second_date
                      ),
                      payment: props.kid.monthly_payment.payment,
                      payed: props.kid.monthly_payment.payed,
                      done: props.kid.monthly_payment.done,
                      due_date: props.kid.monthly_payment.due_date
                    }
                  : null,
              singular_payment_object: null,
              singular_payment: props.kid.singular_payment,
              parents: props.kid.parents
            }}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              submitForm(values, { setSubmitting, resetForm });
            }}
            validator={() => ({})}
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
              setFieldTouched,
              setFieldError
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
                  <Form.Label> Padre(s): </Form.Label>
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
                            let valueParents = [...values.parents];
                            valueParents.splice(
                              valueParents.indexOf(parent.user_type),
                              1
                            );
                            setFieldValue("parents", valueParents);

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
                            let valueParents = [...values.parents];
                            state.selectedParents.push(parent);
                            state.parents.splice(index, 1);
                            setState({
                              ...state,
                              selectedParents: state.selectedParents,
                              parents: state.parents
                            });
                            valueParents.push(parent.user_type);
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
                <Form.Group controlId="formImageCropper">
                  <Form.Label>Perfil: </Form.Label>
                  <br />
                  {fileRef && avatar.length > 0 && (
                    <img height="100" width="100" src={avatar} />
                  )}
                  <div className="image-cropper">
                    <ImageCropper
                      fileRef={fileRef}
                      onChange={handleChangeImage}
                      outputOptions={{
                        width: 300,
                        height: 300,
                        quality: 0.4
                      }}
                      cropOptions={{ aspect: 1, maxZoom: 10 }}
                      displayOptions={{
                        title: "Cortar Imagen",
                        removeButtonText: "Remover",
                        confirmButtonText: "Confirmar"
                      }}
                      previewOptions={{
                        maxWidth: "100",
                        maxHeight: "100",
                        children: "Seleccionar Imagen"
                      }}
                    />
                  </div>
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
                              emptyMonthlyPayment.map(element => {
                                setFieldValue(
                                  element.field,
                                  element.value,
                                  false
                                );
                              });
                              setState({ ...state, monthlyPayment: true });
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
                              emptyMonthlyPayment.forEach((element, index) => {
                                setFieldTouched(element.field, false);
                              });
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
                          <Form.Group>
                            <Form.Label>Rango de Meses: </Form.Label>
                            <br></br>
                            <Row>
                              <Col>
                                <DatePicker
                                  id="monthly_payment.first_date"
                                  name="monthly_payment.first_date"
                                  onBlur={handleBlur}
                                  placeholderText="Fecha de inicio"
                                  selected={values.monthly_payment.first_date}
                                  onChange={date => {
                                    if (
                                      values.monthly_payment.second_date &&
                                      date &&
                                      values.monthly_payment.second_date.getTime() <
                                        date.getTime()
                                    ) {
                                      setFieldValue(
                                        "monthly_payment.first_date",
                                        false
                                      );
                                    } else {
                                      setFieldTouched(
                                        "monthly_payment.first_date",
                                        true
                                      );
                                      setFieldValue(
                                        "monthly_payment.first_date",
                                        date
                                      );
                                    }
                                  }}
                                  selectsStart
                                  value={values.monthly_payment.first_date}
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
                              </Col>
                              <Col>
                                <DatePicker
                                  id="monthly_payment.second_date"
                                  name="monthly_payment.second_date"
                                  onBlur={handleBlur}
                                  placeholderText="Fecha de final"
                                  selected={values.monthly_payment.second_date}
                                  onChange={date => {
                                    if (
                                      values.monthly_payment.first_date &&
                                      date &&
                                      values.monthly_payment.first_date.getTime() >
                                        date.getTime()
                                    ) {
                                      setFieldValue(
                                        "monthly_payment.second_date",
                                        false
                                      );
                                    } else {
                                      setFieldTouched(
                                        "monthly_payment.second_date",
                                        true
                                      );
                                      setFieldValue(
                                        "monthly_payment.second_date",
                                        date
                                      );
                                    }
                                  }}
                                  selectsEnd
                                  value={values.monthly_payment.second_date}
                                  startDate={values.monthly_payment.first_date}
                                  endDate={values.monthly_payment.second_date}
                                  dateFormat="MM/yyyy"
                                  showMonthYearPicker
                                />
                                <ErrorMessage
                                  component="div"
                                  name="monthly_payment.second_date"
                                  className="text-muted"
                                />
                              </Col>
                            </Row>
                          </Form.Group>
                          <Row>
                            <Col>
                              <Form.Group>
                                <Form.Label>Mensualidad: </Form.Label>
                                <InputGroup>
                                  <InputGroup.Prepend>
                                    <InputGroup.Text>Lps.</InputGroup.Text>
                                  </InputGroup.Prepend>
                                  <Form.Control
                                    type="number"
                                    id="monthly_payment.payment"
                                    name="monthly_payment.payment"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.monthly_payment.payment}
                                    placeholder="Ingresar mensualidad"
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  component="div"
                                  name="monthly_payment.payment"
                                  className="text-muted"
                                />
                              </Form.Group>
                            </Col>
                            <Col>
                              <Form.Group>
                                <Form.Label>Día de pago: </Form.Label>
                                <Form.Control
                                  type="number"
                                  id="monthly_payment.due_date"
                                  name="monthly_payment.due_date"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.monthly_payment.due_date}
                                  placeholder="Fecha entre los días del 1-28 (ej: 5)"
                                />
                                <ErrorMessage
                                  component="div"
                                  name="monthly_payment.due_date"
                                  className="text-muted"
                                />
                              </Form.Group>
                            </Col>
                          </Row>
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
                            aria-expanded={state.singularPayment}
                            handleClick={() => {
                              emptySingularPayment.map(element => {
                                setFieldValue(
                                  element.field,
                                  element.value,
                                  false
                                );
                              });
                              setState({ ...state, singularPayment: true });
                            }}
                          />
                        )}
                        {state.singularPayment && (
                          <DeleteRoundButton
                            aria-controls="singular-payment-form"
                            aria-expanded={state.singularPayment}
                            handleClick={() => {
                              setState({ ...state, singularPayment: false });
                              setFieldValue(
                                "singular_payment_object",
                                null,
                                false
                              );
                              emptySingularPayment.forEach(element => {
                                setFieldTouched(element.field, false);
                              });
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
                                if (date) {
                                  setFieldValue(
                                    "singular_payment_object.first_date",
                                    date
                                  );
                                } else {
                                  setFieldTouched(
                                    "singular_payment_object.first_date",
                                    false
                                  );
                                }
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
                            <InputGroup>
                              <InputGroup.Prepend>
                                <InputGroup.Text>Lps.</InputGroup.Text>
                              </InputGroup.Prepend>
                              <Form.Control
                                type="number"
                                name="singular_payment_object.payment"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.singular_payment_object.payment}
                                placeholder="Ingresar monto total"
                              />
                            </InputGroup>
                            <ErrorMessage
                              component="div"
                              name="singular_payment_object.payment"
                              className="text-muted"
                            />
                          </Form.Group>
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
                              if (!errors.singular_payment_object) {
                                let data = {
                                  first_date:
                                    values.singular_payment_object.first_date,
                                  payment:
                                    values.singular_payment_object.payment
                                };
                                values.singular_payment.push(data);
                                newSingular.push(data);
                                setNewSingular(newSingular);
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
                            (singularCharge, index) => (
                              <tr key={index}>
                                <td> {singularCharge.payment} Lps. </td>
                                <td>
                                  {" "}
                                  {typeof singularCharge.first_date ===
                                    "string" ||
                                  singularCharge.first_date instanceof String
                                    ? new Date(
                                        singularCharge.first_date
                                      ).toLocaleDateString("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric"
                                      })
                                    : singularCharge.first_date
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
                                      loading=""
                                      handleAffirmation={() => {
                                        setFieldValue(
                                          "singular_payment",
                                          deleteCharge(index, values)
                                        );
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
