
# Media-Vault
MediaVault is a secure and efficient application designed to store and delete your images and videos. With an easy-to-use interface, you can manage your media files effortlessly and keep them safe in one place.


## Tech Stack

**Client-App :** React Native Expo

**Server:** Node, Express

**Database:** MongoDB




## Run Locally

Clone the project

```bash
  git clone https://github.com/Shashanksarojj/MediaVault.git
```

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## API Reference

#### Get all items

```http
POST /api/auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  User's username |
| `password` | `string` | **Required**.  User's password |
| `name` | `string` | **Required**.  User's name |

#### Get item

```http
POST /api/auth/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**. User's username |
| `password` | `string` | **Required**.   User's Password |

#### Verify Token

```http
GET /api/auth/verify-token
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**.   Bearer 


#### Upload Image
```http
POST /api/media/uploadImage

```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**.   Bearer token|
| `image` | `string` | **Required**.  Image file to upload |


#### Get Media

```http
GET /api/media/get-media
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**.   Bearer token|

#### Media By id

```http
GET /api/media/media/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**.   Bearer token|
| `id` | `string` | **Required**.  ID of the media|


#### DELETE Media

```http
DELETE /api/media/del-media/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `Authorization` | `string` | **Required**.   Bearer token|
| `id` | `string` | **Required**.  ID of the media|


## Screenshots
![Screenshot_20240609_234436_MediaVault](https://github.com/Shashanksarojj/MediaVault/assets/66843256/c71f88b2-14c8-42d8-92da-4cea9ab70784)
![Screenshot_20240609_234424_MediaVault](https://github.com/Shashanksarojj/MediaVault/assets/66843256/0c38fafd-fe53-4ac0-9fbc-f206e1a38448)

![Screenshot_20240609_234407_MediaVault](https://github.com/Shashanksarojj/MediaVault/assets/66843256/d0af282c-a221-4b6f-9ea3-1229d6eb3af5)



## Demo



