import { errorCausesObj } from "./errors";

export class IndexedDB {
    // Database info
    static dbName = "WEIGHT_TRACKER"
    static dbVersion = 1;

    // Store names
    static USER_ACCOUNT_STORE = "USER_ACCOUNT";
    static WEIGHT_ENTRY_STORE = "WEIGHT_ENTRY";
    static GOAL_WEIGHT_ENTRY_STORE = "GOAL_WEIGHT_ENTRY";

    // Store names
    static USER_NAME_INDEX = "USER_NAME";
    static WEIGHT_ENTRY_ID_INDEX = "WEIGHT_ENTRY_ID";
    static USER_ID_INDEX = "USER_ID";

    static async accessDB() {
        try {
            const dbRequest = indexedDB.open(this.dbName, this.dbVersion);

            // Initializes error handle in the event the database request fails
            dbRequest.onerror = (e) => {
                console.error(e);
                throw new Error("Unable to initialize IndexDB", {cause: errorCausesObj.databaseInitializationError});
            };

            dbRequest.onupgradeneeded = () => {
                // Accesses the database
                const db = dbRequest.result;

                // Creates the user accounts store
                const userAccountsStore = db.createObjectStore(this.USER_ACCOUNT_STORE, {keyPath: "userId", autoIncrement: true});
                // Creates the userName index
                userAccountsStore.createIndex(this.USER_NAME_INDEX, "userName", {unique: true}); 

                // Creates the weight entry store
                const weightEntryStore = db.createObjectStore(this.WEIGHT_ENTRY_STORE, {keyPath: "weightEntryId", autoIncrement: true});
                // Creates the weigh entry id index and the user id index
                weightEntryStore.createIndex(this.WEIGHT_ENTRY_ID_INDEX, "weightEntryId", {unique: true}); 
                weightEntryStore.createIndex(this.USER_ID_INDEX, "userId", {unique: false});
                
                // Creates the goal weight entry store
                const goalWeightEntryStore = db.createObjectStore(this.GOAL_WEIGHT_ENTRY_STORE, {keyPath: "goalWeightEntryId", autoIncrement: true});
                // Creates the user id index
                goalWeightEntryStore.createIndex(this.USER_ID_INDEX, "userId", {unique: true});
            }

            return dbRequest.result;
        } catch (error) {
            // Throws the error
            throw error;
        }
    }
}