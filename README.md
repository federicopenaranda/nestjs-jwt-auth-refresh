# Kata: NestJS JWT Access and Refresh token
## Kata solution for creating a NestJS project and add authentication with JWT (access and refresh token).

### Warning: This is a work in progress, I will complete these steps to make them a complete tutorial to follow.

**Goal:** Create a NestJS API that Authenticates users and return an Access and Refresh token, then uses the Access Token to access restricted API points, and uses the Refresh Token to renew the Access Token.

**First Repetition:** 3 hours
**Number of Repetitions:** 7
**Last Repetition:** 35 minutes

## Steps

## 1. Project Creation, packages installation and basic configuration
Create new NestJS project
Install class-validator and class-transformer
Add global validationPipe ( app.useGlobalPipes(new ValidationPipe()); )
Install @nestjs/config
Create .env file and add the secrets
Generate access secret and refresh secret (https://randomkeygen.com/)
Add config module to app module: ConfigModule.forRoot()

Painpoint: ConfigModule reads the .env file from the root of the project folder as a default.

Extra task: Create an env folder and create 3 .env files for 3 environments: local, test and production, configure ConfigModule accordingly.

## 2. Install Needed Packages
Install jsonwebtoken (npm i jsonwebtoken)
Install @types/jsonwebtoken (npm i -D @types/jsonwebtoken)
Install passport-jwt (npm i passport-jwt)
Install Dev Dep @types/passport-jwt  (npm i -D @types/passport-jwt)
Install @nestjs/passport

## 3. Create Resources
Generate 2 resources “user” and “auth”
Create User entity with fields: userId, name, email, password
Create RefreshJwt  entity with fields: refreshTokenId, userId
Create static users in user.service
Create findUserByEmail, and findUserById methods
Export userService in users module and import UserModule into AuthModule

## 4. Create API endpoints and DTOs
Painpoint: VSCode not recognizing import tags. Solución: ctrl + shift + p > Typescript: Restart TS Server.

Auth Controller:
- POST: login → Create DTO with fields: email and password
- POST: refresh → Create DTO refreshToken with field: refreshToken
- DELETE: logout  → Use DTO refreshToken
- GET: showTokens

User Controller:
- GET: profile (will be protected)


## 5. Create JWT Logic
Create refreshTokens array to store refresh tokens.

Methods in (auth.service):
- login
- refresh
- showTokens
- logout
- getNextRefreshTokenIndex
- verifyRefreshToken

Create login method in authService: email and password params, find user by email, check if password is correct, create refreshPayload and accessPayload, add refreshToken to array, sign them and return.

## 6. Create JWT guard
Create strategies folder
Create jwt.strategy.ts and extend from passport-jwt class
Create constructor and validate method
Add decorator @UseGuards(JwtAuthGuard) to the protected api point

**Extra:** Override the property name the strategy adds to the request when validating the access token, and use it in the “profile” API point of the user controller (instead of the “user” property).

**Extra:** Add user email to the access token data in jwt strategy file.