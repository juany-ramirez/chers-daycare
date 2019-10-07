import React, { Component } from "react";
import { Table, Button, Spinner, Modal } from "react-bootstrap";

class About extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      users: [],
    };
  }


  componentDidMount() {
    fetch("/api/users")
      .then(res => res.json())
      .then(users =>
        this.setState({ users: users.data, loading: false }, () =>
          console.log(users)
        )
      );
  }

  render() {
    if (this.state.loading) {
      return (
        <div className="container text-center">
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="light" />
          <Spinner animation="grow" variant="light" />
        </div>
      );
    }
    return (
      <div className="text-center">
        <h2>Usuarios</h2>
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
            {this.state.users.map((user, index) => (
              <tr key={index}>
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
                  <Button
                    style={{
                      marginLeft: "4px",
                      marginRight: "4px",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px"
                    }}
                    variant="info"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  </Button>
                  <Button
                    style={{
                      marginLeft: "4px",
                      marginRight: "4px",
                      borderRadius: "50%",
                      width: "48px",
                      height: "48px"
                    }}
                    variant="danger"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="white"
                    >
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      <path d="M0 0h24v24H0z" fill="none" />
                    </svg>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default About;
