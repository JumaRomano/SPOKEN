# Database Scripts Guide

This directory contains various database management scripts. **It's critical to use the right script for the right environment!**

## 📁 Available Scripts

### 🔧 Development Scripts

#### `seed.js` - **Development Only**
Creates admin user + **6 sample members** with test data for development/testing.

**DO NOT USE IN PRODUCTION!** This creates fake users:
- john.mwangi@example.com
- mary.mwangi@example.com
- david.ochieng@example.com
- grace.ochieng@example.com
- peter.kamau@example.com
- jane.kamau@example.com

```bash
npm run seed  # ❌ NEVER use in production!
```

#### `quick_seed.js` - **Development Quick Setup**
Creates only the admin user for quick local setup.

```bash
node src/database/quick_seed.js
```

---

### 🚀 Production Scripts

#### `seed_production.js` - **Production Safe**
Creates **ONLY**:
- Admin user (admin@spokenword.com)
- Default funds (General, Building, Missions, Benevolence)

**NO SAMPLE/MOCK DATA!** Safe to run on production.

```bash
npm run seed:prod  # ✅ Use this for production!
```

---

### 🔍 Diagnostic Scripts

#### `check_users.js` - **Check Database Users**
Lists all users in the database with details to help identify unwanted/test users.

```bash
npm run check:users
```

**Example Output:**
```
📊 Found 7 user(s):

User #1:
  ID: 1
  Email: admin@spokenword.com
  Role: sysadmin
  Created: 2026-01-19T10:20:30.000Z

User #2:
  Email: john.mwangi@example.com  ⚠️ Sample data!
  ...
```

---

### 🧹 Cleanup Scripts

#### `clean_sample_data.js` - **Remove Test Data**
Removes ALL sample/test data created by `seed.js` from database.

**What it removes:**
- All 6 sample users and their data
- Sample families (Mwangi, Ochieng, Kamau)
- Sample events
- Sample announcements
- Related contributions, pledges, attendance records

**What it preserves:**
- Admin user (admin@spokenword.com)
- Default funds
- Any real data you've added

```bash
npm run clean:sample
```

⚠️ **5-second warning before execution!** Press Ctrl+C to cancel.

---

## 🎯 Common Scenarios

### Scenario 1: Fresh Production Deployment
```bash
# 1. Run migrations
npm run migrate

# 2. Seed production data (admin only)
npm run seed:prod

# 3. Login and add real members through the app
```

### Scenario 2: Accidentally Used seed.js in Production
```bash
# 1. Check what's in the database
npm run check:users

# 2. If you see sample users, clean them
npm run clean:sample

# 3. Verify only admin remains
npm run check:users
```

### Scenario 3: Local Development Setup
```bash
# 1. Run migrations
npm run migrate

# 2. Seed with sample data for testing
npm run seed

# 3. You'll have admin + 6 test members to work with
```

### Scenario 4: Fresh Local Setup (No Test Data)
```bash
# 1. Run migrations
npm run migrate

# 2. Quick seed (admin only)
node src/database/quick_seed.js
```

---

## 🚨 Production Checklist

Before deploying to production, ensure:

- [ ] You're using `npm run seed:prod` NOT `npm run seed`
- [ ] Environment variable `NODE_ENV=production` is set
- [ ] Database credentials are correct
- [ ] You've updated deployment guide references
- [ ] Team members know the difference between seed scripts

---

## 🐛 Troubleshooting

### "I have unknown users in production!"

This usually means `npm run seed` was run instead of `npm run seed:prod`.

**Solution:**
1. Run `npm run check:users` to verify
2. Run `npm run clean:sample` to remove them
3. Update deployment scripts to use `seed:prod`

### "Script won't connect to database"

Check your `.env` file has correct database credentials:
```bash
DB_HOST=your_host
DB_PORT=your_port
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

---

## 📝 Default Credentials

After running any seed script, you can login with:

**Email:** admin@spokenword.com  
**Password:** Admin123!

⚠️ **Change this immediately after first login in production!**
