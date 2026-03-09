# Garden of Life

A neural language generation experiment exploring how biological-style signals can influence language model decoding.

## Overview

Garden of Life is a web application that demonstrates the integration of simulated neural electrode patterns with large language model text generation. The project visualizes token-by-token generation while incorporating neural spike activity patterns that influence the decoding process.

## Features

### Visualizer
Interactive tool for real-time observation of language generation with neural signal integration. Users can:
- Enter prompts and watch token-by-token generation
- View simulated electrode activation patterns
- See competing token candidates with neural spike scores
- Requires OpenAI API key (not stored, session-only)

### The Grid
A collective neural memory visualization showing:
- Aggregated electrode patterns from all generated stories
- Frequency heatmap of electrode usage across generations
- Recent pattern history with individual electrode activations

### The Garden
A directory of all generated stories with:
- Complete archive of generated content
- Timestamp tracking for each entry
- Raw text output with metadata (costs, tokens, patterns)

### Admin Panel
Story generation interface with:
- Custom prompt input
- AI-powered story generation via OpenAI API
- Automatic electrode pattern assignment
- Firebase storage integration

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **AI Integration**: OpenAI API (GPT-4)
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/gardenoflife/gardenoflife.git
cd gardenoflife
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── page.tsx                 # Homepage
├── visualizer/              # Real-time generation visualizer
├── grid/                    # Neural pattern aggregation
├── garden/                  # Story directory
├── admin/                   # Story generation interface
└── api/
    ├── generate/            # Story generation endpoint
    └── visualize/           # Visualization endpoint

components/
└── Navbar.tsx              # Navigation component

lib/
└── firebase.ts             # Firebase configuration
```

## How It Works

1. **Generation**: Users submit prompts through the admin panel or visualizer
2. **Processing**: The OpenAI API generates text while simulating neural electrode responses
3. **Pattern Assignment**: Each token receives a simulated neural spike pattern (1-16 electrodes)
4. **Storage**: Stories are saved to Firebase with metadata (cost, tokens, electrode patterns)
5. **Visualization**: The Grid aggregates patterns across all stories to show collective neural activity

## Data Model

Each story contains:
- Title and content
- Creation timestamp
- Electrode pattern (array of active electrodes 1-16)
- Token count
- Estimated cost
- Unique identifier

## Contributing

This is an experimental project. Feedback and contributions are welcome.

## License

MIT

## Maintained By

[@gardenoflifesh](https://x.com/gardenoflifesh)
