import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import girlsImage from '../../assets/girls.jpg'
import { loginUser } from '../../services/api'
import { useAuthStore } from '../../stores/authstore'
import { useToastStore } from '../../stores/toaststore'
import './SignIn.css'

type SignInFields = {
  email: string
  password: string
  remember: boolean
}

function GoogleIcon() {
  return (
    <svg className="google-icon" viewBox="0 0 24 24" role="img" aria-label="Google">
      <path fill="#4285F4" d="M21.6 12.23c0-.72-.06-1.42-.18-2.09H12v3.95h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.39Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.38l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.76-5.59-4.12H3.07v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.41 13.95A6 6 0 0 1 6.1 12c0-.68.12-1.34.31-1.95V7.46H3.07A10 10 0 0 0 2 12c0 1.63.39 3.17 1.07 4.54l3.34-2.59Z" />
      <path fill="#EA4335" d="M12 5.93c1.47 0 2.79.5 3.83 1.49l2.87-2.87C16.97 2.91 14.7 2 12 2a10 10 0 0 0-8.93 5.46l3.34 2.59C7.2 7.69 9.4 5.93 12 5.93Z" />
    </svg>
  )
}

function SignIn() {
  const navigate = useNavigate()
  const showToast = useToastStore((state) => state.showToast)
  const login = useAuthStore((state) => state.login)
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignInFields>({
    defaultValues: { remember: true },
  })

  const onSubmit = async (data: SignInFields) => {
    setSubmitError('')
    setIsSubmitting(true)

    try {
      const result = await loginUser(data)
      login(result.access_token, result.user)
      reset()
      showToast('Logged in successfully! Welcome back.', 'success')
      navigate('/news')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to log you in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="signin-panel" aria-labelledby="signin-title">
        <Link to="/" className="brand-mark" aria-label="Back to Social Plateform home">
          <span>BINGO</span>
        </Link>

        <div className="signin-content">
          <div className="signin-heading">
            <p className="eyebrow">Welcome back</p>
            <h1 id="signin-title">Log in to your account</h1>
            <p>Enter your details to continue your journey with us.</p>
          </div>

          <div className="social-login" aria-label="Social sign-in options">
            <button type="button" className="social-button" onClick={() => console.log('Email sign-in selected')} aria-label="Continue with email">
              <Mail className="social-mail-icon" size={19} aria-hidden="true" />
            </button>
            <button type="button" className="social-button" onClick={() => console.log('Google sign-in selected')} aria-label="Continue with Google">
              <GoogleIcon />
            </button>
            <button type="button" className="social-button" onClick={() => console.log('LinkedIn sign-in selected')} aria-label="Continue with LinkedIn">
              <span className="linkedin-icon">in</span>
            </button>
          </div>

          <div className="divider"><span>or continue with email</span></div>

          <form className="signin-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <label htmlFor="email">Email address</label>
            <div className={`input-wrap ${errors.email ? 'has-error' : ''}`}>
              <Mail size={17} aria-hidden="true" />
              <input
                id="email"
                type="email"
                placeholder="hello@example.com"
                autoComplete="email"
                {...register('email', {
                  required: 'Please enter your email address',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
                })}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email.message}</span>}

            <div className="password-label-row">
              <label htmlFor="password">Password</label>
              <a href="#forgot-password">Forgot password?</a>
            </div>
            <div className={`input-wrap ${errors.password ? 'has-error' : ''}`}>
              <LockKeyhole size={17} aria-hidden="true" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Please enter your password',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}

            <label className="remember-option">
              <input type="checkbox" {...register('remember')} />
              <span>Keep me logged in</span>
            </label>

            {submitError && <p className="field-error" role="alert">{submitError}</p>}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Logging in...' : 'Log in'}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          <p className="signup-prompt">Don&apos;t have an account? <Link to="/signup">Sign up</Link></p>
        </div>

        <footer className="signin-footer">
          <span>© 2026 Social Plateform</span>
          <button type="button">English <span aria-hidden="true">⌄</span></button>
        </footer>
      </section>

      <section className="auth-visual" style={{ backgroundImage: `url(${girlsImage})` }} aria-label="Two friends enjoying a moment together">
        <div className="visual-shade" />
        <div className="visual-copy">
          <p className="visual-kicker">Connect. Share. Belong.</p>
          <h2>Your community is waiting.</h2>
          <p>Join people who make every ordinary moment feel a little more meaningful.</p>
          <div className="visual-dots" aria-hidden="true"><span /><span /><span /></div>
        </div>
      </section>
    </main>
  )
}

export default SignIn
