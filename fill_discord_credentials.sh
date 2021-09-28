# -e enables interpretation of backslash escapes (so we can use \n for a new line)
echo -e "DISCORD_BOT_TOKEN='$1'\nDISCORD_SCRAPE_CHANNEL_ID='$2'" > autoscheduler/autoscheduler/settings/.env
