import axios, { AxiosPromise } from "axios";
import querystring from "query-string";
import { config } from "../config";

export interface APIError {
  code: number;
  message: string;
  data: { [key: string]: any };
}

class APIResponse<T> {
  error?: APIError;
  response?: T;

  constructor(error?: APIError, response?: T) {
    this.error = error;
    this.response = response;
  }

  isError() {
    return this.error !== undefined;
  }
}

//const dev = window.location.host.startsWith("localhost");
const dev = false;
const test = window.location.pathname.startsWith("/front-test-much-secret/");

export const jukeboxWebSocketHost = dev
  ? "ws://localhost:8080"
  : `wss://${config.ngrok.split("/")[2]}`;

const protocol = dev ? "http" : config.ngrok.split("/")[0].slice(0, -1),
  host = dev ? "localhost:8080" : config.ngrok.split("/")[2];

class CallbackError extends Error {
  cause: Error;

  constructor(cause: Error) {
    super();
    this.cause = cause;
  }
}

function apiCall(
  isPost: boolean,
  method: string,
  params: { [key: string]: any },
  callback: APICallback<any>
) {
  if (test) {
    method = "test-api/" + method;
  }

  let promise: AxiosPromise;

  const paramString = querystring.stringify(params);

  if (isPost) {
    promise = axios.post(
      protocol + "://" + host + "/" + method,
      paramString === "" ? undefined : paramString,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "ngrok-skip-browser-warning": "true",
        },
      }
    );
  } else {
    promise = axios.get(
      protocol +
        "://" +
        host +
        "/" +
        method +
        (paramString === "" ? "" : "?" + paramString),
      {
        withCredentials: true,
        headers: { "ngrok-skip-browser-warning": "true" },
      }
    );
  }

  promise
    .then((response) => {
      try {
        callback(new APIResponse(undefined, response.data));
      } catch (e) {
        throw new CallbackError(e as Error);
      }
    })
    .catch((e) => {
      if (e instanceof CallbackError) {
        throw e.cause;
      }

      const error =
        e.response === undefined
          ? { code: -1, message: "Network error", data: {} }
          : {
              code: e.response.data.code,
              message: e.response.data.message,
              data: e.response.data,
            };

      callback(new APIResponse(error, undefined));
    });
}

export type APICallback<T> = (response: APIResponse<T>) => void;

class API {
  static getOnline(callback: APICallback<{ online: number }>) {
    apiCall(false, "api/getOnline", {}, callback);
  }

  static login(callback: APICallback<{}>) {
    apiCall(true, "api/login", {}, callback);
  }

  static new_payment(
    price: number,
    productIds: string,
    callback: APICallback<{}>
  ) {
    apiCall(true, "api/new_payment", { price, productIds }, callback);
  }

  static new_deposit(amount: number, callback: APICallback<{}>) {
    apiCall(true, "api/new_deposit", { amount }, callback);
  }

  static getProductCategories(callback: APICallback<Categories>) {
    apiCall(false, "api/getProductCategories", {}, callback);
  }

  static getReviews(callback: APICallback<Categories>) {
    apiCall(false, "api/getReviews", {}, callback);
  }

  static getProducts(callback: APICallback<{ [key: string]: Product }>) {
    apiCall(false, "api/getProducts", {}, (response) => {
      if (response.error) {
        callback(response);
        return;
      }

      const data: { [key: string]: Product } = {};

      Object.values(response.response!).map(
        (e: any) =>
          (data[e.id] = new Product(
            e.id,
            e.categoryId,
            e.name,
            e.shortDescription,
            e.fullDescription,
            e.wideTile,
            e.displayInRecommended,
            e.imageId,
            e.prices,
            e.settings,
            e.isDuration,
            e.discount,
            e.hidden
          ))
      );

      callback(new APIResponse(undefined, data));
    });
  }

  static getProductSets(callback: APICallback<{ [key: string]: ProductSet }>) {
    apiCall(false, "api/getProductSets", {}, (response) => {
      if (response.error) {
        callback(response);
        return;
      }

      const data: { [key: string]: ProductSet } = {};

      Object.values(response.response!).map(
        (e: any) =>
          (data[e.id] = new ProductSet(
            e.id,
            e.categoryId,
            e.name,
            e.shortDescription,
            e.fullDescription,
            e.wideTile,
            e.displayInRecommended,
            e.imageId,
            e.entries,
            e.hiddenDiscount,
            e.displayedDiscountPercent
          ))
      );

      callback(new APIResponse(undefined, data));
    });
  }

  static getGames(callback: APICallback<string[]>) {
    apiCall(false, "api/getGames", {}, callback);
  }

  static getGame(gameId: string, callback: APICallback<Game>) {
    apiCall(false, "api/getGame", { gameId: gameId }, callback);
  }

  static getTopPlayers(
    gameId: string,
    callback: APICallback<Array<TopPlayer>>
  ) {
    apiCall(false, "api/getTopPlayers", { gameId: gameId }, callback);
  }

  static getSurchargeDiscount(
    playerName: string,
    productIds: string[],
    callback: APICallback<{ discount: number }>
  ) {
    apiCall(
      false,
      "api/getSurchargeDiscount",
      { playerName: playerName, productIds: productIds.join(",") },
      callback
    );
  }

  static getUnbanPrice(
    playerName: string,
    callback: APICallback<{ price: number }>
  ) {
    apiCall(false, "api/getUnbanPrice", { playerName: playerName }, callback);
  }

  static getUnmutePrice(
    playerName: string,
    callback: APICallback<{ price: number }>
  ) {
    apiCall(false, "api/getUnmutePrice", { playerName: playerName }, callback);
  }

  static getAccountRecoveryPrice(
    playerName: string,
    callback: APICallback<{ price: number }>
  ) {
    apiCall(
      false,
      "api/getAccountRecoveryPrice",
      { playerName: playerName },
      callback
    );
  }

  static getWholesaleDiscounts(callback: APICallback<WholesaleDiscount[]>) {
    apiCall(false, "api/getWholesaleDiscounts", {}, callback);
  }

  static getPromoCodeDiscount(
    promoCode: string,
    callback: APICallback<{ discount: number; percent: boolean }[]>
  ) {
    apiCall(
      false,
      "api/getPromoCodeDiscount",
      { promoCode: promoCode },
      callback
    );
  }

  static purchase(
    playerName: string,
    targetPlayerName: string,
    email: string,
    promoCode: string | undefined,
    entries: PurchaseProductEntry[],
    paymentProvider: PaymentProvider,
    callback: APICallback<{ redirectUrl: string }>
  ) {
    apiCall(
      true,
      "api/purchase",
      {
        playerName,
        targetPlayerName,
        email,
        promoCode,
        entries: JSON.stringify(entries),
        paymentProvider,
      },
      callback
    );
  }

  // Presents

  static getPresent(id: string, callback: APICallback<Present>) {
    apiCall(false, "api/getPresent", { id: id }, callback);
  }

  static watchPresentAd(id: string, callback: APICallback<{}>) {
    apiCall(true, "api/watchPresentAd", { id: id }, callback);
  }

  static getNextCard(id: string, callback: APICallback<Card>) {
    apiCall(true, "api/getNextCard", { id: id }, callback);
  }

  static takeReward(id: string, callback: APICallback<{}>) {
    apiCall(true, "api/takeReward", { id: id }, callback);
  }

  // Codes

  static activateCode(
    code: string,
    playerName: string,
    callback: APICallback<{ success: boolean }>
  ) {
    apiCall(
      true,
      "api/activateCode",
      { code: code, playerName: playerName },
      callback
    );
  }

  // Payment data

  static getPaymentStatus(
    paymentId: number,
    callback: APICallback<{
      completed: boolean;
      paymentErrorMessage: string | null;
    }>
  ) {
    apiCall(false, "api/getPaymentStatus", { paymentId: paymentId }, callback);
  }
}

export default API;

export type Category = { id: string; name: string };

export type Categories = Category[];

export class AbstractProduct {
  id: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  wideTile: boolean;
  displayInRecommended: boolean;
  imageId: string;

  constructor(
    id: string,
    categoryId: string,
    name: string,
    shortDescription: string,
    fullDescription: string,
    wideTile: boolean,
    displayInRecommended: boolean,
    imageId: string
  ) {
    this.id = id;
    this.categoryId = categoryId;
    this.name = name;
    this.shortDescription = shortDescription;
    this.fullDescription = fullDescription;
    this.wideTile = wideTile;
    this.displayInRecommended = displayInRecommended;
    this.imageId = imageId;
  }

  isProduct() {
    return this instanceof Product;
  }
}

export class Product extends AbstractProduct {
  prices: number[];
  settings: number[];
  isDuration: boolean;
  discount: number;
  hidden: boolean;

  constructor(
    id: string,
    categoryId: string,
    name: string,
    shortDescription: string,
    fullDescription: string,
    wideTile: boolean,
    displayInRecommended: boolean,
    imageId: string,
    prices: string,
    settings: string,
    isDuration: boolean,
    discount: number,
    hidden: boolean
  ) {
    super(
      id,
      categoryId,
      name,
      shortDescription,
      fullDescription,
      wideTile,
      displayInRecommended,
      imageId
    );

    this.prices = prices.split(",").map((e) => +e);
    this.settings = settings.split(",").map((e) => +e);
    this.isDuration = isDuration;
    this.discount = discount;
    this.hidden = hidden;
  }

  getBasePrice(setting: number | undefined, multiplier: number) {
    let priceIndex = 0;

    if (setting !== undefined) {
      priceIndex = this.settings.indexOf(setting);

      if (priceIndex === -1) {
        throw new Error(
          "Invalid setting " + setting + " for product " + this.id
        );
      }
    }

    return this.prices[priceIndex] * multiplier;
  }

  getPrice(
    setting: number | undefined,
    multiplier: number,
    discounts: WholesaleDiscount[]
  ) {
    return applyDiscount(
      this.getBasePrice(setting, multiplier),
      this.discount + Product.getAdditionalDiscount(multiplier, discounts)
    );
  }

  private static getAdditionalDiscount(
    multiplier: number,
    discounts: WholesaleDiscount[]
  ) {
    for (let i = discounts.length - 1; i >= 0; i--) {
      const discount = discounts[i];

      if (multiplier >= discount.minAmount) {
        return discount.discount;
      }
    }

    return 0;
  }
}

export type Products = { [key: string]: Product };

export type Sets = { [key: string]: ProductSet };

export function applyDiscount(price: number, discount: number) {
  return price - Math.floor((price * discount) / 100.0);
}

export interface SetEntry {
  productId: string;
  setting?: number;
}

export class ProductSet extends AbstractProduct {
  entries: SetEntry[];
  hiddenDiscount: number;
  displayedDiscountPercent: number;

  constructor(
    id: string,
    categoryId: string,
    name: string,
    shortDescription: string,
    fullDescription: string,
    wideTile: boolean,
    displayInRecommended: boolean,
    imageId: string,
    entries: SetEntry[],
    hiddenDiscount: number,
    displayedDiscountPercent: number
  ) {
    super(
      id,
      categoryId,
      name,
      shortDescription,
      fullDescription,
      wideTile,
      displayInRecommended,
      imageId
    );

    this.entries = entries;
    this.hiddenDiscount = hiddenDiscount;
    this.displayedDiscountPercent = displayedDiscountPercent;
  }

  getBasePrice(products: { [key: string]: Product }) {
    let price = 0;

    for (const entry of this.entries) {
      const product = products[entry.productId];

      if (product === undefined) {
        continue;
      }

      price += product.getBasePrice(entry.setting, 1);
    }

    return Math.max(
      1,
      Math.floor(price * (1 - this.displayedDiscountPercent / 100))
    );
  }

  getPrice(products: { [key: string]: Product }) {
    let price = 0;

    for (const entry of this.entries) {
      const product = products[entry.productId];

      if (product === undefined) {
        continue;
      }

      price += product.getPrice(entry.setting, 1, []);
    }

    return Math.max(
      1,
      Math.floor(price * (1 - this.displayedDiscountPercent / 100))
    );
  }
}

export interface PurchaseProductEntry {
  productId?: string;
  setId?: string;
  setting?: number;
  multiplier: number;
}

export function getErrorMessage(error: APIError) {
  const oldData = "Данные устарели, обновите страницу и попробуйте ещё раз";

  const messagesByCode: { [key: number]: string } = {
    11: "Ник содержит неверные символы, или слишком длинный, или слишком короткий",
    12: "Такой промокод не существует",
    13: "Этот промокод истёк и больше не может использоваться",
    14: "Этот промокод был использован слишком много раз",
    15: oldData,
    16: oldData,
    17: oldData,
    18: oldData,
    19: "Некорректный адрес электронной почты",
    22: "Выбрано слишком много товаров, уменьшите список покупок",
    23: "Не выбрано нормальных товаров для покупки (не покупайте разбан или размут, если вы не забанены и не замучены)",
  };

  return (
    messagesByCode[error.code] ||
    "Произошла ошибка, обновите страницу и попробуйте ещё раз"
  );
}

export enum PaymentProvider {
  CARD = "CARD",
  QIWI = "QIWI",
}

export const getServerStaticUrl = () => {
  return "/items/";
};

export const defaultPaymentProvider = PaymentProvider.QIWI;

export interface Game {
  id: string;
  name: string;
  description: string;
  topColumnDisplayName: string;
}

export interface TopPlayer {
  name: string;
  value: number;
  headImage: string;
}

export interface WholesaleDiscount {
  minAmount: number;
  discount: number;
}

export function getProductData(
  data: AbstractProduct,
  setting: number | undefined
) {
  if (!data.isProduct()) {
    return { settings: [] as number[], setting: undefined, isDuration: false };
  }

  const product = data as Product;

  return {
    settings: product.settings,
    setting: setting === undefined ? product.settings[0] : setting,
    isDuration: product.isDuration,
  };
}

export type Present = {
  expired: boolean;
  adWatched: boolean;
  videoId: string;
  skipDelay: number;
  cardsOpened: boolean;
};

export type Card = {
  rarity: string;
  name: string;
  imageUrl: string;
  amount: number;
  isEmpty: boolean;
};

function getParams(url: string): { [key: string]: string } {
  const i = url.indexOf("?");

  if (i === -1) {
    throw "No URL parameters in " + url;
  }

  const result: { [key: string]: string } = {};

  url
    .substring(i + 1)
    .split("&")
    .forEach((pair) => {
      const j = pair.indexOf("=");

      if (j === -1) {
        throw "No value in key-value pair " + pair;
      } else {
        const val = pair.substring(j + 1).replace(/\+/g, "%20");

        result[decodeURIComponent(pair.substring(0, j))] =
          decodeURIComponent(val);
      }
    });

  return result;
}

function createForm(url: string) {
  const params = getParams(url);

  const form = document.createElement("form");
  form.method = "POST";
  form.action = url.substring(0, url.indexOf("?"));

  Object.entries(params).forEach((e) => {
    const input = document.createElement("input");
    input.name = e[0];
    input.value = e[1];
    form.appendChild(input);
  });

  return form;
}

export function redirectToPaymentPage(url: string): void {
  window.location.href = url;

  //const form = createForm(url);
  //document.body.appendChild(form);
  //form.submit();
}
