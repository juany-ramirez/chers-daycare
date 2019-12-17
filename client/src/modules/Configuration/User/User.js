import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import UserModal from "./UserModal";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
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
    names: "",
    last_names: "",
    email: "",
    password: "",
    phone: "",
    rol: 3
  };
  const { SearchBar } = Search;
  const paginationOptions = {
    paginationSize: 5, // the pagination bar size, default is 5
    sizePerPageList: [
      3,
      5,
      10,
      {
        text: "Todos",
        value: users.length
      }
    ], // A numeric array is also available: [5, 10]. the purpose of above example is custom the text
    withFirstAndLast: false, // hide the going to first and last page button
    alwaysShowAllBtns: true, // always show the next and previous page button
    firstPageText: "First", // the text of first page button
    prePageText: "Prev", // the text of previous page button
    nextPageText: "Sig" // the text of next page button
  };

  const actionFormatter = (cell, row, rowIndex) => {
    return (
      <div className="action-wrapper">
        <UserModal
          index={rowIndex}
          type="edit"
          title="Editar usuario"
          user={row}
        />
        <DModal
          index={rowIndex}
          ref={deleteModal}
          text="Estás seguro que deseas eliminar este usuario?"
          modalType={2}
          handleAffirmation={() => {
            deleteUser(row._id);
          }}
        />
      </div>
    );
  };

  const columns = [
    {
      dataField: "names",
      text: "Nombres",
      classes: "capitalized-initial",
      sort: true
    },
    {
      dataField: "last_names",
      text: "Apellidos",
      classes: "capitalized-initial",
      sort: true
    },
    {
      dataField: "phone",
      text: "Teléfono",
      classes: "capitalized-initial",
      sort: true
    },
    {
      dataField: "email",
      text: "Correo",
      sort: true
    },
    {
      dataField: "rol",
      text: "Tipo",
      classes: "capitalized-initial",
      formatter: (cell, row) => {
        return row.rol === 1
          ? "Administrador"
          : row.rol === 2
          ? "Maestro/a"
          : "Padre de Familia";
      },
      sort: true
    },
    {
      dataField: "link",
      text: "Acción",
      classes: "table-action",
      formatter: actionFormatter
    }
  ];

  const deleteUser = id => {
    axios
      .delete(`${process.env.REACT_APP_NODE_API}/api/users/${id}`)
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
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users`)
      .then(response => {
        console.log(response.data);
        setState({ ...state, loading: false });
        setUsers(response.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

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
        <UserModal type="create" title="Crear nuevo usuario" user={emptyUser} />
        <br />

        <ToolkitProvider
          keyField="_id"
          data={users}
          columns={columns}
          search
          bootstrap4
        >
          {props => (
            <div>
              <SearchBar {...props.searchProps} />
              <hr />{" "}
              <BootstrapTable
                classes="table table-light table-striped table-bordered table-hover"
                pagination={paginationFactory(paginationOptions)}
                wrapperClasses="table-responsive"
                {...props.baseProps}
              />
            </div>
          )}
        </ToolkitProvider>
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
};

export default User;
