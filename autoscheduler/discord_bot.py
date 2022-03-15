import asyncio
import os
import time
import discord
from discord.client import Client
import requests
from discord import Webhook, RequestsWebhookAdapter

DISCORD_BOT_TOKEN = os.getenv('DISCORD_BOT_TOKEN')

def create_client() -> Client:
    """ Creates a bot Client and returns it """
    intents = discord.Intents.default()
    intents.guilds = True
    intents.guild_messages = True
    client = Client(intents=intents)

    return client

def send_discord_message(channel_id: int, message: str):
    """ Initializes the discord bot then sends the given message in the given channel """
    if not DISCORD_BOT_TOKEN:
        print("Error: DISCORD_BOT_TOKEN is invalid!")
        return

    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        client = create_client()

        @client.event
        async def on_ready(): # pylint: disable=unused-variable
            channel = client.get_channel(channel_id)
            await channel.send(message)

            await client.close()
            time.sleep(0.1) # Prevents a 'Event loop is closed' error

        client.run(DISCORD_BOT_TOKEN)
    finally:
        loop.close()

def send_discord_message_webhook(webhook_url: str, message: str):
    webhook = Webhook.from_url(webhook_url, adapter=RequestsWebhookAdapter())
    webhook.send(message)
