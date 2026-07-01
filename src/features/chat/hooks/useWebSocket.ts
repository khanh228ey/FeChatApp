import { useEffect, useRef, useCallback } from 'react'
import type { WsMessage } from '../types/chat.types'

const WS_BASE = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080'

interface UseWebSocketOptions {
  token: string | null
  onMessage: (msg: WsMessage) => void
}

/**
 * Hook quản lý WebSocket connection.
 * - Tự connect khi có token, disconnect khi unmount.
 * - Expose hàm `send` để gửi message.
 */
export function useWebSocket({ token, onMessage }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage // luôn dùng callback mới nhất

  const send = useCallback((payload: WsMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    }
  }, [])

  useEffect(() => {
    if (!token) return

    const ws = new WebSocket(`${WS_BASE}/ws?token=${token}`)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[ws] connected')
    }

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)
        onMessageRef.current(msg)
      } catch {
        console.warn('[ws] invalid message:', event.data)
      }
    }

    ws.onerror = (err) => {
      console.error('[ws] error:', err)
    }

    ws.onclose = () => {
      console.log('[ws] disconnected')
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [token]) // reconnect nếu token thay đổi

  return { send }
}
