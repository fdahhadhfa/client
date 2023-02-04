import React, { Component } from "react";

import API, {
  Product,
  getErrorMessage,
  ProductSet,
  PaymentProvider,
  defaultPaymentProvider,
  redirectToPaymentPage,
} from "../api/API";
import appContext from "../context/AppContext";
import { Cart, CartItem, toPurchaseEntries } from "../cart/Cart";
import { DataContextConsumer, DataContextAPI } from "../data/DataContext";
import PriceCalculator from "../common/PriceCalculator";
import CartEntry from "../CartEntry";
import TermsCheckbox from "../common/TermsCheckbox";

import "./MobileCart.css";

let savedState = {
  promoCode: "",
  email: "",
  termsAccepted: false,
  paymentProvider: defaultPaymentProvider,
};

type State = typeof savedState;

class MobileCart extends Component {
  state: State = { ...savedState, termsAccepted: false };

  render() {
    const { promoCode, email, termsAccepted } = this.state;

    return (
      <DataContextConsumer
        children={(ctx) => {
          const { items, entries } = this.getData(ctx);

          return (
            <PriceCalculator
              playerName="player"
              promoCode={""}
              items={items}
              products={ctx.products}
              children={(price) => {
                return (
                  <div className="mobile-cart animate__animated animate__fadeIn">
                    <div className="header">
                      <button
                        className="back"
                        onClick={() => appContext.setCartOpened(false)}
                      />

                      <h1>Корзина</h1>
                    </div>

                    <hr />

                    {entries.length === 0 ? (
                      <div className="empty-cart">В корзине нет товаров</div>
                    ) : (
                      entries
                    )}

                    <hr />

                    <button
                      className="buy"
                      disabled={items.length === 0}
                      onClick={() => this.onClick(price, items)}
                    >
                      Далее{price <= 0 ? "" : " (" + price + "₽)"}
                    </button>
                  </div>
                );
              }}
            />
          );
        }}
      />
    );
  }

  private getData(ctx: DataContextAPI) {
    let items = Cart.getItems();

    let entries: React.ReactElement[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const data =
        item.setId !== undefined
          ? ctx.sets[item.setId]
          : ctx.products[item.productId!];

      if (data === undefined) {
        // Product or set not found
        Cart.removeAllCartItems();
        return { items: [], entries: [] };
      }

      try {
        if (data.isProduct()) {
          (data as Product).getPrice(
            item.setting,
            item.multiplier,
            ctx.wholesaleDiscounts
          );
        } else {
          (data as ProductSet).getPrice(ctx.products);
        }
      } catch (e) {
        // Invalid entry
        Cart.removeAllCartItems();
        return { items: [], entries: [] };
      }

      entries.push(
        <CartEntry
          key={i}
          index={i}
          item={item}
          data={data}
          layout="MOBILE"
          onItemsUpdate={() => this.setState({})}
        />
      );
    }

    return { items: items, entries: entries };
  }

  private onClick(price: number, items: CartItem[]) {
    savedState = this.state;

    appContext.setCartOpened(false);

    appContext.setPaymentProviderSelectModalData({
      purchaseParams: {
        email: this.state.email,
        promoCode:
          this.state.promoCode === "" ? undefined : this.state.promoCode,
        entries: toPurchaseEntries(items),
      },
      price: price,
      onBack: () => {
        appContext.setCartOpened(true);
      },
    });
  }
}

export default MobileCart;
