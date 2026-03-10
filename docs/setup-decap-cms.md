# Decap CMS Setup Instructions

These instructions will guide you through setting up Decap CMS for this repository, including the required GitHub OAuth Application and Cloudflare Pages environment variables.

## 1. Create a GitHub OAuth Application

To allow Decap CMS to authenticate with GitHub, you need to create an OAuth Application on GitHub.

1.  Go to your GitHub **Settings > Developer settings > OAuth Apps**.
2.  Click **New OAuth App**.
3.  **Application name**: `rahuldhole-cms` (or any name you prefer).
4.  **Homepage URL**: `https://<your-site>.pages.dev` (replace with your actual production URL).
5.  **Authorization callback URL**: `https://<your-site>.pages.dev/api/callback`.
6.  Click **Register application**.
7.  Copy the **Client ID** and generate a **Client Secret**. Save these for the next step.

## 2. Configure Cloudflare Pages Environment Variables

You need to add the GitHub Client ID and Client Secret to your Cloudflare Pages project.

1.  Go to your Cloudflare dashboard and select your **Pages** project.
2.  Go to **Settings > Environment variables**.
3.  Add the following variables for **Production**:
    *   `STUDIO_GITHUB_CLIENT_ID`: (Your GitHub Client ID)
    *   `STUDIO_GITHUB_CLIENT_SECRET`: (Your GitHub Client Secret)
4.  Save the variables.
5.  **Note**: These must be set for the "Production" environment. If you want to use them in "Preview" environments, ensure you use the correct callback URL in the GitHub OAuth App or create a separate OAuth app for previews.

## 3. Accessing the Content Manager

Once the environment variables are set and the site is deployed:

1.  Navigate to `https://<your-site>.pages.dev/admin`.
2.  Click the "Login with GitHub" button.
3.  You will be redirected to GitHub to authorize the application.
4.  Once authorized, you will be redirected back to the Decap CMS dashboard.

## Local Development

Authentication will not work in local development because it requires a secure redirect URI and a registered OAuth App. To test the UI locally, create new dev only oauth app and serve via localtunnel.

## Notes for Development

*   The Decap CMS configuration is located in `public/admin/config.yml`.
*   The OAuth flow is handled by Nuxt server routes in `server/api/auth.js` and `server/api/callback.js`.
*   Content collections are mirrored from `content.config.ts`. If you add new collections or fields to `content.config.ts`, you should also update `public/admin/config.yml`.
