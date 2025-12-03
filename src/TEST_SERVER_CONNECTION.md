# 🔍 Testing Server Connection

## Quick Test

Open your browser console and run this command to test if the server is accessible:

```javascript
fetch('https://faczbtutzsrcnlrahifb.supabase.co/functions/v1/make-server-b5fd51b8/health', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhY3pidHV0enNyY25scmFoaWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTE3MTMsImV4cCI6MjA4MDA2NzcxM30.2PYn_okTcGJ78VtwEq6uN3ESKBmOb1r6bZALIV10lGc'
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## Expected Response

If the server is working:
```json
{
  "status": "ok",
  "timestamp": "2024-12-01T..."
}
```

## If You Get 404 Error

This means the Edge Function is not deployed. Follow these steps:

### Step 1: Deploy the Edge Function

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref faczbtutzsrcnlrahifb

# Deploy the function
supabase functions deploy server
```

### Step 2: Verify Deployment

After deployment, test again with the fetch command above.

### Step 3: Check Function Logs

```bash
supabase functions logs server
```

## Alternative: Use Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/faczbtutzsrcnlrahifb/functions
2. Click "Deploy new function"
3. Upload the `/supabase/functions/server/` directory
4. Deploy and test

## Common Issues

### Issue: "Function not found"
**Solution:** The function needs to be deployed to Supabase

### Issue: "CORS error"
**Solution:** The server has CORS enabled, but check the deployment

### Issue: "Authentication failed"
**Solution:** Make sure you're using the correct anon key in the Authorization header
