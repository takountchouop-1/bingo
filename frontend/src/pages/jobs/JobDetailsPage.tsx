import { ArrowLeft, BriefcaseBusiness, CalendarClock, MapPinned, MessageSquareText, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createOrOpenConversation } from '../../services/messaging'
import { useAuthStore } from '../../stores/authstore'
import './JobDetailsPage.css'

const JOB_POSTS_STORAGE_KEY = 'bingo-job-posts'

type JobPost = {
  id: string
  title: string
  type: string
  location: string
  salary: string
  dateTime: string
  description: string
  createdAt: string
  employerId?: string
  employerName?: string
  availability?: 'Disponible' | 'Indisponible'
}

function JobDetailsPage() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState<JobPost | null>(null)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem(JOB_POSTS_STORAGE_KEY) ?? '[]') as JobPost[]
    const foundJob = (Array.isArray(savedPosts) ? savedPosts : []).find((post) => post.id === jobId)
    setJob(foundJob ?? null)
  }, [jobId])

  const handleInterestClick = () => {
    if (!user) {
      navigate('/signin')
      return
    }

    if (job && user.id === job.employerId) {
      navigate('/messages')
      return
    }

    if (!job) return

    const conversationId = createOrOpenConversation({
      jobId: job.id,
      jobTitle: job.title,
      employerId: job.employerId ?? 'community-employer',
      employerName: job.employerName ?? 'Job employer',
      currentUserId: user.id,
      currentUserName: user.username,
      initialText: `Hi, I am interested in the job "${job.title}" and would like to learn more about it.`,
    })

    navigate(`/messages/${conversationId}`)
  }

  if (!job) {
    return (
      <main className="job-details-page empty-state-page">
        <div className="job-details-empty">
          <h1>Job not found</h1>
          <p>This opportunity is no longer available.</p>
          <button type="button" className="job-details-back-button" onClick={() => navigate('/news')}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to feed
          </button>
        </div>
      </main>
    )
  }

  const mapQuery = encodeURIComponent(job.location)
  const isOwner = Boolean(user && job.employerId && user.id === job.employerId)

  return (
    <main className="job-details-page">
      <div className="job-details-header">
        <Link to="/news" className="job-details-back-link" aria-label="Back to news feed">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back</span>
        </Link>
      </div>

      <article className="job-details-card">
        <header className="job-details-header-block">
          <div className="job-details-badges">
            <span className="job-badge job-badge-new">Nouveau</span>
            <span className="job-badge job-badge-type">{job.type}</span>
          </div>

          <h1>{job.title}</h1>
        </header>

        <section className="job-details-meta-grid">
          <div className="job-meta-item">
            <span className="meta-icon">
              <BriefcaseBusiness size={16} aria-hidden="true" />
            </span>
            <div>
              <small>Job type</small>
              <strong>{job.type}</strong>
            </div>
          </div>

          <div className="job-meta-item">
            <span className="meta-icon green-icon">
              <Wallet size={16} aria-hidden="true" />
            </span>
            <div>
              <small>Salary</small>
              <strong className="salary-value">{job.salary}</strong>
            </div>
          </div>

          <div className="job-meta-item">
            <span className="meta-icon">
              <BriefcaseBusiness size={16} aria-hidden="true" />
            </span>
            <div>
              <small>Availability</small>
              <strong>{job.availability || 'Disponible'}</strong>
            </div>
          </div>

          <div className="job-meta-item">
            <span className="meta-icon">
              <MapPinned size={16} aria-hidden="true" />
            </span>
            <div>
              <small>Location</small>
              <strong>{job.location}</strong>
            </div>
          </div>

          <div className="job-meta-item">
            <span className="meta-icon">
              <CalendarClock size={16} aria-hidden="true" />
            </span>
            <div>
              <small>Date</small>
              <strong>
                {new Date(job.dateTime).toLocaleString([], {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </div>
          </div>
        </section>

        <section className="job-details-section">
          <h2>Job description</h2>
          <p>{job.description}</p>
        </section>

        <section className="job-details-actions">
          <button type="button" className="job-interest-button" onClick={handleInterestClick}>
            <MessageSquareText size={18} aria-hidden="true" />
            {isOwner ? 'Open messages' : 'I am interested'}
          </button>
        </section>

        <section className="job-details-section map-section">
          <h2>Location map</h2>
          <div className="job-map-frame">
            <iframe
              title={`${job.title} location`}
              src={`https://maps.google.com/maps?q=${mapQuery}&z=12&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </article>
    </main>
  )
}

export default JobDetailsPage
