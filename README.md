# auth-app
Write a application with NodeJs (Express, MySQL)
1. Create a Registration API which use the following body
A. first_name
B. last_name
C. email
D. password
E. NID
F. profile photo
G. Age
H. Current marital status
I. auth_token
NB.
a. Email and Password will be on auth table and the rest are on the profile table
b. Be ensure that, if one table insertion is failed then the other will not insert(ACID
properties of DBMS)
c. password should be encrypted with Crypto Library
d. For photo upload you can use Multer Library
e. Store photos in local storage and save the path on table
f. Use a generic response for failed and success individually
g. Success code should be 200
h. You can use `mysql` library for nodejs mysql
2. Create a Login API which contains the following body
A. email
B. password
NB.
a. If email and password matched then return a random UUID so that next time we can use
it for login and store this on auth_token in Auth table
3. Create an Update api which contains the route like
“your-local-route/:user_id/”
And the body will contains the data from your profile table.
NB. Be sure that one user cannot update data of other users
4. Create a Delete api so that any one can delete his/her account
The route will the like the update api
5. Create an API so that user can see his/her profile
NB. Make sure that password will not in the responseMISC.
a. Use Camel-Case or Snake-Case, not mixed up both (Js preferred Camel-case)
b. Strictly maintain the meaningful variable name and convention like boolean field will like
this `isActive`, `hasSeen`
c. Use callback functions
d. For REST best practice follow this link
e. For JS clean code follow this link
f. For Response status code follow this link
