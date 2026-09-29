#!/bin/sh
# Verifies the anon-readable scholarship corpus is present.
KEY=$(grep -o 'VITE_SUPABASE_ANON_KEY=.*' .env | cut -d= -f2-)
URL=$(grep -o 'VITE_SUPABASE_URL=.*' .env | cut -d= -f2-)
curl -s -H "apikey: $KEY" -H "Prefer: count=exact" -D - -o /dev/null \
  "$URL/rest/v1/scholarships?select=id" | grep -i content-range
