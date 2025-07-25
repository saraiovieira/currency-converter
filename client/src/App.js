import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Header from "./Components/Header/Header";
import CurrencyInput from "./Components/CurrencyInput/CurrencyInput";
import { getRates } from "./Functions/utils";
import mockRates from "./Functions/mockRates";

function App() {
  const [rates, setRates] = useState({});
  const [currencies, setCurrencies] = useState({
    from: "USD",
    to: "EUR",
    amount: 1,
  });
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const convert = useCallback(
    (from, to, amount) => {
      if (!rates[from] || !rates[to]) return 0;
      return (rates[to] / rates[from]) * amount;
    },
    [rates]
  );

  const fetchRates = useCallback(
    async (retries = 3) => {
      try {
        const data = await getRates();
        setRates(data);
        setConvertedAmount(
          convert(currencies.from, currencies.to, currencies.amount)
        );
      } catch (err) {
        if (err.response?.status === 429) {
          console.warn("⚠️ API limit exceeded. Using mock data.");
          setRates(mockRates);
          setError("API limit reached — using temporary values.");
          setConvertedAmount(
            convert(currencies.from, currencies.to, currencies.amount)
          );
        } else if (retries > 0) {
          setTimeout(() => fetchRates(retries - 1), 3000);
        } else {
          setError("⚠️ Failed to load rates. Please refresh the page.");
        }
      } finally {
        setLoading(false);
      }
    },
    [convert, currencies.from, currencies.to, currencies.amount]
  );

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (rates[currencies.from] && rates[currencies.to]) {
      setConvertedAmount(
        convert(currencies.from, currencies.to, currencies.amount)
      );
    }
  }, [currencies, rates, convert]);

  function handleAmountChange(e) {
    const amount = e.target.value;
    setCurrencies((prev) => ({ ...prev, amount }));
  }

  function handleCurrencyChange(type, e) {
    const value = e.target.value;
    setCurrencies((prev) => ({
      ...prev,
      [type]: value,
      amount: 1,
    }));
  }

  function handleConvertedAmountChange(e) {
    const newToAmount = e.target.value;
    setConvertedAmount(newToAmount);
    if (rates[currencies.from] && rates[currencies.to]) {
      const newFromAmount =
        (rates[currencies.from] / rates[currencies.to]) * newToAmount;
      setCurrencies((prev) => ({ ...prev, amount: newFromAmount }));
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <div className="loading">⏳ Loading exchange rates...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="block">
      <section className="block_section--left">
        <img
          className="block_img"
          alt="People holding euro and dollar coins and currency exchange"
          src={`${process.env.PUBLIC_URL}/currency-exchange.jpg`}
        />
      </section>
      <section className="block_section--right">
        <div className="block_div">
          <Header />
          <CurrencyInput
            rates={rates}
            selectedCurrency={currencies.from}
            amount={currencies.amount}
            onChangeAmount={handleAmountChange}
            onChangeCurrency={(e) => handleCurrencyChange("from", e)}
          />
          <span className="currency_sign">=</span>
          <CurrencyInput
            rates={rates}
            selectedCurrency={currencies.to}
            amount={convertedAmount}
            onChangeAmount={handleConvertedAmountChange}
            onChangeCurrency={(e) => handleCurrencyChange("to", e)}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
