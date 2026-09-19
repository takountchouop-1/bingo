import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BriefcaseBusiness, MapPin, Wallet } from 'lucide-react'
import NewsNavbar, { type NewsCategory } from '../../components/layout/NewsNavbar'
import './LandingPage.css'

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  all: 'All posts',
  opportunities: 'opportunities',
  incidents: 'incidents',
  donations: 'donations',
}

const JOB_POSTS_STORAGE_KEY = 'bingo-job-posts'
const JOB_POSTS_SEEN_KEY = 'bingo-job-posts-seen'

type JobPost = {
  id: string
  title: string
  type: string
  location: string
  salary: string
  dateTime: string
  description: string
  createdAt: string
  availability: 'Disponible' | 'Indisponible'
}

function NewsLandingPage() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [jobPosts, setJobPosts] = useState<JobPost[]>([])
  const [seenJobIds, setSeenJobIds] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem(JOB_POSTS_STORAGE_KEY) ?? '[]') as JobPost[]
    const savedSeenJobs = JSON.parse(localStorage.getItem(JOB_POSTS_SEEN_KEY) ?? '[]') as string[]

    const normalizedPosts = Array.isArray(savedPosts) ? savedPosts : []
    setJobPosts(normalizedPosts)
    setSeenJobIds(Array.isArray(savedSeenJobs) ? savedSeenJobs : [])
  }, [])

  const visiblePosts = jobPosts.filter(() => {
    if (activeCategory === 'all') return true
    if (activeCategory === 'opportunities') return true
    return false
  })

  const filteredPosts = visiblePosts.filter((post) => {
    if (!appliedSearch.trim()) return true
    const term = appliedSearch.toLowerCase()
    return [post.title, post.type, post.location, post.salary, post.description]
      .join(' ')
      .toLowerCase()
      .includes(term)
  })

  function handleOpenPost(post: JobPost) {
    if (!seenJobIds.includes(post.id)) {
      const nextSeenJobs = [...seenJobIds, post.id]
      setSeenJobIds(nextSeenJobs)
      localStorage.setItem(JOB_POSTS_SEEN_KEY, JSON.stringify(nextSeenJobs))
    }

    navigate(`/jobs/${post.id}`)
  }

  return (
    <main className="news-landing-page">
      <NewsNavbar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={setAppliedSearch}
      />

      <section className="news-feed" aria-labelledby="news-feed-title">
        <h1 id="news-feed-title" className="news-feed-heading">
          {appliedSearch ? `Results for "${appliedSearch}"` : 'Your feed'}
        </h1>
        <p className="news-feed-subheading">Showing {CATEGORY_LABELS[activeCategory]}</p>

        {filteredPosts.length === 0 ? (
          <div className="news-feed-empty">
            <strong>No posts to show yet</strong>
            <span>Come back soon or be the first to share something with the community.</span>
          </div>
        ) : (
          <div className="news-feed-grid">
            {filteredPosts.map((post) => {
              const isSeen = seenJobIds.includes(post.id)

              return (
                <button
                  key={post.id}
                  type="button"
                  className="news-post-card"
                  onClick={() => handleOpenPost(post)}
                >
                  <div className="news-post-header">
                    <span className="news-post-tag">{post.type}</span>
                    <span className={`news-status-badge ${isSeen ? 'seen' : 'new'}`}>
                      {isSeen ? 'Déjà vu' : 'Nouveau'}
                    </span>
                  </div>

                  <div className="news-post-topline">
                    <h2>{post.title}</h2>
                    <span className={`availability-pill ${post.availability === 'Disponible' ? 'available' : 'unavailable'}`}>
                      <span className="availability-dot" aria-hidden="true" />
                      {post.availability || 'Disponible'}
                    </span>
                  </div>

                  <div className="news-post-meta">
                    <span className="meta-inline location-inline"><MapPin size={14} aria-hidden="true" /> {post.location}</span>
                    <span className="meta-inline salary-inline"><Wallet size={14} aria-hidden="true" /> {post.salary}</span>
                  </div>

                  <p>{post.description}</p>

                  <div className="news-post-footer">
                    <span className="news-post-date">
                      {new Date(post.dateTime).toLocaleString([], {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="news-more-link"><BriefcaseBusiness size={14} aria-hidden="true" /> View details</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}

export default NewsLandingPage
