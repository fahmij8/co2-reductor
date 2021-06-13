import { getData } from "./app-antares.js";

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

const timeValidityChecker = (datas) => {
    let parsedData = JSON.parse(datas);
    let lastUpdate = parsedData["m2m:cin"]["ct"];
    lastUpdate = lastUpdate.split("T");
    lastUpdate = parseInt(lastUpdate[1].substring(0, 2));
    let timeNow = new Date().getHours();
    if (timeNow - lastUpdate <= 1) {
        return true;
    } else {
        return false;
    }
};

const dashboardCheckDeviceStatus = async () => {
    $(".dash-check").addClass("disabled");
    $(".dash-check").html("Please wait ...");
    await getData(2, "no-parsing").then((result) => {
        let statusCam = timeValidityChecker(JSON.parse(result));
        if (statusCam) {
            $(".dash-cam-border").removeClass("border-left-danger");
            $(".dash-cam-text").removeClass("text-danger");
            $(".dash-cam-border").addClass("border-left-success");
            $(".dash-cam-text").addClass("text-success");
            $(".dash-cam-stat").html("Activated");
        } else {
            $(".dash-cam-border").removeClass("border-left-success");
            $(".dash-cam-text").removeClass("text-success");
            $(".dash-cam-border").addClass("border-left-danger");
            $(".dash-cam-text").addClass("text-danger");
            $(".dash-cam-stat").html("Deactivated");
        }
    });
    $(".dash-lu").html(`Last system up checked : ${new Date().toLocaleString()}`);
    $(".dash-check").removeClass("disabled");
    $(".dash-check").html("Check Status");
};

export { sbInit, Toast, dashboardCheckDeviceStatus };
