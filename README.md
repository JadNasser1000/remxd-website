# REMXD Website

A modern, responsive landing page for REMXD with privacy policy and terms of service pages.

## Pages

- **Main Page** (`index.html`) - Landing page with hero section, mission statement, and contact form
- **Privacy Policy** (`privacy.html`) - Complete privacy policy at `/privacy`
- **Terms of Use** (`terms.html`) - Terms of service at `/terms`

## Features

- Beautiful starry night hero section with animated stars
- Smooth scrolling navigation
- Responsive design for all devices
- Contact form with validation
- Modern typography using Google Fonts (Playfair Display & Inter)
- Clean, professional layout

## File Structure

```
Remxd-website/
├── index.html          # Main landing page
├── privacy.html        # Privacy policy page
├── terms.html          # Terms of use page
├── styles.css          # All styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Deployment

### Option 1: Deploy to remxd.ai with URL routing

To get the URLs working as `remxd.ai/privacy` and `remxd.ai/terms`, you'll need to configure your web server:

#### For Apache (.htaccess):
```apache
RewriteEngine On
RewriteRule ^privacy$ privacy.html [L]
RewriteRule ^terms$ terms.html [L]
```

#### For Nginx:
```nginx
location /privacy {
    try_files /privacy.html =404;
}

location /terms {
    try_files /terms.html =404;
}
```

### Option 2: Quick deployment options

1. **Netlify** (Recommended for simplicity)
   - Drag and drop the folder to [netlify.com/drop](https://app.netlify.com/drop)
   - Configure custom domain to point to remxd.ai
   - Netlify will automatically handle URL routing

2. **Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in this directory
   - Follow prompts to deploy

3. **GitHub Pages**
   - Create a repository and push these files
   - Enable GitHub Pages in repository settings
   - Configure custom domain

### Option 3: Traditional web hosting

1. Upload all files to your web server via FTP or file manager
2. Configure your domain (remxd.ai) to point to your hosting
3. Set up URL rewriting (see Option 1)

## Local Development

To test locally:

1. Open `index.html` in a web browser, or
2. Use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```
3. Navigate to `http://localhost:8000`

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1a1a1a;
    --secondary-color: #f5f5f5;
    --accent-color: #00bcd4;
    --text-light: #ffffff;
    --text-dark: #333333;
}
```

### Content
- Edit mission statement in `index.html`
- Update privacy policy in `privacy.html`
- Update terms in `terms.html`

### Contact Form
The contact form currently shows an alert. To make it functional, integrate with:
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://www.netlify.com/products/forms/)
- Your own backend API

### Download Button
Update the app download link in `script.js`:
```javascript
// Replace the alert with actual app store links
window.location.href = 'https://apps.apple.com/your-app';
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

© 2025 REMXD. All rights reserved.

# Force rebuild
