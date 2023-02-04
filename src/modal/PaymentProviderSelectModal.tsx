import React, { Component } from "react";
import API, {
  getErrorMessage,
  PaymentProvider,
  redirectToPaymentPage,
  PurchaseProductEntry,
  AbstractProduct,
} from "../api/API";
import appContext from "../context/AppContext";
import { DataContextConsumer } from "../data/DataContext";
import "./PaymentProviderSelectModal.css";
import { Redirect, useHistory } from "react-router-dom";
import { config } from "../config";

export type PaymentProviderSelectModalData = {
  purchaseParams: {
    email: string;
    promoCode?: string;
    entries: PurchaseProductEntry[];
  };
  price: number;
  onBack: () => void;
};

type PaymentType = {
  id: string;
  name: string;
  provider: PaymentProvider;
};

const paymentTypes: PaymentType[] = [
  { id: "qiwi", name: "QIWI", provider: PaymentProvider.QIWI },
  { id: "card", name: "КАРТА", provider: PaymentProvider.CARD },
];

class PaymentProviderSelectModal extends Component<{
  data: PaymentProviderSelectModalData;
}> {
  state = {
    paymentType: paymentTypes[0] as PaymentType,
  };

  render() {
    const { data } = this.props;

    return (
      <DataContextConsumer
        children={(ctx) => {
          return (
            <div className="modal payment-provider-select-modal animate__animated animate__fadeIn">
              <button
                className="close"
                onClick={() =>
                  appContext.setPaymentProviderSelectModalData(undefined)
                }
              />

              <h1>Способы оплаты</h1>

              <hr />

              <div className="sides">
                <div className="left">
                  <p>Товары:</p>
                  <p className="primary">
                    {this.props.data.purchaseParams.entries.map((e, i) => {
                      let product: AbstractProduct;

                      if (e.setId !== undefined) {
                        product = ctx.sets[e.setId!];
                      } else {
                        product = ctx.products[e.productId!];
                      }

                      return (
                        <div key={i}>
                          - {product.name} x{e.multiplier}
                        </div>
                      );
                    })}
                  </p>
                  <p>Проверь введённые данные.</p>
                  <p>
                    Если всё верно — выбери удобный тебе способ оплаты. После
                    оплаты покупка будет выдана в течение 30 сек.
                  </p>
                </div>

                <div className="right">
                  {paymentTypes.map((t) => (
                    <div
                      key={t.id}
                      className={
                        t.id === this.state.paymentType.id ? "selected" : ""
                      }
                      onClick={() => this.setState({ paymentType: t })}
                    >
                      <img
                        src={
                          "/payment_type_icons/" +
                          t.id +
                          "_" +
                          (t.id === this.state.paymentType.id ? "1" : "0") +
                          ".png"
                        }
                        alt={t.name}
                        title={t.name}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="controls">
                <button
                  className="back"
                  onClick={() => {
                    appContext.setPaymentProviderSelectModalData(undefined);

                    this.props.data.onBack();
                  }}
                >
                  Назад
                </button>
                <button className="buy" onClick={(e) => this.onClick(e)}>
                  Оплатить {this.state.paymentType.name}:{" "}
                  {this.props.data.price}₽
                </button>
              </div>

              <hr className="last" />
            </div>
          );
        }}
      />
    );
  }

  private onClick(e: any) {
    const params = this.props.data.purchaseParams;

    const button = e.target as any;

    button.disabled = true;

    let productIds = "";
    for (let i = 0; i < params.entries.length; i++) {
      productIds +=
        params.entries[i].productId +
        `${i + 1 !== params.entries.length ? ":" : ""}`;
    }

    API.new_payment(this.props.data.price, productIds, (resp) => {
      if (resp.error) return;

      const paymentType = this.state.paymentType.id;
      window.location.href = `https://oplata.qiwi.com/create?publicKey=${
        config.qiwi.public_key
      }&amount=${this.props.data.price}&successUrl=${
        config.domain
      }/paymentStatus/success?type=${"tariff"}?amount=${
        this.props.data.price
      }?id=${`${Math.random()}`.slice(2)}&customFields[paySourcesFilter]=${
        paymentType == "card" ? "card" : "qw,mobile"
      }`;
    });
  }
}

export default PaymentProviderSelectModal;
