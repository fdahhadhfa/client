import React from "react";
import Modal from "react-modal";
import { Route, Switch } from "react-router-dom";
import CodePage from "./code/CodePage";
import "./Content.css";
import appContext from "./context/AppContext";
import DataPolicy from "./DataPolicy";
import CartModal from "./modal/CartModal";
import PaymentProviderSelectModal from "./modal/PaymentProviderSelectModal";
import PurchaseConfirmationModal from "./modal/PurchaseConfirmationModal";
import PurchaseModal from "./modal/PurchaseModal";
import OfferAgreementPage from "./OfferAgreementPage";
import PaymentStatusPage from "./payment/PaymentStatusPage";
import PaymentProcess from "./PaymentProcess";
import CardsPage from "./present/CardsPage";
import PresentPage from "./present/PresentPage";
import RulesPage from "./RulesPage";
import Shop from "./Shop";
import GuaranteePage from "./GuaranteePage";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    padding: "30px",
    display: "flex",
  },

  content: {
    padding: "0",
    minWidth: "350px",
    border: "0px",
    borderRadius: "0px",
    overflow: "auto",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    position: "relative" as "relative",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
};

const Content = () => (
  <div className="content">
    <Switch>
      <Route path="/code" component={CodePage} />

      <Route
        path="/shop/:category"
        render={(props) => <Shop category={props.match.params.category} />}
      />

      <Route path="/rules" component={RulesPage} />
      <Route path="/offerAgreement" component={OfferAgreementPage} />
      <Route path="/privacy" component={DataPolicy} />
      <Route path="/paymentProcess" component={PaymentProcess} />

      <Route
        path="/present/cards/:presentId"
        render={(props) => <CardsPage id={props.match.params.presentId} />}
      />
      <Route
        path="/present/:presentId"
        render={(props) => <PresentPage id={props.match.params.presentId} />}
      />

      <Route path="/paymentStatus/success" component={PaymentStatusPage} />
      <Route path="/paymentStatus/error" component={PaymentStatusPage} />

      <Route path="/guarantee" component={GuaranteePage} />

      <Route render={() => <Shop category="recommended" />} />
    </Switch>

    {appContext.paymentProviderSelectModalData !== undefined ? (
      <Modal
        isOpen={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() =>
          appContext.setPaymentProviderSelectModalData(undefined)
        }
        style={modalStyles}
      >
        <PaymentProviderSelectModal
          data={appContext.paymentProviderSelectModalData}
        />
      </Modal>
    ) : null}

    {appContext.cartOpened ? (
      <Modal
        isOpen={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => appContext.setCartOpened(false)}
        style={modalStyles}
      >
        <CartModal />
      </Modal>
    ) : null}

    {appContext.openedProduct !== undefined ? (
      <Modal
        isOpen={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => appContext.setOpenedProduct(undefined)}
        style={modalStyles}
      >
        <PurchaseModal product={appContext.openedProduct!.product} />
      </Modal>
    ) : null}

    {appContext.purchasedProducts !== undefined ? (
      <Modal
        isOpen={true}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        onRequestClose={() => appContext.setPurchasedProducts(undefined)}
        style={modalStyles}
      >
        <PurchaseConfirmationModal
          purchasedProducts={appContext.purchasedProducts!}
        />
      </Modal>
    ) : null}
  </div>
);

export default Content;
