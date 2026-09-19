import { ArrowLeft, BriefcaseBusiness, CalendarClock, MapPin, PencilLine, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authstore'
import './CreateJobPostPage.css'

const JOB_POSTS_STORAGE_KEY = 'bingo-job-posts'

type JobFormState = {
  title: string
  type: string
  location: string
  salary: string
  dateTime: string
  description: string
  availability: 'Disponible' | 'Indisponible'
}

const defaultForm: JobFormState = {
  title: '',
  type: 'Full-time',
  location: '',
  salary: '',
  dateTime: '',
  description: '',
  availability: 'Disponible',
}

const jobTypes = ['Hourly', 'Daily', 'Part-time', 'Weekly', 'Full-time', 'Contract']

function CreateJobPostPage() {
  const [formData, setFormData] = useState<JobFormState>(defaultForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const values = Object.values(formData).map((value) => value.trim())
    if (values.some((value) => value.length === 0)) {
      window.alert('Please complete all the fields before posting the job.')
      return
    }

    setIsSubmitting(true)

    window.setTimeout(() => {
      const existingPosts = JSON.parse(localStorage.getItem(JOB_POSTS_STORAGE_KEY) ?? '[]') as Array<
        JobFormState & { id: string; createdAt: string }
      >

      const newPost = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        availability: formData.availability || 'Disponible',
        employerId: user?.id ?? 'community-employer',
        employerName: user?.username ?? 'Community employer',
      }

      localStorage.setItem(JOB_POSTS_STORAGE_KEY, JSON.stringify([newPost, ...existingPosts]))

      setIsSubmitting(false)
      setFormData(defaultForm)
      window.alert('Your job post has been created successfully.')
      navigate('/news', { replace: true })
    }, 400)
  }

  return (
    <main className="job-create-page">
      <section className="job-create-shell" aria-labelledby="job-create-title">
        <aside className="job-create-visual" aria-label="Create a job post information panel">
          <Link to="/" className="job-create-brand" aria-label="Back to Bingo Plateform home">
            <span>BINGO</span>
          </Link>

          <div className="job-create-copy">
            <p className="job-kicker">Hire with confidence</p>
            <h1 id="job-create-title">Create your next job opportunity</h1>
            <p>Reach local talent, experienced workers, and people ready to take the next step in their career.</p>
          </div>

          <div className="job-feature-list">
            <div className="job-feature-item">
              <span className="feature-icon">
                <BriefcaseBusiness size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Reach more people</strong>
                <small>Post to a growing community</small>
              </div>
            </div>
            <div className="job-feature-item">
              <span className="feature-icon">
                <MapPin size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Local visibility</strong>
                <small>Promote jobs by location</small>
              </div>
            </div>
            <div className="job-feature-item">
              <span className="feature-icon">
                <Wallet size={18} aria-hidden="true" />
              </span>
              <div>
                <strong>Clear pricing</strong>
                <small>Share salary expectations quickly</small>
              </div>
            </div>
          </div>
        </aside>

        <section className="job-create-form-panel">
          <Link to="/" className="job-back-link" aria-label="Go back home">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back</span>
          </Link>

          <div className="job-form-header">
            <p className="job-section-kicker">Create a job post</p>
            <h2>Post a new opportunity</h2>
          </div>

          <form className="job-form" onSubmit={handleSubmit}>
            <label htmlFor="title">Job title</label>
            <div className="job-input-wrap">
              <PencilLine size={16} aria-hidden="true" />
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Developer"
                required
              />
            </div>

            <label htmlFor="type">Job type</label>
            <div className="job-input-wrap">
              <BriefcaseBusiness size={16} aria-hidden="true" />
              <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <label htmlFor="location">Job location</label>
            <div className="job-input-wrap">
              <MapPin size={16} aria-hidden="true" />
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Yaoundé, Douala"
                required
              />
            </div>

            <label htmlFor="salary">Salary</label>
            <div className="job-input-wrap">
              <Wallet size={16} aria-hidden="true" />
              <input
                id="salary"
                name="salary"
                type="text"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. 150,000 XAF / month"
                required
              />
            </div>

            <label htmlFor="dateTime">Date &amp; time</label>
            <div className="job-input-wrap">
              <CalendarClock size={16} aria-hidden="true" />
              <input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
            </div>

            <label htmlFor="description">Job description</label>
            <div className="job-textarea-wrap">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, skills required, responsibilities, and what the ideal candidate should bring..."
                rows={6}
                required
              />
            </div>

            <button type="submit" className="job-submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Creating post...' : 'Create job post'}
            </button>
          </form>
        </section>
      </section>
    </main>
  )
}

export default CreateJobPostPage
