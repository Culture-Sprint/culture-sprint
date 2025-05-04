
# Culture Sprint Platform

An interactive web application designed to facilitate and manage culture sprint sessions for organizations.

## Project Overview

Culture Sprint is a digital platform designed to facilitate rapid, participatory cultural transformation within organizations. By leveraging data-driven insights and structured collaborative processes, it enables teams to identify emerging patterns and implement actionable interventions that resonate with all stakeholders.

## Key Features

- **Pattern Recognition**: Collects anonymous feedback to uncover cultural patterns while minimizing bias from traditional interviews or surveys.
- **Stakeholder Engagement**: Brings diverse voices into the analysis and solution process, ensuring cultural change is co-owned and context-aware.
- **Actionable Insights**: Converts collected data into concrete interventions within just one week.
- **Transparent Change Management**: Ensures interventions are based entirely on real stakeholder experiences, not assumptions.

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Supabase account (for backend services)
- OpenAI API key (for AI assistant features)
- Perplexity API key (optional, for alternative AI model)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/your-username/culture-sprint.git
   cd culture-sprint
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the environment example file and fill in your values:
   ```
   cp .env.example .env
   ```

4. Configure your environment variables in the `.env` file:
   - Get your Supabase URL and anon key from your Supabase project dashboard
   - Obtain an OpenAI API key from [OpenAI's platform](https://platform.openai.com/api-keys)
   - (Optional) Get a Perplexity API key if you want to use their AI services

5. Start the development server:
   ```
   npm run dev
   ```

### Supabase Edge Functions

This project uses Supabase Edge Functions for server-side operations. After setting up your Supabase project:

1. Add your API keys to Supabase Edge Functions secrets:
   ```
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   supabase secrets set PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```

2. Deploy the edge functions:
   ```
   supabase functions deploy
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| VITE_SUPABASE_URL | Your Supabase project URL | Yes |
| VITE_SUPABASE_ANON_KEY | Your Supabase project anonymous key | Yes |
| VITE_ENABLE_DEBUG | Enable debug mode (true/false) | No |
| OPENAI_API_KEY | OpenAI API key (for Edge Functions) | For AI features |
| PERPLEXITY_API_KEY | Perplexity API key (for Edge Functions) | Optional |

## Development

- Feature flag `VITE_ENABLE_DEBUG=true` can be enabled for additional debugging information
- The project uses React, Vite, TailwindCSS, and shadcn/ui for the frontend
- Supabase provides authentication, database, and serverless functions

## Trademark Notice
"Culture Sprint" is a trademark of Hosting Learning OU. Self-hosting is permitted 
for legitimate Culture Sprint processes as defined in our Trademark Policy. 
Modified versions serving different purposes must be renamed.

## License

Apache License Version 2.0 - read LICENSE.md

## Contact

contact @ culturesprint.co
