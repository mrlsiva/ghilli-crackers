import React, { useEffect, useState } from 'react';
import { getFaqs } from '../services/api';
import './FaqSection.css';

const FaqSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getFaqs()
      .then((res) => {
        if (!cancelled && res?.success && res.data) setFaqs(res.data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="faq-section">
      <div className="faq-header">
        <span className="faq-tag">Questions, Answered</span>
        <h2 className="faq-title">Frequently <span>asked</span> questions</h2>
        <p className="faq-subtitle">Find answers to the most common questions about Ghilli Crackers.</p>
      </div>

      <div className="faq-body">
        <div className="faq-image-wrap">
          <img src="/images/faq.png" alt="" className="faq-image" />
        </div>

        <div className="faq-list">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div className={`faq-item ${isOpen ? 'faq-item-open' : ''}`} key={idx}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle-icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
