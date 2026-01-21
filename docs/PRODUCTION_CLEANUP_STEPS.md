# Production Database Cleanup - Step by Step

**Date:** 2026-01-21  
**Issue:** Production has 6 sample/test users that need to be removed  
**Goal:** Clean production database to have only admin user + real data

---

## ⚠️ Pre-Cleanup Checklist

- [ ] I have access to Render Dashboard
- [ ] I've located the backend service (spoken-word-chms-backend)
- [ ] I understand this will delete sample users permanently
- [ ] I'm ready to add real members after cleanup

---

## 🚀 Cleanup Steps

### Step 1: Access Render Shell

1. Navigate to: https://dashboard.render.com
2. Click on **spoken-word-chms-backend** service
3. Click the **"Shell"** tab at the top
4. Wait for shell to initialize (you'll see a command prompt)

---

### Step 2: Check Current Users

In the Render Shell, type:

```bash
npm run check:users
```

**Expected Output:**
- You should see 7 users total:
  - 1 admin (admin@spokenword.com) ✅ Keep this
  - 6 sample users (emails ending in @example.com) ❌ These need to go

**Sample users to be removed:**
1. john.mwangi@example.com
2. mary.mwangi@example.com
3. david.ochieng@example.com
4. grace.ochieng@example.com
5. peter.kamau@example.com
6. jane.kamau@example.com

---

### Step 3: Run Cleanup Script

In the Render Shell, type:

```bash
npm run clean:sample
```

**What happens:**
1. Script shows a WARNING message
2. 5-second countdown (press Ctrl+C to cancel if needed)
3. Script deletes:
   - 6 sample users
   - Their member profiles
   - Sample families
   - Sample contributions, pledges, attendance
   - Sample events and announcements
   - Group memberships and groups
4. Script shows success message

**Duration:** ~5-10 seconds after countdown

---

### Step 4: Verify Cleanup Succeeded

In the Render Shell, type:

```bash
npm run check:users
```

**Expected Output:**
- Should show **only 1 user**: admin@spokenword.com
- If you see more than 1 user, something went wrong

---

### Step 5: Test Admin Login

1. Go to your production frontend URL
2. Navigate to `/login`
3. Login with:
   - **Email:** admin@spokenword.com
   - **Password:** Admin123!
4. Verify you can access the dashboard

⚠️ **IMPORTANT:** Change the admin password immediately after logging in!

---

## ✅ Post-Cleanup Actions

After successful cleanup:

- [ ] Update admin password from default
- [ ] Begin adding real church members through the UI
- [ ] Create real groups, events, etc.
- [ ] Set up user roles for staff members
- [ ] Configure member access as needed

---

## 🐛 Troubleshooting

### Error: "Cannot find module"
**Solution:** The scripts might not be deployed yet. Run:
```bash
npm install
```

Then try the cleanup again.

---

### Error: "Connection refused" or database error
**Solution:** Check environment variables in Render dashboard:
- Go to "Environment" tab
- Verify DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD are correct
- Save and redeploy if needed

---

### Cleanup partially failed
**Solution:** The script uses transactions - if it fails, nothing is deleted.
- Check the error message
- Fix the issue (usually database connection)
- Run cleanup again

---

### Want to restore sample data for testing
**Solution:** If you accidentally cleaned the wrong database:
- You can't undo the cleanup
- Run `npm run seed:prod` to recreate admin user
- Add new test data manually or use local environment for testing

---

## 📝 What Gets Deleted vs Preserved

### ❌ Deleted (Sample Data)
- 6 test user accounts
- Sample members (Mwangi, Ochieng, Kamau families)
- Sample families
- Sample groups (Youth Ministry, Worship Team, etc.)
- Sample events (Annual Church Retreat)
- Sample announcements
- All related contributions, pledges, attendance records

### ✅ Preserved (Real/Essential Data)
- Admin user account
- Database schema/tables
- Default funds (General, Building, Missions, Benevolence)
- Any actual members you've added
- Environment configuration

---

## 🔒 Security Note

After cleanup, your production database is "clean" but the admin account still has the default password. This is a security risk!

**Immediately after cleanup:**
1. Login as admin
2. Go to Settings/Profile
3. Change password to a strong, unique password
4. Store it securely (password manager recommended)

---

## 📞 Need Help?

If something goes wrong:
1. Don't panic - the script uses database transactions
2. Check Render logs for error details
3. Verify database connection is working
4. You can always restore from database backup if available

---

**Status:** [ ] Not Started | [ ] In Progress | [ ] Completed

**Notes:**
_Add any notes about issues encountered or special observations here_
