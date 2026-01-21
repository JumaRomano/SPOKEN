# Production Cleanup (No Shell Access)

**Problem:** Render Free tier doesn't have Shell access  
**Solution:** Run cleanup from your local machine, connecting directly to production database

---

## 🚀 Quick Start (2 Steps)

### Step 1: Get Production Database Credentials

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your backend service
3. Go to **Environment** tab
4. Copy these values:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`

Keep these handy - you'll need them in a moment.

---

### Step 2: Run Cleanup from Local Machine

Open a **NEW** terminal in your backend folder and run:

```bash
# First, check what's in production
npm run prod:check

# Then, clean the sample data
npm run prod:clean
```

The scripts will ask you for the production database credentials you copied in Step 1.

---

## 📋 Detailed Steps

### Check Production Users First

```bash
cd backend
npm run prod:check
```

**You'll be prompted for:**
- DB_HOST (e.g., `spoken01-xxx.aivencloud.com`)
- DB_PORT (e.g., `22417`)
- DB_NAME (e.g., `defaultdb`)
- DB_USER (e.g., `avnadmin`)
- DB_PASSWORD (hidden as you type)

**Output will show:**
- All users in production
- Which ones are sample data (marked with ⚠️)
- Summary count

---

### Clean Production Database

```bash
cd backend
npm run prod:clean
```

**You'll be prompted for:**
1. Production database credentials (same as above)
2. Confirmation: Type `DELETE SAMPLE DATA` to proceed

**What happens:**
- Connects to your production database
- Deletes all 6 sample users
- Removes sample families, events, etc.
- Keeps admin user
- Shows success message

---

## 🔒 Security Notes

### Database Firewall
If you get a connection error, your production database might block external connections. 

**Solutions:**
1. **Check Aiven/Database provider firewall settings**
2. **Whitelist your IP address** in database settings
3. **Use VPN** if your network blocks database ports

### SSL Certificate
Cloud databases require SSL. The scripts automatically use SSL with `rejectUnauthorized: false` for compatibility.

---

## ✅ After Cleanup

Once cleanup succeeds:

1. ✅ Run `npm run prod:check` again to verify
2. ✅ Should see only 1 user (admin)
3. ✅ Login to production frontend
4. ✅ Change admin password
5. ✅ Start adding real members

---

## 🐛 Troubleshooting

### "Error: connect ETIMEDOUT"
**Cause:** Database firewall blocking your IP  
**Fix:** Add your IP to database whitelist (Aiven dashboard → Database → Network → Add IP)

### "Error: password authentication failed"
**Cause:** Wrong credentials  
**Fix:** Double-check credentials from Render Environment tab

### "Error: Cannot find module"
**Cause:** Missing dependencies  
**Fix:** Run `npm install` in backend folder first

### "Connection refused"
**Cause:** Wrong host/port  
**Fix:** Verify DB_HOST and DB_PORT from Render

---

## 💡 Alternative: Temporary API Endpoint

If direct connection doesn't work, you can create a temporary API endpoint:

```javascript
// Add to backend temporarily
app.post('/api/admin/cleanup-sample-data', async (req, res) => {
    // Add authentication check!
    const authHeader = req.headers.authorization;
    if (authHeader !== 'Bearer YOUR_SECRET_TOKEN') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const cleanSampleData = require('./database/clean_sample_data');
        await cleanSampleData();
        res.json({ success: true, message: 'Sample data cleaned' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

Then call it with:
```bash
curl -X POST https://your-backend.onrender.com/api/admin/cleanup-sample-data \
  -H "Authorization: Bearer YOUR_SECRET_TOKEN"
```

⚠️ **Remove this endpoint after cleanup!**

---

## 📞 Summary

**Easiest approach:**
1. `npm run prod:check` - See what's in production
2. `npm run prod:clean` - Remove sample data
3. Verify on your production app

**Time:** ~2 minutes  
**Risk:** Low (uses transactions, can't partial-delete)  
**Result:** Clean production database with only real data
