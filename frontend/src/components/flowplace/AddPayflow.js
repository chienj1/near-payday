import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const AddPayflow = ({ save }) => {
    const [deposit, setDeposit] = useState(0);

    const isFormFilled = () => deposit;
  
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button
            onClick={handleShow}
            variant="dark"
            className="rounded-pill px-0"
            style={{ width: "38px" }}
          >
            <i class="bi bi-plus"></i>
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>New Payflow</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <FloatingLabel
                  controlId="inputdeposit"
                  label="Deposit"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="ammount"
                    onChange={(e) => {
                        setDeposit(e.target.value);
                    }}
                  />
                </FloatingLabel>
              </Modal.Body>
            </Form>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
              <Button
                variant="dark"
                disabled={!isFormFilled()}
                onClick={() => {
                  save({}, deposit);
                  handleClose();
                }}
              >
                Save
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    
    AddPayflow.propTypes = {
      save: PropTypes.func.isRequired,
    };
    
    export default AddPayflow;
