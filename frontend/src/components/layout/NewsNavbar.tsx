import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  BriefcaseBusiness,
  ChevronDown,
  Gift,
  Heart,
  LayoutGrid,
  LogOut,
  Megaphone,
  MessageCircle,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react'
import { useAuthStore } from '../../stores/authstore'
import './NewsNavbar.css'

export type NewsCategory = 'all' | 'opportunities' | 'incidents' | 'donations'

const CATEGORIES: { id: NewsCategory; label: string; icon: typeof LayoutGrid }[] = [
  { id: 'all', label: 'All posts', icon: LayoutGrid },
  { id: 'opportunities', label: 'Opportunities', icon: BriefcaseBusiness },
  { id: 'incidents', label: 'Incidents', icon: ShieldAlert },
  { id: 'donations', label: 'Donations', icon: Gift },
]

type Panel = 'category' | 'notifications' | 'favorites' | 'messages' | 'account' | null

type NewsNavbarProps = {
  activeCategory: NewsCategory
  onCategoryChange: (category: NewsCategory) => void
  searchQuery: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (value: string) => void
  notificationsCount?: number
  favoritesCount?: number
  messagesCount?: number
}

function NewsNavbar({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  notificationsCount = 0,
  favoritesCount = 0,
  messagesCount = 0,
}: NewsNavbarProps) {
  const [openPanel, setOpenPanel] = useState<Panel>(null)
  const navRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenPanel(null)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpenPanel(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function togglePanel(panel: Panel) {
    setOpenPanel((current) => (current === panel ? null : panel))
  }

  function handleSearchSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSearchSubmit(searchQuery)
  }

  function handleLogout() {
    logout()
    navigate('/signin')
  }

  const activeCategoryLabel = CATEGORIES.find((category) => category.id === activeCategory)?.label ?? 'All posts'
  const initials = (user?.username ?? '?').slice(0, 1).toUpperCase()

  return (
    <nav className="news-navbar" aria-label="News navigation" ref={navRef}>
      <div className="news-navbar-row">
        <a className="news-brand" href="/news" aria-label="Bingo Plateform home">
          <span className="brand-orbit" aria-hidden="true"><span /></span>
          <span>Bingo <strong>Plateform</strong></span>
        </a>

        <button type="button" className="news-post-button" onClick={() => navigate('/jobs/create')}>
          <Plus size={16} aria-hidden="true" /> Create a post
        </button>

        <form className="news-search" role="search" onSubmit={handleSearchSubmit}>
          <Search size={17} aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search jobs, incidents, donations, news..."
            aria-label="Search"
          />
          <button type="submit">Search</button>
        </form>

        <div className="news-navbar-actions">
          <div className="navbar-item">
            <button
              type="button"
              className={`navbar-icon-button navbar-category-button ${openPanel === 'category' ? 'active' : ''}`}
              onClick={() => togglePanel('category')}
              aria-expanded={openPanel === 'category'}
            >
              <LayoutGrid size={18} aria-hidden="true" />
              <span>{activeCategoryLabel}</span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            {openPanel === 'category' && (
              <div className="navbar-panel category-panel" role="menu">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={category.id === activeCategory}
                    className={`category-option ${category.id === activeCategory ? 'selected' : ''}`}
                    onClick={() => {
                      onCategoryChange(category.id)
                      setOpenPanel(null)
                    }}
                  >
                    <category.icon size={16} aria-hidden="true" />
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="navbar-item">
            <button
              type="button"
              className={`navbar-icon-button ${openPanel === 'notifications' ? 'active' : ''}`}
              onClick={() => togglePanel('notifications')}
              aria-expanded={openPanel === 'notifications'}
              aria-label="Notifications"
            >
              <Bell size={19} aria-hidden="true" />
              {notificationsCount > 0 && <span className="navbar-badge">{notificationsCount}</span>}
            </button>
            {openPanel === 'notifications' && (
              <div className="navbar-panel" role="menu">
                <p className="panel-title">Notifications</p>
                <p className="panel-empty">You&apos;re all caught up. No new notifications.</p>
              </div>
            )}
          </div>

          <div className="navbar-item">
            <button
              type="button"
              className={`navbar-icon-button ${openPanel === 'favorites' ? 'active' : ''}`}
              onClick={() => togglePanel('favorites')}
              aria-expanded={openPanel === 'favorites'}
              aria-label="Favorites"
            >
              <Heart size={18} aria-hidden="true" />
              {favoritesCount > 0 && <span className="navbar-badge">{favoritesCount}</span>}
            </button>
            {openPanel === 'favorites' && (
              <div className="navbar-panel" role="menu">
                <p className="panel-title">Favorites</p>
                <p className="panel-empty">Posts you save will show up here.</p>
              </div>
            )}
          </div>

          <div className="navbar-item">
            <button
              type="button"
              className={`navbar-icon-button ${openPanel === 'messages' ? 'active' : ''}`}
              onClick={() => {
                setOpenPanel(null)
                navigate('/messages')
              }}
              aria-expanded={openPanel === 'messages'}
              aria-label="Messages"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {messagesCount > 0 && <span className="navbar-badge">{messagesCount}</span>}
            </button>
            {openPanel === 'messages' && (
              <div className="navbar-panel" role="menu">
                <p className="panel-title">Messages</p>
                <button type="button" className="logout-button" onClick={() => navigate('/messages')}>
                  Open inbox
                </button>
              </div>
            )}
          </div>

          <div className="navbar-item">
            <button
              type="button"
              className={`navbar-account-button ${openPanel === 'account' ? 'active' : ''}`}
              onClick={() => togglePanel('account')}
              aria-expanded={openPanel === 'account'}
            >
              <span className="navbar-avatar">{initials}</span>
            </button>
            {openPanel === 'account' && (
              <div className="navbar-panel account-panel" role="menu">
                <p className="panel-title">{user?.username ?? 'Account'}</p>
                <p className="panel-subtitle">{user?.email}</p>
                <button type="button" className="logout-button" onClick={handleLogout}>
                  <LogOut size={15} aria-hidden="true" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="news-navbar-tags" aria-hidden="true">
        <Megaphone size={13} />
        <span>Stay connected to what matters in your community.</span>
      </div>
    </nav>
  )
}

export default NewsNavbar
