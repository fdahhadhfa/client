import React from 'react';
import {Route, Switch} from 'react-router';
import CodePage from '../code/CodePage';
import appContext from '../context/AppContext';
import DataPolicy from '../DataPolicy';
import PaymentProviderSelectModal from '../modal/PaymentProviderSelectModal';
import OfferAgreementPage from '../OfferAgreementPage';
import PaymentStatusPage from '../payment/PaymentStatusPage';
import PaymentProcess from '../PaymentProcess';
import CardsPage from '../present/CardsPage';
import PresentPage from '../present/PresentPage';
import RulesPage from '../RulesPage';
import MobileCart from './MobileCart';
import MobilePurchase from './MobilePurchase';
import MobileShop from './MobileShop';
import GuaranteePage from '../GuaranteePage';

const MobileContent = () => {
	if (appContext.cartOpened === true) {
		return <MobileCart/>;
	}
	
	if (appContext.openedProduct !== undefined) {
		return <MobilePurchase product={appContext.openedProduct.product}/>;
	}

	if (appContext.paymentProviderSelectModalData !== undefined) {
		return <PaymentProviderSelectModal data={appContext.paymentProviderSelectModalData}/>;
	}

	return <Switch>
		<Route path='/code' component={CodePage}/>

		<Route path='/shop/:category' render={(props) => <MobileShop category={props.match.params.category}/>}/>

		<Route path='/rules' component={RulesPage}/>
		<Route path='/offerAgreement' component={OfferAgreementPage}/>
		<Route path='/privacy' component={DataPolicy}/>
		<Route path='/paymentProcess' component={PaymentProcess}/>

		<Route path='/present/cards/:presentId' render={(props) => <CardsPage id={props.match.params.presentId}/>}/>
		<Route path='/present/:presentId' render={(props) => <PresentPage id={props.match.params.presentId}/>}/>

		<Route path='/paymentStatus/success' component={PaymentStatusPage}/>
		<Route path='/paymentStatus/error' component={PaymentStatusPage}/>

		<Route path='/guarantee' component={GuaranteePage} />

		<Route render={() => <MobileShop category="recommended"/>}/>
	</Switch>;
}

export default MobileContent;