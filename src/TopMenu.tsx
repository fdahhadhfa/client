import React from "react";

import { NavLink } from "react-router-dom";

import "./TopMenu.css";
import { config } from "./config";
import appContext from "./context/AppContext";

function style(name: string, padding: number) {
  return {
    backgroundImage: "url('/assets/" + name + ".png')",
    paddingLeft: padding + "px",
  };
}

const TopMenu = () => (
  <ul className="top-menu">
    <li>
      <img src="/assets/shop.png" className="top-menu-icon" />
      <NavLink
        onClick={() => {
          appContext.setOpenedProduct(undefined);
          appContext.setCartOpened(false);
        }}
        activeClassName="active"
        to="/shop/tariffs"
        isActive={(match, loc) => !!match || loc.pathname === "/"}
      >
        Магазин
      </NavLink>
    </li>
    <li>
      <img src="/assets/guarantee.png" className="top-menu-icon" />
      <NavLink
        onClick={() => {
          appContext.setOpenedProduct(undefined);
          appContext.setCartOpened(false);
        }}
        activeClassName="active"
        to="/guarantee"
        isActive={(match, loc) => !!match || loc.pathname === "/guarantee"}
      >
        Пруфы/Отзывы
      </NavLink>
    </li>
    <li>
      <img src="/assets/support.png" className="top-menu-icon" />
      <a href={`${config.support}`} target="_blank" rel="noreferrer noopener">
        Помощь
      </a>
    </li>
  </ul>
);

export default TopMenu;
