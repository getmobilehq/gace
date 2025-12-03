# ⚡ Quick Test - 2 Minutes

**Test if signup works - ultra-fast version**

---

## 🚀 Steps

### 1. Start App
```bash
npm run dev
```

### 2. Open & Check
- Go to: `http://localhost:5173/signup`
- Press **F12** (open console)
- Click **"🔧 Test Helper"** (bottom-right)
- Server health should be **✅ green**

### 3. Fill Form
```
Name: Test User
Email: test@example.com  
Type: Individual
Password: password123
Password: password123 (again)
```

### 4. Submit
- Click **"Create Account"**
- Watch console

### 5. Result?

✅ **SUCCESS** - Console shows:
```
=== SIGNUP STARTED ===
...
=== SIGNUP SUCCESSFUL ===
```
Page redirects to `/onboarding` ✨

❌ **FAILED** - Console shows:
```
=== SIGNUP FAILED ===
Error: <message>
```

---

## ❌ If Failed

**Server health RED?**
```bash
supabase functions deploy server
```

**"relation does not exist"?**
- Run `/supabase/setup.sql` in Supabase Dashboard

**404 error?**
- Edge function not deployed

**Something else?**
- Check `/DEBUG_SIGNUP.md`

---

## ✅ If Successful

**You're done! Signup is working.**

What you should see:
- Profile created ✅
- User authenticated ✅
- Redirected to onboarding ✅

Check Supabase Dashboard:
- **Auth → Users** - New user appears
- **Database → user_profiles** - Profile exists

---

**That's it!** 🎉

Need more detail? → `/START_TESTING.md`
