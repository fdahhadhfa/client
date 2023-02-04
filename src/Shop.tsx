import React from 'react';

import { DataContextConsumer } from './data/DataContext';
import Tile from './common/Tile';

import { browserHistory } from './MainWrapper';

import './Shop.css';

const Shop = (props: {category: string}) => <DataContextConsumer children={(ctx) => {
	const tiles: React.ReactElement[] = [];

	// todo дублирование кода
	
	// Сначала пихаем батл пасс в начало списка тайлов
	Object.values(ctx.products)
			.filter(e => !e.hidden)
			.filter(e => e.categoryId === props.category || props.category === 'recommended' && e.displayInRecommended)
			.filter(e => e.id === 'battlepass')
			.map(e => <Tile key={e.id} product={e} discount={e.discount} displayDiscount={0} basePrice={e.getBasePrice(undefined, 1)} noHover={false}/>)
			.forEach(e => tiles.push(e));

	Object.values(ctx.products)
		.filter(e => !e.hidden)
		.filter(e => e.categoryId === props.category || props.category === 'recommended' && e.displayInRecommended)
		.filter(e => e.id === 'brawl_stars')
		.map(e => <Tile key={e.id} product={e} discount={e.discount} displayDiscount={0} basePrice={e.getBasePrice(undefined, 1)} noHover={false}/>)
		.forEach(e => tiles.push(e));

	// Потом пихаем остальные товары кроме баттпасса
	Object.values(ctx.products)
			.filter(e => !e.hidden)
			.filter(e => e.categoryId === props.category || props.category === 'recommended' && e.displayInRecommended)
			.filter(e => e.id !== 'battlepass' && e.id !== 'brawl_stars')
			.map(e => <Tile key={e.id} product={e} discount={e.discount} displayDiscount={0} basePrice={e.getBasePrice(undefined, 1)} noHover={false}/>)
			.forEach(e => tiles.push(e));

	Object.values(ctx.sets)
			.filter(e => e.categoryId === props.category)
			.map(e => <Tile key={e.id} product={e} discount={0} displayDiscount={e.displayedDiscountPercent} basePrice={e.getPrice(ctx.products)} noHover={false}/>)
			.forEach(e => tiles.push(e));

	return <div className="shop">
		<div className="menu">
			<ul>
				{ctx.categories.map(e => <li key={e.id}><button className={e.id === props.category ? "active" : ""} onClick={() => {
					browserHistory.push('/shop/' + e.id);

					window.scrollTo(0, 0); 
				}}>{e.name}</button></li>)}
			</ul>
		</div>

		<div className="tiles">
			{tiles}
		</div>
	</div>;
}}/>;

export default Shop;