import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const InputAmmount = ({ id, save, description, label, enable }) => {
    const [ammount, setAmmount] = useState("");
    
    const isFormFilled = () => ammount;
    
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button
            onClick={handleShow}
            className="w-40 py-3"
            variant="outline-dark"
            disabled={!enable}
          >
            {enable? description : "All claimed"}
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>{description}</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
                <FloatingLabel
                  controlId="inputAmmount"
                  className="mb-3"
                  label={label}
                >
                  <Form.Control
                    type="text"
                    placeholder="ammount"
                    onChange={(e) => {
                        setAmmount(e.target.value);
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
                  save(id, ammount);
                  handleClose();
                }}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    
    InputAmmount.propTypes = {
      id:  PropTypes.string.isRequired,
      save: PropTypes.func.isRequired,
      description: PropTypes.string.isRequired
    };
    
    export default InputAmmount;
