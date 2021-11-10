# -e enables interpretation of backslash escapes (so we can use \n for a new line)
# Note that >> appends to a file, whereas just > will overwrite the file
echo -e "GOOGLE_OAUTH2_CLIENT_ID='$1'\nGOOGLE_OAUTH2_SECRET='$2'" >> autoscheduler/autoscheduler/settings/.env
