# 🚀 Vistone SaaS Platform - Production Deployment Guide

Complete deployment guide for the Vistone digital marketplace platform using **Netlify**, **Supabase**, and **Firebase Storage**.

---

## 📋 Prerequisites

- **Node.js** 18+ and npm 9+
- **Git** for version control
- **Netlify** account
- **Supabase** account
- **Firebase** account
- **Stripe** account (for payments)
- **Domain name** (optional but recommended)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION STACK                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   NETLIFY    │  │   SUPABASE   │  │   FIREBASE   │     │
│  │   Frontend   │  │   Database   │  │   Storage    │     │
│  │   + API      │  │   + Auth     │  │   + CDN      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    STRIPE    │  │    EMAIL     │  │  ANALYTICS   │     │
│  │   Payments   │  │   Service    │  │   Tracking   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Step 1: Supabase Database Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name: `vistone-production`
3. Set a strong database password
4. Select your preferred region

### 1.2 Database Schema Setup

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `database/schema.sql`
3. Run the SQL to create all tables and indexes
4. Verify all tables are created successfully

### 1.3 Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
-- ... repeat for all tables

-- Create policies for secure access
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Public products are viewable" ON products
  FOR SELECT USING (status = 'published');

-- Add more policies as needed
```

### 1.4 Get Supabase Credentials

From your Supabase project settings:
- **Project URL**: `https://your-project.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Database URL**: `postgresql://postgres:password@db.your-project.supabase.co:5432/postgres`

---

## 🔥 Step 2: Firebase Storage Setup

### 2.1 Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project: `vistone-storage`
3. Enable Google Analytics (optional)

### 2.2 Enable Cloud Storage

1. Go to **Storage** in Firebase console
2. Click **Get Started**
3. Choose **Start in production mode**
4. Select your storage location

### 2.3 Configure Storage Rules

```javascript
// Firebase Storage Rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public files (product images, blog images)
    match /products/{productId}/images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Private files (product downloads)
    match /products/{productId}/{licenseType}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // User avatars
    match /users/avatars/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Support attachments
    match /support/tickets/{ticketId}/attachments/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 2.4 Generate Service Account

1. Go to **Project Settings** → **Service Accounts**
2. Click **Generate new private key**
3. Download the JSON file
4. Extract the required fields for environment variables

---

## 💳 Step 3: Stripe Payment Setup

### 3.1 Create Stripe Account

1. Sign up at [stripe.com](https://stripe.com)
2. Complete account verification
3. Enable your account for live payments

### 3.2 Get API Keys

From Stripe Dashboard → **Developers** → **API Keys**:
- **Publishable Key**: `pk_live_...`
- **Secret Key**: `sk_live_...`

### 3.3 Configure Webhooks

1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-domain.netlify.app/api/payment/stripe/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`

4. Copy the **Webhook Secret**: `whsec_...`

---

## 🌐 Step 4: Netlify Deployment

### 4.1 Prepare Repository

1. Push your code to GitHub/GitLab
2. Ensure `netlify.toml` is in the root directory
3. Verify `package.json` has all dependencies

### 4.2 Connect to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **New site from Git**
3. Connect your repository
4. Configure build settings:
   - **Build command**: `npm run build:production`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`

### 4.3 Environment Variables

In Netlify Dashboard → **Site Settings** → **Environment Variables**, add:

```bash
# Application
NODE_ENV=production
SITE_NAME=Vistone Digital Marketplace
FRONTEND_URL=https://your-site.netlify.app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Firebase
FIREBASE_PROJECT_ID=your-firebase-project
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nyour-key\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Stripe
STRIPE_SECRET_KEY=sk_live_your-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@your-domain.com
```

### 4.4 Deploy

1. Click **Deploy site**
2. Wait for build to complete
3. Test your deployment

---

## 📧 Step 5: Email Service Setup

### Option A: Gmail SMTP

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use these settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   ```

### Option B: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Verify your sender identity
4. Update environment variables:
   ```
   SENDGRID_API_KEY=your-sendgrid-api-key
   ```

---

## 🔐 Step 6: Security Configuration

### 6.1 Generate Secure Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### 6.2 Configure CORS

Update `netlify.toml` with your actual domain:

```toml
[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "https://your-domain.com"
```

### 6.3 SSL Certificate

Netlify automatically provides SSL certificates. For custom domains:
1. Add your domain in **Domain Settings**
2. Update DNS records as instructed
3. SSL certificate will be automatically provisioned

---

## 📊 Step 7: Analytics Setup

### 7.1 Google Analytics

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID: `G-XXXXXXXXXX`
3. Add to environment variables:
   ```
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   ```

### 7.2 Netlify Analytics

1. Enable Netlify Analytics in your site dashboard
2. View traffic and performance metrics

---

## 🧪 Step 8: Testing & Verification

### 8.1 Functionality Tests

- [ ] User registration and login
- [ ] Product browsing and search
- [ ] Shopping cart functionality
- [ ] Payment processing (use Stripe test mode first)
- [ ] File downloads
- [ ] License management
- [ ] Support ticket system
- [ ] Admin panel access
- [ ] Email notifications

### 8.2 Performance Tests

- [ ] Page load speeds
- [ ] API response times
- [ ] File upload/download speeds
- [ ] Database query performance

### 8.3 Security Tests

- [ ] Authentication flows
- [ ] Authorization checks
- [ ] Input validation
- [ ] Rate limiting
- [ ] CORS configuration

---

## 🚀 Step 9: Go Live

### 9.1 Pre-Launch Checklist

- [ ] All environment variables configured
- [ ] Database schema deployed
- [ ] Payment system tested
- [ ] Email notifications working
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Backup procedures in place
- [ ] Monitoring alerts configured

### 9.2 Launch Steps

1. **Switch Stripe to Live Mode**
   - Update API keys to live keys
   - Test a small transaction
   - Monitor webhook deliveries

2. **Update DNS** (if using custom domain)
   - Point your domain to Netlify
   - Verify SSL certificate

3. **Monitor Launch**
   - Watch error logs
   - Monitor performance metrics
   - Check payment processing
   - Verify email delivery

---

## 📈 Step 10: Post-Launch Monitoring

### 10.1 Set Up Monitoring

1. **Netlify Functions Logs**
   - Monitor function execution
   - Watch for errors and timeouts

2. **Supabase Monitoring**
   - Database performance
   - Connection pool usage
   - Query performance

3. **Firebase Storage**
   - Storage usage
   - Bandwidth consumption
   - Access patterns

### 10.2 Regular Maintenance

- **Weekly**: Review error logs and performance metrics
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Review and optimize database performance
- **Annually**: Rotate API keys and secrets

---

## 🔧 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check Node.js version
   node --version  # Should be 18+
   
   # Clear cache and reinstall
   npm run clean:all
   ```

2. **Database Connection Issues**
   - Verify Supabase URL and credentials
   - Check connection string format
   - Ensure database is not paused

3. **File Upload Issues**
   - Verify Firebase credentials
   - Check storage rules
   - Confirm bucket permissions

4. **Payment Processing Issues**
   - Verify Stripe webhook endpoint
   - Check webhook secret
   - Monitor Stripe dashboard for failed events

### Getting Help

- **Netlify Support**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Support**: [supabase.com/docs](https://supabase.com/docs)
- **Firebase Support**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Stripe Support**: [stripe.com/docs](https://stripe.com/docs)

---

## 🎉 Congratulations!

Your Vistone SaaS platform is now live and ready to serve customers! 

### Next Steps

1. **Marketing**: Set up SEO, social media, and marketing campaigns
2. **Analytics**: Monitor user behavior and optimize conversion rates
3. **Scaling**: Plan for increased traffic and storage needs
4. **Features**: Implement additional features based on user feedback

### Support

For technical support or questions about this deployment:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

**Happy Selling! 🚀**
