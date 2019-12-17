import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import { PrimaryHeaderLarge, DButton } from "../../../components";
import { Table, Spinner, Row, Modal, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

const Payment = props => {
  const [state, setState] = useState({
    loading: true,
    payments: []
  });
  const [smShow, setSmShow] = useState(false);
  const [message, setMessage] = useState("");

  const emptyPayment = {
    names: "",
    last_names: "",
    parent: "",
    singular_payments: [],
    monthly_payment: [],
    tags: [],
    profiles: []
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
        value: state.payments.length
      }
    ], // A numeric array is also available: [5, 10]. the purpose of above example is custom the text
    withFirstAndLast: false, // hide the going to first and last page button
    alwaysShowAllBtns: true, // always show the next and previous page button
    firstPageText: "First", // the text of first page button
    prePageText: "Prev", // the text of previous page button
    nextPageText: "Sig" // the text of next page button
  };

  const linkFormatter = (cell, row, rowIndex) => {
    return (
      <a href={cell} target="_blank">
        See mail
      </a>
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
      text: "Link",
      formatter: linkFormatter
    }
  ];

  const getPayments = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/users?rol=3`, {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZDVlZTUzM2FjYzM2ZTNlZmM4NGE2NWMiLCJleHAiOjE1NzE4NzMzMTgxNTcsIm5hbWVzIjoiQ2hlcidzIERheWNhcmUiLCJsYXN0X25hbWVzIjpudWxsLCJlbWFpbCI6ImNoZXJzZGF5Y2FyZS5sZWFybmluZ2NlbnRlckBnbWFpbC5jb20iLCJ0aGlyZF9wYXJ0eV9ub3RpZmljYXRpb24iOm51bGwsIm5vdGlmaWNhdGlvbnMiOltdLCJyb2wiOjEsImlhdCI6MTU3MTc4NjkxOH0.rvfM4GELHQPCu9wRBplglRWXd8CPfC7_DObom1q73d8"
        }
      })
      .then(response => {
        console.log(response.data);
        setState({ ...state, loading: false, payments: response.data.data });
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    getPayments();
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
    <div className="text-center">
      <PrimaryHeaderLarge title="Pagos" />
      <Button variant="warning">Ingresar nuevo pago</Button>
      <br />
      <br />

      <ToolkitProvider
        keyField="_id"
        data={state.payments}
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
      <br />
      <Modal
        size="sm"
        show={smShow}
        onHide={() => {
          setSmShow(false);
        }}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">{message}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="d-flex justify-content-end">
            <DButton
              handleClick={() => {
                setSmShow(false);
              }}
              title="Ok"
            />
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
  return state.loading ? loadingContent : content;
};

export default Payment;
