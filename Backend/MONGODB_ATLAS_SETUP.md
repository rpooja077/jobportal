# MongoDB Atlas Setup Guide

## Step 1: Create .env file
1. In your `Backend` directory, create a file named `.env`
2. Copy the contents from `env.example` to `.env`
3. Replace `<db_password>` with your actual MongoDB Atlas password

## Step 2: Update your MongoDB Atlas connection string
Your `.env` file should look like this:
```env
MONGODB_URI=mongodb+srv://pooja077:YOUR_ACTUAL_PASSWORD@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0
```

**Important:** Replace `YOUR_ACTUAL_PASSWORD` with your actual MongoDB Atlas password.

## Step 3: Test the connection
Before running your main application, test the connection:
```bash
cd Backend
node test-mongodb-connection.js
```

## Step 4: Run your application
If the connection test is successful, run your main application:
```bash
npm start
# or
node index.js
```

## Troubleshooting

### Common Issues:

1. **Authentication failed**
   - Check your username and password
   - Make sure you're using the correct password (not the database user password)

2. **Network error**
   - Check if your IP address is whitelisted in MongoDB Atlas
   - Go to Network Access in Atlas and add your current IP

3. **Cluster not found**
   - Verify your cluster URL is correct
   - Make sure your cluster is running

4. **Database name**
   - The database `job_portal` will be created automatically if it doesn't exist

## MongoDB Atlas Security Best Practices

1. **Use strong passwords**
2. **Whitelist only necessary IP addresses**
3. **Use environment variables (never commit .env to git)**
4. **Regularly rotate your database user passwords**

## Connection String Breakdown
```
mongodb+srv://pooja077:password@cluster0.arehes8.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0
```
- `pooja077` - Your username
- `password` - Your password
- `cluster0.arehes8.mongodb.net` - Your cluster URL
- `job_portal` - Database name
- `retryWrites=true&w=majority` - Connection options for reliability
