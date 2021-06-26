const displayChart = () => {
    let options = {
        type: "line",
        data: {
            labels: JSON.parse(localStorage.getItem("label")),
            datasets: [
                {
                    label: "CO2 Rate",
                    tension: 0.3,
                    backgroundColor: "rgba(28, 200, 137, 0.05)",
                    borderColor: "rgba(28, 200, 137, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(28, 200, 137, 1)",
                    pointBorderColor: "rgba(28, 200, 137, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(28, 200, 137, 1)",
                    pointHoverBorderColor: "rgba(28, 200, 137, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: JSON.parse(localStorage.getItem("dataset")),
                    fill: "origin",
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 10,
                },
            },
            scales: {
                xAxis: {
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                    max: 11,
                },

                yAxis: {
                    ticks: {
                        padding: 10,
                        callback: function (value, index, values) {
                            return `${value} ppm`;
                        },
                    },
                    grid: {
                        color: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
                interaction: {
                    intersect: false,
                    mode: "index",
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: "rgb(255,255,255)",
                    bodyColor: "#858796",
                    titleMarginBottom: 10,
                    titleColor: "#6e707e",
                    titleFont: {
                        size: 14,
                    },
                    borderColor: "#dddfeb",
                    borderWidth: 1,
                    padding: 15,
                    displayColors: false,
                    caretPadding: 10,
                    callbacks: {
                        title: (context) => {
                            console.log(context);
                            return `${context[0].dataset.data[context[0].dataIndex].toString().substr(0, 7)} ppm`;
                        },
                        label: (context) => {
                            return `Last Updated : ${context.label}`;
                        },
                    },
                },
            },
        },
    };

    // Area Chart Example
    let ctx = document.getElementById("history").getContext("2d");
    let myLineChart = new Chart(ctx, options);
};

export { displayChart };
