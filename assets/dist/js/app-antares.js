import { Toast } from "./app-display.js";

const antaresAccessKey = "9634da50ff7abd7a:3bdb608765b907a4";
const antaresEndpointEsp32 = "https://platform.antares.id:8443/~/antares-cse/antares-id/SmartDoorSecurity/esp32";
const antaresEndpointCamera = "https://platform.antares.id:8443/~/antares-cse/antares-id/SmartDoorSecurity/camIP";
const antaresEndpointReed = "https://platform.antares.id:8443/~/antares-cse/antares-id/SmartDoorSecurity/reedswitch";
const antaresEndpointEsp32Status = "https://platform.antares.id:8443/~/antares-cse/antares-id/SmartDoorSecurity/esp32-status";
const antaresGetLatest = "/la";

const parseData = (data) => {
    try {
        data = JSON.parse(JSON.parse(data));
        data = JSON.parse(data["m2m:cin"].con);
        return data;
    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Parsing data failed!",
        });
        console.error(error);
    }
};

const getData = (destination, condition = "") => {
    if (destination === 1) {
        destination = antaresEndpointEsp32 + antaresGetLatest;
    } else if (destination === 2) {
        destination = antaresEndpointCamera + antaresGetLatest;
    } else if (destination === 3) {
        destination = antaresEndpointReed + antaresGetLatest;
    } else if (destination === 4) {
        destination = antaresEndpointEsp32Status + antaresGetLatest;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://antares-gp.herokuapp.com/get-data.php",
            method: "POST",
            crossDomain: true,
            data: {
                endpoint: destination,
                accesskey: antaresAccessKey,
            },
            success: (res) => {
                if (condition === "") {
                    console.log(`[G : ${new Date().toLocaleTimeString()}] = `, parseData(res));
                    resolve(parseData(res));
                } else {
                    console.log(`[G : ${new Date().toLocaleTimeString()}] = `, parseData(res));
                    resolve(res);
                }
            },
            error: (res) => {
                console.error(res);
                Toast.fire({
                    icon: "error",
                    title: "Getting data failed!",
                });
                reject(res);
            },
        });
    });
};

const postData = (data, destination) => {
    if (destination === 1) {
        destination = antaresEndpointEsp32;
    } else if (destination === 2) {
        destination = antaresEndpointCamera;
    } else if (destination === 3) {
        destination = antaresEndpointReed;
    } else if (destination === 4) {
        destination = antaresEndpointEsp32Status;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://antares-gp.herokuapp.com/post-data.php",
            method: "POST",
            crossDomain: true,
            data: {
                data: `{\r\n    \"m2m:cin\": {\r\n    \"con\": \"{\\\"lamp\\\":${data[0]},\\\"buzzer\\\":${data[1]},\\\"lock\\\":${data[2]},\\\"servo\\\":${data[3]}}\"\r\n    }\r\n}`,
                endpoint: destination,
                accesskey: antaresAccessKey,
            },
            success: (res) => {
                console.log(`[P : ${new Date().toLocaleTimeString()}] = `, parseData(res));
                resolve(parseData(res));
            },
            error: (res) => {
                console.error(res);
                Toast.fire({
                    icon: "error",
                    title: "Posting data failed!",
                });
                reject(res);
            },
        });
    });
};

const doHeavyTask = (params) => {
    let totalMillisAllotted = params.totalMillisAllotted;
    let totalTasks = params.totalTasks;
    let tasksPerTick = params.tasksPerTick;
    let tasksCompleted = 0;
    let totalTicks = Math.ceil(totalTasks / tasksPerTick);
    let interval = null;

    if (totalTicks === 0) return;

    let doTick = function () {
        let totalByEndOfTick = Math.min(tasksCompleted + tasksPerTick, totalTasks);

        do {
            params.task(tasksCompleted++);
        } while (tasksCompleted < totalByEndOfTick);

        if (tasksCompleted >= totalTasks) clearInterval(interval);
    };

    doTick();
    if (totalTicks > 1) interval = setInterval(doTick, totalMillisAllotted / totalTicks);
};

const clearHeavyTask = () => {
    for (var i = 1; i < 9999; i++) window.clearInterval(i);
};

export { getData, postData, doHeavyTask, clearHeavyTask };
