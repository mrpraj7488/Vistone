import { useState } from 'react';
import { Container } from '../layout/Container';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Send } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export default function Newsletter({ darkMode }) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
    }, 3000);
  };

  return (
    <section className={`section-padding ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <Container>
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Section Header - Premium mobile optimized */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 md:mb-12">
            <div 
              className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                darkMode ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-100 text-primary-700'
              }`}
              style={{
                fontSize: 'clamp(0.75rem, 1.25vw + 0.25rem, 0.875rem)', // 12px - 14px
              }}
            >
              <Mail size={14} className="sm:w-4 sm:h-4" />
              <span className="font-medium">Stay Updated</span>
            </div>

            <h2 
              className={`font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
              style={{
                fontSize: 'clamp(1.75rem, 4vw + 0.5rem, 2.75rem)', // 28px - 44px
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
              }}
            >
              Connect with Us for the <span className="text-primary-600">Latest Updates</span>
            </h2>
            <p 
              className={`max-w-2xl mx-auto ${
                darkMode ? 'text-slate-300' : 'text-slate-600'
              }`}
              style={{
                fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)', // 14px - 18px
                lineHeight: '1.6',
              }}
            >
              Subscribe to our newsletter and be the first to know about new products, features, and exclusive offers.
            </p>
          </div>

          {/* Newsletter Form - Premium mobile optimized */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} transition-all duration-300`}
                style={{
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                  padding: 'clamp(0.75rem, 1.5vw + 0.5rem, 1rem)', // 12px - 16px
                }}
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} transition-all duration-300`}
                style={{
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                  padding: 'clamp(0.75rem, 1.5vw + 0.5rem, 1rem)', // 12px - 16px
                }}
              />
            </div>

            <Button 
              type="submit"
              variant="primary" 
              size="lg"
              leftIcon={<Send size={20} />}
              className={`w-full sm:w-auto font-semibold ${
                !darkMode 
                  ? '!bg-primary-600 !hover:bg-primary-700 !text-white !shadow-lg hover:!shadow-xl focus:!ring-primary-500'
                  : ''
              }`}
              style={!darkMode ? {
                background: '#2563eb',
                color: '#ffffff',
                fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              } : {
                fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)',
              }}
              disabled={submitted}
            >
              {submitted ? 'Subscribed!' : 'Subscribe'}
            </Button>

            {submitted && (
              <p 
                className={`mt-3 sm:mt-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}
                style={{
                  fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1rem)', // 14px - 16px
                }}
              >
                Thank you for subscribing! Check your email for confirmation.
              </p>
            )}
          </form>
        </div>
      </Container>
    </section>
  );
}

