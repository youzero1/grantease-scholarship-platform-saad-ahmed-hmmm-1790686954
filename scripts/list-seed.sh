#!/bin/sh
KEY=$(grep -o 'VITE_SUPABASE_ANON_KEY=.*' .env | cut -d= -f2-)
URL=$(grep -o 'VITE_SUPABASE_URL=.*' .env | cut -d= -f2-)
curl -s -H "apikey: $KEY" "$URL/rest/v1/scholarships?select=name,prompt_theme&order=name&limit=100"
