import styles from '../styles/data-deletion.css?url';

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

export default function DataDeletion() {
  return (
    <div className="data-deletion-container">
      {/* Header Section */}
      <header className="data-deletion-header">
        <h1 className="data-deletion-title">Data Deletion Policy</h1>
        <p className="data-deletion-subtitle">
          Your right to delete your data, in full compliance with Meta's
          Platform Terms
        </p>
        <div className="compliance-badge">
          <span className="badge-icon">✅</span>
          <span>Meta Platform Compliant</span>
        </div>
      </header>

      {/* Quick Action Section */}
      <div className="quick-actions">
        <h2 className="actions-title">Delete Your Data Now</h2>
        <div className="actions-grid">
          <div className="action-card primary">
            <div className="action-icon">🔄</div>
            <h3>Instagram Settings</h3>
            <p>Remove app access directly from your Instagram account</p>
            <div className="action-steps">
              <span className="step">Settings → Apps → Remove</span>
            </div>
            <div className="action-badge recommended">Recommended</div>
          </div>
          <div className="action-card secondary">
            <div className="action-icon">📧</div>
            <h3>Email Request</h3>
            <p>Send us a deletion request via email</p>
            <div className="action-steps">
              <span className="step">30-day processing time</span>
            </div>
            <div className="action-badge">Manual Process</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="data-deletion-content">
        {/* Meta Compliance Notice */}
        <div className="meta-compliance-notice">
          <div className="notice-icon">🛡️</div>
          <div className="notice-content">
            <h3>Meta Platform Compliance</h3>
            <p>
              This policy fully complies with Meta's Platform Terms and
              Instagram Basic Display API requirements. Data deletion requests
              are processed automatically and confirmed within specified
              timeframes as required by Meta's data governance standards.
            </p>
          </div>
        </div>

        <section className="deletion-section">
          <div className="section-header">
            <div className="section-icon">📋</div>
            <h2 className="section-title">Overview</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              At Instagram Feed App, we respect your privacy and your
              fundamental right to control your data. This comprehensive policy
              explains how you can request deletion of your data from our
              systems in full compliance with Meta's Platform Terms and
              applicable privacy regulations including GDPR and CCPA.
            </p>
            <div className="key-points">
              <div className="key-point">
                <div className="point-icon">⚡</div>
                <div>
                  <h4>Automated Processing</h4>
                  <p>
                    Integrated with Meta's deletion callback systems for instant
                    processing
                  </p>
                </div>
              </div>
              <div className="key-point">
                <div className="point-icon">🔒</div>
                <div>
                  <h4>Complete Removal</h4>
                  <p>
                    All associated data permanently deleted from all our systems
                  </p>
                </div>
              </div>
              <div className="key-point">
                <div className="point-icon">📞</div>
                <div>
                  <h4>Confirmation Provided</h4>
                  <p>
                    Written confirmation of successful deletion within 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="deletion-section">
          <div className="section-header">
            <div className="section-icon">🛠️</div>
            <h2 className="section-title">Deletion Methods</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Choose the method that works best for you. Both options ensure
              complete data removal:
            </p>
            <div className="methods-grid">
              <div className="method-card automatic">
                <div className="method-header">
                  <div className="method-icon">🔄</div>
                  <div className="method-title">
                    <h3>Automatic Deletion</h3>
                    <span className="method-badge">Recommended</span>
                  </div>
                </div>
                <div className="method-content">
                  <div className="method-steps">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-text">
                        Open Instagram app or instagram.com
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-text">
                        Go to Settings → Security → Apps and Websites
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-text">
                        Find "Instagram Feed App" in Active apps
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">4</div>
                      <div className="step-text">
                        Click "Remove" to revoke access
                      </div>
                    </div>
                  </div>
                  <div className="method-footer">
                    <div className="processing-time">
                      <span className="time-icon">⏱️</span>
                      <span>Processed within 30 days automatically</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="method-card manual">
                <div className="method-header">
                  <div className="method-icon">📧</div>
                  <div className="method-title">
                    <h3>Manual Email Request</h3>
                    <span className="method-badge">Alternative</span>
                  </div>
                </div>
                <div className="method-content">
                  <div className="method-steps">
                    <div className="step-item">
                      <div className="step-number">1</div>
                      <div className="step-text">
                        Uninstall app from Shopify store (optional)
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">2</div>
                      <div className="step-text">
                        Email us with deletion request
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">3</div>
                      <div className="step-text">
                        Include store domain and Instagram username
                      </div>
                    </div>
                    <div className="step-item">
                      <div className="step-number">4</div>
                      <div className="step-text">
                        Receive confirmation email
                      </div>
                    </div>
                  </div>
                  <div className="method-footer">
                    <div className="processing-time">
                      <span className="time-icon">⏱️</span>
                      <span>Acknowledged in 72hrs, completed in 30 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="deletion-section">
          <div className="section-header">
            <div className="section-icon">🗑️</div>
            <h2 className="section-title">What Gets Deleted</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Upon your request, we permanently delete ALL of your data from our
              systems. This includes:
            </p>
            <div className="data-categories">
              <div className="data-category">
                <div className="category-header">
                  <div className="category-icon">🔗</div>
                  <h4>Account & Connection Data</h4>
                </div>
                <ul className="data-list">
                  <li>Instagram account access tokens and refresh tokens</li>
                  <li>Instagram user ID and profile information</li>
                  <li>Shopify store connection details</li>
                  <li>API authentication credentials</li>
                </ul>
              </div>
              <div className="data-category">
                <div className="category-header">
                  <div className="category-icon">📱</div>
                  <h4>Content & Media Data</h4>
                </div>
                <ul className="data-list">
                  <li>Cached Instagram posts, images, and videos</li>
                  <li>Post metadata, comments, and engagement data</li>
                  <li>Instagram Stories and Highlights data</li>
                  <li>Media file copies and thumbnails</li>
                </ul>
              </div>
              <div className="data-category">
                <div className="category-header">
                  <div className="category-icon">⚙️</div>
                  <h4>Settings & Preferences</h4>
                </div>
                <ul className="data-list">
                  <li>Feed configuration and display preferences</li>
                  <li>User customization settings</li>
                  <li>Widget placement and styling options</li>
                  <li>Analytics and performance preferences</li>
                </ul>
              </div>
              <div className="data-category">
                <div className="category-header">
                  <div className="category-icon">📊</div>
                  <h4>System & Analytics Data</h4>
                </div>
                <ul className="data-list">
                  <li>Usage analytics and performance metrics</li>
                  <li>Webhook subscriptions and callback data</li>
                  <li>System logs containing your Instagram data</li>
                  <li>Backup copies and archived data</li>
                </ul>
              </div>
            </div>
            <div className="deletion-warning">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h4>Permanent Deletion Notice</h4>
                <p>
                  This deletion is <strong>permanent and irreversible</strong>.
                  Once deleted, your data cannot be recovered. You will need to
                  completely reconnect your Instagram account and reconfigure
                  all settings if you reinstall the app.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="deletion-section">
          <div className="section-header">
            <div className="section-icon">⏱️</div>
            <h2 className="section-title">Processing Timeline</h2>
          </div>
          <div className="section-content">
            <div className="timeline-grid">
              <div className="timeline-card automatic-timeline">
                <div className="timeline-header">
                  <div className="timeline-icon">🔄</div>
                  <h4>Automatic Requests</h4>
                </div>
                <div className="timeline-content">
                  <div className="timeline-step">
                    <span className="timeline-time">Immediate</span>
                    <span className="timeline-desc">
                      Request received from Meta
                    </span>
                  </div>
                  <div className="timeline-step">
                    <span className="timeline-time">Within 24 hours</span>
                    <span className="timeline-desc">
                      Deletion process initiated
                    </span>
                  </div>
                  <div className="timeline-step">
                    <span className="timeline-time">Within 30 days</span>
                    <span className="timeline-desc">
                      Complete deletion confirmed
                    </span>
                  </div>
                </div>
              </div>
              <div className="timeline-card manual-timeline">
                <div className="timeline-header">
                  <div className="timeline-icon">📧</div>
                  <h4>Email Requests</h4>
                </div>
                <div className="timeline-content">
                  <div className="timeline-step">
                    <span className="timeline-time">Within 72 hours</span>
                    <span className="timeline-desc">
                      Email acknowledgment sent
                    </span>
                  </div>
                  <div className="timeline-step">
                    <span className="timeline-time">Within 7 days</span>
                    <span className="timeline-desc">
                      Identity verification completed
                    </span>
                  </div>
                  <div className="timeline-step">
                    <span className="timeline-time">Within 30 days</span>
                    <span className="timeline-desc">
                      Deletion completed & confirmed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="deletion-section">
          <div className="section-header">
            <div className="section-icon">🔧</div>
            <h2 className="section-title">Technical Implementation</h2>
          </div>
          <div className="section-content">
            <p className="section-text">
              Our technical infrastructure is designed to comply with Meta's
              data deletion requirements:
            </p>
            <div className="tech-features">
              <div className="tech-feature">
                <div className="tech-icon">🔗</div>
                <div className="tech-content">
                  <h4>Meta Webhook Integration</h4>
                  <p>
                    Registered callback endpoint processes deletion requests
                    from Meta automatically
                  </p>
                  <code className="endpoint-code">
                    https://your-app-domain.com/webhooks/data-deletion
                  </code>
                </div>
              </div>
              <div className="tech-feature">
                <div className="tech-icon">🛡️</div>
                <div className="tech-content">
                  <h4>Secure Processing</h4>
                  <p>
                    All deletion requests are verified and processed using
                    encrypted secure channels
                  </p>
                </div>
              </div>
              <div className="tech-feature">
                <div className="tech-icon">📝</div>
                <div className="tech-content">
                  <h4>Audit Trail</h4>
                  <p>
                    Complete logging of deletion process for compliance and
                    verification purposes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section">
          <div className="contact-content">
            <div className="contact-info">
              <h2>Need Help with Data Deletion?</h2>
              <p>
                Our privacy team is ready to assist you with any data deletion
                requests or questions. We're committed to processing your
                request promptly and providing confirmation.
              </p>
              <div className="contact-details">
                <div className="contact-method">
                  <div className="contact-icon">📧</div>
                  <div>
                    <h4>Email for Deletion Requests</h4>
                    <a href="mailto:info@sprinix.com" className="email-link">
                      info@sprinix.com
                    </a>
                  </div>
                </div>
              </div>
              <div className="required-info">
                <h4>Include in Your Request:</h4>
                <ul className="info-list">
                  <li>Your Shopify store domain</li>
                  <li>Instagram username</li>
                  <li>Confirmation of permanent deletion intent</li>
                  <li>Preferred confirmation method</li>
                </ul>
              </div>
              <div className="response-guarantee">
                <div className="guarantee-badge">
                  <span>⏱️ 72-hour response guarantee</span>
                </div>
              </div>
            </div>
            <div className="contact-illustration">
              <div className="illustration-circle">
                <div className="illustration-icon">🛡️</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
