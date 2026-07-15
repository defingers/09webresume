# Deploying to Azure (automated via GitHub Actions)

This sets up continuous deployment: every push to `main` automatically deploys the backend to Azure App Service and the frontend to Azure Static Web Apps. You do the one-time setup below; after that, `git push` is all you need.

## 0. One-time cleanup

A previous automated attempt left a broken `.git` folder in this project. Before starting, delete it manually in File Explorer:

- Delete `C:\Sunil_app\Sunil_app\.git` (you may need to show hidden files: View -> Hidden items)
- Also delete `C:\Sunil_app\Sunil_app\app\frontend\node_modules` if present (leftover test artifacts; `npm install` will recreate it)

## 1. Push this project to GitHub

In VS Code's terminal, at `C:\Sunil_app\Sunil_app`:

```
git init
git add -A
git commit -m "Initial commit"
```

Then create a new empty repo on github.com (no README/license), and:

```
git remote add origin https://github.com/<your-username>/<your-repo>.git
git branch -M main
git push -u origin main
```

## 2. MongoDB Atlas: allow Azure to connect

In the Atlas dashboard (cloud.mongodb.com):
1. Network Access -> Add IP Address -> **Allow Access from Anywhere** (`0.0.0.0/0`). Azure App Service uses dynamic outbound IPs, so this is the simplest reliable option.
2. Database -> Connect -> Drivers -> copy the connection string. It looks like:
   `mongodb+srv://defing_db_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
3. Replace `<password>` with your DB user's password, URL-encoded (`@` becomes `%40`, etc). You'll paste this whole string into Azure in step 5.

## 3. Create the backend (Azure App Service)

In portal.azure.com:
1. Create a resource -> **Web App**
2. Publish: **Code**, Runtime stack: **Python 3.11**, Operating System: **Linux**
3. Pick any region close to you, and the Free (F1) or Basic (B1) pricing tier
4. Create it, then open the resource once deployed
5. Go to **Configuration -> General settings** -> set **Startup Command** to:
   ```
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker server:app --bind=0.0.0.0:8000 --timeout 600
   ```
6. Go to **Configuration -> Application settings** -> add these (New application setting for each):
   - `MONGO_URL` = the full connection string from step 2
   - `DB_NAME` = `test_database`
   - `CORS_ORIGINS` = `*` (tighten this to your frontend URL later)
   - `RESEND_API_KEY` = (leave blank until you have one, or fill in)
   - `SENDER_EMAIL` = `aboutsunin@gmail.com`
   - `RECIPIENT_EMAIL` = wherever you want contact form emails sent
7. Save.
8. Go to **Deployment Center** (or **Overview -> Get publish profile**) and download the **Publish Profile**. Open it in a text editor and copy the entire contents.

## 4. Create the frontend (Azure Static Web Apps)

In portal.azure.com:
1. Create a resource -> **Static Web App**
2. Deployment details: choose **Other** (since we're using our own GitHub Actions workflow, not the auto-generated one) — if it forces you to pick GitHub, you can connect the repo but then delete the workflow file it auto-generates and keep the one already in this project (`.github/workflows/frontend-azure.yml`)
3. Hosting plan: **Free**
4. Create it
5. Once created, go to **Manage deployment token** and copy the token

## 5. Add GitHub secrets

In your GitHub repo: **Settings -> Secrets and variables -> Actions -> New repository secret**. Add:

| Secret name | Value |
|---|---|
| `AZURE_BACKEND_PUBLISH_PROFILE` | the full publish profile XML from step 3.8 |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | the deployment token from step 4.5 |
| `REACT_APP_BACKEND_URL` | `https://<your-backend-app-name>.azurewebsites.net` |

## 6. Point the workflow at your App Service name

Open `.github/workflows/backend-azure.yml` in this project and change:

```yaml
AZURE_WEBAPP_NAME: your-backend-app-name
```

to the actual name you gave the Web App in step 3.2.

## 7. Deploy

```
git add -A
git commit -m "Configure Azure deployment"
git push
```

Go to your repo's **Actions** tab on GitHub to watch both workflows run. Once green:
- Backend: `https://<your-backend-app-name>.azurewebsites.net/api/health`
- Frontend: the URL shown on your Static Web App's Overview page in the Azure portal

## Troubleshooting

- **Backend 502/503**: check Startup Command was saved correctly (step 3.5), and check Log stream in the App Service portal.
- **Frontend loads but contact form fails**: `REACT_APP_BACKEND_URL` secret is wrong, or `CORS_ORIGINS` on the backend doesn't include the frontend's URL.
- **MongoDB connection refused**: double check Network Access allows `0.0.0.0/0`, and that the password in `MONGO_URL` is percent-encoded.
