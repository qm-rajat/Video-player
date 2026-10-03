'use client';

import { useState, useEffect } from 'react';
import { MediaItem, curatedLegalEpisodes } from '@/lib/data';

const STORAGE_KEY = 'animestream_queue';

export interface QueueItem {
  media: MediaItem;
  quantity: number;
}

export function getQueue(): Record<string, number> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveQueue(queue: Record<string, number>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new Event('queue_updated'));
  } catch (e) {
    console.error('Failed to save queue', e);
  }
}

export function showToast(message: string) {
  if (typeof window === 'undefined') return;
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'on';
  const existingTimer = (toast as any)._timer;
  if (existingTimer) clearTimeout(existingTimer);
  (toast as any)._timer = setTimeout(() => {
    if (toast) toast.className = '';
  }, 2200);
}

export function addToQueue(id: string, amount: number = 1) {
  const current = getQueue();
  current[id] = (current[id] || 0) + amount;
  saveQueue(current);
  showToast(`ADDED [${id.toUpperCase()}] TO WATCH QUEUE`);
}

export function removeFromQueue(id: string) {
  const current = getQueue();
  delete current[id];
  saveQueue(current);
  showToast(`REMOVED [${id.toUpperCase()}] FROM QUEUE`);
}

export function updateQueueQuantity(id: string, delta: number) {
  const current = getQueue();
  const nextVal = (current[id] || 0) + delta;
  if (nextVal <= 0) {
    delete current[id];
  } else {
    current[id] = nextVal;
  }
  saveQueue(current);
}

export function clearQueue() {
  saveQueue({});
  showToast('WATCH QUEUE CLEARED (ORDER DOCKET INITIALIZED)');
}

export function useQueue() {
  const [queue, setQueue] = useState<Record<string, number>>({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      const q = getQueue();
      setQueue(q);
      const total = Object.values(q).reduce((sum, val) => sum + val, 0);
      setCount(total);
    };

    update();
    window.addEventListener('queue_updated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('queue_updated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return { queue, count };
}
