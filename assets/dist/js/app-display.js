import { getData, postData, doHeavyTask, clearHeavyTask } from "./app-antares.js";
import { displayChart } from "./app-chart.js";

const sbInit = () => {
    !(function (l) {
        "use strict";
        l("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
            l("body").toggleClass("sidebar-toggled"), l(".sidebar").toggleClass("toggled"), l(".sidebar").hasClass("toggled") && l(".sidebar .collapse").collapse("hide");
        }),
            l(window).resize(function () {
                l(window).width() < 768 && l(".sidebar .collapse").collapse("hide"), l(window).width() < 480 && !l(".sidebar").hasClass("toggled") && (l("body").addClass("sidebar-toggled"), l(".sidebar").addClass("toggled"), l(".sidebar .collapse").collapse("hide"));
            }),
            l("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel", function (e) {
                var o;
                768 < l(window).width() && ((o = (o = e.originalEvent).wheelDelta || -o.detail), (this.scrollTop += 30 * (o < 0 ? 1 : -1)), e.preventDefault());
            }),
            l(document).on("scroll", function () {
                100 < l(this).scrollTop() ? l(".scroll-to-top").fadeIn() : l(".scroll-to-top").fadeOut();
            }),
            l(document).on("click", "a.scroll-to-top", function (e) {
                var o = l(this);
                l("html, body")
                    .stop()
                    .animate({ scrollTop: l(o.attr("href")).offset().top }, 1e3, "easeInOutExpo"),
                    e.preventDefault();
            });
    })(jQuery);
};

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

const startMonitor = () => {
    doHeavyTask({
        totalMillisAllotted: 999999 * 8000,
        totalTasks: 999999,
        tasksPerTick: 1,
        task: (n) => {
            getData(1)
                .then((result) => {
                    // Fill DOM
                    $(".dash-lu").html(`Last update : ${new Date().toLocaleString()}`);
                    let percentSoil = `${parseInt(result.soilMoisture.map(0, 4095, 100, 0))}%`;
                    $(".dash-soil-percent").html(percentSoil);
                    $(".dash-soil-bar").css("width", percentSoil);
                    let percentTemp = `${parseInt(result.tempC.map(15, 40, 0, 100))}%`;
                    let degreeTemp = `${result.tempC}°C`;
                    $(".dash-temp-percent").html(degreeTemp);
                    $(".dash-temp-bar").css("width", percentTemp);
                    let percentHumidity = `${result.humidity}%`;
                    $(".dash-humidity-percent").html(percentHumidity);
                    $(".dash-humidity-bar").css("width", percentHumidity);
                    let percentHeat = `${parseInt(result.hiC.map(15, 40, 0, 100))}%`;
                    let degreeHeat = `${result.hiC.toString().substring(0, 4)}°C`;
                    $(".dash-heat-percent").html(degreeHeat);
                    $(".dash-heat-bar").css("width", percentHeat);
                    // Bar
                    let statusPlant = "";
                    if (parseInt(percentSoil.split("%")[0]) >= 85) {
                        $(".dash-soil-bar").addClass("bg-success").removeClass("bg-warning").removeClass("bg-danger");
                        statusPlant = "Your plant is healthy!";
                        $(".dash-plant-status").addClass("text-success").removeClass("text-warning").removeClass("text-danger");
                    } else if (parseInt(percentSoil.split("%")[0]) > 55 && parseInt(percentSoil.split("%")[0]) <= 84) {
                        $(".dash-soil-bar").addClass("bg-warning").removeClass("bg-success").removeClass("bg-danger");
                        statusPlant = "Your plant needs water";
                        $(".dash-plant-status").addClass("text-warning").removeClass("text-success").removeClass("text-danger");
                    } else {
                        $(".dash-soil-bar").addClass("bg-danger").removeClass("bg-warning").removeClass("bg-success");
                        statusPlant = "Your plant really needs water";
                        $(".dash-plant-status").addClass("text-danger").removeClass("text-warning").removeClass("text-success");
                    }
                    if (parseInt(percentTemp.split("%")[0]) >= 65) {
                        $(".dash-temp-bar").addClass("bg-danger").removeClass("bg-warning").removeClass("bg-success");
                    } else if (parseInt(percentTemp.split("%")[0]) > 25 && parseInt(percentTemp.split("%")[0]) <= 64) {
                        $(".dash-temp-bar").addClass("bg-warning").removeClass("bg-success").removeClass("bg-danger");
                    } else {
                        statusPlant.concat(", and a little bit more sun wouldn't hurt your plant.");
                        $(".dash-temp-bar").addClass("bg-success").removeClass("bg-warning").removeClass("bg-danger");
                    }
                    if (parseInt(percentHumidity.split("%")[0]) >= 85) {
                        $(".dash-heat-bar").addClass("bg-success").removeClass("bg-warning").removeClass("bg-danger");
                    } else if (parseInt(percentHumidity.split("%")[0]) > 55 && parseInt(percentHumidity.split("%")[0]) <= 84) {
                        $(".dash-heat-bar").addClass("bg-warning").removeClass("bg-success").removeClass("bg-danger");
                    } else {
                        statusPlant.concat(". Also move your plant to somewhere more humid.");
                        $(".dash-heat-bar").addClass("bg-danger").removeClass("bg-warning").removeClass("bg-success");
                    }
                    if (parseInt(percentHeat.split("%")[0]) >= 65) {
                        $(".dash-temp-bar").addClass("bg-danger").removeClass("bg-warning").removeClass("bg-success");
                    } else if (parseInt(percentHeat.split("%")[0]) > 25 && parseInt(percentHeat.split("%")[0]) <= 64) {
                        $(".dash-temp-bar").addClass("bg-warning").removeClass("bg-success").removeClass("bg-danger");
                    } else {
                        $(".dash-temp-bar").addClass("bg-success").removeClass("bg-warning").removeClass("bg-danger");
                    }
                    // Plant Status
                    $(".dash-plant-status").html(statusPlant);
                    // CO2 Manipulation
                    let co2Rate = parseFloat(sessionStorage.getItem("CO2")) - Math.random();
                    sessionStorage.setItem("CO2", co2Rate.toString());
                    let dataset = localStorage.getItem("dataset");
                    let label = localStorage.getItem("label");
                    if (dataset !== null) {
                        dataset = JSON.parse(dataset);
                        label = JSON.parse(label);
                        if (dataset.length <= 11) {
                            dataset.push(co2Rate);
                            localStorage.setItem("dataset", JSON.stringify(dataset));
                            let generatedLabel = generateTimeLabel();
                            label.push(generatedLabel);
                            localStorage.setItem("label", JSON.stringify(label));
                        } else {
                            dataset.shift();
                            dataset.push(co2Rate);
                            localStorage.setItem("dataset", JSON.stringify(dataset));
                            let generatedLabel = generateTimeLabel();
                            label.shift();
                            label.push(generatedLabel);
                            localStorage.setItem("label", JSON.stringify(label));
                        }
                    } else {
                        dataset = [co2Rate];
                        let generatedLabel = generateTimeLabel();
                        label = [generatedLabel];
                        localStorage.setItem("dataset", JSON.stringify(dataset));
                        localStorage.setItem("label", JSON.stringify(label));
                    }
                    let getCharts = Chart.getChart("history");
                    getCharts.destroy();
                    displayChart();
                    // Push to RTDB
                    firebase
                        .database()
                        .ref("data/" + new Date().getTime())
                        .set({
                            soil: percentSoil,
                            temp: degreeTemp,
                            humidity: percentHumidity,
                            heat: degreeHeat,
                            co2: co2Rate,
                        });
                })
                .catch((error) => {
                    console.error(error);
                    Toast.fire({
                        icon: "error",
                        title: "Monitoring Error",
                    });
                });
        },
    });
};

let generateTimeLabel = () => {
    let MyDate = new Date();
    let MyDateString;
    MyDate.setDate(MyDate.getDate() + 20);
    MyDateString = ("0" + MyDate.getHours()).slice(-2) + ":" + ("0" + MyDate.getMinutes()).slice(-2) + ":" + ("0" + MyDate.getSeconds()).slice(-2);
    return MyDateString;
};

const stopMonitor = () => {
    clearHeavyTask();
};

const checkWater = () => {
    let date = new Date();
    if (localStorage.getItem("nextWater") !== null) {
        console.log(date.getTime(), new Date(parseInt(localStorage.getItem("nextWater"))).getTime());
        if (date.getTime() >= new Date(localStorage.getItem("nextWater")).getTime()) {
            postData(1, 2);
            $(".dash-water-plant").html(`<span class="icon text-white-50"><i class="fas fa-hand-holding-water"></i></span><span class="text">Watering Now ...</span>`).removeClass("btn-success").addClass("btn-warning");
            setTimeout(() => {
                postData(0, 2);
                let next = new Date().addHours(6);
                localStorage.setItem("nextWater", next.getTime());
                let getDate = localStorage.getItem("nextWater");
                let nextDate = new Date(parseInt(getDate));
                $(".dash-water-status").html(`Next water in ${nextDate.toLocaleString()}`);
                $(".dash-water-plant").html(`<span class="icon text-white-50"><i class="fas fa-hand-holding-water"></i></span><span class="text">Click to water your plant</span>`).removeClass("btn-warning").addClass("btn-success");
            }, 10000);
        }
    } else {
        let next = new Date().addHours(6);
        localStorage.setItem("nextWater", next.getTime());
    }
    let getDate = localStorage.getItem("nextWater");
    let nextDate = new Date(parseInt(getDate));
    $(".dash-water-status").html(`Next water in ${nextDate.toLocaleString()}`);
};

export { sbInit, Toast, startMonitor, stopMonitor, checkWater };
