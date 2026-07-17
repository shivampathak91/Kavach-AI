from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Set
import json
import uuid
from loguru import logger


class ConnectionManager:
    """WebSocket connection manager for real-time updates"""
    
    def __init__(self):
        # Active connections: {user_id: set of websockets}
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # Subscription mapping: {user_id: set of channels}
        self.subscriptions: Dict[str, Set[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info(f"WebSocket connected for user {user_id}")
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove a WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info(f"WebSocket disconnected for user {user_id}")
    
    async def disconnect_all(self):
        """Disconnect all WebSocket connections"""
        for user_id, connections in self.active_connections.items():
            for websocket in connections:
                try:
                    await websocket.close()
                except Exception:
                    pass
        self.active_connections.clear()
        self.subscriptions.clear()
    
    async def subscribe(self, user_id: str, channels: list[str]):
        """Subscribe user to channels"""
        if user_id not in self.subscriptions:
            self.subscriptions[user_id] = set()
        self.subscriptions[user_id].update(channels)
        logger.info(f"User {user_id} subscribed to channels: {channels}")
    
    async def unsubscribe(self, user_id: str, channels: list[str]):
        """Unsubscribe user from channels"""
        if user_id in self.subscriptions:
            self.subscriptions[user_id].difference_update(channels)
            logger.info(f"User {user_id} unsubscribed from channels: {channels}")
    
    async def send_personal_message(self, message: dict, user_id: str):
        """Send a message to a specific user"""
        if user_id in self.active_connections:
            disconnected = set()
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    disconnected.add(connection)
            
            # Clean up disconnected connections
            for connection in disconnected:
                self.disconnect(connection, user_id)
    
    async def broadcast(self, message: dict, channel: str):
        """Broadcast a message to all users subscribed to a channel"""
        for user_id, channels in self.subscriptions.items():
            if channel in channels:
                await self.send_personal_message(message, user_id)
    
    async def broadcast_event(self, event_data: dict):
        """Broadcast an event to relevant users"""
        message = {
            "type": "event",
            "data": event_data
        }
        # Broadcast to agent owner
        agent_id = event_data.get("agent_id")
        if agent_id:
            # In a real implementation, we'd look up the user_id from agent_id
            # For now, broadcast to all
            await self.broadcast(message, "events")
    
    async def broadcast_alert(self, alert_data: dict):
        """Broadcast an alert"""
        message = {
            "type": "alert",
            "data": alert_data
        }
        await self.broadcast(message, "alerts")
    
    async def broadcast_metrics(self, metrics_data: dict):
        """Broadcast metrics update"""
        message = {
            "type": "metrics",
            "data": metrics_data
        }
        await self.broadcast(message, "metrics")


# Global connection manager instance
websocket_manager = ConnectionManager()
