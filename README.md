# Code Quest

## Project Overview

Code Quest is a React Native mobile application, built with Expo, designed for creating and participating in treasure hunt-style games. The main use case is for organizers to set up a "Code Quest" event, where participants (players) register and answer a series of questions to complete the hunt.

The app provides a seamless experience for both players and administrators, with separate interfaces for each.

## Tech Stack

- **Core:** React Native, Expo
- **Navigation:** React Navigation (Stack Navigator)
- **Backend/Database:** Firebase (Firestore for database, Firebase Authentication for admin access)
- **Localization:** i18next, react-i18next
- **Animation:** Lottie for engaging animations
- **Utilities:** `expo-barcode-scanner` for QR code scanning functionalities

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js**: It is recommended to use the latest LTS version.
- **Package Manager**: `npm` or `yarn`.
- **Expo CLI**: The command-line interface for Expo. You can install it globally via npm:
  ```bash
  npm install -g expo-cli
  ```
- **Firebase Account**: You will need a Firebase project to handle the backend and database.

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/grnsmn/code-quest-treasure-hunt.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd code-quest-treasure-hunt
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    - Create a `.env` file in the root of the project.
    - Copy the contents of `.env.example` into your new `.env` file.
    - Follow the instructions in the **Configuration** section below to get the necessary values.

5.  **Run the application:**
    ```bash
    npm start
    ```
    This will start the Expo development server and open the Expo Developer Tools in your browser. You can then run the app on a physical device using the Expo Go app or on a simulator/emulator.

### Running Tests

Currently, there are no automated tests configured for this project.

## Configuration

This application requires a Firebase project for its backend functionality.

1.  Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  In your project, create a new Web application.
3.  You will be provided with a `firebaseConfig` object. Copy these keys into your `.env` file.
4.  Enable **Firestore Database** and **Firebase Authentication** (with email/password) in your Firebase project.

Your `.env` file should look like this:

```
EXPO_PUBLIC_API_KEY="your-api-key"
EXPO_PUBLIC_AUTH_DOMAIN="your-auth-domain"
EXPO_PUBLIC_PROJECT_ID="your-project-id"
EXPO_PUBLIC_STORAGE_BUCKET="your-storage-bucket"
EXPO_PUBLIC_MESSAGING_SENDER_ID="your-messaging-sender-id"
EXPO_PUBLIC_APP_ID="your-app-id"
```

There are no database seeding or migration commands required to start.

## Usage

### For Players

1.  Upon opening the app, players are directed to the **Register Screen**.
2.  They enter their name to register for the quest.
3.  Players then proceed to the **Question Screen**, where they will be presented with questions. In a real-world scenario, this would involve scanning QR codes to get to the next question.
4.  After correctly answering a question, a **Success Screen** is displayed.
5.  Once all questions are answered, the **End Screen** appears, signifying the completion of the quest.

### For Admins/Organizers

1.  Admins can log in through the **Admin Login Screen**.
2.  After successful login, they are taken to the **Admin Dashboard**.
3.  From the dashboard, they can:
    - **View Users**: See a list of all registered players.
    - **Manage Questions**: Add, edit, or delete questions for the treasure hunt.
    - **Participant Counter**: _(Under Development - See [Issue #5](https://github.com/grnsmn/code-quest-treasure-hunt/issues/5))_ This feature aims to display the total number of registered participants for each treasure hunt directly in the admin dashboard.

## Deployment

The web version of this application can be built using:

```bash
npm run web-build
```

This project includes a `netlify.toml` file, which means it can be easily deployed to [Netlify](https://www.netlify.com/).

## Future Improvements

- **QR Code Scanner Integration**: The `expo-barcode-scanner` dependency is included but not yet fully integrated. A future improvement is to add a QR code scanner that can be opened directly from the success screen after a correct answer, allowing players to scan the next QR code without leaving the app or using the phone's native camera app.
- **Secure Question Routing**: Currently, questions can be accessed via simple numbered routes (e.g., `/question/1`). To prevent players from easily guessing the next question's URL and bypassing the intended game flow, this should be replaced with a more secure method, such as using unique, non-sequential IDs (hashes or UUIDs) for each question.

## Contributing

Contributions are welcome! If you have suggestions for improvements, please open an issue or submit a pull request.

1.  **Fork the Project**
2.  **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3.  **Commit your Changes** (`git commit -m 'Add some AmazingFeature'`)
4.  **Push to the Branch** (`git push origin feature/AmazingFeature`)
5.  **Open a Pull Request**

Please ensure your code adheres to the existing style and that you run any available linting commands.

## License

This project is not currently licensed.

## Contributors

Thanks to all the volunteers who contributed to this project! 🙏

|                  Contributor                   | Contribution                                                                                                                                |
| :--------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------ |
| [@MarcoCaamal](https://github.com/MarcoCaamal) | [Internationalization integration](https://github.com/MarcoCaamal/code-quest-treasure-hunt/commit/0dcf2e5eaf16c1b71d975fe13c6dc00eea429f5f) |

---
_This README was updated by an AI assistant._