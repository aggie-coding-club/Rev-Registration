# -e enables interpretation of backslash escapes (so we can use \n for a new line)
echo -e "DISCORD_BOT_TOKEN='$1'\nDISCORD_$2_CHANNEL_ID='$3'" > autoscheduler/autoscheduler/settings/.env
