'use client'

import React, { useState, useEffect } from 'react'

interface DebugLog {
  type: 'info' | 'error' | 'success'
  message: string
  timestamp: number
  data?: any
}

let debugLogs: DebugLog[] = []
let listeners: Array<(logs: DebugLog[]) => void> = []

export function addDebugLog(type: DebugLog['type'], message: string, data?: any) {
  const log: DebugLog = {
    type,
    message,
    timestamp: Date.now(),
    data
  }
  debugLogs.push(log)
  // Keep only last 50 logs
  if (debugLogs.length > 50) {
    debugLogs = debugLogs.slice(-50)
  }
  // Notify all listeners
  listeners.forEach(listener => listener([...debugLogs]))
  
  // Also log to console
  const consoleMethod = type === 'error' ? 'error' : type === 'success' ? 'log' : 'log'
  console[consoleMethod](`[DEBUG] ${message}`, data || '')
}

export function clearDebugLogs() {
  debugLogs = []
  listeners.forEach(listener => listener([]))
}

/**
 * DebugPanel - Shows all debug logs on screen for mobile debugging
 * Press and hold on the panel for 2 seconds to close it
 */
export default function DebugPanel() {
  const [logs, setLogs] = useState<DebugLog[]>(debugLogs)
  const [isVisible, setIsVisible] = useState(true)
  const [holdTimer, setHoldTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Subscribe to log updates
    listeners.push(setLogs)
    
    return () => {
      // Unsubscribe
      listeners = listeners.filter(l => l !== setLogs)
    }
  }, [])

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)
    setHoldTimer(timer)
  }

  const handleTouchEnd = () => {
    if (holdTimer) {
      clearTimeout(holdTimer)
      setHoldTimer(null)
    }
  }

  if (!isVisible || logs.length === 0) {
    return null
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-white max-h-[40vh] overflow-y-auto border-t-4 border-[#35BFFF]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2 sticky top-0 bg-black/95 pb-2">
          <div className="text-xs font-bold text-[#35BFFF] uppercase tracking-wider">
            Debug Console (Hold to close)
          </div>
          <button
            onClick={() => clearDebugLogs()}
            className="text-xs px-2 py-1 bg-red-600 rounded"
          >
            Clear
          </button>
        </div>
        <div className="space-y-1 text-xs font-mono">
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                log.type === 'error'
                  ? 'bg-red-900/40 border-l-2 border-red-500'
                  : log.type === 'success'
                  ? 'bg-green-900/40 border-l-2 border-green-500'
                  : 'bg-blue-900/40 border-l-2 border-blue-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className={`font-semibold ${
                    log.type === 'error' ? 'text-red-300' : 
                    log.type === 'success' ? 'text-green-300' : 
                    'text-blue-300'
                  }`}>
                    {log.message}
                  </div>
                  {log.data && (
                    <pre className="mt-1 text-gray-300 overflow-x-auto whitespace-pre-wrap break-all">
                      {typeof log.data === 'object' 
                        ? JSON.stringify(log.data, null, 2) 
                        : String(log.data)}
                    </pre>
                  )}
                </div>
                <div className="text-gray-500 text-[10px] whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
