import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import DModal from "../../../components/Modals";
import {
  PrimaryHeaderLarge,
  DButton,
  CreateRoundButton,
  WhatsAppRoundButton
} from "../../../components";
import { Table, Spinner, Row, Modal, Button } from "react-bootstrap";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { PaymentContext } from "../../../contexts/PaymentContext";
import PaymentModal from "./PaymentModal";
import "./Payment.scss";

const Payment = props => {
  const [state, setState] = useState({
    loading: true,
    charge: 0
  });
  const [smShow, setSmShow] = useState(false);
  const [message, setMessage] = useState("");
  const [payments, setPayment] = useState([]);
  const value = useMemo(() => ({ payments, setPayment }), [
    payments,
    setPayment
  ]);

  const emptyPayment = {
    payment: 0,
    date: ""
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
        value: value.payments.length
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
        <PaymentModal
          index={rowIndex}
          type="create"
          title="Generar pago"
          payment={row}
        />
        <Button
          onClick={() => {
            const phone = row.user.phone;
            const messageText = `Cher's Learning Center te recuerda que tienes pendiente un pago [${row.charge} Lps].`;
            const urlEncodedText = encodeURI(messageText);
            const url = `https://wa.me/504${phone}?text=${urlEncodedText}`;
            window.open(url);
          }}
          style={{
            backgroundColor: "#d5e4f2",
            borderColor: "#d5e4f2"
          }}
          className="round-buttons"
        >
          <img
            alt="whatsapp-icon"
            src={require("../../../assets/icons/whatsapp-icon.svg")}
            height="24px"
            width="24px"
          />
        </Button>
      </div>
    );
  };

  const columns = [
    {
      dataField: "user.names",
      text: "Nombre",
      classes: "capitalized-initials",
      formatter: (cell, row) => {
        return `${row.user.names} ${row.user.last_names}`;
      },
      sort: true
    },
    {
      dataField: "kids.done",
      text: "En mora",
      classes: "capitalized-initial",
      formatter: (cell, row) => {
        let done = true;
        row.kids.forEach(kid => {
          if (!kid.done) done = false;
        });
        return done === true ? "No" : "Si";
      },
      sort: true
    },
    {
      dataField: "charge",
      text: "Deuda",
      sort: true
    },
    {
      dataField: "link",
      text: "Acción",
      classes: "table-action",
      formatter: actionFormatter
    }
  ];

  const getPayments = () => {
    axios
      .get(`${process.env.REACT_APP_NODE_API}/api/payment`)
      .then(response => {
        setPayment(response.data.data);
        setState({ ...state, loading: false });
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
    <PaymentContext.Provider value={value}>
      <div className="text-center">
        <PrimaryHeaderLarge title="Pagos" />
        <br />
        <ToolkitProvider
          keyField="_id"
          data={payments}
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
            <Modal.Title id="example-modal-sizes-title-sm">
              {message}
            </Modal.Title>
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
    </PaymentContext.Provider>
  );
  return state.loading ? loadingContent : content;
};

export default Payment;
