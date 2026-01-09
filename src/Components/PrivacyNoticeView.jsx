import React from 'react';
import { Icons } from './Icons';

const PrivacyNoticeView = ({ onBack }) => {
  return (
    <div className="glass-card rounded-4 w-100 overflow-hidden position-relative z-1 fade-up" style={{ maxWidth: "900px", padding: "2rem" }}>
      
      {/* Header - Back Button Removed from here */}
      <div className="mb-4 border-bottom pb-3" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
        <h2 className="fw-bold m-0" style={{color: 'var(--accent)'}}>Privacy Notice</h2>
      </div>

      {/* Content Scrollable Area */}
      <div className="privacy-content" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '1rem', lineHeight: '1.7', fontSize: '0.95rem' }}>
        
        <p className="mb-4">
          <strong>Santhome Holdings BVI (www.santhomecard.com)</strong>, with registered office at <strong>SANTHOME HOLDINGS LIMITED, MILL MALL, SUITE 6, WICKHAMS CAY 1, POBOX-3085, ROAD TOWN, TORTOLA, BVI, TORTOLA</strong> respects your privacy and provides you with this Privacy Notice (“Privacy Notice”) so that you may understand the ways in which we do and do not use the information you transmit when accessing and using website, platform, software services and related services.
        </p>

        <p className="mb-4">
          At <strong>Santhome Holdings BVI (www.santhomecard.com)</strong> we handle your data so that neither we nor anyone else can use them to harm your interests and rights, such as your right to privacy.
        </p>

        <p className="mb-4">
          If you want to review, verify, correct or request erasure of your personal information, object to the processing of your personal data or request that we transfer a copy of your personal information to another party, please contact us using.
        </p>

        <p className="mb-4">The policy extends to our website: <strong>ecard.santhomecard.com</strong></p>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>What data, for what purposes, based on what grounds, and how long we process the data?</h5>
        
        <ul className="list-unstyled">
          <li className="mb-3">
            <strong>To provide you with our services</strong><br/>
            Legal basis: contract.<br/>
            Data: email, image, contact information, company name, social media profiles, job title.<br/>
            Storage period: 14 days after deleting the account.
          </li>
          <li className="mb-3">
            <strong>To provide technical support</strong><br/>
            Legal basis: contract.<br/>
            Data: email, ****username, data from messages.<br/>
            Storage period: as long as you have your account or support is needed whichever is shorter.
          </li>
          <li className="mb-3">
            <strong>To analyze user behavior in order to improve our service</strong><br/>
            Legal basis: consent.<br/>
            Data: browser information.<br/>
            Storage period: 6 months.
          </li>
          <li className="mb-3">
            <strong>To offer our clients personalized marketing and advertising</strong><br/>
            Legal basis: consent.<br/>
            Data: location data, javascript events, device, availability of cookie, client ID, data about the site visit, screen height, and width, user ID, browser language, interests, clicking on an external link.<br/>
            Storage period: 6 months after last interaction or visiting our website.
          </li>
        </ul>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>Where did we get your data from?</h5>
        <p className="mb-4">
          <strong>Browser.</strong> Your internet browser (such as Mozilla Firefox, Google Chrome, or Microsoft Internet Explorer) automatically transmits some information to us every time you access content on one of our internet domains. Examples of such information include the URL of the particular Web page you visited, the IP (Internet Protocol) address of the computer you are using, or the browser version that you are using to access the website.
        </p>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>Who do we share your personal data with?</h5>
        <p className="mb-3">
          <strong>Google Analytics</strong><br/>
          Google Analytics is a web analytics service. The service is provided by Google, Inc. Address: Google, Google Data Protection Office, 1600 Amphitheatre Pkwy, Mountain View, California 94043, USA. Relevant privacy policy of Google. Unfortunately, the country of data recipient doesn’t ensure an adequate level of protection of your personal data. Privacy Shield is used to transfer your data to Google to ensure that they are properly protected.
        </p>
        <p className="mb-4">
          <strong>Facebook Pixel</strong><br/>
          Facebook Pixel is an advertising tool that uses a short piece of code that is installed on your websites to track visitors. The services are provided by Facebook Ireland Ltd. Address: 1601 South California Avenue, Palo Alto, CA 94304, USA. Relevant privacy policy of Facebook. Unfortunately, the country of data recipient doesn’t ensure an adequate level of protection of your personal data. Standard Contractual Clauses are used to transfer your data to Facebook to ensure that they are properly protected. For more information: click on this link.
        </p>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>Automated decisions</h5>
        <p className="mb-4">We neither use automated decision-making nor your personal data to automatically assess aspects of your personality (automated profiling).</p>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>Your rights</h5>
        <p className="mb-2"><strong>Information about the processing of your personal data</strong></p>
        <ul className="list-unstyled">
          <li className="mb-3"><strong>Obtain access to the personal data held about you</strong> Under Article 15 of the GDPR, individuals have a right of access that gives them the right to obtain a copy of their personal data, as well as other supplementary information. It helps individuals to understand how and why companies are using their data, and check the lawfulness of the processing.</li>
          <li className="mb-3"><strong>Ask for incorrect, inaccurate, or incomplete personal data to be corrected</strong> Under Article 16 of the GDPR, individuals have the right to have inaccurate personal data rectified. An individual may also be able to have incomplete personal data completed – although this will depend on the purposes for the processing.</li>
          <li className="mb-3"><strong>Request that personal data be erased when they are no longer needed or if the processing is unlawful</strong> Under Article 17 of the GDPR, individuals have the right to have personal data erased. This is also known as the 'right to be forgotten'. The right is not absolute and only applies in certain circumstances.</li>
          <li className="mb-3"><strong>Request the restriction of the processing of your personal data in specific cases</strong> Article 18 of the GDPR gives individuals the right to restrict the processing of their personal data in certain circumstances. This means that an individual can limit the way that an organization uses its data. This is an alternative to requesting the erasure of their data.</li>
          <li className="mb-3"><strong>Receive your personal data in a machine-readable format and send them to another controller ('data portability')</strong> Under Article 20 of the GDPR, individuals have the right to data portability that gives individuals the right to receive personal data they have provided to a controller in a structured, commonly used, and machine-readable format. It also gives them the right to request that a controller transmits those data directly to another controller.</li>
          <li className="mb-3"><strong>Object to the processing of your personal data for marketing purposes or on grounds relating to your particular situation</strong> Article 21 of the GDPR gives individuals the right to object to the processing of their personal data at any time. This effectively allows individuals to stop or prevent you from processing their personal data.</li>
          <li className="mb-3"><strong>Withdraw your consent at any time</strong> The GDPR gives a specific right to withdraw consent. You need to tell people about their right to withdraw and offer them easy ways to withdraw consent at any time.</li>
          <li className="mb-3"><strong>Lodge a complaint with a supervisory authority</strong> In accordance with Article 77 of the GDPR, you, as a data subject, have the right to lodge a complaint with a supervisory authority, in particular in the Member State of your habitual residence, place of work, or where an alleged infringement of the GDPR has taken place.</li>
        </ul>

        <h5 className="fw-bold mt-5 mb-3" style={{color: 'var(--accent)'}}>Our contacts</h5>
        <p className="mb-0"><strong>Santhome Holdings BVI (www.santhomecard.com)</strong></p>
        <p className="mb-0"><a href="mailto:help@santhomecard.com" style={{color: 'var(--accent)', textDecoration: 'none'}}>help@santhomecard.com</a></p>
        <p className="mb-0"><strong>Address:</strong> SANTHOME HOLDINGS LIMITED, MILL MALL, SUITE 6, WICKHAMS CAY 1, POBOX-3085, ROAD TOWN, TORTOLA, BVI, TORTOLA</p>

      </div>

      <div className="mt-4 pt-3 border-top d-flex justify-content-center" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
        <button onClick={onBack} className="btn w-50 py-3 fw-bold text-uppercase text-white"
          style={{ background: 'var(--accent)', border: 'none', borderRadius: '6px', letterSpacing: '1px' }}>
          Back to Profile
        </button>
      </div>

    </div>
  );
};

export default PrivacyNoticeView;