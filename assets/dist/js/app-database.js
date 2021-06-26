let fillDB = () => {
    $(".table-responsive").hide();
    let itemProcessed = 0;
    firebase
        .database()
        .ref(`data`)
        .once("value", (snapshot) => {
            let dbJson = snapshot.val();
            if (dbJson === undefined || dbJson === null) {
                $(".card-body").html("Empty screenshoot!");
            } else {
                Object.entries(dbJson).forEach((data) => {
                    $("#fill-DB").append(`
                    <tr>
                        <td>${new Date(parseInt(data[0])).toLocaleString()}</td>
                        <td>${data[1]["co2"].toString().substr(0, 8)} ppm</td>
                        <td>${data[1]["humidity"]}</td>
                        <td>${data[1]["temp"]}</td>
                        <td>${data[1]["soil"]}</td>
                        <td>${data[1]["heat"]}</td>
                    </tr>
                    `);
                    itemProcessed += 1;
                    if (itemProcessed === Object.entries(dbJson).length) {
                        let tables = $("#dataDB").DataTable({
                            retrieve: true,
                            order: [[0, "desc"]],
                            lengthMenu: [
                                [5, 20, 50, -1],
                                [5, 20, 50, "All"],
                            ],
                            buttons: [
                                { extend: "copy", className: "btn btn-success shadow d-block d-md-inline-block d-lg-inline-block mb-2 mb-md-0 mb-lg-0 mr-0 mr-md-1 mr-lg-1", text: "Copy" },
                                { extend: "pdf", className: "btn btn-success shadow d-block d-md-inline-block d-lg-inline-block mb-2 mb-md-0 mb-lg-0 mr-0 mr-md-1 mr-lg-1", text: "Export as PDF" },
                                { extend: "excel", className: "btn btn-success shadow d-block d-md-inline-block d-lg-inline-block mb-2 mb-md-0 mb-lg-0 mr-0 mr-md-1 mr-lg-1", text: "Export as Excel" },
                            ],
                        });
                        tables.buttons(0, null).containers().appendTo("#exportDB");
                        $(".loader-container").hide();
                        $(".table-responsive").show();
                    }
                });
            }
        });
};

export { fillDB };
