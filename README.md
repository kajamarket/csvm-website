# Christ Salvation Victory Mission International (CSVM)

A lightweight four-page static HTML website prepared for GitHub Pages.

## Pages
- `index.html` — Home
- `about.html` — About Us, history, mission, community impact, Victory Camp and leadership
- `directory.html` — headquarters, parish directory and departments
- `news.html` — locally stored convention, history and community impact articles

## Deploy to GitHub Pages
1. Create a GitHub repository and upload the contents of this folder to the repository root.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and `/ (root)`, then save.
5. Wait for GitHub Pages to publish the site. Use the URL shown in Settings → Pages.

The site uses relative paths for its CSS and JavaScript, so it can be served from a GitHub Pages project path. No package installation or build step is needed.

## Before publishing
- Verify the church's preferred social media profile URLs and replace generic platform links in the shared header.
- Confirm that the supplied account details and contact information remain current before publication.
- The logo and sample pastor image currently load from the official website. If desired, download the approved assets and store them in `assets/images/` before publishing, then update the image paths.
- Parish direction links open Google Maps searches for the supplied address text. They are not claims that the precise map pin has been independently verified.
- Review all page content with the church before launch.

## Technical notes
- HTML5, CSS and vanilla JavaScript only.
- Mobile navigation and parish search/filter are included.
- No backend, analytics, payment form, live stream or third-party framework is included.
- The website does not claim to process donations online.
