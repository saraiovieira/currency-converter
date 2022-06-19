import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import CurrencyInput from "./Components/CurrencyInput/CurrencyInput";
import { getRates } from "./Functions/utils";

function App() {
  const [rates, setRates] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [fromAmount, setFromAmount] = useState();
  const [toAmount, setToAmount] = useState();

  function onChangeFromAmount(e) {
    setFromAmount(e.target.value);
    setToAmount((rates[toCurrency] / rates[fromCurrency]) * e.target.value);
  }

  function onChangeToAmount(e) {
    setToAmount(e.target.value);
    setFromAmount((rates[fromCurrency] / rates[toCurrency]) * e.target.value);
  }

  function onChangeFromCurrency(e) {
    setFromCurrency(e.target.value);
    setFromAmount(1);
    setToAmount((1 / rates[e.target.value]) * rates[toCurrency]);
  }

  function onChangeToCurrency(e) {
    setToCurrency(e.target.value);
    setToAmount(1);
    setFromAmount((1 / rates[e.target.value]) * rates[fromCurrency]);
  }

  useEffect(() => {
    getRates()
      .then((rates) => {
        setRates(rates);
        setFromCurrency(Object.keys(rates)[0]);
        setToCurrency(Object.keys(rates)[1]);
      })
      .catch((error) => console.log(error));
  }, []);

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
