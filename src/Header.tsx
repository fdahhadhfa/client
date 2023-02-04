import React from "react";

import TopControls from "./TopControls";
import TopMenu from "./TopMenu";

import "./Header.css";
import { NavLink } from "react-router-dom";

const Header = () => (
  <header>
    <div className="header-content">
      <NavLink to="/shop/tariffs" className="logo">
        <img src="/logo.png" />
      </NavLink>
      <div className="header-right">
        <div className="header-top">
          <TopControls />
        </div>
        <div className="header-menu">
          <TopMenu />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
