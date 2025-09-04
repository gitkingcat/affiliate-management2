import { useState } from "react"
import { X } from "lucide-react"

interface InfoBannerProps {
    description: string
    show?: boolean
    onClose?: () => void
}

export default function InfoBanner({  description, show = true, onClose }: InfoBannerProps) {
    const [isVisible, setIsVisible] = useState(show)

    const handleClose = () => {
        setIsVisible(false)
        onClose?.()
    }

    if (!isVisible) return null

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
            <button
                onClick={handleClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
                <X className="h-4 w-4"/>
            </button>
            <p className="text-sm text-gray-700">
                {description}
            </p>
        </div>
    )
}