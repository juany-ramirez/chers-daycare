import React, { useEffect, useState } from "react";
import { Formik } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import { DButton, PrimaryHeaderLarge } from "../../components";
import Auth from '../../auth';
import "./Authentication.scss";

const Login = props => {

    const [validation, setValidation] = useState('');

    const ValidationSchema = Yup.object().shape({
        password: Yup.string()
            .max(255, "El texto es muy largo")
            .required("Requerido"),
        email: Yup.string()
            .email("Tiene que ser un correo electrónico")
            .max(255, "El texto es muy largo")
            .required("Requerido")
    });

    const submitForm = (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        console.log(values);
        axios.post(`${process.env.REACT_APP_NODE_API}/api/auth/signin`, values)
            .then(response => {
                console.log("Success:", response.data);
                Auth.login(response.data.token);
                console.log(Auth.decodeJWT());
                resetForm();
                setValidation("");
                props.history.push("/home");
                
            })
            .catch(error => {
                setValidation("Email o contraseña incorrecta");
            });
        setSubmitting(false);
    }

    useEffect(() => {
        setValidation("");
        // eslint-disable-next-line
    }, []);

    let content = (
        <div className="styles-authentication">
            <Container>
                <Row>
                    <Col xs={12}>
                        <PrimaryHeaderLarge title="Iniciar Sesión" />
                    </Col>
                </Row>
                <Formik
                    validationSchema={ValidationSchema}
                    initialValues={{ email: '', password: '' }}
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
                        /* and other goodies */
                    }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Correo: </Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        placeholder="Ingresar correo" />
                                    <Form.Text className="text-muted">
                                        {errors.email && touched.email && errors.email}
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Contraseña: </Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        placeholder="Contraseña" />
                                    <Form.Text className="text-muted">
                                        {errors.password && touched.password && errors.password}
                                    </Form.Text>
                                </Form.Group>
                                {validation !== "" && (
                                    <Form.Text className="text-muted">
                                        {validation}
                                    </Form.Text>
                                )}
                                <DButton
                                    bg="#F2B441"
                                    color="#4A4972"
                                    disabled={isSubmitting}
                                    title="INGRESAR"
                                    type="submit" />
                            </Form>
                        )}
                </Formik>
            </Container>
        </div>
    );
    return content;
};

export default Login;
