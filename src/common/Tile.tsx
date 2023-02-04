import React from 'react';

import { Cart } from '../cart/Cart';
import { AbstractProduct, applyDiscount, getServerStaticUrl, Product } from '../api/API';
import appContext from '../context/AppContext';

import './Tile.css';

const Tile = (props: {product: AbstractProduct, discount: number, displayDiscount: number, basePrice: number, noHover: boolean}) => {
	const p = props.product;

	const prefix = p instanceof Product && (p.prices.length > 1 || p.id === 'auth_recover') ? 'От ' : null;

	let price;

	if (p.id === 'unban') {
		price = <div className="price">От 100 ₽</div>;
	} else if (p.id === 'unmute') {
		price = <div className="price">От 50 ₽</div>;
	} else {
		if (props.displayDiscount > 0) {
			price = <div className="price">{prefix}{props.basePrice} ₽ <span>{Math.ceil(props.basePrice / (1 - props.displayDiscount / 100))} ₽</span></div>;
		} else if (props.discount > 0) {
			price = <div className="price">{prefix}{applyDiscount(props.basePrice, props.discount)} ₽ <span>{props.basePrice} ₽</span></div>;
		} else {
			price = <div className="price">{prefix}{props.basePrice} ₽</div>;
		}
	}

	let discount;

	if (props.displayDiscount > 0) {
		discount = <div className="discount">-{props.displayDiscount}%</div>;
	} else if (props.discount > 0) {
		discount = <div className="discount">-{props.discount}%</div>;
	} else {
		discount = null;
	}

	const cls = (p.id === 'battlepass' ? 'tile huge' : (p.wideTile ? "tile wide" : "tile")) + (props.noHover ? " nohover" : "");

	return <div className={cls} style={{backgroundImage: `url(${getServerStaticUrl() + p.imageId})`}}  onClick={() => appContext.setOpenedProduct({product: props.product})}>	
		{discount}

		<div className="title">{p.name}</div>
		
		<div className="desc">{p.shortDescription.split("\n").map((line, i) => <p key={i}>{line}</p>)}</div>
		
		{price}

		<div className="buttons">
			<button className="buy" onClick={e => {
				e.stopPropagation();

				appContext.setOpenedProduct({product: props.product});
			}}>Купить</button>

			<button className="add-to-cart" onClick={e => {
				e.stopPropagation();

				Cart.addCartItem(Cart.createCartItem(p));
			}}>+<img src="/assets/cart.png"/>{p.wideTile ? "В корзину" : null}</button>
		</div>
	</div>;
};

export default Tile;