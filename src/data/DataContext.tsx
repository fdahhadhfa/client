import { createContext } from 'react';

import { Products, Sets, Categories, WholesaleDiscount } from '../api/API';

export class DataContextAPI {

	categories: Categories;
	products: Products;
	sets: Sets;
	wholesaleDiscounts: WholesaleDiscount[];

	constructor(categories: Categories, products: Products, sets: Sets, wholesaleDiscounts: WholesaleDiscount[]) {
		this.categories = categories;
		this.products = products;
		this.sets = sets;
		this.wholesaleDiscounts = wholesaleDiscounts;
	}

}

const context = createContext<DataContextAPI>(undefined as any)

const DataContextProvider = context.Provider;

export {DataContextProvider};

const DataContextConsumer = context.Consumer;

export {DataContextConsumer};