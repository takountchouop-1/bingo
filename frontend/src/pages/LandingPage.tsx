import { ArrowRight, BriefcaseBusiness, CalendarRange, CheckCircle2, Heart, MapPin, Megaphone, MessageCircle, Play, Search, Sparkles, Users, UsersRound, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import welcomeImage from '../assets/welcome.jpg'
import plumberImage from '../assets/plombier.jpg'
import workerImage from '../assets/ouvrier.jpg'
import donationImage from '../assets/donation.jpg'
import assistImage from '../assets/assist.jpg'
import personImage from '../assets/person.jpg'
import './LandingPage.css'

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
}

function LandingPage() {
  const [jobPosts, setJobPosts] = useState<JobPost[]>([])

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem(JOB_POSTS_STORAGE_KEY) ?? '[]') as JobPost[]
    setJobPosts(Array.isArray(savedPosts) ? savedPosts : [])
  }, [])

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Main navigation">
        <a className="landing-brand" href="#top" aria-label="Bingo Plateform home">
          <span className="brand-orbit" aria-hidden="true"><span /></span>
          <span>Bingo <strong>Plateform</strong></span>
        </a>

        <div className="landing-links">
          <a href="#community">Community</a>
          <a href="#stories">Stories</a>
          <a href="#about">About us</a>
        </div>

        <div className="landing-actions">
          <Link className="login-link" to="/signin">Login</Link>
          <Link className="nav-cta" to="/signup">Join the community <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </nav>

      <section className="landing-hero" id="top" aria-labelledby="landing-title">
        <div className="hero-copy">
          <p className="hero-eyebrow"><Sparkles size={14} aria-hidden="true" /> A place for everyone</p>
          <h1 id="landing-title">Connect. Discover. Help. <em>Make a Difference.</em></h1>
          <p className="hero-description"><strong>One platform for opportunities, community support, trusted information, and the people who make a difference.</strong></p>
          <p className="hero-detail">Find jobs and everyday opportunities around you. Offer your skills, support someone in need through an anonymous donation, share important incidents, and stay connected to what is happening in Cameroon and around the world.</p>
          <p className="hero-impact">Your opportunity could change someone&apos;s life. Your help could change another. Your voice could keep a community informed.</p>
          <div className="hero-buttons">
            <Link className="primary-button" to="/signup">Create your account <ArrowRight size={17} aria-hidden="true" /></Link>
            <a className="secondary-button" href="#stories"><span className="play-icon"><Play size={13} fill="currentColor" aria-hidden="true" /></span> See how it works</a>
          </div>
          <div className="member-note"><span className="member-avatars"><i>J</i><i>M</i><i>A</i></span><span><strong>12,000+</strong> people are already here</span></div>
        </div>

        <div className="hero-visual" aria-label="A woman connecting with her community">
          <div className="visual-glow" />
          <div className="image-frame"><img src={welcomeImage} alt="Woman smiling while connecting with friends on her phone" /></div>
          <div className="floating-card reaction-card"><span className="icon-bubble pink"><Heart size={16} fill="currentColor" aria-hidden="true" /></span><span><strong>New connection</strong><small>Someone liked your story</small></span></div>
          <div className="floating-card people-card"><span className="icon-bubble blue"><Users size={17} aria-hidden="true" /></span><strong>+248<br /><small>new friends today</small></strong></div>
          <div className="floating-card message-card"><span className="message-dot" /><MessageCircle size={16} aria-hidden="true" /><span>Good vibes<br /><small>everywhere</small></span></div>
        </div>
      </section>

      <section className="opportunities-section" id="stories" aria-labelledby="opportunities-title">
        <div className="opportunity-collage">
          <div className="collage-main"><img src={plumberImage} alt="A local plumber offering his professional skills" /></div>
          <div className="collage-secondary"><img src={workerImage} alt="A craftsman working on a piece of wood" /></div>
          <div className="collage-donation"><img src={donationImage} alt="Community members receiving donated gifts" /></div>
          <span className="collage-badge">Community<br /><strong>in action</strong></span>
        </div>

        <div className="opportunity-copy" id="about">
          <p className="section-eyebrow">Discover what is possible</p>
          <h2 id="opportunities-title">Your next opportunity<br />could be <em>closer than you think.</em></h2>
          <p className="opportunity-intro">From finding work to helping a neighbour, Bingo Plateform brings the right people, resources, and opportunities together in one trusted space.</p>
          <ul className="opportunity-list">
            <li><CheckCircle2 size={18} aria-hidden="true" /><span>Find jobs and everyday opportunities around you.</span></li>
            <li><CheckCircle2 size={18} aria-hidden="true" /><span>Offer your skills and build meaningful connections.</span></li>
            <li><CheckCircle2 size={18} aria-hidden="true" /><span>Support someone in need through an anonymous donation.</span></li>
          </ul>
          <a className="learn-button" href="#join">Explore the community <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="services-section" aria-labelledby="services-title">
        <div className="services-heading">
          <p className="section-eyebrow">A platform with purpose</p>
          <h2 id="services-title">You&apos;ve got a need,<br /><em>we&apos;ve got a way forward.</em></h2>
        </div>
        <div className="service-grid">
          <article className="service-card service-card-active">
            <span className="service-icon"><BriefcaseBusiness size={20} aria-hidden="true" /></span>
            <h3>Opportunities</h3>
            <p>Discover jobs, services, and practical opportunities close to you.</p>
            <a href="#join" aria-label="Explore opportunities"><ArrowRight size={17} aria-hidden="true" /></a>
          </article>
          <article className="service-card">
            <span className="service-icon"><Search size={20} aria-hidden="true" /></span>
            <h3>Find your people</h3>
            <p>Search for trusted skills, local support, and people who can help.</p>
            <a href="#community" aria-label="Find your people"><ArrowRight size={17} aria-hidden="true" /></a>
          </article>
          <article className="service-card">
            <span className="service-icon"><Megaphone size={20} aria-hidden="true" /></span>
            <h3>Share what matters</h3>
            <p>Give your ideas, stories, and important community news a voice.</p>
            <a href="#stories" aria-label="Share what matters"><ArrowRight size={17} aria-hidden="true" /></a>
          </article>
          <article className="service-card">
            <span className="service-icon"><UsersRound size={20} aria-hidden="true" /></span>
            <h3>Social connection</h3>
            <p>Build genuine connections with a community that cares about people.</p>
            <a href="#community" aria-label="Build social connections"><ArrowRight size={17} aria-hidden="true" /></a>
          </article>
        </div>
      </section>

      <section className="job-banner" id="join" aria-labelledby="job-banner-title">
        <div className="job-banner-copy">
          <p className="job-banner-eyebrow">Turn skills into opportunities</p>
          <h2 id="job-banner-title">Post your job for millions of people to see.</h2>
          <p>Reach the right people, showcase what you do, and help your next opportunity find you.</p>
          <Link className="job-banner-button" to="/jobs/create">Post a job <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="job-banner-stat" aria-label="People ready to discover your opportunity">
          <span className="stat-orbit"><Users size={27} aria-hidden="true" /></span>
          <strong>Millions</strong>
          <span>ready to discover<br />what you offer</span>
        </div>
      </section>

      <section className="job-postings-section" aria-labelledby="job-postings-title">
        <div className="job-postings-header">
          <p className="section-eyebrow">Latest opportunities</p>
          <h2 id="job-postings-title">Open jobs from the community</h2>
        </div>

        {jobPosts.length === 0 ? (
          <div className="jobs-empty-state">
            No job posts yet. Be the first to share an opportunity.
          </div>
        ) : (
          <div className="job-posts-grid">
            {jobPosts.map((job) => (
              <article key={job.id} className="job-post-card">
                <div className="job-post-header">
                  <div>
                    <p className="job-type-pill">{job.type}</p>
                    <h3>{job.title}</h3>
                  </div>
                </div>

                <div className="job-meta-list">
                  <span><MapPin size={15} aria-hidden="true" /> {job.location}</span>
                  <span><Wallet size={15} aria-hidden="true" /> {job.salary}</span>
                  <span><CalendarRange size={15} aria-hidden="true" /> {job.dateTime}</span>
                </div>

                <p className="job-description">{job.description}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="about-section" aria-labelledby="about-title">
        <div className="about-visual">
          <div className="about-visual-ring" />
          <div className="about-image-frame"><img src={assistImage} alt="People working together and supporting one another" /></div>
          <span className="about-experience"><strong>One</strong><small>trusted<br />platform</small></span>
        </div>
        <div className="about-copy">
          <p className="section-eyebrow">Who we are</p>
          <h2 id="about-title">Who is<br /><em>Bingo Plateform</em> for?</h2>
          <p className="about-intro">Bingo Plateform is for everyone who wants to connect, discover opportunities, support others, and make a difference in their community.</p>
          <div className="about-points">
            <div><span className="about-point-icon">01</span><span><strong>For people with purpose</strong><small>Share your skills, ideas, and everyday opportunities.</small></span></div>
            <div><span className="about-point-icon">02</span><span><strong>For communities that care</strong><small>Find trusted information and support when it matters.</small></span></div>
          </div>
          <a className="learn-button" href="#community">Get to know us <ArrowRight size={16} aria-hidden="true" /></a>
        </div>
      </section>

      <section className="community-strip" id="community" aria-label="Community highlights">
        <div><span className="strip-icon"><Users size={18} aria-hidden="true" /></span><strong>Meet your people</strong><p>Real connections, made easy.</p></div>
        <div><span className="strip-icon coral"><Heart size={18} fill="currentColor" aria-hidden="true" /></span><strong>Share what matters</strong><p>Your story deserves a space.</p></div>
        <div><span className="strip-icon gold"><MessageCircle size={18} aria-hidden="true" /></span><strong>Stay in the loop</strong><p>Be part of the conversation.</p></div>
      </section>

      <section className="bridge-section" aria-labelledby="bridge-title">
        <img className="bridge-image" src={personImage} alt="People from different professions standing together" />
        <div className="bridge-overlay" />
        <div className="bridge-content">
          <p className="bridge-eyebrow">One community, many possibilities</p>
          <h2 id="bridge-title">Let us build the bridge<br />between your world and <em>what comes next.</em></h2>
          <p className="bridge-description">The right connection can open a door, bring support closer, or help an important story reach the people who need it.</p>
          <div className="bridge-stats">
            <div><strong>18K+</strong><span>people connected</span></div>
            <div><strong>7K+</strong><span>happy members</span></div>
            <div><strong>4.7</strong><span>community rating</span></div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="#top" aria-label="Bingo Plateform home">
          <span className="brand-orbit" aria-hidden="true"><span /></span>
          <span>Bingo <strong>Plateform</strong></span>
        </a>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#community">Community</a>
          <a href="#stories">Stories</a>
          <a href="#about">About us</a>
          <a href="mailto:hello@socialplateform.com">Contact</a>
        </nav>
        <p className="footer-copyright">© 2026 Bingo Plateform</p>
      </footer>
    </main>
  )
}

export default LandingPage