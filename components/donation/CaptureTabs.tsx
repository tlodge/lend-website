'use client'

import { useState } from 'react'
import { Type, Mic, Video } from 'lucide-react'
import TextCapture from './TextCapture'
import AudioCapture from './AudioCapture'
import VideoCapture from './VideoCapture'
import styles from './CaptureTabs.module.css'

export default function CaptureTabs() {
  const [activeTab, setActiveTab] = useState<'text' | 'audio' | 'video'>('text')
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const tabs = [
    { key: 'text' as const, label: 'Write / Paste', icon: Type },
    { key: 'audio' as const, label: 'Record Audio', icon: Mic },
    { key: 'video' as const, label: 'Record Video', icon: Video },
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabBar} role="tablist" aria-label="Story capture method">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      <div className={styles.tabContent} role="tabpanel">
        {activeTab === 'text' && (
          <TextCapture onSaved={() => showToast('Story saved! View it in My Stories.')} />
        )}
        {activeTab === 'audio' && (
          <AudioCapture onSaved={() => showToast('Audio story saved!')} />
        )}
        {activeTab === 'video' && (
          <VideoCapture onSaved={() => showToast('Video story saved!')} />
        )}
      </div>

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  )
}
