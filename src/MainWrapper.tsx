import React, { Component } from 'react';

import { Router } from 'react-router-dom';

import { createBrowserHistory } from 'history';

import API from './api/API';
import { DataContextProvider, DataContextAPI } from './data/DataContext';

import MultiLoader from './util/MultiLoader';

export const browserHistory = createBrowserHistory();

class MainWrapper extends Component {
	
	render() {
		return <div>
			<Router history={browserHistory}>
				<MultiLoader methods={[API.getProductCategories, API.getProducts, API.getProductSets, API.getWholesaleDiscounts]} children={(data, _) => {
					return <DataContextProvider value={new DataContextAPI(data[0], data[1], data[2], data[3])}>
						{
							// @ts-ignore
							this.props.children
						}
					</DataContextProvider>
				}}/>
			</Router>
		</div>;
	}

}

export default MainWrapper;