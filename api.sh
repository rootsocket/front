source .env
npx wrangler@beta pages dev functions --kv ROOTSOCKET --binding MAIL_KEY="$RS_MAIL_KEY" --binding SECRET="$RS_SECRET" --binding BACKBLAZE_ACCOUNT_AUTH="$RS_ACCOUNT_AUTH"
