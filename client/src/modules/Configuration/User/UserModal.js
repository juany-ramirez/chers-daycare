import React, { useState, useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Modal,
  Form,
  ToggleButtonGroup,
  ToggleButton,
  Row
} from "react-bootstrap";
import { EditRoundButton, DButton } from "../../../components";
import { UserContext } from "../../../contexts/UserContext";

const UserModal = props => {
  const { users, setUsers } = useContext(UserContext);

  const [lgShow, setLgShow] = useState(false);
  const [smShow, setSmShow] = useState(false);
  const [validation, setValidation] = useState("");
  const [value, setValue] = useState(3);
  const [message, setMessage] = useState("");

  const ValidationSchema = Yup.object().shape({
    names: Yup.string()
      .max(255, "El texto es muy largo")
      .required("Nombres requeridos"),
    last_names: Yup.string()
      .max(255, "El texto es muy largo")
      .required("Apellidos requeridos"),
    password: Yup.string()
      .min(6, "La contraseña tiene que tener 6 caracteres como mínimo.")
      .max(255, "El texto es muy largo")
      .required("Contraseña requerida"),
    passwordConfirmation: Yup.string()
      .min(6, "La contraseña tiene que tener 6 caracteres como mínimo.")
      .max(255, "El texto es muy largo")
      .test("passwords-match", "Las contraseñas deben ser iguales", function(
        value
      ) {
        return this.parent.password === value;
      })
      .required("Contraseña requerida"),
    email: Yup.string()
      .email("Tiene que ser un correo electrónico")
      .max(255, "El texto es muy largo")
      .required("Correo electrónico requerido"),
    phone: Yup.string().max(255, "El texto es muy largo"),
    rol: Yup.number().required("Tipo de usuario requerido")
  });

  const createUser = (values, { resetForm }) => {
    axios
      .post(`${process.env.REACT_APP_NODE_API}/api/auth/signup`, values)
      .then(response => {
        setValidation("");
        if (response.data.success) {
          resetForm();
          setMessage("Se ha creado nuevo Usuario");
          setSmShow(true);
          let userList = [...users];
          userList.push(response.data.data);
          setUsers(userList);
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
    const user = props.user;
    console.log(user);
    user.names = values.names;
    user.last_names = values.last_names;
    user.email = values.email;
    user.phone = values.phone;
    user.rol = values.rol;
    axios
      .put(`${process.env.REACT_APP_NODE_API}/api/auth/users/${user._id}`, user)
      .then(response => {
        console.log(response);
        if (response.data.success) {
          let userList = [...users];
          userList[props.index] = response.data.data;
          setUsers(userList);
          setMessage("Se ha actualizado el Usuario");
          setSmShow(true);
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
        <DButton
          title="Crear nuevo usuario"
          handleClick={() => setLgShow(true)}
        />
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
              names: props.user.names,
              last_names: props.user.last_names,
              email: props.user.email,
              password: props.user.password,
              passwordConfirmation: props.user.password,
              phone: props.user.phone,
              rol: props.user.rol
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
                <Form.Group controlId="formPhone">
                  <Form.Label>Teléfono: </Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                    placeholder="Ingresar teléfono"
                  />
                  <Form.Text className="text-muted">
                    {errors.phone && touched.phone && errors.phone}
                  </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Correo: </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    placeholder="Ingresar correo"
                  />
                  <Form.Text className="text-muted">
                    {errors.email && touched.email && errors.email}
                  </Form.Text>
                </Form.Group>
                {props.type === "create" && (
                  <div>
                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Contraseña: </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.password}
                        placeholder="Contraseña"
                      />
                      <Form.Text className="text-muted">
                        {errors.password && touched.password && errors.password}
                      </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPasswordConfirmation">
                      <Form.Label>Repetir Contraseña: </Form.Label>
                      <Form.Control
                        type="password"
                        name="passwordConfirmation"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.passwordConfirmation}
                        placeholder="Contraseña"
                      />
                      <Form.Text className="text-muted">
                        {errors.passwordConfirmation &&
                          touched.passwordConfirmation &&
                          errors.passwordConfirmation}
                      </Form.Text>
                    </Form.Group>
                  </div>
                )}
                <Form.Group controlId="formUserType">
                  <Form.Label as="legend" column sm={3}>
                    Tipo de Usuario:
                  </Form.Label>
                  <ToggleButtonGroup
                    type="radio"
                    name="rol"
                    value={values.rol}
                    onChange={val => {
                      setFieldValue("rol", val);
                      setValue(val);
                    }}
                    onBlur={handleBlur}
                    defaultValue={3}
                  >
                    <ToggleButton variant="warning" value={1}>
                      {" "}
                      Administrador{" "}
                    </ToggleButton>
                    <ToggleButton variant="warning" value={2}>
                      {" "}
                      Caretaker{" "}
                    </ToggleButton>
                    <ToggleButton variant="warning" value={3}>
                      {" "}
                      Padre/Madre{" "}
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <Form.Text className="text-muted">
                    {errors.rol && touched.rol && errors.rol}
                  </Form.Text>
                </Form.Group>
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

export default UserModal;
