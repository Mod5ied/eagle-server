import { env } from '@config/env.js';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';

let app: App;
if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
} else {
  app = getApps()[0];
}

export const db = getFirestore(app);
