# Deployment & Development Guide - GHG WHAT-IF Tool

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/17871787/WiT_Risk_Score.git
cd ghg-tool

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 💻 Development Environment

### Prerequisites
- Node.js 16+ 
- npm 7+
- Git
- Vercel CLI (optional)

### Recommended Tools
- VS Code with extensions:
  - ESLint
  - Prettier
  - TypeScript
  - Tailwind CSS IntelliSense
- React Developer Tools
- Lighthouse (Chrome)

## 🏗️ Project Scripts

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start Vite dev server | Local development |
| `npm run build` | TypeScript + Vite build | Production build |
| `npm run preview` | Preview production build | Test before deploy |
| `npm test` | Run Jest tests | Unit testing |
| `npm run type-check` | TypeScript checking | Verify types |
| `npm run lighthouse` | Run Lighthouse locally | Performance check |

## 🌐 Deployment Process

### Vercel Deployment (Production)

1. **Automatic Deployment** (Recommended)
   - Push to `main` branch
   - Vercel auto-deploys via GitHub integration

2. **Manual Deployment**
   ```bash
   # Deploy to production
   vercel --prod
   
   # Deploy preview
   vercel
   ```

3. **Force Deployment** (Cache issues)
   ```bash
   vercel --prod --force
   ```

### Environment URLs

- **Production**: https://ghg-tool-five.vercel.app
- **Latest Deploy**: Check `vercel ls` for recent deployments
- **GitHub**: https://github.com/17871787/WiT_Risk_Score

## 🔧 Configuration Files

### `vercel.json`
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

### `vite.config.ts`
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
        }
      }
    }
  }
})
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 🐛 Common Issues & Solutions

### Build Failures

1. **TypeScript Errors**
   ```bash
   # Check types without building
   npx tsc --noEmit
   ```

2. **Module Resolution**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check imports use correct paths

3. **Vite Build Issues**
   - Clear cache: `rm -rf dist`
   - Check for circular dependencies

### Deployment Issues

1. **Old Version Showing**
   - Hard refresh: Ctrl+Shift+R
   - Check deployment: `vercel ls`
   - Update alias: `vercel alias [deployment-url] ghg-tool-five.vercel.app`

2. **Build Timeout**
   - Reduce bundle size
   - Check for infinite loops in build

3. **404 Errors**
   - Ensure `vercel.json` has rewrites
   - Check `outputDirectory` is correct

## 🔍 Debugging

### Local Debugging

```bash
# Development with verbose logging
VITE_LOG_LEVEL=debug npm run dev

# Check bundle size
npm run build -- --report

# Analyze dependencies
npm ls
```

### Production Debugging

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel inspect [deployment-url]

# List all deployments
vercel ls
```

## 📊 Performance Monitoring

### Lighthouse CI

```bash
# Run locally
npm run lighthouse

# View report
open lighthouse-report.html
```

### Key Metrics
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: < 200KB gzipped

## 🔄 Development Workflow

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Develop with Hot Reload**
   ```bash
   npm run dev
   ```

3. **Type Check**
   ```bash
   npm run type-check
   ```

4. **Test**
   ```bash
   npm test
   ```

5. **Build & Preview**
   ```bash
   npm run build
   npm run preview
   ```

6. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

### Adding New Components

1. Create component file in appropriate directory
2. Add TypeScript types if needed
3. Import in parent component/dashboard
4. Test with different parameter values
5. Verify memoization if expensive

### Adding New Calculations

1. Create pure function in `/lib/calculations/`
2. Add unit tests
3. Create custom hook in `/hooks/`
4. Integrate into `useCalculations` if core metric
5. Update relevant displays

## 🔐 Security Considerations

### Build Security
- No secrets in code
- All calculations client-side
- Input validation on all parameters
- Safe math operations (no division by zero)

### Deployment Security
- HTTPS only
- No exposed API keys
- Vercel security headers
- Regular dependency updates

## 📦 Dependencies Management

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "zustand": "^4.4.0",
  "recharts": "^2.8.0",
  "tailwindcss": "^3.3.0",
  "vite": "^4.4.0",
  "typescript": "^5.0.0"
}
```

### Update Process
```bash
# Check outdated
npm outdated

# Update patch versions
npm update

# Update minor versions
npm install package@latest
```

## 🎯 Production Checklist

- [ ] All TypeScript errors resolved
- [ ] Tests passing
- [ ] Build successful
- [ ] Bundle size < 200KB gzipped
- [ ] Lighthouse score > 90
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Cross-browser tested
- [ ] Accessibility checked
- [ ] Documentation updated

## 📞 Support

### Resources
- **GitHub Issues**: https://github.com/17871787/WiT_Risk_Score/issues
- **Vercel Dashboard**: https://vercel.com/joe-towers-projects/ghg-tool
- **Local Logs**: Check browser console

### Common Commands Reference
```bash
# Development
npm run dev              # Start dev server
npm test                 # Run tests
npm run type-check       # Check types

# Building
npm run build           # Production build
npm run preview         # Preview build

# Deployment
vercel                  # Deploy preview
vercel --prod          # Deploy production
vercel ls              # List deployments
vercel logs            # View logs
vercel alias ls        # List aliases
```

---

*Last Updated: August 2025*
*For auto-compact: All critical paths and commands are documented above*