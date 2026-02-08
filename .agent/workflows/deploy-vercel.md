---
description: How to push to GitHub and deploy to Vercel for free
---

Follow these steps to host your website for free and share it with your client.

### 1. Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `sangam-elite-website`).
3. Keep it **Public** (or Private if you prefer).
4. Do **not** initialize with a README, license, or gitignore (we already have them).
5. Click **Create repository**.

### 2. Push Your Code to GitHub
Open your terminal in `h:/website_temp/sangem-hotels` and run:

// turbo
```bash
git add .
git commit -m "Final production-ready build for client"
git branch -M master
git remote add origin https://github.com/YOUR_USERNAME/sangam-elite-website.git
git push -u origin master
```
> [!IMPORTANT]
> Replace `YOUR_USERNAME` and `sangam-elite-website` with your actual GitHub username and repository name.

### 3. Deploy to Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account.
2. Click **Add New...** > **Project**.
3. You will see your GitHub repositories. Click **Import** next to `sangam-elite-website`.
4. Leave the default settings (Vercel automatically detects Next.js).
5. Click **Deploy**.

### 4. Share with Client
Within 1-2 minutes, Vercel will give you a live URL (e.g., `sangam-elite-website.vercel.app`). You can send this link directly to your client!

> [!TIP]
> Every time you push new changes to GitHub (`git push`), Vercel will automatically update your live website!
