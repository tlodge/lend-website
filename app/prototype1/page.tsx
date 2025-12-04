"use client"

import { useState, useEffect, useRef } from "react"
import html2canvas from "html2canvas"
import { Camera } from "lucide-react"
import Header from "../../components/Header"
import PrototypeOverview from "./PrototypeOverview"
import styles from "./prototype.module.css"

interface IframeEvent {
  type: 'view-change' | 'story-select' | 'story-reflection' | 'menu-action'
  view?: string
  storyId?: string
  storyTitle?: string
  response?: 'helpful' | 'unsure' | 'distressing' | 'dislike'
  action?: string
  timestamp: number
  metadata?: Record<string, any>
}

const VIEW_INFO: Record<string, { title: string; description: string; details: string[] }> = {
  'search': {
    title: 'Conversational Search',
    description: 'This is the root screen.  Users can chat by typing or talking. We want this to be as sparse and simple as possible.',
    details: [
      `Users can discuss what they are looking for rather than searching on keywords or setting filters.`,
      `Once the system has enough information the user can choose to 'show me stories'.`,
      `Beneath the 'show me stories' the system will explain what it will look for and the user can edit it.`,
      `Beneath all system chat responses, the user is provided with a few buttons of options as a simpler way to respond.`,
    
    ]
  },
  'library': {
    title: 'Story Matches',
    description: 'This provides a list of stories that match the user\'s criteria. The best match is more prominent.',
    details: [
      'A user can look at what the system actually looked for, based on assumptions it has made so far.',
      'Rather than view stories on the website, they may wish to create a playlist to listen and watch over time in a more familiar application (e.g podcast app)',
      'Beneath the story thumbnail is a summary of the story.  This is intended to help users anticipate whether it might be distreesing',
      `We also have a 'why this story' where users can learn why a particular story was recommended, and challenge any assumptions.`,

    ]
  },
  'playback': {
    title: 'Story Playback',
    description: 'This is an example of a video narrative. Other media types will be supported (text, images, audio)',
    details: [
      'Users can stop a story from playing at any time. Or explicitly state that they do not like it',
      `At the end of the story, the user can provide very brief feedback.  Deeper feedback is encouraged in the chat interface.`,
    ]
  },
  'safety': {
    title: 'Safety & Support',
    description: 'The user has indicated a story was distressing and is viewing safety options.',
    details: [
      'Provides immediate support resources',
      'Offers options to take a break or view calming activities',
      'Can access additional support information',
      'Allows user to return to search for different content'
    ]
  },
  'calm': {
    title: 'Calming Activities',
    description: 'The user is viewing calming activities and resources.',
    details: [
      'Provides breathing exercises and relaxation techniques',
      'Offers alternative content suggestions',
      'Helps users manage emotional responses',
      'Can return to the main interface when ready'
    ]
  },
  'personalization': {
    title: 'Personalization',
    description: 'The user is reviewing and adjusting their preferences.',
    details: [
      'Shows detected preferences based on user behavior',
      'Allows users to confirm or change preferences',
      'Helps the system provide better recommendations',
      'Improves future story matching'
    ]
  },
  'disengagement': {
    title: 'Session Ending',
    description: 'The user is ending their session or taking a break.',
    details: [
      'Shows session summary (stories viewed, theme)',
      'Options to pause, save for later, or share',
      'Progress is saved for returning users',
      'Provides a smooth exit experience'
    ]
  },
  'playlist': {
    title: 'Playlist Management',
    description: 'The user is creating or managing a playlist of stories.',
    details: [
      'Users can create custom playlists',
      'Stories can be added or removed',
      'Playlists can be exported or shared',
      'Helps users organize their favorite narratives'
    ]
  }
}

export default function Prototype1() {
  const [showOverview, setShowOverview] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<IframeEvent[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [currentView, setCurrentView] = useState<string | null>(null)
  const [lastViewedStory, setLastViewedStory] = useState<{ id: string; title: string } | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const eventsEndRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const figmaPrototypeUrl = "https://tlodge.github.io/lend-prototype-2/"

  useEffect(() => {
    const handleMessage = (event: MessageEvent<IframeEvent>) => {
      // Verify origin for security
      if (event.origin !== 'https://tlodge.github.io') return

      // Update current view if it's a view-change event
      if (event.data.type === 'view-change' && event.data.view) {
        setCurrentView(event.data.view)
      }

      // Track when a story is selected or reflected upon
      if (event.data.type === 'story-select' && event.data.storyId && event.data.storyTitle) {
        setLastViewedStory({ id: event.data.storyId, title: event.data.storyTitle })
      }
      if (event.data.type === 'story-reflection' && event.data.storyId && lastViewedStory) {
        // Keep the last viewed story when reflection is provided
        // This ensures we show the post-playback info when returning to search
      }

      // Add the event to the list
      setEvents((prev) => [...prev, event.data].slice(-50)) // Keep last 50 events
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [lastViewedStory])

  // Auto-scroll to bottom when new events arrive
  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [events])

  const captureScreenshot = async () => {
    if (!iframeRef.current || isCapturing) return

    setIsCapturing(true)
    
    // Set up a one-time listener for screenshot response from iframe
    const handleScreenshotResponse = (event: MessageEvent) => {
      console.log('Parent received message:', event.origin, event.data);
      
      // Check origin - allow from the prototype domain
      if (event.origin !== 'https://tlodge.github.io' && event.origin !== window.location.origin) {
        console.log('Origin mismatch, ignoring:', event.origin);
        return;
      }
      
      if (event.data && event.data.type === 'screenshot-response' && event.data.imageData) {
        console.log('Screenshot response received, processing...');
        try {
          // Convert base64 to blob and download
          const base64Data = event.data.imageData
          // Handle both data:image/png;base64,xxx and just xxx formats
          const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data
          const byteCharacters = atob(base64String)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const blob = new Blob([byteArray], { type: 'image/png' })
          
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `prototype-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
          
          console.log('Screenshot downloaded successfully');
          window.removeEventListener('message', handleScreenshotResponse)
          setIsCapturing(false)
        } catch (error) {
          console.error('Error processing screenshot:', error);
          window.removeEventListener('message', handleScreenshotResponse)
          setIsCapturing(false)
          alert('Error processing screenshot: ' + error);
        }
      }
    }

    window.addEventListener('message', handleScreenshotResponse)

    try {
      const iframe = iframeRef.current
      
      console.log('Requesting screenshot from iframe...');
      
      // Check if we should use Screen Capture API from parent (better user gesture context)
      // The Screen Capture API needs to be called from a direct user interaction
      // Since the button is in the parent, we can call it here instead of in the iframe
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        try {
          // Call Screen Capture API from parent page (has user gesture context)
          const options: any = {
            video: {
              width: { ideal: window.innerWidth },
              height: { ideal: window.innerHeight }
            },
            audio: false,
            preferCurrentTab: true
          };
          
          const stream = await navigator.mediaDevices.getDisplayMedia(options);
          
          // Create video element to capture frame
          const video = document.createElement('video');
          video.srcObject = stream;
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          
          // Wait for video to be ready
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Video load timeout'));
            }, 5000);
            
            video.onloadedmetadata = () => {
              clearTimeout(timeout);
              video.play()
                .then(() => {
                  setTimeout(() => resolve(), 200);
                })
                .catch(reject);
            };
            video.onerror = (error) => {
              clearTimeout(timeout);
              reject(error);
            };
            
            if (video.readyState >= 1) {
              clearTimeout(timeout);
              video.play()
                .then(() => {
                  setTimeout(() => resolve(), 200);
                })
                .catch(reject);
            }
          });
          
          // Create canvas and draw frame
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Could not get canvas context');
          }
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Stop the stream
          stream.getTracks().forEach(track => track.stop());
          video.srcObject = null;
          
          // Convert to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `prototype-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              console.log('Screenshot captured and downloaded');
              setIsCapturing(false);
            }
          }, 'image/png');
          
          return; // Success, exit early
        } catch (screenCaptureError) {
          console.log('Screen Capture API failed in parent, trying iframe approach:', screenCaptureError);
          // Fall through to iframe approach
        }
      }
      
      // Fallback: Request screenshot from iframe
      iframe.contentWindow?.postMessage({ type: 'request-screenshot' }, 'https://tlodge.github.io')
      console.log('Screenshot request sent to iframe');
      
      // Fallback: If iframe doesn't respond within 3 seconds, try html2canvas on wrapper
      const fallbackTimeout = setTimeout(async () => {
        try {
          const iframeWrapper = iframe.parentElement
          if (iframeWrapper) {
            const canvas = await html2canvas(iframeWrapper as HTMLElement, {
              allowTaint: true,
              useCORS: false,
              logging: false,
            })
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `prototype-screenshot-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.png`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
              }
              window.removeEventListener('message', handleScreenshotResponse)
              setIsCapturing(false)
            }, 'image/png')
          }
        } catch (error) {
          console.error('Fallback capture failed:', error)
          window.removeEventListener('message', handleScreenshotResponse)
          setIsCapturing(false)
          alert('Unable to capture screenshot. The prototype may need to be updated to support screenshots.')
        }
      }, 3000)
      
      // Clear timeout if iframe responds
      const originalHandler = handleScreenshotResponse
      const wrappedHandler = (event: MessageEvent) => {
        if (event.data.type === 'screenshot-response') {
          clearTimeout(fallbackTimeout)
        }
        originalHandler(event)
      }
      window.removeEventListener('message', handleScreenshotResponse)
      window.addEventListener('message', wrappedHandler)
      
    } catch (error) {
      console.error('Error requesting screenshot:', error)
      window.removeEventListener('message', handleScreenshotResponse)
      setIsCapturing(false)
      alert('Unable to request screenshot from prototype.')
    }
  }

 

  // Determine which view info to show
  // If we're on search view and have a recently viewed story, show post-playback info
  const isReturningFromPlayback = currentView === 'search' && lastViewedStory !== null
  
  const currentViewInfo = currentView 
    ? (isReturningFromPlayback 
        ? {
            title: 'Returning to Conversation',
            description: `You've just watched "${lastViewedStory.title}". The system is ready to continue the conversation.`,
            details: [
              'You can see a thumbnail of the story you just watched displayed on the screen.',
              'You can discuss the story you just watched, ask for similar stories, or explore something new.',
              'The conversation can continue naturally - you can provide feedback, ask questions, or request different content.',
              'The system remembers your viewing history and can reference it in future recommendations.'
            ]
          }
        : VIEW_INFO[currentView])
    : null

  if (showOverview) {
    return <PrototypeOverview onProceed={() => setShowOverview(false)} />
  }

  return (
    <>
      <Header />
      {/* Floating Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        aria-label={isPanelOpen ? "Close panel" : "Open panel"}
      >
        {isPanelOpen ? 'Close' : 'Open'}
      </button>
      <main className={styles.prototypeContainer}>
        <div className={`${styles.layoutWrapper} ${isPanelOpen ? styles.panelOpen : ''}`}>
          {/* Left Column - Prototype Iframe */}
          <div className={styles.iframeColumn}>
            <div className={styles.iframeWrapper}>
              {isLoading && (
                <div className={styles.loading}>
                  <p>Loading prototype...</p>
                </div>
              )}
              <iframe
                ref={iframeRef}
                src={figmaPrototypeUrl}
                className={styles.prototypeFrame}
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                title="Prototype Interface"
              />
            </div>
          </div>

          {/* Right Column - Contextual Information Panel */}
          <div className={`${styles.infoColumn} ${isPanelOpen ? styles.open : styles.closed}`}>
            {isPanelOpen && (
              <div className={styles.panelContent}>
                <div className={styles.contextSection}>
                 
                  {currentViewInfo ? (
                    <div className={styles.viewInfo}>
                      <h3>{currentViewInfo.title}</h3>
                      <p className={styles.viewDescription}>{currentViewInfo.description}</p>
                      <ul className={styles.viewDetails}>
                        {currentViewInfo.details.map((detail, index) => (
                          <li key={index}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className={styles.noViewInfo}>
                      Interact with the prototype to see contextual information about each screen.
                    </p>
                  )}
                  
                  <button
                    className={styles.screenshotButton}
                    onClick={captureScreenshot}
                    disabled={isCapturing}
                    aria-label="Capture screenshot"
                  >
                    <Camera size={20} />
                    <span>{isCapturing ? 'Capturing...' : 'Screenshot'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

