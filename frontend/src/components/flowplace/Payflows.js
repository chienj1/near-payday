import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddPayflow from "./AddPayflow";
import Payflow from "./Payflow";
import Loader from "../utils/Loader";
import { Row } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  createPayflow,
  getPayflows as getPayflowList,
  depositAssets,
  withdrawAssets,
  updateClaimable,
  getPayment,
  killPayflow
} from "../../utils/flowplace";




const Payflows = () => {
  const [payflows, setPayflows] = useState([]);
  const [loading, setLoading] = useState(false);

  const getPayflows = useCallback( async () => {
      try {
        setLoading(true);
        setPayflows(await getPayflowList());
      } catch (error) {
        console.log({ error });
      } finally {
        setLoading(false);
      }
    }
  );

  const addPayflow = async (data, deposit) => {
    try {
      createPayflow(data, deposit).then((resp) => { getPayflows(); });
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  }

  const addMorePay = async (id, deposit) => {
    try {
      setLoading(true);
      await depositAssets(id, deposit).then((resp) => { getPayflows(); });
      toast(<NotificationSuccess text="Deposit successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Deposit failed." />);
    } finally {
      setLoading(false);
    }
  }

  const reducePay = async (id, ammount) => {
    try {
      await withdrawAssets(id, ammount).then((resp) => { getPayflows(); });
      toast(<NotificationSuccess text="Withdraw successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Withdraw failed" />);
    } finally {
      setLoading(false);
    }
  }

  const updatePayflowInfo = async (id) => {
    try {
      await updateClaimable(id).then((resp) => { getPayflows(); });
      toast(<NotificationSuccess text="...." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="...." />);
    } finally {
      setLoading(false);
    }
  }

  const receivePayflow = async (id, ammount) => {
    try {
      await getPayment(id, ammount).then((resp) => { getPayflows(); });
      toast(<NotificationSuccess text="...." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="...." />);
    } finally {
      setLoading(false);
    }
  }

  const removePay = async (id) =>{
    try {
      await killPayflow(id).then((resp) => { getPayflows(); });
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="...." />);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getPayflows(); }, []);

  return (
    <>
      {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">Near PayDay</h1>
              <AddPayflow save={addPayflow} />
            </div>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
              {payflows.map((_payflow) => (
                <Payflow payflow={{ ..._payflow, }}
                         deposit={addMorePay}
                         withdraw={reducePay}
                         update={updatePayflowInfo}
                         getpay={receivePayflow}
                         killpay={removePay}
                />
              ))}
            </Row>
          </>
        ) : (
              <Loader />
            )
      }
    </>
  );

}

export default Payflows;
