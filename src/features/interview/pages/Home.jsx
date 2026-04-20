import React, { useState, useRef } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'

const Home = () => {
    // ✅ NEW
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [fileName, setFileName] = useState("")

    const { generateReport,reports, deleteReport } = useInterview()
    const { handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ deleteTargetId, setDeleteTargetId ] = useState(null)
    const resumeInputRef = useRef()

    const navigate = useNavigate()
    // ✅ NEW
    const handleFileChange = (e) => {
        const file = e.target.files[0]
            if (file) {
                setFileName(file.name)
            }
    }
    // ✅ NEW
    const validate = () => {
        const newErrors = {}

    if (!jobDescription.trim()) {
        newErrors.jobDescription = "Job description required"
    }

    const resumeFile = resumeInputRef.current?.files[0]

    if (!resumeFile && !selfDescription.trim()) {
        newErrors.profile = "Resume or self description required"
    }

    if (resumeFile && resumeFile.size > 5 * 1024 * 1024) {
        newErrors.profile = "File must be less than 5MB"
    }

    return newErrors
    }
    
    const handleGenerateReport = async () => {
    if (loading) return

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
    }

    setErrors({})
    setLoading(true)

    try {
        const resumeFile = resumeInputRef.current?.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })

        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    } catch (err) {
        console.error(err)
    } finally {
        setLoading(false)
    }
}

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    const handleConfirmDelete = async () => {
        if (!deleteTargetId) {
            return
        }

        await deleteReport(deleteTargetId)
        setDeleteTargetId(null)
    }

    return (
        <div className='home-page'>

            <div className='home-toolbar'>
                <button onClick={onLogout} className='logout-btn' type='button'>
                    Logout
                </button>
            </div>

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
    <div className='panel__header'>
        <span className='panel__icon'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
        </span>
        <h2>Target Job Description</h2>
        <span className='badge badge--required'>Required</span>
    </div>

    <textarea
        value={jobDescription}   // ✅ controlled
        onChange={(e) => setJobDescription(e.target.value)}
        className={`panel__textarea ${errors.jobDescription ? "error" : ""}`} // ✅ error border
        placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
        maxLength={5000}
    />

    <div className='char-counter'>
        {jobDescription.length} / 5000 chars
    </div>

    {/* ✅ ERROR ab andar */}
    {errors.jobDescription && (
        <p className="error-text">{errors.jobDescription}</p>
    )}
</div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            <label className='dropzone' htmlFor='resume'>
                                <span className='dropzone__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                </span>
                                <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                <input 
                                    ref={resumeInputRef} 
                                    onChange={handleFileChange}   // ✅ ADD
                                    hidden 
                                    type='file' 
                                    id='resume' 
                                    name='resume' 
                                    accept='.pdf,.docx' 
                                    />
                            </label>
                        </div>

                        {fileName && (
                        <p className="file-name success">✅ {fileName}</p>
                        )}
                        {errors.profile && (
                        <p className="error-text">{errors.profile}</p>
                        )}

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                            value={selfDescription}
                            onChange={(e) => setSelfDescription(e.target.value)}
                            id='selfDescription'
                            name='selfDescription'
                            className='panel__textarea panel__textarea--short'
                            placeholder="Briefly describe your experience..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
  onClick={handleGenerateReport}
  className={`generate-btn ${loading ? "loading" : ""}`}
  disabled={loading}
>
  <>
    {loading && <span className="btn-loader"></span>}
    Generate My Interview Strategy
  </>
</button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className='report-item__header'>
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <button
                                        type='button'
                                        className='report-delete-btn'
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setDeleteTargetId(report._id)
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>

            {deleteTargetId && (
                <div className='confirm-overlay' role='dialog' aria-modal='true' aria-labelledby='delete-confirm-title'>
                    <div className='confirm-modal'>
                        <h3 id='delete-confirm-title'>Delete Interview Plan?</h3>
                        <p>Are you sure you want to delete this interview plan? This action cannot be undone.</p>
                        <div className='confirm-actions'>
                            <button
                                type='button'
                                className='confirm-btn confirm-btn--yes'
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                type='button'
                                className='confirm-btn confirm-btn--no'
                                onClick={() => setDeleteTargetId(null)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home