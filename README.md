# Todo App

A React Native-based Todo App for managing todos. This project uses the Expo framework for development and testing, and it includes backend API calls to manage todo data.

## Features

- View a list of todos
- Filter todos by status
- Search todos by title or details
- Sort todos by different criteria
- Add, edit, and view todo details

## Prerequisites

Before setting up the app, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16.x or later recommended)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/) (optional but recommended)
- Backend API for managing todos (the app assumes the API is hosted and reachable at a specified URL)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install Dependencies

Use npm or yarn to install the required dependencies:

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 3. Configure the Backend API

Ensure the `api.js` file in the project contains the correct base URL for your backend API:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url.com', // Replace with your backend URL
});

export default api;
```

### 4. Run the App

Start the development server:

```bash
# Using npm
npm start

# OR using yarn
yarn start
```

Follow the instructions to run the app on an emulator or physical device:

- Press `a` to open Android Emulator.
- Press `i` to open iOS Simulator.
- Scan the QR code with the Expo Go app on your physical device.

### 5. Backend API Setup

For the backend API, this is the link to the repo (https://github.com/yaqoubhassan/todo-api.git).

First make sure both the mobile app and the backend API are running on the same network.
Run `ipconfig` in your terminal and find the `IPv4 Address`. Run `php artisan serve --host <address-from-IPv4> --port 8000`.

Update the `baseURL` in `api.js` with the url you get from running `php artisan serve --host <address-from-IPv4> --port 8000` for local testing.

## Project Structure

```
|-- assets/               # Static assets like images
|-- screens/              # App screens (TodoList, TodoDetails, etc.)
|-- api.js                # Axios instance for API communication
|-- App.js                # Entry point for the app
|-- package.json          # Project metadata and dependencies
```

## Troubleshooting

- **App not starting or crashing:** Ensure all dependencies are installed and that the Expo CLI is correctly set up.
- **API errors:** Verify the `baseURL` in `api.js` and ensure the backend API is running.
- **Network issues:** Test with a device/emulator on the same network as the backend.
