'use client'

import { get, set, del, keys } from 'idb-keyval'

export interface QueuedOperation {
  id: string
  table: string
  operation: 'insert' | 'update' | 'delete'
  payload: Record<string, unknown>
  timestamp: number
  retries: number
}

const QUEUE_PREFIX = 'ir_queue_'

export async function enqueue(op: Omit<QueuedOperation, 'id' | 'timestamp' | 'retries'>) {
  const id = `${QUEUE_PREFIX}${Date.now()}_${Math.random().toString(36).slice(2)}`
  const item: QueuedOperation = { ...op, id, timestamp: Date.now(), retries: 0 }
  await set(id, item)
  return item
}

export async function dequeue(id: string) {
  await del(id)
}

export async function getAllQueued(): Promise<QueuedOperation[]> {
  const allKeys = await keys()
  const queueKeys = allKeys.filter(k => String(k).startsWith(QUEUE_PREFIX))
  const items = await Promise.all(queueKeys.map(k => get<QueuedOperation>(k)))
  return items
    .filter((item): item is QueuedOperation => item !== undefined)
    .sort((a, b) => a.timestamp - b.timestamp)
}

export async function clearQueue() {
  const allKeys = await keys()
  const queueKeys = allKeys.filter(k => String(k).startsWith(QUEUE_PREFIX))
  await Promise.all(queueKeys.map(k => del(k)))
}
