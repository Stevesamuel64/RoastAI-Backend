# RoastAI-Backend

Backend of the RoastAI project, built to provide witty, comedic AI responses using the DeepSeek r1 API.

---

## Project Overview / Purpose
This backend powers RoastAI, a platform that delivers hilarious AI-generated content. It handles AI requests, processes user input, and sends funny responses, including daily witty news summaries.

---

## Features

- **SavageBot:** A sarcastic, roast-style chatbot that answers questions with a comic twist.  
- **Funny Responses:** Users can input a subject and request a humorous reply in the style of a person or country.    
- **Group Debates:** Funny debates between two characters roasting themselves.  
- **Random Quote Remix:** Takes famous quotes and remixes them into absurd, funny versions.  
- **Daily Email:** Receive a daily email summarizing yesterday’s top news in a witty, comedic style.

---

## Tech Stack

- **Frontend (integrates with backend):** React.js, TypeScript, TailwindCSS  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Other Tools:** Bcrypt.js, JWT, Cookie-parser, Nodemailer, Node-cron, DeepSeek r1 API

---

## Getting Started

### Prerequisites

- Node.js >= 16  
- MongoDB (local or Atlas)  
- DeepSeek r1 API key  
- Email account for daily summaries  

### Installation

```bash
git clone <your-repo-url>
cd RoastAI-Backend
npm install
````

### Running Locally

```bash
npm run dev
```

* Starts the server with Nodemon for hot reloading.

### Production

```bash
npm start
```

* Runs the backend in production mode.

---

## Environment Variables

Create a `.env` file in the root directory with these keys:

```env
JWT_SECRET=<your_jwt_secret>                 # Secret key for JWT authentication
FRONTEND_URL=<your_frontend_deployed_url>    # URL of the frontend app
MONGO_URI=<your_mongodb_uri>                 # MongoDB connection string
OPENROUTER_API_KEY=<your_openrouter_api_key> # API key for OpenRouter
NEWS_API_KEY=<your_newsapi_key>              # API key for news fetching
LLAMA_API_KEY=<your_llama_api_key>           # API key for LLaMA AI integration
EMAIL_USER=<your_email_address>              # Email address for sending daily summaries
EMAIL_PASS=<your_email_password>             # Email password or app-specific password
API_KEY_Funny_Characters=<api_key_here>      # API key for funny characters feature
API_KEY_Funny_Feud=<api_key_here>            # API key for funny feud feature
API_KEY_Funny_Quote=<api_key_here>           # API key for random quote remix
NODE_ENV=<development_or_production>         # Set to 'development' or 'production'
```

---

## Scripts

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `npm run dev` | Run development server with Nodemon |
| `npm start`   | Run production server               |
| `npm install` | Install dependencies                |

---

## License

📝 For educational and personal practice only. Fork, run, and learn!
