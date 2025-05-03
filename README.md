# Click Fit - Fitness Application

## 📝 Project Description
Click Fit is a full-stack fitness web application featuring:
- Responsive frontend with interactive UI
- File upload functionality with drag-and-drop support
- MySQL database integration
- RESTful API endpoints

## 🛠️ Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript, jQuery, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **File Upload**: Multer

## 🚀 Installation Guide

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- npm (v6+)

### Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Hassaan-Zahid/click-fit.git
   cd click-fit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up the database**:
    - Start your MySQL server
    - Update database credentials in `server.js` if needed

4. **Start the application**:
   ```bash
   npm run dev
   ```

## ⚙️ Configuration
- **Port**: Configured in `server.js` (default: 3000)
- **File Uploads**: Saved to `public/uploads/`
- **Database**:
    - Name: `clickfit_db`
    - Tables: `users`

## 📂 Project Structure
```
click-fit/
├── public/               # Frontend files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── uploads/          # Uploaded files
│   └── index.html        # Main page
├── server.js             # Backend server
├── package.json          # Dependencies
└── README.md             # This file
```

## 🌐 API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the frontend |
| `/upload` | POST | Handles file uploads |

## 🐛 Troubleshooting
- **Port in use**: Try `killall node` or change port in `server.js`
- **Database errors**: Verify MySQL is running and credentials are correct
- **CORS issues**: Check the CORS configuration in `server.js`
