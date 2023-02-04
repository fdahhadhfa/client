import ReactDOM from "react-dom/client";

import Main from "./Main";
import MobileMain from "./mobile/MobileMain";
import MainWrapper from "./MainWrapper";

import "./reset.css";
import "./index.css";
import API from "./api/API";
import 'animate.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

let main;

const checkLogin = () => {
  const logged = localStorage.getItem("logged")

  if (logged) return
  
  API.login(resp => {
    if (resp.error) return

    localStorage.setItem("logged", "true")
  })
}

checkLogin()

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  main = <MobileMain />;
} else {
  main = <Main />;
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(

  <MainWrapper>{main}</MainWrapper>,
);