import './index.css';
import React, { useState } from 'react';

export default function App() {
  return (
    <div>
      <TipCalculator />
    </div>
  );
}

function TipCalculator() {
  const [bill, setBill] = useState('');
  const [percentage1, setPercentage1] = useState('0');
  const [percentage2, setPercentage2] = useState('0');

  const calculateTotal = () => {
    const billValue = parseFloat(bill);
    if (isNaN(billValue)) return 0;
    const friendsTip = parseFloat(percentage1);
    const yourTip = parseFloat(percentage2);
    const averageTip = (friendsTip + yourTip) / 2;
    const tipAmount = (billValue * averageTip) / 100;
    return { total: (billValue + tipAmount).toFixed(2), tip: tipAmount.toFixed(2) };
  };

  const resetForm = () => {
    setBill('');
    setPercentage1('0');
    setPercentage2('0');
  };

  const { total, tip } = calculateTotal();

  return (
    <div>
      <BillInput bill={bill} onSetBill={setBill} />
      <SelectPercentage
        percentage={percentage1}
        setSelect={setPercentage1}
      >
        How did your friend like the service?
      </SelectPercentage>
      <SelectPercentage
        percentage={percentage2}
        setSelect={setPercentage2}
      >
        How did you like the service?
      </SelectPercentage>
      <Output total={total} bill={bill} tip={tip} />
      <Reset resetForm={resetForm} />
    </div>
  );
}

function BillInput({ bill, onSetBill }) {
  return (
    <div>
      <label>How much was the bill?</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => onSetBill(e.target.value)}
        placeholder="Enter the bill amount"
      />
    </div>
  );
}

function SelectPercentage({ percentage, setSelect, children }) {
  return (
    <div>
      <label>{children}</label>
      <select value={percentage} onChange={(e) => setSelect(Number(e.target.value))}>
        <option value="0">Dissatisfied (0%)</option>
        <option value="5">It was okay (5%)</option>
        <option value="10">It was good (10%)</option>
        <option value="20">Absolutely Amazing (20%)</option>
      </select>
    </div>
  );
}

function Output({ total, bill, tip }) {
  return (
    <div>
      <h3>
        You pay <strong>${total}</strong> (<strong>${bill || 0}</strong> + <strong>${tip}</strong> tip)
      </h3>
    </div>
  );
}

function Reset({ resetForm }) {
  return (
    <button onClick={resetForm}>
      Reset
    </button>
  );
}
