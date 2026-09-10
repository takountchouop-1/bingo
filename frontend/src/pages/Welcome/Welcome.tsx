import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import welcomePersonImage from '../../assets/welcomeperson.jpg'
import './Welcome.css'

type WelcomeState = {
  username?: string
}

function Welcome() {
  const location = useLocation()
  const { username } = (location.state as WelcomeState | null) ?? {}

  return (
    <main className="welcome-page">
      <div className="welcome-card">
        <div className="welcome-avatar">
          <img src={welcomePersonImage} alt="Welcoming community member" />
          <span className="welcome-avatar-badge">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
        </div>

        <p className="eyebrow">You&apos;re all set</p>
        <h1 className="welcome-title">Thanks for signing up{username ? `, ${username}` : ''}!</h1>
        <p className="welcome-subtitle">
          Your account has been created successfully. We&apos;re so glad to have you here — it&apos;s time to
          explore opportunities, connect with your community, and make things happen.
        </p>

        <Link to="/signin" className="welcome-continue">
          <span>Continue</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </main>
  )
}

export default Welcome
