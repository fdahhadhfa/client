import React, { Component } from "react";

import appContext from "../context/AppContext";
import { Product, ProductSet, defaultPaymentProvider } from "../api/API";
import { Cart, CartItem, toPurchaseEntries } from "../cart/Cart";

import CartEntry from "../CartEntry";

import { DataContextAPI, DataContextConsumer } from "../data/DataContext";
import PriceCalculator from "../common/PriceCalculator";

import "./Modal.css";
import "./CartModal.css";

let savedState = {
  promoCode: "",
  email: "",
  termsAccepted: false,
  paymentProvider: defaultPaymentProvider,
};

type State = typeof savedState;

class CartModal extends Component {
  state: State = { ...savedState, termsAccepted: false };

  render() {
    const { promoCode, email, termsAccepted } = this.state;

    return (
      <DataContextConsumer
        children={(ctx) => {
          const { items, entries } = this.getData(ctx);

          return (
            <PriceCalculator
              playerName=""
              promoCode={""}
              items={items}
              products={ctx.products}
              children={(price) => {
                return (
                  <div className="modal cart-modal animate__animated animate__fadeIn">
                    <button
                      className="close"
                      onClick={() => appContext.setCartOpened(false)}
                    />

                    <h1>Корзина</h1>

                    <hr />

                    <div className="controls">
                      <button
                        className="buy"
                        disabled={items.length === 0}
                        onClick={() => this.onClick(price, items)}
                      >
                        Далее{price <= 0 ? "" : " (" + price + "₽)"}
                      </button>
                    </div>

                    {entries.length === 0 ? (
                      <div className="empty-cart">В корзине нет товаров</div>
                    ) : (
                      entries
                    )}

                    <hr className="last" />
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
          layout="DESKTOP"
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

export default CartModal;
