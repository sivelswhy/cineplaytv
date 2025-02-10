import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BannerConfig {
  enabled: boolean
  message: string
  link?: string
  backgroundColor: string
  textColor: string
}

const DEFAULT_CONFIG: BannerConfig = {
  enabled: false,
  message: '',
  backgroundColor: '#2B8CBE',
  textColor: '#FFFFFF'
}

const CACHE_KEY = 'announcement_banner'
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

const AnnouncementBanner = () => {
  const [config, setConfig] = useState<BannerConfig>(DEFAULT_CONFIG)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem(CACHE_KEY)
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData)
          const isExpired = Date.now() - timestamp > CACHE_DURATION
          
          if (!isExpired) {
            setConfig(data)
            return
          }
        }

        // Fetch from local JSON file
        const response = await fetch('/config/announcement.json')
        const data = await response.json()
        
        // Cache the response
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }))
        
        setConfig(data)
      } catch (error) {
        console.error('Failed to fetch banner config:', error)
      }
    }

    fetchConfig()
  }, [])

  // Check if banner should be shown
  if (!config.enabled) return null

  // Extract message without the arrow
  const message = config.message?.replace('→', '').replace('→', '').trim()

  return (
    <div className="fixed top-12 sm:top-16 md:top-20 left-0 right-0 z-50 pointer-events-none w-full px-2 sm:px-4">
      <div className="max-w-screen-2xl mx-auto">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <div
                className={cn(
                  "flex items-center space-x-2 sm:space-x-3 rounded-full pointer-events-auto",
                  "px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2",
                  "w-full sm:w-auto max-w-[95%] mx-auto",
                  "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                  "backdrop-blur-md",
                  "bg-gradient-to-r from-black/40 to-black/20"
                )}
                style={{ 
                  boxShadow: `0 0 0 1px ${config.backgroundColor}20, 0 8px 30px rgb(0,0,0,0.12), inset 0 1px 1px ${config.backgroundColor}10`,
                }}
              >
                <div className={cn(
                  "rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 flex-shrink-0",
                  "text-[10px] sm:text-xs md:text-sm font-semibold",
                  "text-center tracking-wide",
                  "shadow-sm whitespace-nowrap"
                )}
                style={{ 
                  backgroundColor: config.backgroundColor,
                  color: config.textColor,
                  boxShadow: `0 0 0 1px ${config.backgroundColor}50, inset 0 1px 1px ${config.textColor}20`,
                }}
                >
                  📣 New
                </div>
                {config.link ? (
                  <a 
                    href={config.link}
                    className="text-[11px] sm:text-xs md:text-sm font-medium hover:underline flex items-center gap-1.5 sm:gap-2 min-w-0 py-0.5 group"
                    style={{ color: config.textColor }}
                  >
                    <span className="truncate">{message}</span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-shrink-0 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200 hidden sm:block"
                    >
                      <path
                        d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                ) : (
                  <span 
                    className="text-[11px] sm:text-xs md:text-sm font-medium truncate py-0.5"
                    style={{ color: config.textColor }}
                  >
                    {message}
                  </span>
                )}
                <button
                  onClick={() => setIsVisible(false)}
                  className="ml-0.5 sm:ml-1 p-1 sm:p-1.5 -mr-0.5 sm:-mr-1 rounded-full hover:bg-white/10 transition-all duration-200 flex-shrink-0 opacity-75 hover:opacity-100"
                  style={{ color: config.textColor }}
                  aria-label="Close announcement"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default AnnouncementBanner 