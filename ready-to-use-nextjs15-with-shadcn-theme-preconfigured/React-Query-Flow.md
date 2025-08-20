So the main flow is now:

Server → fetch + prefill cache

Send dehydrated cache to client

Client → hydrates + React Query instantly has leads,activities,chats without extra fetch

That’s the clean hydration pattern. ✅
