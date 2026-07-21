// Firebase setup for IT Meeting Minutes Generator
// This file uses Firebase Realtime Database to save and load meeting records.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAnalytics, isSupported as analyticsIsSupported } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAn8vFvz_Kzi-U_UpzdV9ydVwmR4Pa_nGE",
  authDomain: "it-minutes.firebaseapp.com",
  databaseURL: "https://it-minutes-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "it-minutes",
  storageBucket: "it-minutes.firebasestorage.app",
  messagingSenderId: "773702419923",
  appId: "1:773702419923:web:10abadf3fa5cf2783a9b26",
  measurementId: "G-FZ4GBG0R2H"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

analyticsIsSupported()
  .then((supported) => {
    if (supported) getAnalytics(app);
  })
  .catch(() => {
    // Analytics is optional. The minutes generator works even if analytics is unavailable.
  });

const MEETING_RECORDS_PATH = "meetingRecords";
const LATEST_ID_PATH = "metadata/latestId";

function safeClone(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function byLatestFirst(a, b) {
  const dateA = a.date || "";
  const dateB = b.date || "";
  if (dateA !== dateB) return dateB.localeCompare(dateA);
  return Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0);
}

function compactRecord(id, value = {}) {
  return {
    id,
    title: value.title || "I.T Meeting",
    date: value.date || "",
    description: value.objective || value.description || "IT meeting minutes record.",
    preparedBy: value.preparedBy || "",
    updatedAt: value.updatedAt || 0,
    createdAt: value.createdAt || 0
  };
}

async function listMeetings() {
  const recordsSnap = await get(ref(db, MEETING_RECORDS_PATH));
  const records = [];

  if (recordsSnap.exists()) {
    recordsSnap.forEach((childSnap) => {
      records.push(compactRecord(childSnap.key, childSnap.val()));
    });
  }

  records.sort(byLatestFirst);

  let latestId = "";
  const latestSnap = await get(ref(db, LATEST_ID_PATH)).catch(() => null);
  if (latestSnap?.exists()) latestId = latestSnap.val();
  if (!latestId && records.length) latestId = records[0].id;

  return { records, latestId };
}

async function getMeeting(id) {
  if (!id) throw new Error("Missing Firebase meeting record ID.");
  const snap = await get(ref(db, `${MEETING_RECORDS_PATH}/${id}`));
  if (!snap.exists()) throw new Error("Meeting record not found in Firebase.");
  return { ...snap.val(), firebaseId: id };
}

async function saveMeeting(id, meetingData) {
  const payload = safeClone(meetingData);
  const recordRef = id ? ref(db, `${MEETING_RECORDS_PATH}/${id}`) : push(ref(db, MEETING_RECORDS_PATH));
  const recordId = id || recordRef.key;

  let existingCreatedAt = null;
  if (id) {
    const existingSnap = await get(recordRef).catch(() => null);
    existingCreatedAt = existingSnap?.val()?.createdAt || null;
  }

  payload.firebaseId = recordId;
  payload.createdAt = existingCreatedAt || serverTimestamp();
  payload.updatedAt = serverTimestamp();

  await set(recordRef, payload);
  await set(ref(db, LATEST_ID_PATH), recordId);

  return { id: recordId };
}

async function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

async function signOutUser() {
  return signOut(auth);
}

function onAuthChanged(callback) {
  return onAuthStateChanged(auth, callback);
}

function getCurrentUser() {
  return auth.currentUser;
}

const api = {
  listMeetings,
  getMeeting,
  saveMeeting,
  signIn,
  signOutUser,
  onAuthChanged,
  getCurrentUser
};

window.ITMinutesFirebase = api;
window.dispatchEvent(new CustomEvent("it-minutes-firebase-ready", { detail: api }));
