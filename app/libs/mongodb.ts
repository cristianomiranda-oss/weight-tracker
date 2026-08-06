import { MongoClient, ServerApiVersion } from "mongodb";
import type {
  DBCollection,
  GoalWeightEntryType,
  UserAccount,
  WeightEntryType,
} from "./types";
import { errorCausesObj } from "../utils/errors";
import { checkPassword, hashPassword } from "./verification";
import { getAccountPayload } from "./payload-generation";

class WeightTrackerDB {
  mongoDbUri: string | null;
  DATABASE_NAME: string;
  USER_ACCOUNT_COLLECTION: DBCollection;
  WEIGHT_ENTRY_COLLECTION: DBCollection;
  GOAL_WEIGHT_ENTRY_COLLECTION: DBCollection;

  constructor() {
    // Database name
    this.DATABASE_NAME = "WEIGHT_TRACKER";

    // Collection names
    this.USER_ACCOUNT_COLLECTION = "USER_ACCOUNT";
    this.WEIGHT_ENTRY_COLLECTION = "WEIGHT_ENTRY";
    this.GOAL_WEIGHT_ENTRY_COLLECTION = "GOAL_WEIGHT_ENTRY";

    const userName: string | undefined = process.env.DB_USERNAME;
    const passWord: string | undefined = process.env.DB_PASSWORD;

    // Checks if the username and password values were successfully gathered
    if (userName === undefined || passWord === undefined) {
      // If not the client is set to null
      this.mongoDbUri = null;
    } else {
      // If so, the uri is created and a new client is created
      this.mongoDbUri = `mongodb://${userName}:${passWord}@ac-udfeevm-shard-00-00.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-01.a0yqeq4.mongodb.net:27017,ac-udfeevm-shard-00-02.a0yqeq4.mongodb.net:27017/?ssl=true&replicaSet=atlas-t9numu-shard-0&authSource=admin&appName=Weight-Tracking-Data`;
    }
  }

  _getDBConnection() {
    try {
      if (this.mongoDbUri === null) {
        throw new Error("Failed to connect to database", {
          cause: errorCausesObj.databaseInitializationError,
        });
      }

      const client = new MongoClient(this.mongoDbUri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });

      return client;
    } catch (error) {
      return null;
    }
  }

  async testDbConnection() {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Connects to the database and pings it before closing
      await client.connect();
      await client.db("admin").command({ ping: 1 });

      return "Database Connected!";
    } catch (error) {
      throw error;
    } finally {
      await client.close();
    }
  }

  async createNewUserAccount(userName: string, userPassword: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Generates a random uuid value for the entry id
      const newUserId = crypto.randomUUID();

      // Hashes the user's password before storing
      const hashedPassword = await hashPassword(userPassword);

      // A new user object is created
      const newUserAccount: UserAccount = {
        _id: newUserId,
        userName,
        userPassword: hashedPassword,
      };

      // Initializes a connection to the accounts collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<UserAccount>(this.USER_ACCOUNT_COLLECTION);

      const insertResult = await dbCollection.insertOne(newUserAccount);

      // Returns the boolean for denoting if the insert was successful
      return insertResult.acknowledged;
    } catch (error) {
      throw new Error(`Failed to insert`, {
        cause: errorCausesObj.databaseCrudError,
      });
    } finally {
      await client.close();
    }
  }

  async validateUserAccount(userName: string, userPassword: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Initializes a connection to the accounts collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<UserAccount>(this.USER_ACCOUNT_COLLECTION);

      // Constructs the query for searching the collection
      const query = {
        userName: userName,
      };

      // Queries the database for the one account that contains the matching username
      const userAccountData = await dbCollection.findOne(query);

      // Checks if an account associated with the username was found
      if (userAccountData === null) {
        // Returns null to denote signin failed
        return null;
      }

      // Calls the method to compare the stored hashed password with the one entered by the user
      const isPasswordValid = await checkPassword(
        userPassword,
        userAccountData.userPassword,
      );

      // Checks the user's credentials after obtaining the account data
      if (isPasswordValid) {
        // Generates a user account payload
        const userPayload = await getAccountPayload(
          userAccountData._id,
          userAccountData.userName,
        );

        // Resolves with the user's account obj
        return userPayload;
      } else {
        // Returns null to denote signin failed
        return null;
      }
    } catch (error) {
      throw new Error(`Failed to insert`, {
        cause: errorCausesObj.databaseCrudError,
      });
    } finally {
      await client.close();
    }
  }
}

export const WeightTrackerDataBase = new WeightTrackerDB();
