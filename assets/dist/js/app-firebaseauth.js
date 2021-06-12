import { routePage } from "./app-route.js";

const firebaseInit = async () => {
    let firebaseConfig = {
        apiKey: "AIzaSyAqK13mu6i4RRWjGOzn7JQCoAAfWRVfQiQ",
        authDomain: "door-security-antares.firebaseapp.com",
        databaseURL: "https://door-security-antares-default-rtdb.firebaseio.com",
        projectId: "door-security-antares",
        storageBucket: "door-security-antares.appspot.com",
        messagingSenderId: "108760617876",
        appId: "1:108760617876:web:9f1d1c9dd57bb66312b581",
        measurementId: "G-PBDVMT1X2B",
    };
    await firebase.initializeApp(firebaseConfig);
    await firebase.analytics();
};

const getUserInfo = async () => {
    return await firebase.auth().currentUser;
};

const logOut = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            window.location.href = "./index.html";
            routePage();
        })
        .catch((error) => {
            console.error(error);
        });
};

export { firebaseInit, getUserInfo, logOut };
