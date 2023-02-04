import React, { Component } from 'react';

import appContext from './context/AppContext';

import Header from './Header';
import Footer from './Footer';
import Content from './Content';

class Main extends Component {
	
	componentDidMount() {
		appContext.updater = () => this.setState({});
	}

	componentWillUnmount() {
		appContext.updater = undefined;
	}
	
	render() {
		return <div>
			<Header/>
			<Content/>
			<Footer/>
		</div>;
	}

}

export default Main;