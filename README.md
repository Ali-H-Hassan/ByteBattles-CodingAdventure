<img src="./Readme/title1.svg"/>

<br><br>

<!-- project philosophy -->
<img src="./Readme/title2.svg"/>

> ByteBattle is an innovative web platform that merges learning and gaming with real-world career opportunities. It's designed to make programming education engaging and directly relevant to the tech industry. Our mission is to transform how programming is learned, making it both enjoyable and practical.
>
> The platform not only offers interactive games for learning programming concepts but also features tests created by tech companies for potential hiring. This unique approach allows users to not just learn and apply coding skills, but also to connect with employers, making ByteBattle a bridge between education and employment in the tech industry.

### User Stories

#### For the User

- As a user, I want to play educational games, so I can engagingly learn programming concepts.
- As a user, I want to take part in coding challenges so that I can test and improve my coding skills.
- As a user, I want to compete against AI in coding battles, so I can gauge my skill level and get feedback.

#### For the Company

- As a company, I want to create and post coding tests, so I can assess and potentially hire skilled programmers.
- As a company, I want to view the leaderboard, so I can identify top-performing candidates.
- As a company, I want to customize tests for specific programming roles, so I can effectively screen candidates for job-specific skills.

<!-- Tech stack -->
<img src="./Readme/title3.svg"/>

ByteBattle is built using a variety of powerful technologies:

### Frontend

- **React**: A JavaScript library for building user interfaces. [Learn more](https://reactjs.org/)
- **Redux**: A predictable state container for JavaScript apps. [Learn more](https://redux.js.org/)

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. [Learn more](https://nodejs.org/)
- **ExpressJS**: A minimal and flexible Node.js web application framework. [Learn more](https://expressjs.com/)

### Game Development

- **Phaser Library**: A fast, free, and fun open source framework for Canvas and WebGL powered browser games. [Learn more](https://phaser.io/)

### Database

- **MongoDB**: A general purpose, document-based, distributed database built for modern application developers. [Learn more](https://www.mongodb.com/)

### Additional Libraries and Tools

- **multer**: A node.js middleware for handling `multipart/form-data`, primarily used for uploading files. [Learn more](https://www.npmjs.com/package/multer)
- Various other React and Redux dependencies for enhanced functionality and user experience.

<br><br>

<!-- UI UX -->
<img src="./Readme/title4.svg"/>

> ByteBattle is designed for streamlined navigation and engaging user experience, balancing educational games and test-taking within a cohesive interface.

- Project design details and mockups can be accessed here: [ByteBattle Design](https://www.figma.com/file/Mdc8gQ2xi0AxRRoH5NYAw0/ByteBattles?type=design&mode=design&t=8vw1uRceK4v53QHN-1)

### Mockups

| Dashboard Screen                            | Register Screen                           |
| ------------------------------------------- | ----------------------------------------- |
| ![Dashboard Screen](./Readme/Dashboard.png) | ![Register Screen](./Readme/Register.png) |

<br><br>

<!-- Database Design -->
<img src="./Readme/title5.svg"/>

The database schema is structured to support user data, educational content, game data, and test results.
<br><br>
<img src="./Readme/ByteBattleDiagram.png">

<br><br>

<!-- Implementation -->
<img src="./Readme/title6.svg"/>

### User Interface (Web)

| AI Battle                                          | Course Selection                                    |
| -------------------------------------------------- | --------------------------------------------------- |
| ![AI Battle](./Readme/AIBattle.gif)                | ![Course Selection](./Readme/CourseDisplay.gif)     |
| Backend Game Screen                                | Frontend Game Screen                                |
| ![Backend Game Screen](./Readme/GameScene1.gif)    | ![Frontend Game Screen](./Readme//GameScene2.gif)   |
| Google Register                                    | Company Dashboard                                   |
| ![Google Register](./Readme/GoogleRegister.gif)    | ![Company Dashboard](./Readme/CompanyDashboard.png) |
| Test Landing Page                                  | User Dashboard                                      |
| ![Test Landing Page](./Readme/TestLandingPage.png) | ![User Dashboard ](./Readme/UserDashboard.png)      |
| Thank You Page                                     | Test Creation                                       |
| ![Thank You Page](./Readme/ThankyouPage.png)       | ![Test Creation](./Readme/CreateTest.png)           |

<br><br>

<!-- Prompt Engineering -->
<img src="./Readme/title7.svg"/>

## AI-Powered Coding Duels

ByteBattle introduces an interactive AI that users can challenge in coding duels. This feature not only benchmarks user code against AI solutions but also provides personalized feedback to improve coding skills.

### Features:

- **AI Solutions**: Utilizes the Gemini AI model for generating code solutions and natural language analysis.
- **Performance Comparison**: Times user and AI code execution to foster efficient coding practices.
- **Feedback System**: Offers automated feedback on user code, highlighting areas for optimization.

### Implementation:

The backend, built on Node.js, securely executes code and evaluates performance. The AI's feedback is generated through advanced natural language processing, assisting users in enhancing their coding prowess.

![AI Code Snippet](./Readme/AISnippet.png)

<br><br>

<!-- AWS Deployment -->
<img src="./Readme/title8.svg"/>

This section provides a step-by-step guide to get ByteBattle up and running on an Amazon EC2 instance.

#### Pre-requisites:

Ensure you have an EC2 instance running and you have the private key (`.pem` file) for SSH access.

#### Steps:

1. **Connecting to Your EC2 Instance:**

   ```sh
   ssh -i /path/to/my-key.pem ec2-user@my-ec2-ip-address
   ```

2. **Installing Node.js on EC2:**

   - Update the package repository:
     ```sh
     sudo yum update -y
     ```
   - Install Node.js:
     ```sh
     sudo yum install -y nodejs
     ```

3. **Setting Up MongoDB:**

   - Install MongoDB:
     ```sh
     sudo yum install -y mongodb-org
     ```
   - Start MongoDB:
     ```sh
     sudo systemctl start mongod
     ```

4. **Install Git:**

   - To clone the repository from GitHub:
     ```sh
     sudo yum install -y git
     ```

5. **Cloning the Repository and Installing Dependencies:**

   - Clone the repo and navigate to the project directory:
     ```sh
     git clone https://github.com/your_username/ByteBattles-CodingAdventure.git
     cd ByteBattles-CodingAdventure
     ```
   - Install NPM packages for both frontend and backend:
     ```sh
     npm install
     ```

6. **Setting Up MongoDB URI:**

   - Enter your MongoDB URI in the `config.js` file:
     ```js
     const MONGO_URI = "ENTER YOUR MONGO URI";
     ```

7. **Starting the Application:**
   - Start the server:
     ```sh
     npm start
     ```

Replace `/path/to/my-key.pem`, `ec2-user@my-ec2-ip-address`, and `your_username/ByteBattles-CodingAdventure.git` with your specific details to connect to your EC2 instance, and update the MongoDB URI in the `config.js` file with your actual MongoDB credentials.

<br><br>

<!-- Unit Testing -->
<img src="./Readme/title9.svg"/>

### Precision in Development: Harnessing the Power of Unit Testing:

- This project employs rigorous unit testing methodologies to ensure the reliability and accuracy of code components. By systematically evaluating individual units of the software, we guarantee a robust foundation, identifying and addressing potential issues early in the development process.

| Features testing                              |
| --------------------------------------------- |
| ![Features testing](./Readme/UnitTesting.png) |

<br><br>

<!-- How to run -->
<img src="./Readme/title10.svg"/>

### Installation

1. Clone the repo
   ```sh
   [git clone https://github.com/your_username_/ByteBattles-CodingAdventure.git](https://github.com/Ali-H-Hassan/ByteBattles-CodingAdventure.git)
   ```
2. Install NPM packages for both frontend and backend:
   ```sh
   npm install
   ```
3. Set up MongoDB and enter your database URI in config.js:
   ```js
   const MONGO_URI = "ENTER YOUR MONGO URI";
   ```
4. Start the server:
   ```sh
   npm start
   ```

Now, you should be able to run ByteBattle locally and explore its features.
