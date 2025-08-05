import styles from '../styles/terms-of-service.css?url';

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

export default function TermsOfService() {
  return (
    <div className="terms-container">
      {/* Header Section */}
      <header className="terms-header">
        <h1 className="terms-title">Terms of Service</h1>
        <p className="terms-subtitle">
          Clear, fair terms for using our Instagram Feed App on Shopify
        </p>
        <div className="last-updated">
          Effective:{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </header>

      {/* Quick Overview */}
      <div className="quick-overview">
        <h2 className="overview-title">What You Need to Know</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <div className="overview-icon">✅</div>
            <h3>Easy to Use</h3>
            <p>Simple integration between Instagram and your Shopify store</p>
          </div>
          <div className="overview-card">
            <div className="overview-icon">🔗</div>
            <h3>Platform Compliance</h3>
            <p>Follows Meta and Shopify guidelines for safe operation</p>
          </div>
          <div className="overview-card">
            <div className="overview-icon">🛡️</div>
            <h3>Your Control</h3>
            <p>You own your content and can terminate service anytime</p>
          </div>
          <div className="overview-card">
            <div className="overview-icon">⚡</div>
            <h3>Minimal Data</h3>
            <p>We only collect what's needed for functionality</p>
          </div>
        </div>
      </div>

      {/* Main Terms Content */}
      <div className="terms-content">
        {/* Quick Summary Alert */}
        <div className="quick-summary-alert">
          <div className="alert-icon">📋</div>
          <div className="alert-content">
            <h3>Quick Summary</h3>
            <p>
              By using our Instagram Feed App, you agree to display Instagram
              content responsibly, comply with Meta and Shopify policies, and
              understand that we collect minimal data to provide our service.
              You can terminate anytime by uninstalling the app.
            </p>
          </div>
        </div>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">1</div>
            <h2 className="section-title">Acceptance of Terms</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              By installing and using the <strong>Instagram Feed App</strong>,
              you acknowledge that you have read, understood, and agree to be
              bound by these Terms of Service. These terms create a legal
              agreement between you and our service.
            </p>
            <div className="important-note">
              <div className="note-icon">⚠️</div>
              <p>
                If you do not agree with any part of these terms, please
                uninstall the app immediately.
              </p>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">2</div>
            <h2 className="section-title">Service Description</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Our Instagram Feed App seamlessly integrates your Instagram
              content with your Shopify store, helping you showcase authentic
              visual content and build social proof.
            </p>
            <div className="service-features">
              <div className="feature-item">
                <div className="feature-icon">📸</div>
                <div>
                  <h4>Instagram Integration</h4>
                  <p>Display your Instagram posts directly on your store</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛍️</div>
                <div>
                  <h4>Shopify Compatibility</h4>
                  <p>Seamless integration with your existing store theme</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div>
                  <h4>Real-time Updates</h4>
                  <p>Automatic sync of your latest Instagram content</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">3</div>
            <h2 className="section-title">Your Responsibilities</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              To ensure a smooth experience for everyone, you agree to:
            </p>
            <div className="responsibilities-grid">
              <div className="responsibility-card">
                <div className="resp-icon">🔐</div>
                <h4>Account Security</h4>
                <p>
                  Maintain valid Shopify store and Instagram account credentials
                </p>
              </div>
              <div className="responsibility-card">
                <div className="resp-icon">📋</div>
                <h4>Policy Compliance</h4>
                <p>
                  Ensure all content complies with Meta's and Shopify's
                  community guidelines
                </p>
              </div>
              <div className="responsibility-card">
                <div className="resp-icon">✨</div>
                <h4>Content Quality</h4>
                <p>
                  Display only appropriate, authorized content that represents
                  your brand well
                </p>
              </div>
              <div className="responsibility-card">
                <div className="resp-icon">🤝</div>
                <h4>Fair Usage</h4>
                <p>
                  Use the service responsibly without attempting to circumvent
                  limitations
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">4</div>
            <h2 className="section-title">Data & Privacy</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              We collect minimal data necessary to provide our service,
              including account tokens and media content. Your privacy is
              important to us.
            </p>
            <div className="data-types">
              <div className="data-category">
                <h4>🔗 Connection Data</h4>
                <ul>
                  <li>Instagram and Shopify API tokens</li>
                  <li>Basic account information</li>
                </ul>
              </div>
              <div className="data-category">
                <h4>📱 Content Data</h4>
                <ul>
                  <li>Instagram posts and media</li>
                  <li>Display preferences and settings</li>
                </ul>
              </div>
            </div>
            <div className="privacy-notice">
              <div className="notice-icon">📋</div>
              <div>
                <h4>Complete Privacy Details</h4>
                <p>
                  For comprehensive information on our data practices, please
                  review our{' '}
                  <a href="/privacy-policy" className="privacy-link">
                    Privacy Policy
                  </a>
                  , which is an integral part of these terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">5</div>
            <h2 className="section-title">Meta Platform Compliance</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              As an app that integrates with Instagram (owned by Meta), we
              adhere to Meta's platform policies and requirements.
            </p>
            <div className="compliance-items">
              <div className="compliance-item">
                <div className="compliance-icon">📸</div>
                <div>
                  <h4>Instagram API Usage</h4>
                  <p>
                    We use Instagram's official API in compliance with their
                    terms and rate limits
                  </p>
                </div>
              </div>
              <div className="compliance-item">
                <div className="compliance-icon">🔒</div>
                <div>
                  <h4>Data Security</h4>
                  <p>
                    All Instagram data is handled according to Meta's security
                    requirements
                  </p>
                </div>
              </div>
              <div className="compliance-item">
                <div className="compliance-icon">⚖️</div>
                <div>
                  <h4>Content Guidelines</h4>
                  <p>
                    Your displayed content must comply with Instagram's
                    community standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">6</div>
            <h2 className="section-title">Service Limitations</h2>
          </div>
          <div className="section-content">
            <div className="limitation-notice">
              <div className="limitation-icon">⚠️</div>
              <div>
                <h4>Service "As Is" Provision</h4>
                <p>
                  We provide the Instagram Feed App "as is" and cannot guarantee
                  uninterrupted service due to potential changes in Instagram's
                  or Shopify's platforms.
                </p>
              </div>
            </div>
            <div className="limitations-list">
              <div className="limitation-item">
                <h4>Platform Dependencies</h4>
                <p>
                  Service functionality depends on Instagram and Shopify API
                  availability
                </p>
              </div>
              <div className="limitation-item">
                <h4>Content Responsibility</h4>
                <p>
                  We are not liable for user content that violates platform
                  policies
                </p>
              </div>
              <div className="limitation-item">
                <h4>Maximum Liability</h4>
                <p>
                  Our liability is limited to the amount paid in the 12 months
                  preceding any claim
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-section">
          <div className="section-header">
            <div className="section-number">7</div>
            <h2 className="section-title">Termination</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              You have full control over your use of our service and can
              terminate at any time.
            </p>
            <div className="termination-options">
              <div className="termination-card">
                <div className="term-icon">🚪</div>
                <h4>Your Right to Terminate</h4>
                <p>
                  Uninstall the app from your Shopify store at any time with no
                  penalties
                </p>
              </div>
              <div className="termination-card">
                <div className="term-icon">🗑️</div>
                <h4>Data Cleanup</h4>
                <p>
                  Upon termination, your data will be deleted according to our
                  Privacy Policy
                </p>
              </div>
              <div className="termination-card">
                <div className="term-icon">⚖️</div>
                <h4>Our Right to Terminate</h4>
                <p>
                  We may suspend access if these terms are violated, with prior
                  notice when possible
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Questions About These Terms?</h2>
              <p>
                If you have any questions about these terms or need
                clarification, we're here to help. We typically respond within
                24 hours.
              </p>
              <div className="contact-details">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email Support</h4>
                    <a href="mailto:info@sprinix.com" className="email-link">
                      info@sprinix.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="response-time">
                <div className="response-badge">
                  <span>⏱️ 24-hour response time</span>
                </div>
              </div>
            </div>
            <div className="contact-illustration">
              <div className="illustration-circle">
                <div className="illustration-icon">🤝</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
