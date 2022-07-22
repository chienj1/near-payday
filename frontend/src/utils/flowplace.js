import { v4 as uuid4 } from "uuid";
import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function createPayflow(payflow, deposit) {
    payflow.id = uuid4();
    return window.contract.setPayflow({ payflow }, GAS, parseNearAmount(deposit+""));
  }
  
export function getPayflows() {
  return window.contract.getPayflows();
}

export async function depositAssets(id, deposit) {
  await window.contract.depositAssets({ id: id }, GAS, parseNearAmount(deposit+""));
}

export async function withdrawAssets(id, ammount) {
    await window.contract.withdrawAssets({ id: id, ammount: parseNearAmount(ammount+"") }, GAS);
}

export async function startPayment(id, beginTime, endTime, numofpay, receiver) {
    await window.contract.startPayment({ id: id, 
                                  beginTime: beginTime, 
                                    endTime: endTime, 
                                   numofpay: numofpay, 
                                   receiver: receiver }, GAS);
}

export async function updateClaimable(id) {
    await window.contract.updateClaimable({ id: id }, GAS);
}

export async function getPayment(id, ammount) {
    await window.contract.getPayment({ id: id, ammount: parseNearAmount(ammount+"") }, GAS);
}

export async function killPayflow( id ) {
  await window.contract.killPayflow({ id: id }, GAS);
}