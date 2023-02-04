import React, { Component } from 'react';
import Loader from '../util/Loader';
import API, { Present, Card } from '../api/API';
import { browserHistory } from '../MainWrapper';

import './CardsPage.css';

type CardSlot = {card?: Card, showBorder?: boolean};

const createSlots = () => {
	const rows: CardSlot[][] = [];

	for (let y = 0; y < 3; y++) {
		const row: CardSlot[] = [];
		
		for (let x = 0; x < 8; x++) {
			row.push({});
		}

		rows.push(row);
	}

	return rows;
};

const CardSlotElem = (props: {slot: CardSlot, onClick: () => void}) => {
	const card = props.slot.card;
	
	if (card !== undefined) {
		const addClass = props.slot.showBorder === true ? ' notFiller' : '';

		if (card.isEmpty) {
			return <div className={"cardEmpty" + addClass} onClick={() => props.onClick()}></div>;
		}

		return <div className={"card" + addClass} style={{backgroundImage: 'url(/cards/' + card.rarity.toLowerCase() + '.png)'}} onClick={() => props.onClick()}>
			<img src={card.imageUrl}/>
			<div className="name">{card.name}</div>
			{card.amount > 1 ? <div className="amount">{card.amount}</div> : null}
		</div>
	}

	return <div className="cardCover" onClick={() => props.onClick()}></div>;
};

const maxOpenedCards = 10;

class CardsPage extends Component<{id: string}> {

	state = {
		slots: createSlots(),
		openedCount: 0,
		rewardBlocked: false,
		status: 'Выбери карты. Чтобы забрать награду, нажми на кнопку ниже.'
	}

	private disabled = false;

	render() {
		return <Loader method={c => API.getPresent(this.props.id, c)} children={(p: Present) => {
			if (p.expired || p.cardsOpened) {
				browserHistory.push('/');
				return null;
			}

			if (!p.adWatched) {
				browserHistory.push('/present/' + this.props.id);
				return null;
			}

			return <div className="cardsPage">
				<div className="cardsStatus">{this.state.status}</div>

				{this.state.slots.map((row, y) => <div key={y} className="cardRow">{row.map((slot, x) => <CardSlotElem key={x} slot={slot} onClick={() => this.onCardClick(slot)}/>)}</div>)}

				<button className="takeReward" disabled={this.state.openedCount === 0 || this.state.rewardBlocked} onClick={e => this.takeReward(e.target)}>Забрать награду</button>
			</div>
		}}/>;
	}

	private onCardClick(slot: CardSlot) {
		if (slot.card !== undefined || this.state.openedCount === maxOpenedCards || this.disabled || this.state.rewardBlocked) {
			return;
		}

		this.disabled = true;

		API.getNextCard(this.props.id, resp => {
			this.disabled = false;

			if (resp.error) {
				alert('Не удалось открыть карту\n' + resp.error.message);
			} else {
				slot.card = resp.response!;

				const isEmpty = slot.card.isEmpty;

				if (isEmpty) {
					this.disabled = true;

					// Открываем все остальные карты
					setTimeout(() => this.openRemainingCards(this.state.openedCount), 2000);
				} else {
					slot.showBorder = true;
				}

				this.setState({openedCount: this.state.openedCount + 1, rewardBlocked: this.state.rewardBlocked || isEmpty, status: isEmpty ? 'Ты вскрыл пустышку! К сожалению, все твои награды стерлись! Возвращайся и попытай удачу завтра!' : 'Отличная награда! Попробуй еще! Однако, если вскроешь пустышку - все твои награды сгорят!'});
			}
		});
	}

	private takeReward(button: any) {
		if (this.disabled) {
			return;
		}

		button.disabled = true;

		this.disabled = true;

		API.takeReward(this.props.id, resp => {
			// Компоненты остаются выключенными

			if (resp.error) {
				alert('Не удалось забрать награду\n' + resp.error.message);
			} else {
				this.openRemainingCards(this.state.openedCount);
			}
		});
	}

	private openRemainingCards(openedCount: number) {
		const toOpen = [] as CardSlot[];

		// Открываем остальные карты
		for (let i = 0; i < maxOpenedCards - openedCount; i++) {
			let slot = this.getRandomEmptySlot();
			
			while (toOpen.indexOf(slot) !== -1) {
				slot = this.getRandomEmptySlot();
			}

			toOpen.push(slot);

			API.getNextCard(this.props.id, resp => {
				if (resp.response) {
					slot.card = resp.response;
					this.setState({});
				}
			});
		}

		// Остальные слоты будут пустышками
		const empty = {rarity: 'COMMON', name: '', imageUrl: '', amount: 1, isEmpty: true};

		this.state.slots.forEach(row => row.filter(s => s.card === undefined && toOpen.indexOf(s) === -1).forEach(s => s.card = empty));

		this.setState({});
	}

	private getRandomEmptySlot() {
		const slots = [] as CardSlot[];

		for (const row of this.state.slots) {
			row.filter(s => s.card === undefined).forEach(s => slots.push(s));
		}

		return slots[Math.floor(Math.random() * slots.length)];
	}

	private placeFillers() {
		const empty = {rarity: 'COMMON', name: '', imageUrl: '', amount: 1, isEmpty: true};

		this.state.slots.forEach(row => row.filter(s => s.card === undefined).forEach(s => s.card = empty));

		this.setState({});
	}

}

export default CardsPage;