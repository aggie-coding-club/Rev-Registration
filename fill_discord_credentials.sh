# -e enables interpretation of backslash escapes (so we can use \n for a new line)
# Note that >> appends to a file, whereas just > will overwrite the file
echo -e "DISCORD_BOT_TOKEN='$1'\nDISCORD_SCRAPE_CHANNEL_ID='$2'\nDISCORD_FEEDBACK_CHANNEL_ID='$3'" >> autoscheduler/autoscheduler/settings/.env
