# MongoDB Setup Guide

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

1. **Go to MongoDB Atlas**: https://www.mongodb.com/atlas
2. **Sign up for free** (no credit card required)
3. **Create a free cluster**:
   - Choose "M0 Sandbox" (free tier)
   - Select a region close to you
   - Click "Create Cluster"
4. **Set up database access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username/password
   - Set permissions to "Read and write to any database"
5. **Get connection string**:
   - Go to "Clusters" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
6. **Update your .env file**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collegehub?retryWrites=true&w=majority
   ```

### Option 2: Install MongoDB Locally

1. **Download MongoDB Community Server**:
   - Go to: https://www.mongodb.com/try/download/community
   - Select Windows and download MSI installer
2. **Install MongoDB**:
   - Run the installer
   - Choose "Complete" installation
   - Install MongoDB as a Windows Service
3. **Start MongoDB**:
   - MongoDB should start automatically as a service
   - Or run: `net start MongoDB` in Command Prompt as Administrator

### Option 3: Use Docker (if installed)

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Test Your Setup

After setting up MongoDB, restart your server:

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

## Troubleshooting

- **Connection timeout**: Make sure MongoDB is running
- **Authentication failed**: Check username/password in connection string
- **Network issues**: Check firewall settings
- **Atlas connection**: Make sure your IP is whitelisted (or use 0.0.0.0/0 for development)

## Current .env Configuration

Your current `.env` file is set to:
```env
MONGODB_URI=mongodb://localhost:27017/collegehub
```

This works for local MongoDB. For Atlas, replace with your connection string.
