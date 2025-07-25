import React from "react";
import "./CurrencyInput.css";

const CurrencyInput = ({ amount, selectedCurrency, onChangeAmount, onChangeCurrency, rates }) => {
  const formatAmount = (value) => {
    if (!value) return 0;
    return parseFloat(value).toFixed(2);
  };

  return (
    <div className="currency_container">
      <input
        className="currency_input"
        type="number"
        value={formatAmount(amount)}
        onChange={onChangeAmount}
      />
      <select
        className="currency_select"
        value={selectedCurrency}
        onChange={onChangeCurrency}
      >
        {Object.keys(rates).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyInput;
