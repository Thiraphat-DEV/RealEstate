import { useState } from 'react'
import { Button } from '../ui'

export const Navigation = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'projects'>('buy')

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Main Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('buy')}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === 'buy'
                  ? 'text-gold-600 border-b-2 border-gold-600'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === 'rent'
                  ? 'text-gold-600 border-b-2 border-gold-600'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              Rent
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 font-semibold text-sm transition-colors ${
                activeTab === 'projects'
                  ? 'text-gold-600 border-b-2 border-gold-600'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              New Projects
            </button>
            <button className="px-4 py-2 font-semibold text-sm text-gray-600 hover:text-gold-600 transition-colors">
              Agents
            </button>
            <button className="px-4 py-2 font-semibold text-sm text-gray-600 hover:text-gold-600 transition-colors">
              Articles
            </button>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <button className="text-sm text-gray-600 hover:text-gold-600 transition-colors">
              + List Property
            </button>
            <Button variant="outline" size="sm">
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
