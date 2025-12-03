# 🚀 Deploy Server Update

**Deploy the admin delete endpoint to Supabase**

---

## ⚡ Quick Deploy

Run this command:

```bash
supabase functions deploy server
```

Wait for deployment (~ 30 seconds)

---

## ✅ After Deployment

1. **Refresh the signup page**: `http://localhost:5173/signup`

2. **You'll see a new tool in top-right**: "Delete Test User"

3. **Enter the email**: `bidemigraceo@yahoo.com`

4. **Click "Delete User"**

5. **Wait for success message**: "✅ Successfully deleted: bidemigraceo@yahoo.com"

6. **Try signup again** with the same email - it should work now!

---

## 🎯 How to Use the Cleanup Tool

The red box in the top-right corner lets you delete test users:

1. Type the email address
2. Click "Delete User"  
3. User is deleted from both Auth and Database
4. You can now signup with that email again

---

## ⚠️ Important Note

This cleanup tool is **for testing only**!

In production, you would:
- Remove this component
- Add proper admin authentication
- Use role-based access controls

For your MVP demo, it's perfect for quickly cleaning up test accounts.

---

**Ready to deploy?** Run:
```bash
supabase functions deploy server
```
