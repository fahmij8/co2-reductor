import { getUserInfo, logOut } from "./app-firebaseauth.js";
import { sbInit, Toast, startMonitor, stopMonitor, checkWater } from "./app-display.js";
import { displayChart } from "./app-chart.js";
import { fillDB } from "./app-database.js";
import { postData } from "./app-antares.js";

const loadPage = (page) => {
    fetch(`./assets/pages/${page}.html`)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            let content = document.querySelector("#starter-content");
            firebase.auth().onAuthStateChanged(async (user) => {
                if (!user && page !== "login") {
                    // Tell user to login
                    content.innerHTML = "Redirecting ...";
                    window.location.href = "./#login";
                    routePage();
                } else if (!user && page === "login") {
                    // Display Login page
                    content.innerHTML = html;
                    $("#login").click(() => {
                        let provider = new firebase.auth.GoogleAuthProvider();
                        firebase.auth().signInWithRedirect(provider);
                    });
                    $("body").attr("class", "bg-gradient-light");
                } else if (user && page === "login") {
                    // Redirect to dashboard
                    content.innerHTML = "Redirecting ...";
                    window.location.href = "./#dashboard";
                    routePage();
                } else {
                    // Display corresponding page
                    await loadShell(html, "#fillContent");
                }
            });
        })
        .catch((error) => {
            console.log(error);
            routeNotFound();
        });
};

const loadShell = async (contentToAppend, elements) => {
    let page = window.location.hash.substr(1);
    let content = document.querySelector("#starter-content");
    fetch(`./assets/pages/navshell.html`)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            if ($("#accordionSidebar").length === 0) {
                // If shell is not loaded yet
                content.innerHTML = html;
                $("body").removeAttr("class");
                $("body").attr("id", "page-top");
                // Reinitialize Handler
                sbInit();
                $(".handle-all-alerts").click(() => {
                    window.location.href = "#database";
                    setTimeout(() => routePage(), 10);
                });
                // Profile Navbar
                getUserInfo().then((data) => {
                    $("#dashboard-name").html(data.displayName);
                    $("#dashboard-pic").attr("src", data.photoURL);
                    $("#dashboard-logout").click(() => {
                        logOut();
                    });
                });
                // Click Navigation Link Handler
                $(".nav-handler").click(() => {
                    window.location.href = `#${page}`;
                    setTimeout(() => routePage(), 10);
                });
            }

            // Clear navigation active state
            $("#nav-dash").removeClass("active");
            $("#nav-database").removeClass("active");

            // Append html
            document.querySelector(elements).innerHTML = contentToAppend;

            if (page === "dashboard") {
                console.log("Page Dashboard");
                $("#nav-dash").addClass("active");
                $(".dash-monitoring").click(() => {
                    let states = $(".dash-monitoring").data("state");
                    if (states === 0) {
                        checkWater();
                        startMonitor();
                        Toast.fire({
                            icon: "info",
                            title: "Monitoring Started",
                        });
                        $(".dash-monitoring").removeClass("btn-success").addClass("btn-secondary").html(`<span class="icon text-white-50"><i class="fas fa-stop-circle"></i></span><span class="text">Stop Monitoring</span>`).data("state", 1);
                    } else {
                        stopMonitor();
                        Toast.fire({
                            icon: "info",
                            title: "Monitoring Stopped",
                        });
                        $(".dash-monitoring").removeClass("btn-secondary").addClass("btn-success").html(`<span class="icon text-white-50"><i class="fas fa-sync"></i></span><span class="text">Start Monitoring</span>`).data("state", 0);
                    }
                });
                $(".dash-water-plant").click(() => {
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
                });
                displayChart();
            } else if (page === "database") {
                fillDB();
            }
        })
        .catch((error) => {
            console.log(error);
            console.log("Page not found!");
            fetch(`./assets/pages/404.html`)
                .then((response) => {
                    return response.text();
                })
                .then(async (html) => {
                    content.innerHTML = html;
                });
        });
};

const routePage = () => {
    let page = window.location.hash.substr(1);
    if (page == "") page = "login";
    loadPage(page);
};

const routeNotFound = () => {
    let content = document.querySelector("#fillContent");
    console.log("Page not found!");
    fetch(`./assets/pages/404.html`)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            content.innerHTML = html;
        });
};

export { routePage };
