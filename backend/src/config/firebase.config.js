const admin = require('firebase-admin');
const path = require('path');

// Inicializar Firebase Admin SDK
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './firebase-service-account.json';

try {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
  
  console.log('✅ Firebase Admin SDK inicializado correctamente');
} catch (error) {
  console.warn('⚠️ Firebase Admin SDK no configurado. Usando modo de desarrollo.');
  console.warn('   Para producción, configura FIREBASE_SERVICE_ACCOUNT_PATH en .env');
  
  // Inicialización mínima para desarrollo
  if (!admin.apps.length) {
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'ecocondor-dev'
    });
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
