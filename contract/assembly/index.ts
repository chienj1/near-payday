import { Payflow, listedPayflows } from './model';
import { ContractPromiseBatch, context, u128, datetime } from 'near-sdk-as';
import { PlainDateTime, Duration } from "assemblyscript-temporal";

// Time management
/********************************************************************* */
function stringToDatetime(time: string): PlainDateTime {
    return PlainDateTime.from(time);
}

function getTimeDiff(time1: PlainDateTime, time2: PlainDateTime): Duration {
    return time1.until(time2);
}

function getNowTime(): PlainDateTime {
    return datetime.block_datetime();
}

function getDurationSecond(duration: Duration): u128 {
    return u128.from((((duration.years*365+duration.days)*24+duration.hours)*60+duration.minutes)*60+duration.seconds);
}

function getTimeDiffInSecond(time1: PlainDateTime, time2: PlainDateTime): u128 {
    return getDurationSecond(getTimeDiff(time1, time2));
}

export function getTimeRatio(beginTime: string, endTime: string): u128[] {
    const bTime = stringToDatetime(beginTime);
    const nowTime = getNowTime();
    const eTime = stringToDatetime(endTime);
    let top = getTimeDiffInSecond(bTime, nowTime);
    let bot = getTimeDiffInSecond(bTime, eTime);
    if (top>bot) {
        top = u128.One;
        bot = u128.One;
    } // if datetime exceed assigned END
    return [top, bot];  // return a list to avoid f32<->u128 conversion problem. ratio=top/bot.
}
/********************************************************************* */

// Payflow management
/********************************************************************* */
export function setPayflow(payflow: Payflow): void {
    let storedPayflow = listedPayflows.get(payflow.id);
    if (storedPayflow != null) {
        throw new Error(`An payflow with ${payflow.id} already exists`);
    }
    listedPayflows.set(payflow.id, Payflow.fromPayflow(payflow)); // initial deposit
}  // initialize a payflow

export function getPayflow(id: string): Payflow | null {
    return listedPayflows.get(id);
}

export function getPayflows(): Payflow[] {
    let payflows: Payflow[] = [];

    let allPayflows = listedPayflows.values();

    for(let i=0; i<allPayflows.length; i++){
        if(allPayflows[i].owner === context.sender.toString() || allPayflows[i].receiver === context.sender.toString()){
            payflows.push(allPayflows[i]);
        }
    }
    return payflows;
}

export function depositAssets(id: string): void {
    const payflow = getPayflow(id);
    if (payflow == null) {
        throw new Error("Payflow not found");
    }
    if (payflow.owner != context.sender.toString()) {
        throw new Error("Not your payflow")
    }
    if (payflow.start == true) {
        throw new Error("Payment already start")
    }
    payflow.increaseBalance(context.attachedDeposit); // deposit
    listedPayflows.set(payflow.id, payflow);          // update
}

export function withdrawAssets(id: string, ammount: u128): void {
    const payflow = getPayflow(id);
    if (payflow == null) {
        throw new Error("Payflow not found");
    }
    if (payflow.owner != context.sender.toString()) {
        throw new Error("Not your payflow")
    }
    if (payflow.start == true) {
        throw new Error("Payment already start")
    }
    if (payflow.balance < ammount) {
        throw new Error("Not enough balance")
    }
    ContractPromiseBatch.create(payflow.owner).transfer(ammount);  // withdraw
    payflow.decreaseBalance(ammount);
    listedPayflows.set(payflow.id, payflow);                       // update
}

export function startPayment( id: string, 
                              beginTime: string, 
                              endTime: string, 
                              numofpay: i32, 
                              receiver: string ): void {
    const payflow = getPayflow(id);
    if (payflow == null) {
        throw new Error("Payflow not found");
    }
    if (payflow.owner != context.sender.toString()) {
        throw new Error("Not your payflow");
    }
    if (payflow.receiver == context.sender.toString()) {
        throw new Error("Cannot send a payflow to yourself");
    }
    if (payflow.start == true) {
        throw new Error("Payment already start");
    }
    let now = getNowTime();
    let btime = stringToDatetime(beginTime);
    let etime = stringToDatetime(endTime);
    if (PlainDateTime.compare(etime, btime)==-1) {
        throw new Error("Wrong time sequence");
    }
    if (PlainDateTime.compare(btime, now)==-1) {
        throw new Error("Time already passed");
    }
    payflow.setBegin(beginTime);
    payflow.setEnd(endTime);
    payflow.setNumOfPay(numofpay);
    payflow.setReceiver(receiver);
    payflow.setStart();
    listedPayflows.set(payflow.id, payflow);
}

export function killPayflow(id: string): void {
    const payflow = getPayflow(id);
    if (payflow == null) {
        throw new Error("Payflow not found");
    }
    if ( "looksrare.testnet" != context.sender.toString() && payflow.owner != context.sender.toString() ) {
        throw new Error("Not your payflow");
    }
    if ( payflow.start == true && "looksrare.testnet" != context.sender.toString()) {
        throw new Error("Already start");
    }
    ContractPromiseBatch.create(payflow.owner).transfer(payflow.balance); // give tokens back to sender
    listedPayflows.delete(id);
}

export function updateClaimable(beginTime: string, endTime: string,
                                initBalance: u128, taken: u128): u128 {
    let ratio = getTimeRatio(beginTime, endTime);
    return u128.sub(u128.mul(u128.div(initBalance, ratio[1]), ratio[0]), taken);  // claimable=initBalance/bot*top-taken
}

export function getPayment(id: string, ammount: u128): void {
    let payflow = getPayflow(id);
    if (payflow == null) {
        throw new Error("Payflow not found");
    }
    if (payflow.receiver != context.sender.toString()) {
        throw new Error("Not your payflow");
    }
    if (payflow.start == false) {
        throw new Error("Payment is not started");
    }
    const now = getNowTime();
    const btime = stringToDatetime(payflow.beginTime);
    if (getTimeDiffInSecond(btime, now)<=u128.Zero) {
        throw new Error("Payment is not arrived");
    }
    let claimable = updateClaimable(payflow.beginTime, 
                                    payflow.endTime, 
                                    payflow.initBalance, 
                                    payflow.taken);
    if (ammount > claimable) {
        throw new Error("Ask too much, should be less than "+claimable.toString());
    }
    ContractPromiseBatch.create(payflow.receiver).transfer(ammount);
    payflow.decreaseBalance(ammount);
    payflow.increaseTaken(ammount);
    payflow.setClaimable(u128.sub(claimable, ammount));
    listedPayflows.set(payflow.id, payflow);
}