import React from 'react';

import {AbstractProduct, getProductData, getServerStaticUrl} from "./api/API";
import { CartItem, Cart } from "./cart/Cart";
import { millisToString } from "./util/TimeUtil";

import './CartEntry.css';

const CartEntry = (props: {index: number, item: CartItem, data: AbstractProduct, layout: 'DESKTOP' | 'MOBILE', onItemsUpdate: () => void}) => {
	const {settings, setting, isDuration} = getProductData(props.data, props.item.setting);

	const icon = <div className="icon"><img src={getServerStaticUrl() + props.data.imageId}/></div>;

	const name = <div className="name">{props.data.name}</div>;

	const durationList = settings.length > 1 && isDuration ? <div className="duration">
		<select id="durationList" defaultValue={'' + setting} onChange={e => {
			props.item.setting = +e.target.value;

			Cart.setCartItem(props.index, props.item);

			props.onItemsUpdate();
		}}>{settings.map(d => <option key={d} value={d}>{millisToString(d)}</option>)}</select>
	</div> : null;

	const quantityList = settings.length > 1 && !isDuration ? <div className="duration">
		<select id="quantityList" defaultValue={'' + setting} onChange={e => {
			props.item.setting = +e.target.value;

			Cart.setCartItem(props.index, props.item);

			props.onItemsUpdate();
		}}>{settings.map(d => <option key={d} value={d}>{d}</option>)}</select>
	</div> : null;

	const multiplierSelector = props.data.isProduct() && !isDuration ? <div className="amount">
		<button onClick={() => {
			if (props.item.multiplier <= 1) {
				return;
			}

			props.item.multiplier--;

			Cart.setCartItem(props.index, props.item);

			props.onItemsUpdate();
		}}>-</button>

		<span>{props.item.multiplier}</span>

		<button onClick={() => {
			if (props.item.multiplier >= 500) {
				return;
			}

			props.item.multiplier++;

			Cart.setCartItem(props.index, props.item);

			props.onItemsUpdate();
		}}>+</button>
	</div> : null;

	const removeButton = <div className="remove" onClick={() => {
		Cart.removeCartItem(props.index);

		props.onItemsUpdate();
	}}/>;

	let entry; 

	if (props.layout === 'DESKTOP') {
		entry = <div className="cart-entry">
			{icon}
			{name}
			{durationList}
			{quantityList}
			{multiplierSelector}
			{removeButton}
		</div>;
	} else {
		entry = <div className="cart-entry cart-entry-mobile">
			<div className="left">{icon}</div>
			
			<div className="right">
				<div className="top">
					{name}
				</div>

				<div className="bottom">
					{durationList}
					{quantityList}
					<div className="spacer"/>
					{multiplierSelector}
					{removeButton}
				</div>
			</div>
		</div>;
	}

	return <div>
		<hr/>

		{entry}
	</div>;
};

export default CartEntry;