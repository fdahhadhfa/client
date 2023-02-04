import React, {Component} from "react";

import {Link} from "react-router-dom";

import './TermsCheckbox.css';

type Props = {accepted: boolean, onChange: (accepted: boolean) => void};

class TermsCheckbox extends Component<Props> {

	render() {
		return <div className="terms-checkbox">
			<input
				type="checkbox"
				id="terms-checkbox"
				className="terms-checkbox"
				defaultChecked={this.props.accepted}
				onChange={e => this.props.onChange(e.target.checked)}
			/>

			<label htmlFor="terms-checkbox">
				Я прочитал <Link to="/rules" target="_blank">правила</Link>,{' '}
				согласен с <Link to="/offerAgreement" target="_blank">договором</Link>{' '}
				и <Link to="/privacy" target="_blank">политикой конфиденциальности</Link>.
			</label>
		</div>;
	}

}

export default TermsCheckbox;
