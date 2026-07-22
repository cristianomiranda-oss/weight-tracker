import type {
  DataBaseAccessType,
  DataBaseIndex,
  DataBaseStore,
  UserAccount,
  WeightEntryType,
} from "./types";

export class IndexedDB {
  // Database info
  static dbName = "WEIGHT_TRACKER";
  static dbVersion = 1;

  // Store names
  static USER_ACCOUNT_STORE: DataBaseStore = "USER_ACCOUNT";
  static WEIGHT_ENTRY_STORE: DataBaseStore = "WEIGHT_ENTRY";
  static GOAL_WEIGHT_ENTRY_STORE: DataBaseStore = "GOAL_WEIGHT_ENTRY";

  // Store names
  static USER_NAME_INDEX: DataBaseIndex = "USER_NAME";
  static WEIGHT_ENTRY_ID_INDEX: DataBaseIndex = "WEIGHT_ENTRY_ID";
  static USER_ID_INDEX: DataBaseIndex = "USER_ID";

  /**
   * Private method that returns an async promise to access the web browser's indexedDB api
   * @resolves Database object from indexedDB api
   * @rejects Error causing the failed database request
   */
  static _accessDB(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      try {
        const dbRequest = window.indexedDB.open(this.dbName, this.dbVersion);

        // Initializes error handle in the event the database request fails
        dbRequest.onerror = (e) => {
          reject(e);
        };

        dbRequest.onupgradeneeded = () => {
          // Accesses the database
          const db = dbRequest.result;

          // Creates the user accounts store
          const userAccountsStore = db.createObjectStore(
            this.USER_ACCOUNT_STORE,
            { keyPath: "userId", autoIncrement: true },
          );
          // Creates the userName index
          userAccountsStore.createIndex(this.USER_NAME_INDEX, "userName", {
            unique: true,
          });

          // Creates the weight entry store
          const weightEntryStore = db.createObjectStore(
            this.WEIGHT_ENTRY_STORE,
            { keyPath: "weightEntryId", autoIncrement: true },
          );
          // Creates the weigh entry id index and the user id index
          weightEntryStore.createIndex(
            this.WEIGHT_ENTRY_ID_INDEX,
            "weightEntryId",
            { unique: true },
          );
          weightEntryStore.createIndex(this.USER_ID_INDEX, "userId", {
            unique: false,
          });

          // Creates the goal weight entry store
          const goalWeightEntryStore = db.createObjectStore(
            this.GOAL_WEIGHT_ENTRY_STORE,
            { keyPath: "goalWeightEntryId", autoIncrement: true },
          );
          // Creates the user id index
          goalWeightEntryStore.createIndex(this.USER_ID_INDEX, "userId", {
            unique: true,
          });
        };

        dbRequest.onsuccess = () => {
          // Resolves the promise with the db request result
          resolve(dbRequest.result);
        };
      } catch (error) {
        // Rejects promise with the error
        reject(error);
      }
    });
  }

  /**
   * Private method that returns an accessible object stored based on the parameter types passed in
   * @throws Signals that the process failed
   */
  static async _openDBStore(
    dbStore: DataBaseStore,
    accessType: DataBaseAccessType,
  ) {
    try {
      const db = await this._accessDB();

      const storeTransaction = db.transaction([dbStore], accessType);

      const objectStore = storeTransaction.objectStore(dbStore);

      return objectStore;
    } catch (error) {
      throw error;
    }
  }

  /**
   * CRUD method for adding a new user account and returns with the new entry's id
   * @throws Signals that the process failed
   */
  static async createNewUserAccount(userName: string, userPassword: string) {
    try {
      // Accesses the user account object store to write a new entry to it
      const accountsStore = await this._openDBStore(
        this.USER_ACCOUNT_STORE,
        "readwrite",
      );

      // A new user object is created without the userId, as it is added upon being inserting into the database
      const newUserAccount = { userName, userPassword };

      // Returns a new promise that will resolve with the new entry's id or throw an error if any issue occurs
      return await new Promise<number>((resolve, reject) => {
        try {
          const addResult = accountsStore.add(newUserAccount);

          addResult.onerror = (e) => {
            reject(e);
          };
          addResult.onsuccess = (e) => {
            const newId = addResult.result;

            if (typeof newId === "number") {
              resolve(newId);
            } else {
              reject("Invalid entry id");
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }

  /**
   * CRUD method for validating an existing account. Returns with the entry's id if the passed in credentials are valid
   * or null if they are not
   * @throws Signals that the process failed
   */
  static async validateUserAccount(userName: string, userPassword: string) {
    try {
      // Accesses the user account object store to read an entry from it
      const accountsStore = await this._openDBStore(
        this.USER_ACCOUNT_STORE,
        "readonly",
      );

      const userNameIndex = accountsStore.index(this.USER_NAME_INDEX);

      // Returns a new promise that will resolve with the existing entry's id or null if the user name is not associated with an entry or the passed in credentials are invalid
      // or reject with the event that caused the error
      return await new Promise<number | null>((resolve, reject) => {
        try {
          const entryResult = userNameIndex.get(userName);

          entryResult.onerror = (e) => {
            reject(e);
          };

          entryResult.onsuccess = (e) => {
            const entryData: UserAccount | undefined = entryResult.result;

            // checks if any entry matched the passed in userName;
            if (entryData === undefined) {
              // Resolves with null to indicate no entry matches the userName
              resolve(null);
            } else {
              // checks the user's credentials
              if (userPassword === entryData.userPassword) {
                // Resolves with the user's id value
                resolve(entryData.userId);
              } else {
                // Resolves with null to indicate the passed in credentials are invalid
                resolve(null);
              }
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }

  /**
   * CRUD method for creating a new weight entry. Returns with the entry's id if creation is successful
   * @throws Signals that the process failed
   */
  static async createWeightEntry(
    weightValue: number,
    weighInDate: Date,
    userId: number,
  ) {
    try {
      // Accesses the user account object store to read an entry from it
      const weightEntryStore = await this._openDBStore(
        this.WEIGHT_ENTRY_STORE,
        "readwrite",
      );

      const newWeightEntry = { weightValue, weighInDate, userId };

      // Returns a new promise that will resolve with the existing entry's id or null if the user name is not associated with an entry
      // or reject with the event that caused the error
      return await new Promise<number>((resolve, reject) => {
        try {
          const addResult = weightEntryStore.add(newWeightEntry);

          addResult.onerror = (e) => {
            reject(e);
          };

          addResult.onsuccess = (e) => {
            const newWeightEntryId = addResult.result;

            if (typeof newWeightEntryId === "number") {
              resolve(newWeightEntryId);
            } else {
              reject("Invalid entry id");
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }

  /**
   * CRUD method for reading all weight entry associated with a user id. Returns an array of all entries, but if no entries are found an empty array is returned
   * @throws Signals that the process failed
   */
  static async readWeightEntries(userId: number) {
    try {
      // Accesses the user account object store to read an entry from it
      const weightEntryStore = await this._openDBStore(
        this.WEIGHT_ENTRY_STORE,
        "readonly",
      );

      const userIdIndex = weightEntryStore.index(this.USER_ID_INDEX);

      // Returns a new promise that will resolve with the existing entry's id or null if the user name is not associated with an entry
      // or reject with the event that caused the error
      return await new Promise<WeightEntryType[]>((resolve, reject) => {
        try {
          const entriesResult = userIdIndex.getAll(userId);

          entriesResult.onerror = (e) => {
            reject(e);
          };

          entriesResult.onsuccess = (e) => {
            const entryData = entriesResult.result;

            // Resolves with the array populated with entries
            // but if no entries are found an empty array is returned
            resolve(entryData);
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }

  /**
   * CRUD method for reading a weight entry. Returns the weight entry data if found and null if no entry is found
   * @throws Signals that the process failed
   */
  static async readWeightEntry(weightEntryId: number, userId: number) {
    try {
      // Accesses the user account object store to read an entry from it
      const weightEntryStore = await this._openDBStore(
        this.WEIGHT_ENTRY_STORE,
        "readonly",
      );

      // Returns a new promise that will resolve with the existing entry's id or null if the user name is not associated with an entry
      // or reject with the event that caused the error
      return await new Promise<WeightEntryType | null>((resolve, reject) => {
        try {
          const readResult = weightEntryStore.get(weightEntryId);

          readResult.onerror = (e) => {
            reject(e);
          };

          readResult.onsuccess = (e) => {
            const entryData: WeightEntryType | undefined = readResult.result;

            // checks if any entry matched the passed in userName;
            if (entryData === undefined) {
              // Resolves with null to indicate no entry matches the userName
              resolve(null);
            } else {
              // Confirms the found entry's userId matches the user's id
              if (entryData.userId === userId) {
                // Resolves with the entry data
                resolve(entryData);
              } else {
                // Resolves with null as the entry is not associated with the current user
                resolve(null);
              }
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }

  /**
   * CRUD method for updating a weight entry. Returns true if the update is successful and false if an entry is not found or the update fails
   * @throws Signals that the process failed
   */
  static async updateWeightEntry(
    weightEntryId: number,
    weightValue: number,
    weighInDate: Date,
    userId: number,
  ) {
    try {
      // Accesses the user account object store to read an entry from it
      const weightEntryStore = await this._openDBStore(
        this.WEIGHT_ENTRY_STORE,
        "readwrite",
      );

      const newWeightEntry = {
        weightEntryId,
        weightValue,
        weighInDate,
        userId,
      };

      // Returns a new promise that will resolve with the existing entry's id or null if the user name is not associated with an entry
      // or reject with the event that caused the error
      return await new Promise<boolean>((resolve, reject) => {
        try {
          // updates the data associated with the key
          const updateResult = weightEntryStore.put(newWeightEntry);

          updateResult.onerror = (e) => {
            reject(e);
          };

          updateResult.onsuccess = (e) => {
            const entryId = updateResult.result;

            // Checks if the entryId is the same as when passed in
            // to indicate the entry was updated
            if (entryId === weightEntryId) {
              resolve(true);
            } else {
              resolve(false);
            }
          };
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      // Throws any error back to the middleware function
      throw error;
    }
  }
}
