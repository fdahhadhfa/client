import React, { Component } from 'react';

import { Cart } from '../cart/Cart';

import appContext from '../context/AppContext';
import TopMenu from '../TopMenu';

class MobileHeader extends Component {

	private listener = () => this.setState({});

	componentDidMount() {
		appContext.addCartChangeListener(this.listener);
	}

	componentWillUnmount() {
		appContext.removeCartChangeListener(this.listener);
	}
	
	render() {
		const count = Cart.getItems().length;
	
		return <header className="mobile-header">
			<div className="mobile-logo"></div>

			<button className="mobile-cart-button" onClick={() => appContext.setCartOpened(true)}>{count === 0 ? null : <span>{count}</span>}</button>

			<TopMenu/>
		</header>;
	}

}

export default MobileHeader;