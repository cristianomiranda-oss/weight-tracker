Project repository for the Weight-Tracker web application.

Allows users to track weight measurements over time and work towards a goal weight.
Different weight approaches are valid, such as weight loss, gain, and maintenance.

---

# API Endpoints:

All database access methods are available through various API endpoints, and a test endpoint is available as well to validate the server before attempting to connect to the other APIs.
Most of the endpoints require a Bearer token to be present in the header of the Request. <br/>

## **Authorization Requirements**

> **Request Headers**
>
> ```json
> {
>   "Authorization": "Bearer <token>" // A JWT token must be provided within the request header
> }
> ```

## Table of Contents

1. Connection Test
2. Register
3. Login
4. Goal Weight Entry
   - GET
   - POST
   - PUT
5. Weight Entry
   - GET
   - POST
   - PUT
   - DELETE

## Connection Test

> ## **Connection Test**
>
> **Description**: Pings the database from the server to confirm the connection is functioning. <br/>
> **URL**: `/api/connection-test` <br/>
> **Method**: `GET` <br/>
> **Auth required**: NO <br/>
> **Success Response**
>
> ```json
> {
>   "message": "Database Connected!"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

## Register

> ## **Register**
>
> **Description**: Registers a new user account. <br/>
> **URL**: `/api/register` <br/>
> **Method**: `POST` <br/>
> **Auth required**: NO <br/>
> **Data constraints**
>
> ```json
> {
>   "userName": <8-25 Characters>, // Only includes letters, digits, "-", or "_".
>   "userPassword": <8-30 Characters>, // Only includes letters, digits, and any '_-?!@#$%^&*' character.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Account Created"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

## Login

> ## **Login**
>
> **Description**: Login to an existing user account. <br/>
> **URL**: `/api/login` <br/>
> **Method**: `POST` <br/>
> **Auth required**: NO <br/>
> **Data constraints**
>
> ```json
> {
>   "userName": <8-25 Characters>, // Only includes letters, digits, "-", or "_".
>   "userPassword": <8-30 Characters>, // Only includes letters, digits, and any '_-?!@#$%^&*' character.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Sign In Approved",
>   "userAccountData": <JWT Token>, // Authorization Token for accessing restricted endpoints
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

## Goal Weight Entry

> ## **Read Goal Weight Entry**
>
> **Description**: Returns the goal weight entry for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/goal-weight-entry` <br/>
> **Method**: `GET` <br/>
> **Auth required**: YES <br/>
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Retrieved",
>   "goalWeightEntry": <GoalWeightEntryObject>, // An object containing the goal weight entry fields
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

> ## **Create Goal Weight Entry**
>
> **Description**: Create a new goal weight entry for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/goal-weight-entry` <br/>
> **Method**: `POST` <br/>
> **Auth required**: YES <br/>
> **Data constraints**
>
> ```json
> {
>   "weightValue": <Whole or Decimal Value>, // Format can be either '###', '###.#', or '###.##'
>   "goalType": <A Valid Goal Type>, // Can be either 'Loss', 'Gain', or 'Maintenance'.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Added"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

> ## **Update Goal Weight Entry**
>
> **Description**: Updates an existing goal weight entry for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/goal-weight-entry` <br/>
> **Method**: `PUT` <br/>
> **Auth required**: YES <br/>
> **Data constraints**
>
> ```json
> {
>   "weightEntryId": <UUID Value>, // Must be a uuid value that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
>   "weightValue": <Whole or Decimal Value>, // Format can be either '###', '###.#', or '###.##'
>   "goalType": <A Valid Goal Type>, // Can be either 'Loss', 'Gain', or 'Maintenance'.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Updated"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

## Weight Entry

> ## **Read Weight Entry/Entries**
>
> **Description**: Returns all weight entries, or a specific weight entry identified by its id value, for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/weight-entry` <br/>
> **Method**: `GET` <br/>
> **Auth required**: YES <br/>
> **Header**
>
> ```json
> {
>   "weightEntryId": <UUID Value>,
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Retrieved",
>   "goalWeightEntry": <GoalWeightEntryObject>, // An object containing the goal weight entry fields
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

> ## **Create Goal Weight Entry**
>
> **Description**: Create a new goal weight entry for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/goal-weight-entry` <br/>
> **Method**: `POST` <br/>
> **Auth required**: YES <br/>
> **Data constraints**
>
> ```json
> {
>   "weightValue": <Whole or Decimal Value>, // Format can be either '###', '###.#', or '###.##'
>   "goalType": <A Valid Goal Type>, // Can be either 'Loss', 'Gain', or 'Maintenance'.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Added"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

> ## **Update Goal Weight Entry**
>
> **Description**: Updates an existing goal weight entry for the existing account. The passed in Bearer token is used to access the user's account details. <br/>
> **URL**: `/api/goal-weight-entry` <br/>
> **Method**: `PUT` <br/>
> **Auth required**: YES <br/>
> **Data constraints**
>
> ```json
> {
>   "weightEntryId": <UUID Value>, // Must be a uuid value that contains only letters, digits, and '-' and in the pattern of "########-####-####-####-############" (# representing any letter or digit).
>   "weightValue": <Whole or Decimal Value>, // Format can be either '###', '###.#', or '###.##'
>   "goalType": <A Valid Goal Type>, // Can be either 'Loss', 'Gain', or 'Maintenance'.
> }
> ```
>
> **Success Response**
>
> ```json
> {
>   "message": "Goal Weight Entry Updated"
> }
> ```
>
> **Error Response**
>
> ```json
> {
>   "message": string,
>   "cause": string,
> }
> ```

**Credit**: API template created by [jamescooke](https://github.com/jamescooke/restapidocs).
