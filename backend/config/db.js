const mongoose = require('mongoose');

let isConnectedToMongo = false;

// Intercepter les erreurs de connexion pour éviter le crash en mode secours
mongoose.connection.on('error', (err) => {
  isConnectedToMongo = false;
});

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecole_db';
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500
    });
    isConnectedToMongo = true;
    console.log(`[MongoDB] Connecté avec succès à : ${uri}`);
  } catch (err) {
    isConnectedToMongo = false;
    await mongoose.disconnect().catch(() => {});
    console.log(`[Mode Local/Secours] MongoDB non détecté sur ${uri}. Utilisation du stockage local persistant (JSON DB).`);
    console.log(`-> Pour utiliser MongoDB Compass ou MongoDB Atlas, définissez MONGODB_URI dans backend/.env`);
  }
};

const getDbStatus = () => ({
  mode: isConnectedToMongo ? 'mongodb' : 'json_fallback',
  connected: isConnectedToMongo
});

module.exports = { connectDB, getDbStatus, isConnected: () => isConnectedToMongo };
