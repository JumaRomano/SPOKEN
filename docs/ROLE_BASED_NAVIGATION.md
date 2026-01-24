# Navigation Access by Role

## Role-Based Navigation Summary

### Admin / SysAdmin
**Full Access - Can see everything:**
- ✅ Dashboard
- ✅ **Members** (Full directory)
- ✅ Groups (All groups)
- ✅ Finance
- ✅ Events
- ✅ Attendance
- ✅ Sermons Management
- ✅ Back to Website

---

### Finance
**Limited Access:**
- ✅ Dashboard
- ❌ Members (HIDDEN - No access to member directory)
- ✅ Groups (Only groups they're a member of)
- ✅ **Finance** (Their section)
- ✅ Events
- ❌ Attendance (HIDDEN)
- ❌ Sermons Management (HIDDEN)
- ✅ Back to Website

---

### Leader
**Limited Access:**
- ✅ Dashboard
- ❌ Members (HIDDEN - No access to member directory)
- ✅ Groups (Only groups they're a member of)
- ❌ Finance (HIDDEN)
- ✅ Events
- ✅ **Attendance** (Their section)
- ❌ Sermons Management (HIDDEN)
- ✅ Back to Website

**Special Note:** Leaders can see members within their specific groups by clicking on a group and viewing group details.

---

### Member (Regular User)
**Basic Access:**
- ✅ Dashboard
- ❌ Members (HIDDEN - No access to member directory)
- ✅ Groups (Only groups they're a member of)
- ❌ Finance (HIDDEN)
- ✅ Events
- ❌ Attendance (HIDDEN)
- ❌ Sermons Management (HIDDEN)
- ✅ Back to Website

---

## Implementation Details

### Frontend (Navigation)
- `MainLayout.jsx` filters navigation items based on `user.role`
- Items without `roles` array are visible to everyone
- Items with `roles` array are only visible to those specific roles

### Backend (Data Filtering)
- **Groups**: Non-admin users only see groups they're members of (via `group_members` table)
- **Members**: Endpoint is protected, only admin/sysadmin can access
- **Finance**: Only finance/admin/sysadmin can access finance endpoints

### Route Protection
- `RoleProtectedRoute` component redirects unauthorized users to dashboard
- Wraps `/members` and `/members/:id` routes
- Prevents direct URL access by non-admin users

---

## Current Status

✅ Navigation filtering is active
✅ Backend filtering for groups is implemented
✅ Route protection for member pages is active
✅ Role-based access control is enforced at multiple layers
