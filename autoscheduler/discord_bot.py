import os
import time
import discord
from discord.client import Client
from dotenv import load_dotenv

load_dotenv()
DISCORD_BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')
DISCORD_SERVER_ID = os.getenv('DISCORD_SERVER_ID')

def create_client() -> Client:
    """ Creates a bot Client and returns it """
    intents = discord.Intents.default()
    intents.guilds = True
    intents.guild_messages = True
    client = Client(intents=intents)

    return client

def send_discord_message(channel_id: int, message: str):
    """ Initializes the discord bot then sends the given message in the given channel """
    client = create_client()

    @client.event
    async def on_ready(): # pylint: disable=unused-variable
        channel = client.get_channel(channel_id)
        await channel.send(message)

        await client.close()
        time.sleep(0.1) # Prevents a 'Event loop is closed' error

    client.run(DISCORD_BOT_TOKEN)
