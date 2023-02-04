import React, { Component } from "react";

import { CartItem } from "../cart/Cart";
import API, { Product, ProductSet, Products, applyDiscount } from "../api/API";
import { DataContextConsumer } from "../data/DataContext";

type State = {
  surchargeDiscount: number;
  unbanPrice: number;
  unmutePrice: number;
  accountRecoveryPrice: number;
  promoCodeDiscount: { discount: number; percent: boolean };
};

type Props = {
  playerName: string;
  promoCode: string;
  items: CartItem[];
  products: Products;
  children: (price: number) => any;
};

class PriceCalculator extends Component<Props> {
  state: State = {
    surchargeDiscount: 0,
    unbanPrice: 0,
    unmutePrice: 0,
    accountRecoveryPrice: 0,
    promoCodeDiscount: { discount: 0, percent: false },
  };

  componentDidMount() {
    this.updateSurchargeDiscount(this.props.products);
    this.updatePrices();
    this.updatePromoCodeDiscount();
  }

  componentDidUpdate(prevProps: Props) {
    const itemsEq = itemsEqual(prevProps.items, this.props.items);

    if (prevProps.playerName !== this.props.playerName || !itemsEq) {
      this.updateSurchargeDiscount(this.props.products);
      this.updatePrices();
    }

    if (prevProps.promoCode !== this.props.promoCode || !itemsEq) {
      this.updatePromoCodeDiscount();
    }
  }

  render() {
    return (
      <DataContextConsumer
        children={(ctx) => {
          let price = 0;

          for (let i = 0; i < this.props.items.length; i++) {
            const item = this.props.items[i];

            const data =
              item.setId !== undefined
                ? ctx.sets[item.setId]
                : ctx.products[item.productId!];

            if (data === undefined) {
              continue;
            }

            try {
              if (data.id === "unban") {
                price += this.state.unbanPrice;
              } else if (data.id === "unmute") {
                price += this.state.unmutePrice;
              } else if (data.id === "auth_recover") {
                price += this.state.accountRecoveryPrice;
              } else {
                price += data.isProduct()
                  ? (data as Product).getPrice(
                      item.setting,
                      item.multiplier,
                      ctx.wholesaleDiscounts
                    )
                  : (data as ProductSet).getPrice(ctx.products);
              }
            } catch (e) {
              console.log(e);
            }
          }

          price -= this.state.surchargeDiscount;

          if (this.state.promoCodeDiscount.discount > 0) {
            if (this.state.promoCodeDiscount.percent) {
              price = applyDiscount(
                price,
                this.state.promoCodeDiscount.discount
              );
            } else {
              price = Math.max(
                1,
                price - this.state.promoCodeDiscount.discount
              );
            }
          }

          return this.props.children(price);
        }}
      />
    );
  }

  private requestCounter: number = 1;

  private updateSurchargeDiscount(products: { [key: string]: Product }) {
    if (this.props.playerName === "") {
      this.setState({ surchargeDiscount: 0 });
      return;
    }

    const getSetting = (item: CartItem) =>
      item.setting === undefined
        ? products[item.productId!].settings[0]
        : item.setting;

    const ids = this.props.items
      .filter((e) => e.setId !== undefined || getSetting(e) === -1)
      .map((e) => (e.setId || e.productId)!);

    if (ids.length === 0) {
      this.setState({ surchargeDiscount: 0 });
      return;
    }

    const counterValue = ++this.requestCounter;

    API.getSurchargeDiscount(this.props.playerName, ids, (response) => {
      if (this.requestCounter !== counterValue) {
        return;
      }

      if (response.response) {
        this.setState({ surchargeDiscount: response.response.discount });
      }
    });
  }

  private updatePrices() {
    if (this.props.playerName !== "") {
      this.updateUnbanPrice();
      this.updateUnmutePrice();
      this.updateAccountRecoveryPrice();
    }
  }

  private updateUnbanPrice() {
    if (this.props.items.findIndex((i) => i.productId === "unban") === -1) {
      return;
    }

    const name = this.props.playerName;

    API.getUnbanPrice(name, (response) => {
      if (this.props.playerName !== name) {
        return;
      }

      if (response.response) {
        this.setState({ unbanPrice: response.response.price });
      }
    });
  }

  private updateUnmutePrice() {
    if (this.props.items.findIndex((i) => i.productId === "unmute") === -1) {
      return;
    }

    const name = this.props.playerName;

    API.getUnmutePrice(name, (response) => {
      if (this.props.playerName !== name) {
        return;
      }

      if (response.response) {
        this.setState({ unmutePrice: response.response.price });
      }
    });
  }

  private updateAccountRecoveryPrice() {
    if (
      this.props.items.findIndex((i) => i.productId === "auth_recover") === -1
    ) {
      return;
    }

    const name = this.props.playerName;

    API.getAccountRecoveryPrice(name, (response) => {
      if (this.props.playerName !== name) {
        return;
      }

      if (response.response) {
        this.setState({ accountRecoveryPrice: response.response.price });
      }
    });
  }

  private updatePromoCodeDiscount() {
    if (this.props.promoCode === "") {
      return;
    }

    const code = this.props.promoCode;

    API.getPromoCodeDiscount(code, (response) => {
      if (this.props.promoCode !== code) {
        return;
      }

      if (response.response) {
        this.setState({ promoCodeDiscount: response.response });
      }
    });
  }
}

export default PriceCalculator;

function itemsEqual(x: CartItem[], y: CartItem[]) {
  if (x.length !== y.length) {
    return false;
  }

  for (let i = 0; i < x.length; i++) {
    if (x[i].productId !== y[i].productId) {
      return false;
    }

    if (x[i].setId !== y[i].setId) {
      return false;
    }

    if (x[i].setting !== y[i].setting) {
      return false;
    }

    if (x[i].multiplier !== y[i].multiplier) {
      return false;
    }
  }

  return true;
}
