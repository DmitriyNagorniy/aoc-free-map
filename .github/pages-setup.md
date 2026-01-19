# GitHub Pages Setup Instructions

## Automatic Setup (Recommended)

This repository is configured with GitHub Actions to automatically deploy to GitHub Pages when you push to the `main` or `master` branch.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aoc-free-map.git
   git push -u origin main
   ```

2. **Enable GitHub Pages in Repository Settings**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - Save the settings

3. **Wait for Deployment**
   - GitHub Actions will automatically build and deploy your site
   - You can check the progress in the **Actions** tab
   - Once complete, your site will be available at:
     `https://YOUR_USERNAME.github.io/aoc-free-map/`

## Manual Setup (Alternative)

If you prefer to use the traditional GitHub Pages method:

1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Choose **main** (or **master**) branch
4. Select **/ (root)** folder
5. Click **Save**

## Custom Domain (Optional)

If you want to use a custom domain:

1. Create a `CNAME` file in the root directory with your domain:
   ```
   yourdomain.com
   ```
2. Configure DNS settings for your domain
3. GitHub Pages will automatically detect the CNAME file

## Troubleshooting

- **Site not updating?** Check the Actions tab for any errors
- **404 errors?** Make sure all file paths are relative (they should be)
- **Tiles not loading?** Ensure the `tiles/` folder is committed to the repository

## Notes

- The `.nojekyll` file prevents GitHub from processing files with Jekyll
- All paths in the code use relative paths, so they work correctly on GitHub Pages
- The site will be available at: `https://YOUR_USERNAME.github.io/aoc-free-map/`
