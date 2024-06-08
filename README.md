
# Media-Vault
MediaVault is a secure and efficient application designed to store and delete your images and videos. With an easy-to-use interface, you can manage your media files effortlessly and keep them safe in one place.


## Tech Stack

**Client:** React Native

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

![App Screenshot](https://via.placeholder.com/468x300?text=App+Screenshot+Here)


## Demo

Insert gif or link to demo

