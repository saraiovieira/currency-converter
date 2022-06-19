import React, { useEffect, useState } from "react";
import "./CurrencyInput.css";

const CurrencyInput = (props) => {
  const [rates, setRates] = useState([]);

  useEffect(() => {
    setRates(props.rates);
  }, [props.rates]);

  function countDecimals(n) {
    let n2 = String(n);
    if (n2.includes(".")) {
      return n2.split(".")[1].length;
    }
    return 0;
  }

  function getOnly2Decimals(n) {
    if (n === undefined) {
      return 0;
    } else if (countDecimals(n) > 0) {
      return parseFloat(n).toFixed(2);
    } else {
      return n;
    }
  }

  return (
    <div className="currency_container">
      <input
        className="currency_input"
        type="number"
        value={getOnly2Decimals(props.amount)}
        onChange={props.onChangeAmount}
      />
      <select
        className="currency_select"
        value={props.selectedCurrency}
        onChange={props.onChangeCurrency}
      >
        {Object.keys(rates).map((rate) => {
          return (
            <option key={rate} value={rate}>
              {rate}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default CurrencyInput;