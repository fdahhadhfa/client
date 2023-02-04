import React from "react";

import "./RulesPage.css";

const PaymentProcess = () => (
  <div className="rules">
    <p>
      Оплатить заказ можно банковскими картами Visa, Master Card, «Мир», через
      банкинги Тинькофф, Альфа-Банк, Сбер, системы Apple Pay, Google Pay,
      платежную систему ЮMoney, а так же с помощью наличных в терминалах оплаты.
    </p>
    <p />
    <p>
      Чтобы оплатить покупку, вы будете перенаправлены на сервер платежных
      систем Тинькофф или Юкасса, на которых нужно ввести необходимые данные.
    </p>
    <p />
    <p>
      Наши платежные системы обладают подтвержденным сертификатом соответствия
      требованиям стандарта PCI DSS в части хранения, обработки и передачи
      данных держателей карт. Стандарт безопасности банковских карт PCI DSS
      поддерживается международными платежными системами, включая MasterCard и
      Visa, Inc. Платежные системы также является участником программы
      непрерывного соответствия Compliance Control PCI DSS Compliance Process
      (P.D.C.P.). Ваши конфиденциальные данные, необходимые для оплаты
      (реквизиты карты, регистрационные данные и др.), не поступают в
      интернет-магазин — их обработка производится на стороне процессингового
      центра и полностью защищена.
    </p>
    <p />
    <p>
      Стоимость оказания услуг находится на сайте. Комиссия с покупателя не
      взымается.
    </p>
    <p>Возврат услуги осуществляется согласно пункту 8.4 Договора-оферты.</p>
    <p />
    <p className="icons">
      <img src="payment-systems/logo-mastercard.png" alt="MasterCard" />
      <img src="payment-systems/logo-visa.png" alt="Visa" />
      <img src="payment-systems/logo-mir.png" alt="МИР" />
      <img src="payment-systems/logo-sber.png" alt="Apple Pay" />
      <img src="payment-systems/logo-tinkoff.png" alt="Apple Pay" />
      <img src="payment-systems/logo-alfa-bank.png" alt="Альфа Банк" />
      <img src="payment-systems/logo-apple.png" alt="Apple Pay" />
      <img src="payment-systems/logo-google_pay.png" alt="Apple Pay" />
      <img src="payment-systems/logo-qiwi.png" alt="QIWI" />
      <img src="payment-systems/logo-iomoney.png" alt="ЮМани" />
    </p>
  </div>
);

export default PaymentProcess;
