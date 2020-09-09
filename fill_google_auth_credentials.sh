# -e enables interpretation of backslash escapes (so we can use \n for a new line)
echo -e "GOOGLE_OAUTH2_CLIENT_ID='$1'\nGOOGLE_OAUTH2_SECRET='$2'" > autoscheduler/autoscheduler/settings/.env
