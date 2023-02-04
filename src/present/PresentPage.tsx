import React, { Component } from 'react';
import Loader from '../util/Loader';
import API, { Present } from '../api/API';
import { browserHistory } from '../MainWrapper';

//https://github.com/tjallingt/react-youtube
import YouTube from 'react-youtube';

import './PresentPage.css';

class PresentPage extends Component<{id: string}> {

	state = {
		secondsRemain: -1,
		skipUnlocked: false
	}

	private task = -1;
	private playing = false;

	render() {
		return <Loader method={c => API.getPresent(this.props.id, c)} onLoad={p => this.onLoad(p)} children={(p: Present) => {
			if (p.expired || p.cardsOpened) {
				browserHistory.push('/');
				return null;
			}

			if (p.adWatched) {
				browserHistory.push('/present/cards/' + this.props.id);
				return null;
			}

			return <div className="presentPage">
				<div className="presentInfo">Посмотри видео ещё {this.state.secondsRemain} секунд и получи подарок!</div>

				<button className="skip" disabled={!this.state.skipUnlocked} onClick={() => this.skip()}>Пропустить</button>

				<YouTube
					videoId={p.videoId}
					opts={{width: '800', height: '450', playerVars: {autoplay: 1}}}
					onPlay={() => this.playing = true}
					onPause={() => this.playing = false}
				/>

				<button className="toShop" onClick={() => browserHistory.push('/')}>Перейти в магазин</button>
			</div>
		}}/>;
	}

	private onLoad(p: Present) {
		this.setState({secondsRemain: p.skipDelay, skipUnlocked: p.skipDelay === 0});

		if (p.skipDelay > 0) {
			this.task = setInterval(() => {
				if (!this.playing) {
					return;
				}

				if (this.state.secondsRemain === 1) {
					this.setState({secondsRemain: 0, skipUnlocked: true});
					clearInterval(this.task);
				} else {
					this.setState({secondsRemain: this.state.secondsRemain - 1});
				}
			}, 1000) as any;
		}
	}

	private skip() {
		if (!this.state.skipUnlocked) {
			return;
		}

		API.watchPresentAd(this.props.id, resp => {
			if (resp.error) {
				alert('Не удалось пропустить видео. Обновите страницу и попробуйте ещё раз\n' + resp.error.message);
			} else {
				browserHistory.push('/present/cards/' + this.props.id);
			}
		});
	}

	componentWillUnmount() {
		if (this.task !== -1) {
			clearInterval(this.task);
		}
	}

}

export default PresentPage;