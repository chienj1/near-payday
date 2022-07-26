import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import  DateTimePicker from "react-datetime-picker";

const StartPayflow = ({ id, save }) => {
    const [beginTime, setBeginTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [numofpay, setNumOfPay] = useState(0);
    const [receiver, setReceiver] = useState("");
    
    const isFormFilled = () => beginTime && endTime && numofpay && receiver;
    
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
          <Button
            onClick={handleShow}
            variant="dark"
            className="w-40 py-3"
          >
            Start
          </Button>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Start Payflow (cannot modify anything after start)</Modal.Title>
            </Modal.Header>
            <Form>
              <Modal.Body>
              	<div> Begin Time	
                <DateTimePicker 
                  value={beginTime}
                  clearIcon={null} 
                  minDate={new Date()}
                  onChange={(e) => {
                    setBeginTime(e);
                  }} 
                />
                </div>
                <div> End Time	
                <DateTimePicker 
                  value={endTime}
                  clearIcon={null} 
                  minDate={new Date()} 
                  onChange={(e) => {
                    setEndTime(e);
                  }} 
                />
                </div>
                <FloatingLabel
                  controlId="inputReceiver"
                  label="Receiver"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    onChange={(e) => {
                        setReceiver(e.target.value);
                    }}
                  />
                </FloatingLabel>
                               <FloatingLabel
                  controlId="inputNOP"
                  label="Place holder"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    placeholder="Place holder"
                    onChange={(e) => {
                        setNumOfPay(e.target.value);

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
                  save(id, beginTime, endTime, parseInt(numofpay), receiver);
                  handleClose();
                }}
              >
                Start
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
    };
    
    StartPayflow.propTypes = {
      id:  PropTypes.string.isRequired,
      save: PropTypes.func.isRequired,
    };
    
    export default StartPayflow;
