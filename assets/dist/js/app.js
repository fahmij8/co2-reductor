import { firebaseInit } from "./app-firebaseauth.js";
import { routePage } from "./app-route.js";

firebaseInit();
Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return ((this - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};
Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
};
sessionStorage.setItem("CO2", "1500.0");
Chart.defaults.font.family = "Nunito, -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif";
Chart.defaults.color = "#858796";
routePage();
