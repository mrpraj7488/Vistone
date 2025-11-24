import { useState, useEffect, useRef } from 'react';
import { Check, Star, Zap, Crown, Rocket, ArrowRight } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small teams getting started',
    price: { monthly: 29, yearly: 290 },
    originalPrice: { monthly: 39, yearly: 390 },
    icon: Rocket,
    color: 'from-blue-500 to-indigo-600',
    popular: false,
    features: [
      'Up to 5 team members',
      '10GB storage space',
      'Basic analytics',
      'Email support',
      'Standard integrations',
      'Mobile app access',
      'Basic templates'
    ]
  },
  {
    name: 'Professional',
    description: 'Ideal for growing businesses and professional teams',
    price: { monthly: 79, yearly: 790 },
    originalPrice: { monthly: 99, yearly: 990 },
    icon: Star,
    color: 'from-purple-500 to-pink-600',
    popular: true,
    features: [
      'Up to 25 team members',
      '100GB storage space',
      'Advanced analytics & reports',
      'Priority email & chat support',
      'Premium integrations',
      'Mobile & desktop apps',
      'Custom templates',
      'API access',
      'Advanced security features'
    ]
  },
  {
    name: 'Enterprise',
    description: 'Complete solution for large organizations',
    price: { monthly: 199, yearly: 1990 },
    originalPrice: { monthly: 249, yearly: 2490 },
    icon: Crown,
    color: 'from-orange-500 to-red-600',
    popular: false,
    features: [
      'Unlimited team members',
      'Unlimited storage',
      'Custom analytics & dashboards',
      'Dedicated account manager',
      'All integrations included',
      'White-label solution',
      'Custom development',
      'Enterprise security',
      'SLA guarantee',
      'On-premise deployment option'
    ]
  }
];

const features = [
  '99.9% Uptime SLA',
  'Advanced Security',
  'Priority Support',
  'Custom Integrations',
  'Analytics Dashboard',
  'Team Collaboration',
  'Mobile Apps',
  'API Access'
];

export default function Pricing({ darkMode }) {
  const [animate, setAnimate] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const calculateSavings = (plan) => {
    const monthlyCost = plan.price.monthly * 12;
    const yearlyCost = plan.price.yearly;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { savings, percentage };
  };

  return (
    <section 
      ref={sectionRef}
      className={`section-padding relative overflow-hidden ${
        darkMode ? 'bg-slate-900' : 'bg-gray-50'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/3 -left-64 w-128 h-128 rounded-full blur-3xl opacity-10 ${
          darkMode ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-400 to-pink-400'
        }`} />
        <div className={`absolute bottom-1/3 -right-64 w-96 h-96 rounded-full blur-3xl opacity-10 ${
          darkMode ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-blue-400 to-cyan-400'
        }`} />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-500/10 text-green-600'
          }`}>
            <Zap className="w-4 h-4" />
            <span className="text-sm font-semibold">Pricing Plans</span>
          </div>
          
          <h2 className={`heading-lg mb-6 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Simple, <span className="text-gradient">Transparent</span> Pricing
            <br />For Every Business
          </h2>
          
          <p className={`body-lg max-w-3xl mx-auto mb-8 ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Choose the perfect plan for your business needs. All plans include 
            our core features with no hidden fees or setup costs.
          </p>

          {/* Billing Toggle */}
          <div className={`inline-flex items-center p-2 rounded-2xl ${
            darkMode ? 'glass-dark' : 'glass-light'
          }`}>
            <button 
              onClick={() => setIsYearly(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isYearly 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' 
                  : darkMode 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsYearly(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                isYearly 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg' 
                  : darkMode 
                    ? 'text-slate-300 hover:text-white' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, idx) => {
            const Icon = plan.icon;
            const savings = calculateSavings(plan);
            const currentPrice = isYearly ? plan.price.yearly : plan.price.monthly;
            const originalPrice = isYearly ? plan.originalPrice.yearly : plan.originalPrice.monthly;
            
            return (
              <div
                key={idx}
                className={`relative p-8 rounded-3xl transition-all duration-500 cursor-pointer ${
                  plan.popular 
                    ? 'scale-105 lg:scale-110 ring-2 ring-primary-500/50' 
                    : 'hover:scale-105'
                } ${
                  darkMode ? 'glass-dark' : 'glass-light'
                } ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${idx * 0.2}s`
                }}
                onMouseEnter={() => setHoveredPlan(idx)}
                onMouseLeave={() => setHoveredPlan(null)}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {plan.name}
                  </h3>
                  
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className={`text-4xl lg:text-5xl font-black ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      ${currentPrice}
                    </span>
                    <span className={`text-lg ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  {/* Original Price & Savings */}
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className={`line-through ${
                      darkMode ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      ${originalPrice}
                    </span>
                    {isYearly && (
                      <span className="text-green-500 font-semibold">
                        Save ${savings.savings}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIdx) => (
                    <div key={featureIdx} className="flex items-center gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-xl hover:shadow-2xl'
                    : darkMode
                      ? 'glass-dark border border-slate-600 text-white hover:border-primary-500'
                      : 'glass-light border border-slate-200 text-slate-900 hover:border-primary-500'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className={`transition-all duration-1000 delay-700 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="text-center mb-12">
            <h3 className={`text-2xl lg:text-3xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              All Plans Include
            </h3>
            <p className={`text-lg ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Core features available in every subscription
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className={`text-center p-4 rounded-2xl transition-all duration-300 hover:-translate-y-2 ${
                darkMode ? 'glass-dark' : 'glass-light'
              }`}>
                <Check className={`w-8 h-8 mx-auto mb-3 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`font-medium ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-900 ${
          animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className={`inline-block p-6 rounded-2xl ${
            darkMode ? 'glass-dark' : 'glass-light'
          }`}>
            <p className={`text-lg mb-4 ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Still have questions? We're here to help!
            </p>
            <button className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? 'border border-slate-600 text-white hover:border-primary-500'
                : 'border border-slate-200 text-slate-900 hover:border-primary-500'
            }`}>
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
