import React, { Component } from "react";
import { defaultPaymentProvider, Products, Sets } from "../api/API";
import { CartItem, toPurchaseEntries } from "../cart/Cart";
import PriceCalculator from "../common/PriceCalculator";
import TermsCheckbox from "../common/TermsCheckbox";
import appContext from "../context/AppContext";
import { DataContextConsumer } from "../data/DataContext";
import "./PurchaseConfirmationModal.css";

let savedState = {
  promoCode: "",
  email: "",
  termsAccepted: false,
  paymentProvider: defaultPaymentProvider,
};

type State = typeof savedState;

class PurchaseConfirmationModal extends Component<{
  purchasedProducts: CartItem[];
}> {
  state: State = { ...savedState, termsAccepted: false };

  render() {
    const { promoCode, email, termsAccepted } = this.state;

    return (
      <DataContextConsumer
        children={(ctx) => {
          return (
            <PriceCalculator
              playerName="player"
              promoCode={promoCode}
              items={this.props.purchasedProducts}
              products={ctx.products}
              children={(price) => (
                <div className="modal purchase-confirmation-modal animate__animated animate__fadeIn">
                  <button
                    className="close"
                    onClick={() => appContext.setPurchasedProducts(undefined)}
                  />

                  <h1>Покупка</h1>

                  <hr />

                  <div className="products">
                    <p>Товары:</p>
                    <p>{this.formatProductList(ctx.products, ctx.sets)}</p>
                  </div>

                  <hr />

                  <div className="controls">
                    <button
                      className="buy"
                      disabled={false}
                      onClick={() => this.onClick(price)}
                    >
                      Далее {price <= 0 ? "" : ` (${price} ₽)`}
                    </button>
                  </div>

                  <hr className="last" />
                </div>
              )}
            />
          );
        }}
      />
    );
  }

  private formatProductList(products: Products, sets: Sets) {
    return this.props.purchasedProducts
      .map((e) => {
        let name =
          e.productId !== undefined
            ? products[e.productId].name
            : sets[e.setId!].name;

        if (e.setting !== undefined) {
          if (e.setting > 0 && e.setting < 1000) {
            name += ` (${e.setting})`;
          } else {
            name +=
              e.setting == -1
                ? " (навсегда)"
                : ` (${e.setting / 24 / 60 / 60} д.)`;
          }
        }

        if (e.multiplier !== 1) {
          name += ` (${e.multiplier} шт.)`;
        }

        return name;
      })
      .join(", ");
  }

  private onClick(price: number) {
    savedState = this.state;

    const prevProducts = appContext.purchasedProducts!;

    appContext.setPurchasedProducts(undefined);

    appContext.setPaymentProviderSelectModalData({
      purchaseParams: {
        email: this.state.email,
        promoCode:
          this.state.promoCode === "" ? undefined : this.state.promoCode,
        entries: toPurchaseEntries(this.props.purchasedProducts),
      },
      price: price,
      onBack: () => {
        appContext.setPurchasedProducts(prevProducts);
      },
    });
  }
}

export default PurchaseConfirmationModal;
