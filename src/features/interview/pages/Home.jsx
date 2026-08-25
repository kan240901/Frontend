import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useNavigate } from 'react-router'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'

const Home = () => {

  const { loading, generateReport, reports, getReports } = useInterview();
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [resumeFile, setResume] = useState(null)
  const resumeInputRef = useRef(null)

  useEffect(() => {
    getReports()
  }, [getReports])

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ type: '', message: '' })
    if (!resumeFile) {
      setStatus({ type: 'error', message: 'Please select your resume.' })
      return
    }

    if (resumeFile.type !== 'application/pdf' && !resumeFile.name.toLowerCase().endsWith('.pdf')) {
      setStatus({ type: 'error', message: 'Please upload a PDF resume.' })
      return
    }

    if (resumeFile.size > 3 * 1024 * 1024) {
      setStatus({ type: 'error', message: 'Your resume must be smaller than 3 MB.' })
      return
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile })
      navigate(`/interview/${data._id}`)
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Unable to generate your interview strategy.' })
    }
  }

  return (
    <main className='home'>
      <section className='home-shell'>
        <header className='home-heading'>
          <div className='heading-actions'>
            <button className='logout-btn' type='button' onClick={handleLogout}>Log out</button>
          </div>
          <h1>Create Your Custom <span>Interview Plan</span></h1>
          <p className='intro'>Let our AI analyze the job requirements and your unique profile to build a<br className='desktop-break' /> winning strategy.</p>
        </header>

        <form className='interview-form' onSubmit={handleSubmit}>
          <section className='form-panel role-panel'>
            <div className='panel-heading'>
              <span className='panel-icon briefcase-icon' aria-hidden='true' />
              <div>
                <h2>Target Job Description <span className='required-badge'>Required</span></h2>
              </div>
            </div>
            <label htmlFor='jobDescription'>Job description</label>
            <textarea
              name='jobDescription'
              id='jobDescription'
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder='Paste the job description here...'
              required
              maxLength={12000}
            />
            <span className='character-count'>{jobDescription.length} / 5000 chars</span>
          </section>

          <section className='form-panel profile-panel'>
            <div className='panel-heading'>
              <span className='panel-icon user-icon' aria-hidden='true' />
              <div>
                <h2>Your Profile</h2>
              </div>
            </div>
            <div className='input-group'>
              <label htmlFor='resume'>Upload Resume <span className='label-note'>Best Results</span></label>
              <label className={`file-drop ${resumeFile ? 'has-file' : ''}`} htmlFor='resume'>
                <span className='file-icon' aria-hidden='true'>↑</span>
                <strong>{resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}</strong>
                <small>{resumeFile ? 'Ready to send' : 'PDF only (Max 3MB)'}</small>
              </label>
              <input
                ref={resumeInputRef}
                type='file'
                name='resume'
                id='resume'
                accept='application/pdf,.pdf'
                onChange={(event) => setResume(event.target.files[0] || null)}
                required
              />
            </div>
            <div className='or-divider'><span>OR</span></div>
            <div className='input-group description-group'>
              <label htmlFor='selfDescription'>Quick Self-Description</label>
              <textarea
                name='selfDescription'
                id='selfDescription'
                value={selfDescription}
                onChange={(event) => setSelfDescription(event.target.value)}
                placeholder='Your strengths, goals, and the work you are proud of...'
                required
                maxLength={6000}
              />
            </div>
            <p className='form-note'><span aria-hidden='true'>i</span> Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
            <button className='generate-btn' type='submit' disabled={loading}>
              <span>{loading ? 'Building your report...' : 'Generate My Interview Strategy'}</span>
              <span aria-hidden='true'>✦</span>
            </button>
          </section>
        </form>

        <footer className='home-footer'>AI-Powered Strategy Generation <span>•</span> Approx 30s</footer>

        {status.message && <p className={`form-status ${status.type}`} role='status'>{status.message}</p>}

        {reports?.length > 0 && (
          <section className='recent-reports' aria-labelledby='recent-reports-title'>
            <div className='recent-reports-heading'>
              <div>
                <span className='section-kicker'>Your history</span>
                <h2 id='recent-reports-title'>My recent reports</h2>
              </div>
              <span className='reports-total'>{reports.length} reports</span>
            </div>
            <div className='reports-list'>
              {reports.map((recentReport) => (
                <button
                  className='report-item'
                  key={recentReport._id}
                  type='button'
                  onClick={() => navigate(`/interview/${recentReport._id}`)}
                >
                  <span className='report-item-title'>{recentReport.title || 'Untitled interview report'}</span>
                  <span className='report-item-date'>
                    {recentReport.createdAt ? new Date(recentReport.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                  <span className='report-item-score'>{recentReport.matchScore ?? '--'}%</span>
                  <span className='report-item-arrow' aria-hidden='true'>→</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

export default Home
