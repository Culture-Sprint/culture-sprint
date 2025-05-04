
# API Keys Configuration Guide

This project requires several API keys to enable full functionality. This guide explains how to obtain and configure them.

## Required API Keys

### Supabase

The application uses Supabase for authentication, database, and edge functions:

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Once created, find your project URL and anon key in the API settings
4. Add these to your `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### OpenAI API Key

Required for AI assistant features, story analysis, and voice transcription:

1. Create or log in to your OpenAI account at [platform.openai.com](https://platform.openai.com)
2. Navigate to the API keys section
3. Generate a new API key
4. Add this key to your Supabase Edge Function secrets:
   ```
   supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
   ```

## Optional API Keys

### Perplexity API Key

An alternative AI service that can be used instead of OpenAI:

1. Sign up for a Perplexity API key at [perplexity.ai](https://www.perplexity.ai)
2. Once you have your API key, add it to your Supabase Edge Function secrets:
   ```
   supabase secrets set PERPLEXITY_API_KEY=your_perplexity_api_key_here
   ```
3. In the application, users can switch between AI providers in their profile settings

## API Key Security

- Never commit your actual API keys to Git
- Always use environment variables or secrets management
- For production, set these variables in your hosting platform's environment configuration
- The `.env` file is included in `.gitignore` to prevent accidental commits

## Troubleshooting

If you encounter API connection errors:
- Check that your keys are correctly set in the appropriate locations
- Verify that your OpenAI account has sufficient credits
- Ensure your Supabase project has the edge functions deployed
- Check the admin panel for debugging information about API connections
