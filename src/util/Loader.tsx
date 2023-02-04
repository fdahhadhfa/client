import React, { Component } from "react";

import { APICallback, APIError } from "../api/API";

interface LoaderProps<T> {

	method: (callback: APICallback<T>) => void;
	children: (data: T, reload: () => void) => any;
	onLoad: (data: T) => void;
	onError: (error: APIError) => void;

}

class Loader<T> extends Component<LoaderProps<T>> {

	static defaultProps = {
		onLoad: () => {},
		onError: () => {}
	}

	state: {
		loading: boolean,
		error: string,
		data: T | null
	} = {
		loading: true,
		error: '',
		data: null
	}

	componentDidMount() {
		this.callMethod();
	}

	render() {
		if (this.state.error !== '') {
			return <div style={{padding: '20px'}}>{this.state.error}</div>;
		}

		if (this.state.loading || this.state.data === null) {
			return <div style={{padding: '20px'}}>Идёт загрузка...</div>;
		}

		return this.props.children(this.state.data, () => this.callMethod());
	}

	private callMethod() {
		this.props.method(response => {
			if (response.isError()) {
				this.props.onError(response.error!);
				this.setState({loading: false, error: 'Произошла ошибка при загрузке, обновите страницу'});
			} else {
				this.props.onLoad(response.response!);
				this.setState({loading: false, data: response.response!});
			}
		})
	}

}

export default Loader;