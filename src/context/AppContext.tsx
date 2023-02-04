import {AbstractProduct} from "../api/API";
import {CartItem} from "../cart/Cart";
import { PaymentProviderSelectModalData } from "../modal/PaymentProviderSelectModal";

export class AppContextAPI {

	cartOpened: boolean = false;
	openedProduct?: OpenedProduct;
	// Товары, которые отображаются в гуи с почтой и тд
	purchasedProducts?: CartItem[];
	paymentProviderSelectModalData?: PaymentProviderSelectModalData;

	updater: (() => void) | undefined = undefined;

	private cartChangeListeners: Array<() => void> = [];

	setCartOpened(value: boolean) {
		this.cartOpened = value;
		this.update();
	}

	setOpenedProduct(value?: OpenedProduct) {
		this.openedProduct = value;
		this.update();
		window.scrollTo(0, 0); 
	}

	setPurchasedProducts(purchasedProducts?: CartItem[]) {
		this.purchasedProducts = purchasedProducts;
		this.update();
	}

	setPaymentProviderSelectModalData(data?: PaymentProviderSelectModalData) {
		this.paymentProviderSelectModalData = data;
		this.update();
	}

	update() {
		if (this.updater) {
			this.updater();
		}
	}

	addCartChangeListener(listener: () => void) {
		this.cartChangeListeners.push(listener);
	}

	removeCartChangeListener(listener: () => void) {
		const i = this.cartChangeListeners.indexOf(listener);
		
		if (i === -1) {
			return;
		}

		this.cartChangeListeners.splice(i, 1);
	}

	onCartChange() {
		this.update();
	}

}

const appContext = new AppContextAPI();

export default appContext;

export interface OpenedProduct {

	product: AbstractProduct;

}