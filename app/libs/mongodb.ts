import { MongoClient, ServerApiVersion } from "mongodb";
import type {
  DBCollection,
  GoalOption,
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

  /**
   * Initializes the variables for the class with the main being the mongoDbUri.
   *  The mongoDbUri variable is set to the database connection string if the username and password are gathered, or null if they fail to be acquired.
   */
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

  /**
   * Initializes a new client database client
   */
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

  /**
   * Tests the database connection by pinging the remote database
   * @throws Signals that the process failed
   */
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

  /**
   * CRUD method for adding a new user account and returns with the new entry's id
   * @throws Signals that the process failed
   */
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

  /**
   * CRUD method for validating an existing account. Returns with the entry's id if the passed in credentials are valid
   * or null if they are not
   * @throws Signals that the process failed
   * @returns Returns the payload string generated after validating the user's credentials or null if the passed in credentials are invalid
   */
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
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for creating a new weight entry. Returns with the entry's id if creation is successful
   * @throws Signals that the process failed
   */
  async createWeightEntry(
    weightValue: number,
    weighInDate: string,
    userId: string,
  ) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Generates a random uuid value for the entry id
      const newEntryId = crypto.randomUUID();

      const newWeightEntry: WeightEntryType = {
        _id: newEntryId,
        weightValue,
        weighInDate,
        userId,
      };

      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<WeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      const insertResult = await dbCollection.insertOne(newWeightEntry);

      // Returns the boolean for denoting if the insert was successful
      return insertResult.acknowledged;
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for reading all weight entry associated with a user id. Returns an array of all entries, but if no entries are found an empty array is returned
   * @throws Signals that the process failed
   */
  async readWeightEntries(userId: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<WeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Constructs query for filtering the collection
      const query = {
        userId: userId,
      };

      // Obtains a cursor from the database
      const readResult = dbCollection.find(query);

      // Converts the cursor entries to an array
      const weightEntriesArray = await readResult.toArray();

      // Returns the array of entries, or if no entries are found an empty array is returned
      return weightEntriesArray;
    } catch (error) {
      // Throws any error back to the service function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for reading a weight entry. Returns the weight entry data if found and null if no entry is found
   * @throws Signals that the process failed
   */
  async readWeightEntry(weightEntryId: string, userId: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<WeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Constructs query for filtering the collection
      const query = {
        _id: weightEntryId,
        userId: userId,
      };

      // Obtains the entry from the database
      const readResult = await dbCollection.findOne(query);

      // Returns the found entry or a null value if no entry was found
      return readResult;
    } catch (error) {
      // Throws any error back to the service function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for updating a weight entry. Returns true if the update is successful and false if an entry is not found or the update fails
   * @throws Signals that the process failed
   */
  async updateWeightEntry(
    weightEntryId: string,
    weightValue: number,
    weighInDate: string,
    userId: string,
  ) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Constructs the query for filtering the database
      const query = {
        _id: weightEntryId,
        userId,
      };

      // Constructs the object containing the entries to update
      const updateValues = {
        $set: {
          weightValue,
          weighInDate,
        },
      };

      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<WeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Updates the entry matching the query and returns its result
      const updateResult = await dbCollection.updateOne(query, updateValues);

      // Checks if the entry was updated
      if (updateResult.modifiedCount === 0) {
        throw new Error("Entry not found!", {
          cause: errorCausesObj.noUserEntry,
        });
      }

      // Returns boolean denoting if the update was successful
      return updateResult.acknowledged;
    } catch (error) {
      // Throws any error back to the service function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for deleting a weight entry. Returns true if deletion was successful and false if the deletion failed or was not found
   * @throws Signals that the process failed
   */
  async deleteWeightEntry(weightEntryId: string, userId: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Constructs the query for filtering the database
      const query = {
        _id: weightEntryId,
        userId,
      };

      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<WeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Deletes the entry matching the query and returns its result
      const deleteResult = await dbCollection.deleteOne(query);

      // Checks if the entry was deleted
      if (deleteResult.deletedCount === 0) {
        throw new Error("Entry not found!", {
          cause: errorCausesObj.noUserEntry,
        });
      }

      // Returns boolean denoting if the deletion was successful
      return deleteResult.acknowledged;
    } catch (error) {
      // Throws any error back to the service function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for creating a new goal weight entry. Returns with the entry's id if creation is successful
   * @throws Signals that the process failed
   */
  async createGoalWeightEntry(
    weightValue: number,
    goalType: GoalOption,
    userId: string,
  ) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Generates a random uuid value for the entry id
      const newEntryId = crypto.randomUUID();

      const newGoalWeightEntry: GoalWeightEntryType = {
        _id: newEntryId,
        weightValue,
        goalType,
        userId,
      };

      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<GoalWeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      //Inserts the new goal weight entry into the database and stores the result
      const insertResult = await dbCollection.insertOne(newGoalWeightEntry);

      // Returns the boolean for denoting if the insert was successful
      return insertResult.acknowledged;
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for reading a weight entry. Returns the weight entry data if found and null if no entry is found
   * @throws Signals that the process failed
   */
  async readGoalWeightEntry(userId: string) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<GoalWeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Constructs query for filtering the collection
      const query = {
        userId: userId,
      };

      // Obtains the entry from the database
      const readResult = await dbCollection.findOne(query);

      // Returns the found entry or a null value if no entry was found
      return readResult;
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    } finally {
      await client.close();
    }
  }

  /**
   * CRUD method for updating a goal weight entry. Returns true if the update is successful and false if an entry is not found or the update fails
   * @throws Signals that the process failed
   */
  async updateGoalWeightEntry(
    goalWeightEntryId: string,
    weightValue: number,
    goalType: GoalOption,
    userId: string,
  ) {
    const client = this._getDBConnection();

    if (client === null) {
      throw new Error("Failed to access the database", {
        cause: errorCausesObj.databaseInitializationError,
      });
    }

    try {
      // Constructs the query for filtering the database
      const query = {
        _id: goalWeightEntryId,
        userId,
      };

      // Constructs the object containing the entries to update
      const updateValues = {
        $set: {
          weightValue,
          goalType,
        },
      };

      // Initializes a connection to the weight entry collection
      const dbCollection = client
        .db(this.DATABASE_NAME)
        .collection<GoalWeightEntryType>(this.USER_ACCOUNT_COLLECTION);

      // Updates the entry matching the query and returns its result
      const updateResult = await dbCollection.updateOne(query, updateValues);

      // Returns boolean denoting if the update was successful
      return updateResult.acknowledged;
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    } finally {
      await client.close();
    }
  }
}

export const WeightTrackerDataBase = new WeightTrackerDB();
