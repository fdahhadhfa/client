import React, { Component } from "react";

import {
  AbstractProduct,
  getProductData,
  defaultPaymentProvider,
  PurchaseProductEntry,
} from "../api/API";
import { millisToString } from "../util/TimeUtil";
import appContext from "../context/AppContext";

import { DataContextConsumer } from "../data/DataContext";
import PriceCalculator from "../common/PriceCalculator";
import { Cart } from "../cart/Cart";

import "./Modal.css";
import "./PurchaseModal.css";

let savedState = {
  promoCode: "",
  email: "",
  termsAccepted: false,
  paymentProvider: defaultPaymentProvider,
  setting: undefined as number | undefined,
};

type State = typeof savedState;

class PurchaseModal extends Component<{ product: AbstractProduct }> {
  state: State = { ...savedState, termsAccepted: false };

  render() {
    const { promoCode, email, termsAccepted } = this.state;

    const item = Cart.createCartItem(this.props.product);
    item.setting = this.state.setting;
    item.multiplier = 1;

    const { settings, setting, isDuration } = getProductData(
      this.props.product,
      this.state.setting
    );

    // Если настройка только одна, то выбирать по сути и нечего
    const displaySettings = settings.length > 1;

    return (
      <DataContextConsumer
        children={(ctx) => {
          return (
            <PriceCalculator
              playerName=""
              promoCode={""}
              items={[item]}
              products={ctx.products}
              children={(price) => {
                return (
                  <div
                    className={
                      "modal purchase-modal animate__animated animate__fadeIn" +
                      (displaySettings ? "" : " no-settings")
                    }
                  >
                    <button
                      className="close"
                      onClick={() => appContext.setOpenedProduct(undefined)}
                    />

                    <h1>{this.props.product.name}</h1>

                    <hr />

                    <div className="first">
                      {displaySettings ? (
                        <div>
                          {settings.map((d) => (
                            <button
                              key={d}
                              className={
                                d === setting ? "setting active" : "setting"
                              }
                              onClick={() => {
                                this.setState({ setting: d });
                              }}
                            >
                              {isDuration ? millisToString(d) : d}
                            </button>
                          ))}
                        </div>
                      ) : null}

                      <button
                        className="buy"
                        onClick={() => this.onClick(price)}
                      >
                        Далее ({price} ₽)
                      </button>
                    </div>

                    <hr />

                    <div className="desc">
                      <h3>📜 Описание:</h3>

                      {this.props.product.fullDescription
                        .split("\n")
                        .map((line) => line.replace("{setting}", "" + setting))
                        .map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                    </div>
                  </div>
                );
              }}
            />
          );
        }}
      />
    );
  }

  private getCartItem() {
    const item = Cart.createCartItem(this.props.product);
    item.setting = this.state.setting;
    item.multiplier = 1;
    return item;
  }

  private onClick(price: number) {
    savedState = this.state;

    const entries: PurchaseProductEntry[] = [];

    if (this.props.product.isProduct()) {
      entries.push({
        productId: this.props.product.id,
        setting: getProductData(this.props.product, this.state.setting).setting,
        multiplier: 1,
      });
    } else {
      entries.push({ setId: this.props.product.id, multiplier: 1 });
    }

    const prevProduct = appContext.openedProduct;

    appContext.setOpenedProduct(undefined);

    appContext.setPaymentProviderSelectModalData({
      purchaseParams: {
        email: this.state.email,
        promoCode:
          this.state.promoCode === "" ? undefined : this.state.promoCode,
        entries: entries,
      },
      price: price,
      onBack: () => {
        appContext.setOpenedProduct(prevProduct);
      },
    });
  }
}

export default PurchaseModal;
