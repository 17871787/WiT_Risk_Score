# Auto-Compact Handoff - Credentials & Deployment

## 🔐 IMPORTANT: Authentication Status

### GitHub
- **Status**: ✅ Authenticated via GitHub CLI
- **Repository**: https://github.com/17871787/WiT_Risk_Score
- **Username**: 17871787
- **Default Branch**: main
- **Access Method**: Git CLI is already configured

### Vercel
- **Status**: ✅ Authenticated via Vercel CLI
- **Team**: joe-towers-projects
- **Project Name**: ghg-tool
- **Production URL**: https://ghg-tool-five.vercel.app
- **Dashboard**: https://vercel.com/joe-towers-projects/ghg-tool

## 🚀 Deployment Preferences

### Preferred Deployment Method
```bash
# Always use production flag for main deployments
vercel --prod

# For testing/preview
vercel
```

### Deployment Workflow
1. **Always build locally first** to catch errors:
   ```bash
   npm run build
   ```

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

3. **If caching issues occur**:
   ```bash
   vercel --prod --force
   ```

### Git Workflow Preferences
1. **Commit with descriptive messages**:
   ```bash
   git add -A
   git commit -m "feat: description of changes"
   git push origin main
   ```

2. **Commit Message Format**:
   - feat: New features
   - fix: Bug fixes
   - docs: Documentation updates
   - refactor: Code refactoring
   - test: Test updates

3. **Always include Co-Authored-By**:
   ```
   🤖 Generated with Claude Code
   
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```

## 🌐 Project URLs

### Production
- **Main URL**: https://ghg-tool-five.vercel.app
- **Alternative**: https://ghg-tool-joe-towers-projects.vercel.app

### Development
- **Local**: http://localhost:5173 (Vite default)
- **Preview**: Created automatically with `vercel`

## ⚙️ Vercel Configuration

### Current Setup (vercel.json)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deployment Settings
- **Framework Preset**: Vite
- **Node Version**: 18.x
- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 🔧 Common Deployment Commands

### Check Deployment Status
```bash
# List recent deployments
vercel ls

# Check current production URL
vercel

# View deployment logs
vercel logs

# Inspect specific deployment
vercel inspect [deployment-url]
```

### Manage Aliases
```bash
# List all aliases
vercel alias ls

# Update production alias
vercel alias [deployment-url] ghg-tool-five.vercel.app
```

## 📋 Deployment Checklist

Before deploying:
- [ ] Run `npm run build` locally
- [ ] Check for TypeScript errors
- [ ] Verify no console errors in dev
- [ ] Test key features work locally

After deploying:
- [ ] Check production URL loads
- [ ] Verify new features are visible
- [ ] Test on different browsers
- [ ] Check mobile responsiveness

## ⚠️ Important Notes

1. **Authentication is already set up** - Both GitHub and Vercel CLIs are authenticated
2. **No need to login again** - Just use the commands directly
3. **Production deploys automatically** update the main URL
4. **Preview deploys** create unique URLs for testing

## 🆘 Troubleshooting

### If deployment fails:
1. Check build output for errors
2. Verify all files are committed
3. Try `vercel --prod --force`
4. Check Vercel dashboard for detailed logs

### If features missing in production:
1. Hard refresh browser (Ctrl+Shift+R)
2. Check deployment actually completed: `vercel ls`
3. Verify correct files built: Check dist/ folder
4. Update alias if needed

## 🔄 Current State

- **Latest Commit**: All V4 Sprint 1 features deployed
- **Working Features**: 
  - Feed Tuning
  - NUE calculations
  - Theoretical Minimum
  - Enhanced Glide Path
- **Next Sprint**: V4 Sprint 2 - Reduction Pathway Logic

## 📞 Support Resources

- **GitHub Repo**: https://github.com/17871787/WiT_Risk_Score
- **Vercel Dashboard**: https://vercel.com/joe-towers-projects/ghg-tool
- **Local Project**: C:\Users\jtowe\ghg-tool

---

*Note: This document contains deployment preferences and authenticated CLI access. The CLIs are already logged in and ready to use.*