# GCP Project Pre-Setup Guide

## Overview
This template walks you through everything you need to do **before** running `setup-gcp-dev.py`. After completing these steps, you'll have a new GCP project ready for RAG-SaaS deployment.

## Prerequisites (Already Required)
- ✅ **Supabase account** and project set up
- ✅ **Python 3.10+** installed 
- ✅ **UV package manager** installed
- ✅ **Google account** with access to Google Cloud Platform

## Step 1: Create Google Cloud Project (UI Method)

### 1.1 Navigate to Google Cloud Console
1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If this is your first time, accept the terms of service

### 1.2 Create New Project
1. Click the **project selector** dropdown (top-left, next to "Google Cloud Platform")
2. Click **"NEW PROJECT"** button
3. Fill in project details:
   - **Project name**: Choose any display name (e.g., "My RAG App", "Document AI", etc.)
   - **Project ID**: Google will auto-generate this (e.g., `my-rag-app-123456`)
     - You can click "EDIT" to customize it, but it must follow GCP naming rules:
     - 6-30 characters, lowercase letters, numbers, and hyphens only
     - Must start with a letter, cannot end with hyphen
     - Must be globally unique across all of Google Cloud
   - **Organization**: Select your organization (if applicable)
   - **Location**: Leave as default
4. Click **"CREATE"**
5. Wait for project creation (usually 30-60 seconds)

### 1.3 Note Your Project ID
1. After creation, you'll see your **Project ID** (the unique identifier, not the display name)
2. **📝 Write this down** - you'll need this exact Project ID later
3. Make sure the new project is **selected** in the project dropdown

## Step 2: Enable Billing

### 2.1 Enable Billing for Your Project
1. In the Google Cloud Console, go to **"Billing"** from the left sidebar
2. If you don't have a billing account:
   - Click **"Create Account"**
   - Follow the prompts to add a payment method
   - **Note**: Google provides $300 in free credits for new accounts
3. Link your project to the billing account:
   - Select your project from the project list
   - Click **"SET ACCOUNT"**
   - Choose your billing account

### 2.2 Verify Billing is Active
1. Go to **"Billing"** → **"My Projects"**
2. Confirm your project shows **"Billing Enabled"** status

## Step 3: Install Google Cloud SDK

### 3.1 Download and Install gcloud CLI

#### For macOS:
```bash
# Using Homebrew (recommended)
brew install --cask google-cloud-sdk

# Or download installer from:
# https://cloud.google.com/sdk/docs/install-sdk#mac
```

#### For Windows:
1. Download the installer: [https://cloud.google.com/sdk/docs/install-sdk#windows](https://cloud.google.com/sdk/docs/install-sdk#windows)
2. Run the installer and follow the prompts
3. Restart your terminal/command prompt

#### For Linux:
```bash
# Ubuntu/Debian
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Or follow: https://cloud.google.com/sdk/docs/install-sdk#linux
```

### 3.2 Initialize gcloud CLI
```bash
# Initialize gcloud (this will open a browser for authentication)
gcloud init

# Follow the prompts:
# 1. Choose "Log in with a new account"
# 2. Authenticate in the browser
# 3. Select your newly created project
# 4. Choose your default region (recommend: us-central1)
```

### 3.3 Verify Installation
```bash
# Check that gcloud is working
gcloud --version

# Verify your project is set correctly
gcloud config get-value project
# Should show your actual project ID (e.g., my-rag-app-123456)
```

## Step 4: Get Gemini API Key

### 4.1 Create Gemini API Key
1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** or use your existing project
4. **📝 Copy the API key** - you'll need it for your environment variables

### 4.2 Store API Key Securely
- **Don't commit this to version control**
- **Keep it safe** - you'll add it to your `.env.local` file later

## Step 5: Configure Environment Variables

### 5.1 Create .env.local File
1. Navigate to your RAG-SaaS project directory:
   ```bash
   cd templates/rag-saas/apps/rag-processor
   ```

2. Copy the environment template:
   ```bash
   cp env.local.template .env.local
   ```

### 5.2 Update .env.local with Your Values
Open `.env.local` and update these GCP-related variables:

```bash
# Replace with your actual GCP Project ID (e.g., my-rag-app-123456)
# This is the unique identifier, not the display name
GOOGLE_CLOUD_PROJECT_ID=my-rag-app-123456

# Keep this as default
GOOGLE_CLOUD_REGION=us-central1

# Update with your project ID (keep the -dev suffix)
GOOGLE_CLOUD_STORAGE_BUCKET=my-rag-app-123456-rag-documents-dev

# Keep this as true
GOOGLE_GENAI_USE_VERTEXAI=true

# Replace with your actual Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Keep other values as they are for now
```

## Step 6: Final Verification

### 6.1 Test gcloud Authentication
```bash
# Test that you can access your project
gcloud projects describe $(gcloud config get-value project)

# Should show your project details without errors
```

### 6.2 Test API Access
```bash
# Test that you can list (empty) storage buckets
gcloud storage buckets list

# Should complete without errors (list will be empty)
```

## Step 7: Ready for Setup! 🚀

### You're Now Ready to Run the Setup Script
```bash
# Navigate to the rag-processor directory
cd templates/rag-saas/apps/rag-processor

# Run the development setup script
python scripts/setup-gcp-dev.py
```

## Common Issues and Solutions

### Issue: "gcloud command not found"
**Solution**: Restart your terminal after installing gcloud CLI, or add it to your PATH manually.

### Issue: "Project not found" error
**Solution**: Verify your project ID is correct with `gcloud config get-value project`

### Issue: "Billing not enabled" error
**Solution**: Go back to Step 2 and ensure billing is properly enabled for your project.

### Issue: "Permission denied" errors
**Solution**: Make sure you authenticated with `gcloud init` and selected the correct project.

## What Happens Next

After running `setup-gcp-dev.py`, the script will:
- ✅ Enable required Google Cloud APIs
- ✅ Create storage buckets for your documents
- ✅ Set up service accounts and permissions
- ✅ Configure EventArc triggers for file processing
- ✅ Store API keys in Google Secret Manager
- ✅ Set up development environment for testing

## Support

If you encounter issues during this pre-setup:
1. **Check the error messages** - they usually indicate what's missing
2. **Verify billing is enabled** - this is the most common issue
3. **Ensure your project ID is correct** in both gcloud config and .env.local
4. **Try running commands individually** to isolate the issue

---

**Next Step**: Once you complete this pre-setup, run `python scripts/setup-gcp-dev.py` to configure your RAG-SaaS infrastructure! 🎉 
