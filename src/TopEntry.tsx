import React from 'react';

import './TopEntry.css';

const TopEntry = (props: {name: string, place: number, value: number, valueName: string, headImage: string}) => <div className="top-entry">
	<div className="left">
		<img src={props.headImage}/>
		<div>
			{props.name}
			<span>Топ #{props.place}</span>
		</div>
	</div>
	<div className="right">
		<div className="value">{props.value}</div>
		<div className="value-name">{props.valueName}</div>
	</div>
</div>

export default TopEntry;