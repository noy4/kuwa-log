import * as firebase from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

if (!firebase.getApps().length) {
  firebase.initializeApp(firebaseConfig)
  console.log('Init firebase')
}

export const db = getFirestore()

export const transform = (val: any) => {
  return {
    ...val,
    createdAt: val.createdAt.toDate(),
    updatedAt: val.updatedAt.toDate(),
  }
}

export const tagsRef = collection(db, 'tags')
export const kLogsRef = collection(db, 'kLogs')
