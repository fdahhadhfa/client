import React from "react";

import { Link } from "react-router-dom";

import "./Footer.css";

import { config } from "./config";

const Footer = () => (
  <footer>
    <div>Copyright &copy; {config.domain} 2023</div>
  </footer>
);

export default Footer;
