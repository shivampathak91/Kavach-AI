from typing import Dict, Any, Optional
import httpx


class MCPProxy:
    """Proxy for MCP server communication"""
    
    def __init__(self):
        self.mcp_servers = {}  # server_id -> server_url
    
    def register_server(self, server_id: str, server_url: str):
        """Register an MCP server"""
        self.mcp_servers[server_id] = server_url
    
    async def call_tool(
        self,
        server_id: str,
        tool_name: str,
        tool_args: Dict[str, Any],
        timeout: int = 30
    ) -> Dict[str, Any]:
        """Call a tool on an MCP server"""
        
        if server_id not in self.mcp_servers:
            return {"error": f"MCP server {server_id} not registered"}
        
        server_url = self.mcp_servers[server_id]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{server_url}/tools/{tool_name}",
                    json=tool_args,
                    timeout=timeout
                )
                response.raise_for_status()
                return response.json()
        
        except httpx.TimeoutException:
            return {"error": "MCP server timeout"}
        except httpx.HTTPError as e:
            return {"error": f"MCP server error: {str(e)}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    async def list_tools(self, server_id: str) -> list[str]:
        """List available tools on an MCP server"""
        
        if server_id not in self.mcp_servers:
            return []
        
        server_url = self.mcp_servers[server_id]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{server_url}/tools",
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
                return data.get("tools", [])
        
        except Exception:
            return []
    
    async def get_tool_schema(self, server_id: str, tool_name: str) -> Dict[str, Any]:
        """Get schema for a specific tool"""
        
        if server_id not in self.mcp_servers:
            return {}
        
        server_url = self.mcp_servers[server_id]
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{server_url}/tools/{tool_name}/schema",
                    timeout=10.0
                )
                response.raise_for_status()
                return response.json()
        
        except Exception:
            return {}
