import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Formik, Field } from 'formik';
import moment from "moment";
import * as Yup from "yup";
import { PrimaryHeaderMedium } from "../../../components/Headers";
import { storage } from '../../../firebase';
import "./NewPostHeader.scss";

const NewPostHeader = (props) => {
  const supportedFormats = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png"
  ];

  let [validation, setValidation] = useState('');
  let [fileName, setFileName] = useState('');

  const ValidationSchema = Yup.object().shape({
    text: Yup.string()
      .max(255, "El texto es muy largo"),
    attachment_data: Yup
      .mixed()
  });

  const submitPost = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    console.log(values);
    const data = {
      caption: values.text
    };
    if(values.attachment_data) {
      const fileName = `post_${moment().format('MM_DD_YYYY_hmmssa')}_${values.attachment_data.name}`;
      console.log('hay attached data = ', `images/${fileName}`);
      const uploadTask = storage.ref(`images/${fileName}`);
      let task = uploadTask.put(values.attachment_data);
      task.on('state_changed', () => { },
        (error) => {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        },
        () => {
          setValidation("");
          resetForm();
          storage.ref('images').child(fileName).getDownloadURL().then((firebaseUrl) => {
            data.image = {
              link: firebaseUrl
            }
            postPost(data);
          })
        });
    } else {      
      postPost(data);
    }
    setSubmitting(false);
  }

  const postPost = (data) => {
    axios.post(`${process.env.REACT_APP_NODE_API}/api/posts`, data)
      .then(response => {
        if(response.data.success){
          props.handlePost();
        } else {
          setValidation("Lo sentimos, ha ocurrido un error :(");
        }
      })
      .catch(error => setValidation("Lo sentimos, ha ocurrido un error :("));
  }

  return (
    <div className="styles-new-post">
      <Container className="text-center">
        <PrimaryHeaderMedium title="Nueva Publicación"></PrimaryHeaderMedium>
        <Formik
          validationSchema={ValidationSchema}
          initialValues={{
            attachment_data: undefined,
            text: undefined
          }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            submitPost(values, { setSubmitting, resetForm });
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
            setFieldError
          }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="formText">
                      <textarea
                        type="text"
                        name="text"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.text}
                        placeholder="Descripcion..."
                        aria-label="Descripcion..."
                      ></textarea>
                      <Form.Text className="text-muted">
                        {errors.text && touched.text && errors.text}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group controlId="formImage">
                      <div className="custom-file">
                        <input
                          type="file"
                          name="attachment_data"
                          onBlur={handleBlur}
                          placeholder="Ingresar imagen"
                          className="custom-file-input"
                          id="customFileLang"
                          lang="es"
                          onChange={e => {
                            e.preventDefault();
                            const file = e.target.files[0];
                            console.log(supportedFormats);
                            console.log(file.type);
                            if (!supportedFormats.includes(file.type)) {
                              setFieldError("attachment_data", `Error formato no admitido (${file.name}).`);
                              setFieldValue("attachment_data", undefined, false);
                            } else {
                              setFieldValue("attachment_data", file);
                              setFileName(file.name);
                            }
                          }}
                        />
                        <label className="custom-file-label" htmlFor="customFileLang">
                          {fileName !== '' && <div>{fileName}</div>}
                          {fileName === '' && <div>Seleccionar Imagen</div>}
                        </label>
                      </div>
                      <Form.Text className="text-muted">
                        {errors.attachment_data && touched.attachment_data && errors.attachment_data}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    {validation !== "" && (
                      <Form.Text className="text-muted">
                        {validation}
                      </Form.Text>
                    )}
                    <Button
                      disabled={isSubmitting} type="submit" value="Submit" variant="danger">
                      Publicar
                    </Button>
                  </Col>
                </Row>
              </Form>
            )}
        </Formik>
      </Container>
    </div>
  );
}

export default NewPostHeader;
