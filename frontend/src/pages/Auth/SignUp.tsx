import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import personOneImage from '../../assets/personone.jpg'
import personTwoImage from '../../assets/persontwo.jpg'
import welcomePersonImage from '../../assets/welcomeperson.jpg'
import { createUser } from '../../services/api'
import './SignUp.css'

type SignUpFields = {
  username: string
  email: string
  password: string
  confirmPassword: string
  domain: string
  role: string
}

function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFields>()

  const password = useWatch({ control, name: 'password' })

  useEffect(() => {
    const imageTimer = window.setInterval(() => {
      setActiveImage((currentImage) => (currentImage + 1) % 3)
    }, 5000)

    return () => window.clearInterval(imageTimer)
  }, [])

  const onSubmit = async (data: SignUpFields) => {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      await createUser(data)
      navigate('/welcome', { state: { username: data.username } })
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create your account.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page signup-page">
      <section className="signin-panel" aria-labelledby="signup-title">
        <Link to="/" className="brand-mark" aria-label="Back to Social Plateform home">
          <span>BINGO</span>
        </Link>

        <div className="signin-content signup-content">
          <div className="signin-heading">
            <p className="eyebrow">Create your account</p>
            <h1 id="signup-title">Join our community</h1>
            <p>Tell us a little about yourself to get started.</p>
          </div>

          <form className="signin-form signup-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <label htmlFor="username">Username</label>
            <div className={`input-wrap ${errors.username ? 'has-error' : ''}`}>
              <User size={17} aria-hidden="true" />
              <input id="username" type="text" placeholder="Choose a username" autoComplete="username" {...register('username', { required: 'Please enter a username' })} />
            </div>
            {errors.username && <span className="field-error">{errors.username.message}</span>}

            <label htmlFor="signup-email">Email address</label>
            <div className={`input-wrap ${errors.email ? 'has-error' : ''}`}>
              <Mail size={17} aria-hidden="true" />
              <input id="signup-email" type="email" placeholder="hello@example.com" autoComplete="email" {...register('email', { required: 'Please enter your email address', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />
            </div>
            {errors.email && <span className="field-error">{errors.email.message}</span>}

            <div className="signup-field-grid">
              <div>
                <label htmlFor="domain">Domain</label>
                <select id="domain" className={errors.domain ? 'has-error' : ''} {...register('domain', { required: 'Choose a domain' })} defaultValue="">
                  <option value="" disabled>Select domain</option>
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="creative">Creative</option>
                </select>
                {errors.domain && <span className="field-error">{errors.domain.message}</span>}
              </div>
              <div>
                <label htmlFor="role">Role</label>
                <select id="role" className={errors.role ? 'has-error' : ''} {...register('role', { required: 'Choose a role' })} defaultValue="">
                  <option value="" disabled>Select role</option>
                  <option value="student">Student</option>
                  <option value="professional">Professional</option>
                  <option value="founder">Founder</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="volunteer">Volunteer</option>
                </select>
                {errors.role && <span className="field-error">{errors.role.message}</span>}
              </div>
            </div>

            <label htmlFor="signup-password">Password</label>
            <div className={`input-wrap ${errors.password ? 'has-error' : ''}`}>
              <LockKeyhole size={17} aria-hidden="true" />
              <input id="signup-password" type={showPassword ? 'text' : 'password'} placeholder="Create a password" autoComplete="new-password" {...register('password', { required: 'Please create a password', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}

            <label htmlFor="confirm-password">Confirm password</label>
            <div className={`input-wrap ${errors.confirmPassword ? 'has-error' : ''}`}>
              <LockKeyhole size={17} aria-hidden="true" />
              <input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} placeholder="Repeat your password" autoComplete="new-password" {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} />
              <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}>
                {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword.message}</span>}

            {submitError && <p className="field-error" role="alert">{submitError}</p>}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Creating account...' : 'Create account'}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="signup-prompt">Already have an account? <Link to="/signin">Log in</Link></p>
        </div>

        <footer className="signin-footer">
          <span>© 2026 Social Plateform</span>
          <button type="button">English <span aria-hidden="true">⌄</span></button>
        </footer>
      </section>

      <section className="auth-visual" aria-label="A welcoming community gathering">
        <div className={`auth-visual-image ${activeImage === 0 ? 'is-active' : ''}`} style={{ backgroundImage: `url(${personOneImage})` }} aria-hidden="true" />
        <div className={`auth-visual-image ${activeImage === 1 ? 'is-active' : ''}`} style={{ backgroundImage: `url(${personTwoImage})` }} aria-hidden="true" />
        <div className={`auth-visual-image ${activeImage === 2 ? 'is-active' : ''}`} style={{ backgroundImage: `url(${welcomePersonImage})` }} aria-hidden="true" />
        <div className="visual-shade" />
        <div className="visual-copy">
          <p className="visual-kicker">Connect. Share. Belong.</p>
          <h2>There is a place for you here.</h2>
          <p>Meet people, discover opportunities, and make every connection count.</p>
          <div className="visual-dots" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </section>
    </main>
  )
}

export default SignUp