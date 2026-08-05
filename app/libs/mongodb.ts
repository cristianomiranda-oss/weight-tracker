export class WeightTrackerDB {
  mongoDbUri: string;
  isDBInitialized: boolean;

  constructor() {
    const userName = process.env.DB_USERNAME;
    const passWord = process.env.DB_PASSWORD;

    if (userName === undefined || passWord === undefined) {
      this.mongoDbUri = "";
      this.isDBInitialized = false;
    } else {
      this.mongoDbUri = `mongodb://${userName}:${passWord}@ac-udfeevm-shard-00-00.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-01.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-02.a0yqeq4.mongodb.net:27017/?ssl=true&replicaSet=atlas-t9numu-shard-0&authSource=admin&appName=Weight-Tracking-Data`;
      this.isDBInitialized = true;
    }
  }
}
