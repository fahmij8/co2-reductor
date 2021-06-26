import { routePage } from "./app-route.js";

const firebaseInit = async () => {
    let firebaseConfig = {
        apiKey: "AIzaSyBGBGg9ABq5-v3CuinK7Dv3f7U7pynvvvY",
        authDomain: "co2-reductor.firebaseapp.com",
        projectId: "co2-reductor",
        storageBucket: "co2-reductor.appspot.com",
        messagingSenderId: "890373173619",
        appId: "1:890373173619:web:05dde8763af3a834255506",
        measurementId: "G-17Z4NMW223",
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
