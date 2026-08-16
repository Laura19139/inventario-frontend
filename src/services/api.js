import axios from "axios";

function notifySessionChanged() {
    window.dispatchEvent(new CustomEvent("session-changed"));
}

const API = axios.create({
    baseURL: "https://inventario-backend-production-8c29.up.railway.app/api"
});

function createLocalSession({ name, username, token = null }) {
    const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    const session = {
        id: Date.now(),
        name: name || username,
        username: username,
        token: token,
        createdAt: new Date().toISOString()
    };

    sessions.push(session);
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("currentSession", JSON.stringify(session));
    notifySessionChanged();
    return session;
}

export async function loginUser(username, password) {
    const res = await API.post("/users/login", { username, password });
    const name = res.data && (res.data.name || res.data.user?.name) ? (res.data.name || res.data.user?.name) : username;
    const token = res.data && (res.data.token || res.data.accessToken) ? (res.data.token || res.data.accessToken) : null;
    const session = createLocalSession({ name, username, token });
    return { res, session };
}

export async function registerUser(name, username, password) {
    const res = await API.post("/users/register", {
        id: 0,
        name,
        username,
        password
    });

    // create a local session record even if backend doesn't return token
    const session = createLocalSession({ name, username, token: null });
    return { res, session };
}

export function getSessions() {
    return JSON.parse(localStorage.getItem("sessions") || "[]");
}

export function getCurrentSession() {
    return JSON.parse(localStorage.getItem("currentSession") || "null");
}

export function getSessionsCount() {
    return getSessions().length;
}

export function getBurnedCount() {
    return parseInt(localStorage.getItem("sessions_burned") || "0");
}

export function logoutCurrent() {
    const cur = getCurrentSession();
    if (!cur) return;
    const burned = getBurnedCount() + 1;
    localStorage.setItem("sessions_burned", String(burned));
    localStorage.removeItem("currentSession");
    notifySessionChanged();
}

export default API;