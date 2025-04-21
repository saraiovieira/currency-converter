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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRates = async (retries = 3) => {
    try {
      const data = await getRates();
      setRates(data);
      if (data[fromCurrency] && data[toCurrency]) {
        setToAmount((data[toCurrency] / data[fromCurrency]) * fromAmount);
      }
      setLoading(false);
    } catch (err) {
      if (retries > 0) {
        setTimeout(() => fetchRates(retries - 1), 3000);
      } else {
        setError("⚠️ Failed to load rates. Please refresh the page.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      setToAmount((rates[toCurrency] / rates[fromCurrency]) * fromAmount);
    }
  }, [fromCurrency, toCurrency, fromAmount, rates]);

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
            src={`${process.env.PUBLIC_URL}/currency-exchange.jpg`}
          />
        </section>
        <section className="block_section--right">
          {loading && (
            <div className="loading-container">
              <div className="loader"></div>
              <div className="loading">⏳ Loading exchange rates...</div>
            </div>
          )}
          {error && (
            <div className="error-container">
              <div className="error">{error}</div>
            </div>
          )}
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
