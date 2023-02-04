import {AbstractProduct, PurchaseProductEntry} from "../api/API";

import appContext from "../context/AppContext";

export interface CartItem {

	productId?: string;
	setId?: string;
	setting?: number;
	multiplier: number;
	timestampCreated: number;

}

const WEEK_MILLIS = 7 * 24 * 60 * 60 * 1000;

export class Cart {

	static getItems(): CartItem[] {
		const s = localStorage.getItem('cartItems');

		if (s === null) {
			return [];
		}

		const list = (JSON.parse(s) as CartItem[]);
		
		const filtered = list.filter(i => i.timestampCreated < Date.now() + WEEK_MILLIS);

		if (list.length !== filtered.length) {
			localStorage.setItem('cartItems', JSON.stringify(filtered));
		}

		return filtered;
	}

	static createCartItem(product: AbstractProduct): CartItem {
		return product.isProduct() ?
				{productId: product.id, multiplier: 1, timestampCreated: Date.now()} :
				{setId: product.id, multiplier: 1, timestampCreated: Date.now()};
	}

	static addCartItem(item: CartItem) {
		const items = this.getItems();
		items.push(item);
		localStorage.setItem('cartItems', JSON.stringify(items));
		appContext.onCartChange();
	}

	static setCartItem(index: number, item: CartItem) {
		const items = this.getItems();
		items[index] = item;
		localStorage.setItem('cartItems', JSON.stringify(items));
		appContext.onCartChange();
	}

	static removeCartItem(index: number) {
		let items = this.getItems();
		items.splice(index, 1);
		localStorage.setItem('cartItems', JSON.stringify(items));
		appContext.onCartChange();
	}

	static removeAllCartItems() {
		localStorage.setItem('cartItems', JSON.stringify([]));
		appContext.onCartChange();
	}

}

export function toPurchaseEntries(list: CartItem[]): PurchaseProductEntry[] {
	return list.map(p => {
		return p.setId !== undefined ?
			{setId: p.setId, multiplier: p.multiplier} :
			{productId: p.productId, setting: p.setting, multiplier: p.multiplier};
	});
}
