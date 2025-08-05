import styles from '../styles/privacy-policy.css?url';

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

export const loader = async ({ request }) => {
  return null;
};

export default function PrivacyPolicy() {
  return (
    <div className="privacy-container">
      {/* Header Section */}
      <header className="privacy-header">
        <h1 className="privacy-title">Privacy Policy</h1>
        <p className="privacy-subtitle">
          Your privacy matters to us. Learn how we protect and handle your data.
        </p>
        <div className="last-updated">
          Last updated:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </header>

      {/* Quick Summary */}
      <div className="quick-summary">
        <h2 className="summary-title">Quick Summary</h2>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">🔒</div>
            <h3>Data Security</h3>
            <p>We use industry-standard encryption and security measures</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <h3>Minimal Data</h3>
            <p>We only collect what's necessary for app functionality</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🚫</div>
            <h3>No Selling</h3>
            <p>We never sell or trade your personal information</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚖️</div>
            <h3>Your Rights</h3>
            <p>Full control over your data with GDPR/CCPA compliance</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="privacy-content">
        <section className="privacy-section">
          <div className="section-header">
            <div className="section-icon">📋</div>
            <h2 className="section-title">Information We Collect</h2>
          </div>
          <p className="section-description">
            We collect minimal information necessary to provide our Instagram
            feed integration service:
          </p>
          <div className="info-cards">
            <div className="info-card">
              <h4>Instagram Data</h4>
              <ul>
                <li>Account connection tokens</li>
                <li>User ID and profile info</li>
                <li>Feed settings and preferences</li>
                <li>Cached posts and media</li>
              </ul>
            </div>
            <div className="info-card">
              <h4>Store Data</h4>
              <ul>
                <li>Shopify store domain</li>
                <li>Basic store information</li>
                <li>Usage analytics (anonymized)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="section-header">
            <div className="section-icon">⚙️</div>
            <h2 className="section-title">How We Use Your Information</h2>
          </div>
          <p className="section-description">
            We use your information exclusively to provide and improve our
            service:
          </p>
          <div className="usage-list">
            <div className="usage-item">
              <div className="usage-icon">🔐</div>
              <div>
                <h4>Secure Authentication</h4>
                <p>Authenticate your Shopify and Instagram accounts securely</p>
              </div>
            </div>
            <div className="usage-item">
              <div className="usage-icon">📱</div>
              <div>
                <h4>Feed Management</h4>
                <p>Embed and manage Instagram feeds on your Shopify store</p>
              </div>
            </div>
            <div className="usage-item">
              <div className="usage-icon">📈</div>
              <div>
                <h4>Service Improvement</h4>
                <p>Improve app functionality and user experience</p>
              </div>
            </div>
            <div className="usage-item">
              <div className="usage-icon">💬</div>
              <div>
                <h4>Customer Support</h4>
                <p>Provide customer support and send important updates</p>
              </div>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="section-header">
            <div className="section-icon">🛡️</div>
            <h2 className="section-title">Data Protection & Security</h2>
          </div>
          <p className="section-description">
            We implement industry-standard security measures to protect your
            information:
          </p>
          <div className="security-features">
            <div className="security-feature">
              <div className="feature-badge">OAuth 2.0</div>
              <span>Secure API authentication with Shopify and Instagram</span>
            </div>
            <div className="security-feature">
              <div className="feature-badge">SSL/TLS</div>
              <span>Encryption for all data transmission</span>
            </div>
            <div className="security-feature">
              <div className="feature-badge">Access Control</div>
              <span>Restricted data access on need-to-know basis</span>
            </div>
            <div className="security-feature">
              <div className="feature-badge">Monitoring</div>
              <span>Regular security audits and monitoring</span>
            </div>
            <div className="security-feature">
              <div className="feature-badge">Minimization</div>
              <span>We only collect what's necessary</span>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="section-header">
            <div className="section-icon">🤝</div>
            <h2 className="section-title">Data Sharing & Third Parties</h2>
          </div>
          <div className="sharing-notice">
            <p>
              <strong>
                We do not sell, trade, or share your personal information
              </strong>{' '}
              with third parties except as described below:
            </p>
          </div>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-logo">🛍️</div>
              <h4>Shopify</h4>
              <p>App functionality, billing, and store integration</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">📸</div>
              <h4>Instagram/Meta</h4>
              <p>Instagram API access and authentication</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">☁️</div>
              <h4>Hosting Providers</h4>
              <p>Secure data storage and app hosting</p>
            </div>
            <div className="partner-card">
              <div className="partner-logo">📊</div>
              <h4>Analytics Services</h4>
              <p>Usage analytics (anonymized data only)</p>
            </div>
          </div>
        </section>

        <section className="privacy-section">
          <div className="section-header">
            <div className="section-icon">⚖️</div>
            <h2 className="section-title">Your Privacy Rights</h2>
          </div>
          <p className="section-description">
            Under applicable data protection laws (GDPR, CCPA, etc.), you have
            these rights:
          </p>
          <div className="rights-grid">
            <div className="right-card">
              <div className="right-icon">👁️</div>
              <h4>Right to Access</h4>
              <p>Request a copy of your personal data</p>
            </div>
            <div className="right-card">
              <div className="right-icon">✏️</div>
              <h4>Right to Rectification</h4>
              <p>Request correction of inaccurate data</p>
            </div>
            <div className="right-card">
              <div className="right-icon">🗑️</div>
              <h4>Right to Erasure</h4>
              <p>Request deletion of your personal data</p>
            </div>
            <div className="right-card">
              <div className="right-icon">📦</div>
              <h4>Data Portability</h4>
              <p>Receive your data in machine-readable format</p>
            </div>
            <div className="right-card">
              <div className="right-icon">🚫</div>
              <h4>Right to Object</h4>
              <p>Object to processing based on legitimate interests</p>
            </div>
            <div className="right-card">
              <div className="right-icon">⏸️</div>
              <h4>Restrict Processing</h4>
              <p>Limit how we process your data</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Need Help or Have Questions?</h2>
              <p>
                For privacy-related questions or to exercise your rights, we're
                here to help.
              </p>
              <div className="contact-details">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email Us</h4>
                    <a href="mailto:info@sprinix.com" className="email-link">
                      info@sprinix.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="response-time">
                <div className="response-badge">
                  <span>⏱️ 30-day response guarantee</span>
                </div>
              </div>
            </div>
            <div className="contact-illustration">
              <div className="illustration-circle">
                <div className="illustration-icon">💬</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
