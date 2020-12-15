import React from "react";
import preloader from "../../assets/images/preloader1.gif";
import s from "./Preloader.module.scss";

let Preloader = (props) => {
  return (
    <div className={s.container}>
      <img src={preloader} />
    </div>
  );
};

export default Preloader;
