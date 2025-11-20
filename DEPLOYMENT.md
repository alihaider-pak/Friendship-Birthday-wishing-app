# Deployment Guide - Birthday Card App

This guide will help you deploy the Birthday Card application to any hosting service.

## 📦 What's Included in the Build

After running `npm run build`, your production files are in the `dist` folder:
- `dist/index.js` - Your backend server (bundled)
- `dist/public/` - Your frontend files (HTML, CSS, JS, images)

## 🚀 Deployment Steps

### 1. Prepare Your Files

You need to upload these files/folders to your hosting service:
```
├── dist/              (entire folder - built application)
├── client/public/uploads/  (for user-uploaded images)
├── package.json
├── package-lock.json
├── node_modules/      (or install on server)
└── .env               (create this - see below)
```

### 2. Set Up Environment Variables

Create a `.env` file on your server with:

```env
# Database Configuration (required)
DATABASE_URL=postgresql://user:password@host:port/database

# Port Configuration (optional - defaults to 5000)
PORT=5000

# Node Environment
NODE_ENV=production
```

**Important:** Replace the `DATABASE_URL` with your actual PostgreSQL database connection string.

### 3. Install Dependencies

On your server, run:
```bash
npm install --production
```

### 4. Run Database Migrations

Push your database schema:
```bash
npm run db:push
```

### 5. Start the Application

```bash
npm start
```

The app will run on the port specified in your `PORT` environment variable (default: 5000).

## 🌐 Hosting Options

### Option 1: Railway.app
1. Create account at [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL database (automatically sets DATABASE_URL)
4. Deploy from GitHub or upload files
5. Railway automatically runs `npm install` and `npm start`

### Option 2: Render.com
1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Add PostgreSQL database
4. Set environment variables in dashboard
5. Build Command: `npm install && npm run build && npm run db:push`
6. Start Command: `npm start`

### Option 3: VPS (DigitalOcean, AWS, etc.)
1. Upload files via SFTP or Git
2. Install Node.js (v20+) and PostgreSQL
3. Set up environment variables
4. Install dependencies: `npm install --production`
5. Run migrations: `npm run db:push`
6. Use PM2 to keep app running:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name birthday-app
   pm2 save
   pm2 startup
   ```

### Option 4: Heroku
1. Create Heroku app
2. Add PostgreSQL addon (automatically sets DATABASE_URL)
3. Push code to Heroku Git
4. Heroku automatically runs build and start scripts

## 📝 Important Notes

### Database
- **Required:** You MUST have a PostgreSQL database
- The app will NOT work without a valid `DATABASE_URL`
- Free options: Railway (500 hours), Supabase, Neon.tech

### File Uploads
- User-uploaded images are stored in `client/public/uploads/`
- Make sure this directory is writable
- On some platforms, you may need to use cloud storage (AWS S3, Cloudinary) for persistent file storage

### Port Configuration
- The app listens on port 5000 by default
- Change via `PORT` environment variable
- Some hosts (Heroku, Railway) set this automatically

## 🔧 Troubleshooting

**App won't start?**
- Check that `DATABASE_URL` is set correctly
- Ensure PostgreSQL is running and accessible
- Check logs: `npm start` or `pm2 logs` (if using PM2)

**Database errors?**
- Run migrations: `npm run db:push`
- Verify database connection string format

**Images not uploading?**
- Check `client/public/uploads/` exists and is writable
- Verify file size limits (default: 5MB)

**Music not playing?**
- Songs are streamed from archive.org (internet required)
- No special configuration needed

## 📞 Support

If you encounter issues, check:
1. Server logs for error messages
2. Database connection is working
3. All environment variables are set
4. Port is not blocked by firewall

---

**Quick Start Command Summary:**
```bash
# 1. Install dependencies
npm install --production

# 2. Set up .env with DATABASE_URL

# 3. Run migrations
npm run db:push

# 4. Start app
npm start
```

Your app should now be live! 🎉
