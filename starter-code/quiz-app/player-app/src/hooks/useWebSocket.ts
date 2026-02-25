import { useEffect, useRef, useState, useCallback } from 'react'
import type { ClientMessage, ServerMessage } from '@shared/index'

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface UseWebSocketReturn {
  status: ConnectionStatus
  sendMessage: (message: ClientMessage) => void
  lastMessage: ServerMessage | null
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const [lastMessage, setLastMessage] = useState<ServerMessage | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const unmountedRef = useRef(false)

  const MAX_RECONNECT_DELAY = 30000

  const connect = useCallback(() => {
    if (unmountedRef.current) return

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setStatus('connecting')

    const ws = new WebSocket(url)
    wsRef.current = ws

    ws.onopen = () => {
      if (unmountedRef.current) {
        ws.close()
        return
      }
      setStatus('connected')
      reconnectAttemptRef.current = 0
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const message = JSON.parse(event.data as string) as ServerMessage
        setLastMessage(message)
      } catch (err) {
        console.error('[useWebSocket] Erreur de parsing:', err)
      }
    }

    ws.onclose = () => {
      if (unmountedRef.current) return
      setStatus('disconnected')
      wsRef.current = null

      const delay = Math.min(
        1000 * Math.pow(2, reconnectAttemptRef.current),
        MAX_RECONNECT_DELAY
      )
      reconnectAttemptRef.current += 1

      reconnectTimeoutRef.current = setTimeout(() => {
        if (!unmountedRef.current) {
          connect()
        }
      }, delay)
    }

    ws.onerror = (event: Event) => {
      console.error('[useWebSocket] Erreur:', event)
    }
  }, [url])

  useEffect(() => {
    unmountedRef.current = false
    connect()

    return () => {
      unmountedRef.current = true

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connect])

  const sendMessage = useCallback((message: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    } else {
      console.warn('[useWebSocket] Impossible d\'envoyer, WebSocket non connecte')
    }
  }, [])

  return { status, sendMessage, lastMessage }
}
