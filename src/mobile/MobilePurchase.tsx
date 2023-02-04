import React, { Component } from "react";

import API, {
  AbstractProduct,
  PurchaseProductEntry,
  getProductData,
  PaymentProvider,
  defaultPaymentProvider,
} from "../api/API";
import appContext from "../context/AppContext";
import { Cart } from "../cart/Cart";
import { millisToString } from "../util/TimeUtil";

import { DataContextConsumer } from "../data/DataContext";
import PriceCalculator from "../common/PriceCalculator";

import "./MobilePurchase.css";
import TermsCheckbox from "../common/TermsCheckbox";

let savedState = {
  promoCode: "",
  email: "",
  termsAccepted: false,
  paymentProvider: defaultPaymentProvider,
  setting: undefined as number | undefined,
};

type State = typeof savedState;

class MobilePurchase extends Component<{ product: AbstractProduct }> {
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

    return (
      <DataContextConsumer
        children={(ctx) => {
          return (
            <PriceCalculator
              playerName="player"
              promoCode={promoCode}
              items={[item]}
              products={ctx.products}
              children={(price) => {
                return (
                  <div className="mobile-purchase animate__animated animate__fadeIn">
                    <div className="header">
                      <img
                        src="/assets/close.png"
                        className="close"
                        style={{ height: "40px", width: "40px" }}
                        onClick={() => appContext.setOpenedProduct(undefined)}
                      />

                      <h1>{this.props.product.name}</h1>

                      <button
                        className="cart"
                        onClick={() =>
                          Cart.addCartItem(
                            Cart.createCartItem(this.props.product)
                          )
                        }
                      >
                        +<img src="/assets/cart.png" />
                      </button>
                    </div>

                    <hr />

                    {settings.length > 0 ? (
                      <div>
                        <div className="settings">
                          {settings.map((d) => (
                            <button
                              key={d}
                              className={d === setting ? "active" : ""}
                              onClick={() => {
                                this.setState({ setting: d });
                              }}
                            >
                              {isDuration ? millisToString(d) : d}
                            </button>
                          ))}
                        </div>

                        <hr />
                      </div>
                    ) : null}

                    <hr />

                    <button
                      className="buy"
                      disabled={false}
                      onClick={() => this.onClick(price)}
                    >
                      Далее ({price} ₽)
                    </button>

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

export default MobilePurchase;
