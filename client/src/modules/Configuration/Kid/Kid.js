import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import KidModal from "./KidModal";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal, Button } from "react-bootstrap";
import { KidContext } from "../../../contexts/KidContext";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import "./Kid.scss";

const Kid = props => {
  const [kids, setKids] = useState([]);

  const value = useMemo(() => ({ kids, setKids }), [kids, setKids]);
  const [state, setState] = useState({
    loading: true,
    kids: []
  });

  const [smShow, setSmShow] = useState(false);
  const [message, setMessage] = useState("");

  const deleteModal = useRef();

  const emptyKid = {
    names: "",
    last_names: "",
    profiles: [],
    tags: [],
    charge: 0,
    latest_monthly_charge: "",
    payed: 0,
    done: true,
    monthly_payment: {
      first_date: "",
      second_date: "",
      payment: "",
      due_date: ""
    },
    singular_payment_object: {
      first_date: "",
      payment: ""
    },
    singular_payment: [],
    parents: []
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
        value: kids.length
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
        <KidModal
          index={rowIndex}
          type="edit"
          title="Editar usuario"
          kid={row}
          getKids={() => {
            getKids();
          }}
        />
        <DModal
          index={rowIndex}
          ref={deleteModal}
          text="¿Seguro que deseas eliminar este usuario?"
          modalType={2}
          handleAffirmation={() => {
            deleteKid(row);
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
      dataField: "link",
      text: "Acción",
      classes: "table-action",
      formatter: actionFormatter
    }
  ];

  const deleteKid = kid => {
    kid.parents.forEach(async parent => {
      const parentId = parent.user_type ? parent.user_type : parent;
      axios
        .patch(`${process.env.REACT_APP_NODE_API}/api/parents/${parentId}`, {
          kid_id: kid._id
        })
        .then(() => {
          axios
            .delete(`${process.env.REACT_APP_NODE_API}/api/kids/${kid._id}`)
            .then(response => {
              if (response.data.success) {
                setMessage("Se ha eliminado el Usuario");
                setSmShow(true);
                getKids();
              } else {
                setMessage("Lo sentimos, ha ocurrido un error :(");
                setSmShow(true);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(error => {});
    });
  };

  const getKids = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/kids`)
      .then(response => {
        setState({ ...state, loading: false });
        setKids(response.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getKids();
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
    <KidContext.Provider value={value}>
      <div className="text-center">
        <PrimaryHeaderLarge title="Niños" />
        <KidModal type="create" title="Agregar Niño" kid={emptyKid} />
        <br />

        <ToolkitProvider
          keyField="_id"
          data={kids}
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
                  if (deleteModal.current) deleteModal.current.closeModal();
                  setSmShow(false);
                }}
                title="Ok"
              />
            </Row>
          </Modal.Body>
        </Modal>
      </div>
    </KidContext.Provider>
  );
  return state.loading ? loadingContent : content;
};

export default Kid;
