import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import CurrencyInput from "./Components/CurrencyInput/CurrencyInput";
import { getRates } from "./Functions/utils";

function App() {
  const [rates, setRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState();

  useEffect(() => {
    getRates()
      .then((rates) => {
        setRates(rates);
        if (rates[fromCurrency] && rates[toCurrency]) {
          setToAmount((rates[toCurrency] / rates[fromCurrency]) * fromAmount);
        }
      })
      .catch((error) => console.log(error));
  }, [fromCurrency, toCurrency, fromAmount]);

  function onChangeFromAmount(e) {
    const newFromAmount = e.target.value;
    setFromAmount(newFromAmount);
    if (rates[fromCurrency] && rates[toCurrency]) {
      setToAmount((rates[toCurrency] / rates[fromCurrency]) * newFromAmount);
    }
  }

  function onChangeToAmount(e) {
    const newToAmount = e.target.value;
    setToAmount(newToAmount);
    if (rates[fromCurrency] && rates[toCurrency]) {
      setFromAmount((rates[fromCurrency] / rates[toCurrency]) * newToAmount);
    }
  }

  function onChangeFromCurrency(e) {
    const newFromCurrency = e.target.value;
    setFromCurrency(newFromCurrency);
    setFromAmount(1);
    if (rates[newFromCurrency] && rates[toCurrency]) {
      setToAmount((rates[toCurrency] / rates[newFromCurrency]) * 1);
    }
  }

  function onChangeToCurrency(e) {
    const newToCurrency = e.target.value;
    setToCurrency(newToCurrency);
    setToAmount(1); 
    if (rates[fromCurrency] && rates[newToCurrency]) {
      setFromAmount((rates[fromCurrency] / rates[newToCurrency]) * 1);
    }
  }

  return (
    <>
      <div className="block">
        <section className="block_section--left">
          <img
            className="block_img"
            alt="People holding euro and dollar coins and currency exchange "
            src="/currency-exchange.jpg"
          />
        </section>
        <section className="block_section--right">
          <div className="block_div">
            <Header />
            <CurrencyInput
              rates={rates}
              selectedCurrency={fromCurrency}
              amount={fromAmount}
              onChangeAmount={onChangeFromAmount}
              onChangeCurrency={onChangeFromCurrency}
            />
            <span className="currency_sign">=</span>
            <CurrencyInput
              rates={rates}
              selectedCurrency={toCurrency}
              amount={toAmount}
              onChangeAmount={onChangeToAmount}
              onChangeCurrency={onChangeToCurrency}
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
