import { Toast } from "./app-display.js";

const antaresAccessKey = "9634da50ff7abd7a:3bdb608765b907a4";
const antaresEndpointEsp32 = "https://platform.antares.id:8443/~/antares-cse/antares-id/CO2Reductor/sensorData";
const antaresEndpointPump = "https://platform.antares.id:8443/~/antares-cse/antares-id/CO2Reductor/pump";
const antaresGetLatest = "/la";

const parseData = (data, condition = "") => {
    try {
        if (condition === "") {
            data = JSON.parse(JSON.parse(data));
            data = JSON.parse(data["m2m:cin"].con);
            return data;
        } else {
            data = JSON.parse(JSON.parse(data));
            return data;
        }
    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Parsing data failed!",
        });
        clearHeavyTask();
        console.error(error);
    }
};

const getData = (destination, condition = "") => {
    if (destination === 1) {
        destination = antaresEndpointEsp32 + antaresGetLatest;
    } else if (destination === 2) {
        destination = antaresEndpointPump + antaresGetLatest;
    } else {
        return false;
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
                    resolve(parseData(res, condition));
                }
            },
            error: (res) => {
                console.error(res);
                Toast.fire({
                    icon: "error",
                    title: "Getting data failed!",
                });
                clearHeavyTask();
                reject(res);
            },
        });
    });
};

const postData = (data, destination) => {
    if (destination === 1) {
        destination = antaresEndpointEsp32;
    } else if (destination === 2) {
        destination = antaresEndpointPump;
    } else {
        return false;
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://antares-gp.herokuapp.com/post-data.php",
            method: "POST",
            crossDomain: true,
            data: {
                data: `{\r\n    \"m2m:cin\": {\r\n    \"con\": \"{\\\"state\\\":${data}}\"\r\n    }\r\n}`,
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
                clearHeavyTask();
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
