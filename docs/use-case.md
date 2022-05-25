# Authentication with Facebook

## Data
* Access Token

## Primary flow
1. Get data (name, email and Facebook ID) from the Facebook api
2. Check if a user already exists with the email address
3. Create an account for the user with the data received from Facebook
4. Create an access token, from the user ID, that expires within 30 minutes
5. Returns the generated access token

## Alternative flow: Existing user
3. Update the user account with the data received from Facebook (Facebook ID and name - only update the name if the user account has no name)

## Exception flow: Invalid or expired token
1. Returns an authentication error
