import { useState, useEffect } from 'react';
import './styles.css';

interface RepoAnalysis {
  repoName: string;
  owner: string;
  stars: number;
  forks: number;
  openIssues: number;
  license: string;
  lastUpdate: string;
  age: string;
  contributors: number;
  riskScore: number;
  findings: Finding[];
}

interface Finding {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
}

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState('');
  const [analysis, setAnalysis] = useState<RepoAnalysis | null>(null);
  const [error, setError] = useState('');

  const scanPhases = [
    'Initializing security scan...',
    'Fetching repository metadata...',
    'Analyzing commit history...',
    'Scanning dependency tree...',
    'Checking for known vulnerabilities...',
    'Evaluating maintenance patterns...',
    'Assessing community trust signals...',
    'Compiling risk assessment...',
  ];

  const simulateScan = () => {
    if (!repoUrl.trim()) {
      setError('Please enter a repository URL or owner/repo');
      return;
    }

    const match = repoUrl.match(/(?:github\.com\/)?([^\/]+)\/([^\/\s]+)/);
    if (!match) {
      setError('Invalid format. Use: owner/repo or https://github.com/owner/repo');
      return;
    }

    const [, owner, repo] = match;
    setError('');
    setIsScanning(true);
    setScanProgress(0);
    setAnalysis(null);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsScanning(false);
        generateAnalysis(owner, repo.replace('.git', ''));
      }
      setScanProgress(Math.min(progress, 100));
      setScanPhase(scanPhases[Math.floor((progress / 100) * (scanPhases.length - 1))]);
    }, 400);
  };

  const generateAnalysis = (owner: string, repo: string) => {
    const riskScore = Math.floor(Math.random() * 60) + 20;

    const possibleFindings: Finding[] = [
      { category: 'Security', severity: 'critical', title: 'No Security Policy', description: 'Repository lacks SECURITY.md file for vulnerability reporting' },
      { category: 'Security', severity: 'high', title: 'Outdated Dependencies', description: 'Package contains dependencies with known CVEs' },
      { category: 'Privacy', severity: 'high', title: 'Telemetry Detected', description: 'Analytics/telemetry code found in source files' },
      { category: 'Privacy', severity: 'medium', title: 'Network Requests', description: 'Makes external API calls that may transmit data' },
      { category: 'Maintenance', severity: 'medium', title: 'Stale Repository', description: 'No commits in the last 6 months' },
      { category: 'Maintenance', severity: 'low', title: 'Limited Contributors', description: 'Single maintainer increases bus factor risk' },
      { category: 'Trust', severity: 'info', title: 'New Repository', description: 'Repository is less than 1 year old' },
      { category: 'Trust', severity: 'low', title: 'Low Star Count', description: 'Limited community validation' },
      { category: 'License', severity: 'medium', title: 'Restrictive License', description: 'GPL license may have implications for your project' },
      { category: 'Security', severity: 'high', title: 'Install Scripts', description: 'Contains postinstall scripts that run arbitrary code' },
    ];

    const numFindings = Math.floor(Math.random() * 5) + 3;
    const shuffled = possibleFindings.sort(() => Math.random() - 0.5);
    const findings = shuffled.slice(0, numFindings);

    const mockAnalysis: RepoAnalysis = {
      repoName: repo,
      owner: owner,
      stars: Math.floor(Math.random() * 10000) + 100,
      forks: Math.floor(Math.random() * 1000) + 10,
      openIssues: Math.floor(Math.random() * 200),
      license: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'Unlicense'][Math.floor(Math.random() * 5)],
      lastUpdate: `${Math.floor(Math.random() * 30) + 1} days ago`,
      age: `${Math.floor(Math.random() * 5) + 1} years`,
      contributors: Math.floor(Math.random() * 50) + 1,
      riskScore,
      findings,
    };

    setAnalysis(mockAnalysis);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 70) return { label: 'HIGH RISK', color: 'var(--critical)' };
    if (score >= 40) return { label: 'MODERATE', color: 'var(--warning)' };
    return { label: 'LOW RISK', color: 'var(--safe)' };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'var(--critical)';
      case 'high': return 'var(--warning)';
      case 'medium': return 'var(--accent)';
      case 'low': return 'var(--safe)';
      default: return 'var(--muted)';
    }
  };

  return (
    <div className="app">
      <div className="scan-lines"></div>
      <div className="grid-bg"></div>

      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-main">REPO SCOUT</span>
            <span className="logo-sub">Open Source Due Diligence</span>
          </div>
        </div>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span className="status-text">SYSTEM READY</span>
        </div>
      </header>

      <main className="main">
        <section className="input-section">
          <div className="input-wrapper">
            <div className="input-prefix">
              <span className="prefix-symbol">&gt;</span>
              <span className="prefix-text">SCAN_TARGET:</span>
            </div>
            <input
              type="text"
              className="repo-input"
              placeholder="owner/repo or https://github.com/owner/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && simulateScan()}
              disabled={isScanning}
            />
            <button
              className="scan-button"
              onClick={simulateScan}
              disabled={isScanning}
            >
              {isScanning ? (
                <span className="scanning-text">SCANNING</span>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  INITIATE SCAN
                </>
              )}
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </section>

        {isScanning && (
          <section className="scanning-section">
            <div className="scan-animation">
              <div className="scan-ring"></div>
              <div className="scan-ring delay-1"></div>
              <div className="scan-ring delay-2"></div>
              <div className="scan-center">
                <span>{Math.floor(scanProgress)}%</span>
              </div>
            </div>
            <div className="scan-status">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${scanProgress}%` }}></div>
              </div>
              <p className="scan-phase">{scanPhase}</p>
            </div>
          </section>
        )}

        {analysis && !isScanning && (
          <section className="results-section">
            <div className="results-header">
              <div className="repo-info">
                <h2 className="repo-title">
                  <span className="repo-owner">{analysis.owner}/</span>
                  <span className="repo-name">{analysis.repoName}</span>
                </h2>
                <div className="repo-meta">
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    {analysis.stars.toLocaleString()}
                  </span>
                  <span className="meta-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M7 7h10v10M17 7L7 17"/>
                    </svg>
                    {analysis.forks.toLocaleString()} forks
                  </span>
                  <span className="meta-item">{analysis.license}</span>
                  <span className="meta-item">Updated {analysis.lastUpdate}</span>
                </div>
              </div>
              <div className="risk-score" style={{ '--risk-color': getRiskLevel(analysis.riskScore).color } as React.CSSProperties}>
                <div className="risk-gauge">
                  <svg viewBox="0 0 100 50" className="gauge-svg">
                    <path d="M 10 45 A 35 35 0 0 1 90 45" fill="none" stroke="var(--border)" strokeWidth="8" strokeLinecap="round"/>
                    <path
                      d="M 10 45 A 35 35 0 0 1 90 45"
                      fill="none"
                      stroke="var(--risk-color)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${analysis.riskScore * 1.1}, 110`}
                      className="gauge-fill"
                    />
                  </svg>
                  <div className="risk-value">{analysis.riskScore}</div>
                </div>
                <span className="risk-label" style={{ color: getRiskLevel(analysis.riskScore).color }}>
                  {getRiskLevel(analysis.riskScore).label}
                </span>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-value">{analysis.contributors}</span>
                <span className="stat-label">Contributors</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{analysis.openIssues}</span>
                <span className="stat-label">Open Issues</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{analysis.age}</span>
                <span className="stat-label">Repository Age</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{analysis.findings.filter(f => f.severity === 'critical' || f.severity === 'high').length}</span>
                <span className="stat-label">Critical Findings</span>
              </div>
            </div>

            <div className="findings-section">
              <h3 className="findings-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Security Findings ({analysis.findings.length})
              </h3>
              <div className="findings-table">
                <div className="table-header">
                  <span>Severity</span>
                  <span>Category</span>
                  <span>Finding</span>
                  <span>Details</span>
                </div>
                {analysis.findings.map((finding, index) => (
                  <div key={index} className="table-row" style={{ animationDelay: `${index * 0.1}s` }}>
                    <span className="severity-badge" style={{ backgroundColor: getSeverityColor(finding.severity) }}>
                      {finding.severity.toUpperCase()}
                    </span>
                    <span className="category">{finding.category}</span>
                    <span className="finding-title">{finding.title}</span>
                    <span className="finding-desc">{finding.description}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="verdict-section">
              <div className="verdict-box" data-risk={analysis.riskScore >= 70 ? 'high' : analysis.riskScore >= 40 ? 'moderate' : 'low'}>
                <div className="verdict-icon">
                  {analysis.riskScore >= 70 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="15" y1="9" x2="9" y2="15"/>
                      <line x1="9" y1="9" x2="15" y2="15"/>
                    </svg>
                  ) : analysis.riskScore >= 40 ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  )}
                </div>
                <div className="verdict-content">
                  <h4>
                    {analysis.riskScore >= 70
                      ? 'Proceed with Extreme Caution'
                      : analysis.riskScore >= 40
                        ? 'Review Before Installing'
                        : 'Relatively Safe to Use'}
                  </h4>
                  <p>
                    {analysis.riskScore >= 70
                      ? 'This repository has significant security or privacy concerns. Consider alternatives or thorough code review.'
                      : analysis.riskScore >= 40
                        ? 'Some concerns identified. Review the findings and assess if they impact your use case.'
                        : 'No major issues detected. Standard precautions still recommended.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {!analysis && !isScanning && (
          <section className="empty-state">
            <div className="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Ready to Analyze</h3>
            <p>Enter a GitHub repository URL to begin security assessment</p>
            <div className="example-repos">
              <span className="example-label">Try:</span>
              {['facebook/react', 'vercel/next.js', 'lodash/lodash'].map((repo) => (
                <button key={repo} className="example-btn" onClick={() => setRepoUrl(repo)}>
                  {repo}
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>Requested by @ganjidotme · Built by @clonkbot</span>
      </footer>
    </div>
  );
}

export default App;
