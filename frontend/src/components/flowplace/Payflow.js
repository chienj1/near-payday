import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Stack } from "react-bootstrap";
import StartPayflow from "./StartPayflow";
import InputAmmount from "./InputAmmount";
import { startPayment, getPayflows } from "../../utils/flowplace";
import { formatNearAmount } from "near-api-js/lib/utils/format";


const Payflow = ({ payflow, deposit, withdraw, update, getpay, killpay }) => {
  const { id, beginTime, endTime, nouse, receiver, owner, 
          balance, initBalance, claimable, taken, start } = payflow;

  const account = window.walletConnection.account();
  const youIsSend = owner === account.accountId;
  const youIsReceive = receiver === account.accountId;
  

  const triggerKillPay  = () => { killpay(id) }; 
  
  const enablePayment = async (id, beginTime, endTime, numofpay, receiver) => {
    startPayment(id, beginTime, endTime, numofpay, receiver).then((resp) => { getPayflows(); });
  } 

  var [estclaim, estimateClaimable] = useState(0); 

  function getConfinedRatio () {
    var btime = new Date(beginTime).getTime();
    var etime = new Date(endTime).getTime();
    var nowtime = new Date().getTime();
                                
    var ratio = ((nowtime-btime)/(etime-btime));
    var confined_ratio = Math.min(1, Math.max(ratio, 0));
    return confined_ratio;
  }

  return (
    <>
    { youIsSend || youIsReceive ? (
      <Col>
        <Card className=" h-100" >
          <Card.Header>
            <Stack direction="horizontal" gap={3}>
              <div>
                <Button
                  onClick={triggerKillPay}
                  variant="dark"
                  className="rounded-pill px-0"
                  style={{ width: "36px" }}
                >
                  x
                </Button>
              </div>
              <div>From: {owner}</div>
            </Stack>      
          </Card.Header>
          <Card.Body className="d-flex  flex-column text-center">
            <Card.Title>To: {receiver || "Not set yet"}</Card.Title>
            <Card.Text className="flex-grow-1">
              <div>balance: {formatNearAmount(balance) || "null"} Near</div>
              <div><hr /></div>
              <div>begin at: {beginTime? new Date(beginTime).toString() : "Not set yet"}</div>
              <div>⇩</div>
              <div>end at: {endTime? new Date(endTime).toString() : "Not set yet"}</div>
              <div>{getConfinedRatio()*100*start} %</div>
              <div><hr /></div>
              { start ? (<div>
                            <div>initBalance: {formatNearAmount(initBalance)} Near</div>
                            <div>claimable: {formatNearAmount(claimable)} Near</div>
                            <div>est. claimable: {estclaim} Near {' '}
                              <Button 
                                disabled={balance!=0}
                                variant="primary"
                                size="sm"
                                onClick={ ()=> {
                                  var confined_ratio = getConfinedRatio();
                                  var est = initBalance*confined_ratio-taken;
                 	           estimateClaimable(est/1.0e+24);                                                             
                              }}>
                                estimate
                              </Button>
                            </div>
                            <div>claimed: {formatNearAmount(taken)} Near</div>
                        </div>) : (null) }
            </Card.Text>
            { !start ? (<div>
              <InputAmmount 
                id={id} 
                save={withdraw} 
                description={"Withdraw"} 
                enable={true} 
                label={"max: "+(balance/1.0e+24).toString()+" N"}/>
              <InputAmmount 
                id={id} 
                save={deposit} 
                description={"Deposit"} 
                enable={true} 
                label={"ammount"}/>
              <StartPayflow id={id} save={enablePayment}/>
            </div>) : (<div>
              <InputAmmount 
                id={id} 
                save={getpay} 
                description={"Claim"} 
                label={"max: "+(estclaim).toString()+" N"} 
                enable={balance!=0} />
            </div>)}
          </Card.Body>
        </Card>
      </Col>) : (
        <span></span>
      )
    }
    </>
  );
};

Payflow.propTypes = {
  payflow: PropTypes.instanceOf(Object).isRequired,
  deposit: PropTypes.func.isRequired,
  withdraw: PropTypes.func.isRequired, 
  getpay: PropTypes.func.isRequired,
  killpay: PropTypes.func.isRequired
};

export default Payflow;
