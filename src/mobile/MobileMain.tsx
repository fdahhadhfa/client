import React, { Component } from 'react';

import appContext from '../context/AppContext';

import MobileHeader from './MobileHeader';
import MobileContent from './MobileContent';
import Footer from "../Footer";

import './mobile.css';

class MobileMain extends Component {
	
	componentDidMount() {
		appContext.updater = () => this.setState({});
	}

	componentWillUnmount() {
		appContext.updater = undefined;
	}

	render() {
		return <div>
			<MobileHeader/>

			<div className="mobile-content">
				<MobileContent/>
			</div>

			<Footer/>
		</div>;
	}

}

export default MobileMain;