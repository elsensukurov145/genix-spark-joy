# EmailJS Integration - Debug & Configuration Guide

## What's Been Fixed ✅

Updated the Apply.tsx component with:
- **Enhanced error logging**: Now shows exact error status codes and messages in browser console
- **Additional parameter variations**: Sends both `to_email` and `user_email` to match common template variables
- **Debug console messages**: Tracks each email send attempt with timestamps
- **Error details in toast**: Toast messages now show the error code for easier debugging

---

## Step 1: Test Error Logging in Browser Console

1. **Open your app** in browser and go to the application form
2. **Open Developer Tools** (F12) → Console tab
3. **Try sending an OTP** and look for colored console messages:
   - ✅ Look for: `📧 Sending OTP with params:` (blue)
   - ❌ Look for: `❌ OTP Send Error:` (red) - This shows the exact problem
4. **Note the error status code** (400, 403, 404, etc.) - this is critical

---

## Step 2: Verify Your EmailJS Template Variables

Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/) → Templates → `template_5oj75c3`

### Template Must Contain These Variables:
Check the template editor and ensure these placeholders exist (they'll be wrapped in `{{` `}}`):

**Primary variables to check:**
- `{{to_email}}` - Recipient email address
- `{{user_email}}` - User's email (alt version)
- `{{user_name}}` - Sender/user name
- `{{applicant_name}}` - Applicant full name
- `{{message}}` - Email body content
- `{{subject}}` - Email subject line
- `{{program}}` - Selected program
- `{{submitted_at}}` - Submission timestamp

### If variables are missing:
- Edit your template and add the missing variables
- Example: `Hello {{user_name}}, your application for {{program}} was received on {{submitted_at}}`

---

## Step 3: Check Your EmailJS Account Limits

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/) → Account
2. Verify:
   - ✅ You have **email credits** remaining (free plan: 200/month)
   - ✅ Your subscription is **active** (not expired)
   - ✅ **Service ID** matches: `service_ajj44jn`
   - ✅ **Template ID** matches: `template_5oj75c3`
   - ✅ **Public Key** matches: `8Ah88Hkuca4TC9RGX`

---

## Step 4: Verify Authorized Domains (CORS)

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/) → Account → Security
2. Under "Authorized Domains", verify your domain is listed:
   - For **local development**: Should include `localhost:5173` or `127.0.0.1:5173`
   - For **production**: Should include your actual domain (e.g., `genix.example.com`)
   - For **Vercel/Netlify**: Should include the preview/production URL

**To add domains:**
- Click "Edit" in Authorized Domains
- Add your domain (one per line)
- Save changes

---

## Step 5: Test with the Updated Code

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Reload the app**
3. **Try to send an OTP**
4. **Check console logs** (F12 → Console):
   - Copy the full error message from the `❌ OTP Send Error:` block
   - This will show you the exact API error (e.g., "Invalid Template ID")

---

## Common Error Codes & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| **400** | Bad Request / Invalid parameters | Check template variables match your template |
| **403** | Forbidden / Wrong credentials | Verify Service ID, Template ID, Public Key |
| **404** | Not Found | Template ID or Service ID doesn't exist |
| **429** | Rate Limited | You've hit your daily email limit |
| **500** | Server Error | EmailJS server issue - try again later |
| **CORS Error** | Domain not authorized | Add your domain to Authorized Domains |

---

## Expected Console Output (Success)

```
📧 Sending OTP with params: {
  service: 'service_ajj44jn',
  template: 'template_5oj75c3',
  params: { to_email: '...', otp_code: '***', ... }
}
✅ Applicant email sent successfully
✅ Admin email sent successfully
```

---

## Next Steps

1. **Run the app and test** → Check console for error messages
2. **Share the error code** from the console
3. **Verify template variables** using Step 2 above
4. **Check authorization** using Step 4 above
5. If still failing → Check your EmailJS dashboard for service/template configuration

---

## DEBUG: View Raw Template Configuration

To see what variables your template has:
1. Go to EmailJS Dashboard → Templates → `template_5oj75c3`
2. Look at the template HTML/content
3. Look for all `{{variable_name}}` placeholders
4. Report back which variables exist

---

## Additional Notes

- **OTP Code**: The form generates a 6-digit code and sends it to the user's email
- **Two emails sent**: One to applicant (confirmation), one to admin (@
- **Field Name Mapping**: The code now sends multiple variations (e.g., both `to_email` and `user_email`) to accommodate different template configurations
- **Error Transparency**: Error codes are now visible in both console and toast messages

