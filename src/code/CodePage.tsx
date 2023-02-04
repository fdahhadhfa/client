import React, { Component } from "react";

import './CodePage.css';
import API from "../api/API";

class CodePage extends Component {

	state = {
		status: 'Введите код',
		code: '',
		playerName: '',
		disabled: false
	}

	render() {
		return <div className="code-page">
			<p>{this.state.status}</p>
			<div>
				<input placeholder="Код" value={this.state.code} onChange={e => this.setState({code: e.target.value})}/>
				<input placeholder="Ник" value={this.state.playerName} onChange={e => this.setState({playerName: e.target.value})}/>
				<button onClick={e => this.onClick(e.target)} disabled={this.state.disabled}>Активировать</button>
			</div>
		</div>;
	}

	private onClick(button: any) {
		if (this.state.code === '' || this.state.playerName === '') {
			alert('Не введён код или ник');
			return;
		}

		this.setState({disabled: true, status: 'Активирую код...'});

		API.activateCode(this.state.code, this.state.playerName, resp => {
			setTimeout(() => this.setState({disabled: false}), 5500);
			
			if (resp.error) {
				this.setState({status: 'Не удалось активировать код: ' + resp.error.message});
			} else {
				const success = resp.response!.success;
				
				this.setState({status: success ? 'Код был успешно активирован!' : 'Код не найден или уже был активирован'});
				
				if (success) {
					this.setState({code: '', playerName: ''});
				}
			}
		});
	}

}

export default CodePage;