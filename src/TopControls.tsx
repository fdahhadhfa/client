import React, { Component, useEffect } from "react";

import "./TopControls.css";
import API from "./api/API";
import appContext from "./context/AppContext";
import { Cart } from "./cart/Cart";
import { copyTextToClipboard } from "./util/Clipboard";
import { config } from "./config";

class TopControls extends Component {
  render() {
    let count = Cart.getItems().length;

    return (
      <div className="top-controls">
        <button
          className="top-control cart"
          onClick={() => appContext.setCartOpened(true)}
        >
          {count === 0 ? null : <span>{count}</span>}
        </button>

        <div className="top-control online">
          <div
            className="domain"
            onClick={() => copyTextToClipboard(config.domain)}
          >
            {config.domain}
          </div>
        </div>
      </div>
    );
  }
}

export default TopControls;
