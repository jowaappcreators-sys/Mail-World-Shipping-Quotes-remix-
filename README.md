# Mail World Office Ship Quote Hub

Professional Shipping Quote Hub for Mail World Office Ship Quote.

## Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

## Local Setup

1. **Clone the repository** (or download and unzip the source code).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   - Create a file named `.env.local` in the root directory.
   - Add your [Google Gemini API Key](https://aistudio.google.com/app/apikey):
     ```env
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     ```
   - (Optional) Add other branding variables:
     ```env
     VITE_BRAND_NAME=Mail World Office Ship Quote
     VITE_BRAND_COLOR=#2563eb
     VITE_BRAND_PHONE=918-555-0123
     VITE_BRAND_EMAIL=admin@mailworldoffice.com
     VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
     ```
4. **Run the app**:
   ```bash
   npm run dev
   ```
5. **Open in Browser**:
   The app will be available at [http://localhost:3000](http://localhost:3000).

## Deployment

### Netlify
- The app is pre-configured for Netlify via `netlify.toml`.
- Ensure you set the `GEMINI_API_KEY` in the Netlify Environment Variables settings.

### Vercel
- The app is pre-configured for Vercel via `vercel.json`.
- Ensure you set the `GEMINI_API_KEY` in the Vercel Environment Variables settings.

### Render
- The app is pre-configured for Render via `render.yaml`.
- Deploy as a **Web Service**.
- Ensure you set the `GEMINI_API_KEY` in the Render Environment Variables settings.

### Google Cloud Run
- A `Dockerfile` is provided for containerized deployment.
- Build and deploy using `gcloud run deploy`.

## Features
- AI-powered shipping quotes from FedEx, UPS, DHL, and USPS.
- Multi-language support (English and Spanish).
- Elite Membership with discounts.
- Local pickup scheduling.
- Integrated support chat.
