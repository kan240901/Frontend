import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'

const Interview = () => {
  const navigate = useNavigate()
  const { interviewId } = useParams()
  const [activeTab, setActiveTab] = useState('technical')
  const [activeQuestion, setActiveQuestion] = useState(null)
  const { report, getReportById, getResumePdf, downloadLoading, downloadError } = useInterview()

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId)
    }
  }, [interviewId, getReportById])

  if (!report) {
    return (
      <main className='interview-page interview-empty'>
        <div className='empty-state'>
          <span className='empty-kicker'>Interview report</span>
          <h1>Your report is waiting to be generated.</h1>
          <button type='button' onClick={() => navigate('/')}>Back to interview setup</button>
        </div>
      </main>
    )
  }

  const questions = activeTab === 'technical' ? report.technicalQuestions || [] : report.behavioralQuestions || []
  const sectionTitle = activeTab === 'technical' ? 'Technical Questions' : 'Behavioral Questions'

  function selectTab(tab) {
    setActiveTab(tab)
    setActiveQuestion(null)
  }

  return (
    <main className='interview-page'>
      <header className='interview-topbar'>
        <button className='back-button' type='button' onClick={() => navigate('/')} aria-label='Back to setup'>←</button>
        <div>
          <span className='brand-mark'>PREP<span>AI</span></span>
          <p>Personalized interview strategy</p>
        </div>
        <div className='score-pill'><strong>{report.matchScore ?? '--'}%</strong><span>role match</span></div>
      </header>

      <section className='interview-layout'>
        <nav className='report-nav' aria-label='Report sections'>
          <p className='nav-label'>Your report</p>
          <button className={activeTab === 'technical' ? 'active' : ''} type='button' onClick={() => selectTab('technical')}>
            <span className='nav-icon'>01</span>Technical questions
            <small>{report.technicalQuestions?.length || 0}</small>
          </button>
          <button className={activeTab === 'behavioral' ? 'active' : ''} type='button' onClick={() => selectTab('behavioral')}>
            <span className='nav-icon'>02</span>Behavioral questions
            <small>{report.behavioralQuestions?.length || 0}</small>
          </button>
          <button className={activeTab === 'roadmap' ? 'active' : ''} type='button' onClick={() => selectTab('roadmap')}>
            <span className='nav-icon'>03</span>Road map
            <small>{report.preparationPlan?.length || 0} days</small>
          </button>
          <div className='nav-summary'>
            <span>Profile match</span>
            <div className='progress-track'><i style={{ width: `${report.matchScore || 0}%` }} /></div>
            <strong>{report.matchScore ?? 0}% aligned</strong>
          </div>
          <div className='resume-download'>
            <p>Download AI-generated resume</p>
            <button type='button' onClick={() => getResumePdf(interviewId)} disabled={downloadLoading}>
              <span className={`download-icon ${downloadLoading ? 'loading' : ''}`} aria-hidden='true'>{downloadLoading ? '' : '↓'}</span>
              <span>{downloadLoading ? 'Preparing resume...' : 'Download resume'}</span>
            </button>
            {downloadError && <p className='download-error' role='alert'>{downloadError}</p>}
          </div>
        </nav>

        <section className='report-main'>
          {activeTab === 'roadmap' ? (
            <Roadmap plan={report.preparationPlan || []} />
          ) : (
            <>
              <div className='content-heading'>
                <div className='heading-row'>
                  <h1>{sectionTitle}</h1>
                  <span className='question-count'>{questions.length} questions</span>
                </div>
              </div>
              {questions.length ? (
                <div className='question-list'>
                  {questions.map((question, index) => (
                    <article className={`question-card ${activeQuestion === index ? 'expanded' : ''}`} key={`${question.question}-${index}`}>
                      <button className='question-toggle' type='button' onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}>
                        <span className='question-number'>Q{String(index + 1).padStart(2, '0')}</span>
                        <span className='question-title'>{question.question}</span>
                        <span className='chevron' aria-hidden='true'>⌄</span>
                      </button>
                      {activeQuestion === index && (
                        <div className='answer-details'>
                          <div className='answer-block'><span className='answer-label'>What they are looking for</span><p>{question.intention}</p></div>
                          <div className='answer-block suggested-answer'><span className='answer-label'>Suggested answer direction</span><p>{question.answer}</p></div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              ) : <p className='no-content'>No questions were returned for this section.</p>}
            </>
          )}
        </section>

        <aside className='insight-panel'>
          <div className='score-heading'><span className='section-kicker'>Match score</span><div className='score-ring'><strong>{report.matchScore ?? '--'}</strong><span>%</span></div><p>{report.matchScore >= 80 ? 'Strong match for this role' : 'Room to strengthen your match'}</p></div>
          <div className='insight-heading'><span className='section-kicker'>Watch closely</span><h2>Skill gaps</h2></div>
          <div className='skill-list'>
            {(report.skillGaps || []).map((gap) => <span className={`skill-chip ${gap.severity || 'medium'}`} key={gap.skill}>{gap.skill}</span>)}
          </div>
          <div className='gap-legend'><span><i className='medium' /> Focus soon</span><span><i className='low' /> Nice to have</span></div>
          <div className='insight-divider' />
          <div className='quick-stats'><span>Technical prompts<strong>{report.technicalQuestions?.length || 0}</strong></span><span>Behavioral prompts<strong>{report.behavioralQuestions?.length || 0}</strong></span></div>
        </aside>
      </section>
    </main>
  )
}

function Roadmap({ plan }) {
  return (
    <div className='roadmap-content'>
      <div className='content-heading'><span className='section-kicker'>Section 03</span><h1>Preparation road map</h1><p>A focused sequence for turning the gaps into confident interview stories.</p></div>
      <div className='roadmap-list'>
        {plan.map((day) => <article className='roadmap-day' key={day.day}><span className='day-number'>Day {day.day}</span><div><h2>{day.focus}</h2><ul>{(day.tasks || []).map((task) => <li key={task}>{task}</li>)}</ul></div></article>)}
      </div>
    </div>
  )
}

export default Interview


