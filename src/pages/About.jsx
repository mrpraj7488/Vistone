import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users, Target, Zap, Shield, Globe, Award,
  ArrowRight, Rocket, Heart, Coffee, Code,
  Briefcase, Linkedin, Twitter, Github
} from 'lucide-react';

export default function About({ darkMode }) {
  const stats = [
    { value: '10+', label: 'Years Experience', icon: ClockIcon },
    { value: '9k+', label: 'Happy Customers', icon: Users },
    { value: '30+', label: 'Premium Products', icon: PackageIcon },
    { value: '80+', label: 'Countries Served', icon: Globe },
  ];

  const values = [
    {
      icon: Rocket,
      title: 'Innovation First',
      description: 'We constantly push the boundaries of what is possible, leveraging cutting-edge technology to solve complex problems.'
    },
    {
      icon: Shield,
      title: 'Uncompromising Quality',
      description: 'Excellence is not an act, but a habit. We ensure every line of code and pixel meets our rigorous standards.'
    },
    {
      icon: Heart,
      title: 'Customer Obsession',
      description: 'Your success is our success. We provide 24/7 dedicated support to ensure you get the most out of our tools.'
    },
    {
      icon: Target,
      title: 'Result Driven',
      description: 'We focus on delivering measurable business outcomes. Our tools are designed to boost efficiency and ROI.'
    },
  ];

  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in SaaS.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      bio: 'Tech enthusiast passionate about scalable architecture.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      bio: 'Full-stack wizard who loves clean code.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
    {
      name: 'Emily Davis',
      role: 'Product Manager',
      bio: 'User-centric strategist focused on great UX.',
      social: { twitter: '#', linkedin: '#', github: '#' }
    },
  ];

  // Helper components for icons to avoid reference errors if not imported directly
  function ClockIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg> }
  function PackageIcon(props) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16.5 9.4-9-5.19" /><path d="m21 16-9 5.19-9-5.19" /><path d="m3 11.1 9 5.19 9-5.19" /><line x1="12" y1="5.99" x2="12" y2="16.39" /><path d="M21 7.5V16c0 .55-.45 1-1 1h-1.1" /><path d="M5.1 7.5H4c-.55 0-1 .45-1 1v8.5" /></svg> }

  return (
    <div className={`min-h-screen pt-20 overflow-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-6">
        <div className={`absolute inset-0 opacity-30 ${darkMode ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-slate-950' : 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-slate-50'}`} />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
              Since 2015
            </span>
            <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Empowering the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                Digital Future
              </span>
            </h1>
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              We build premium SaaS tools that help thousands of businesses worldwide scale, innovate, and succeed in the modern digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-12 border-y ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  <stat.icon size={24} />
                </div>
                <div className={`text-3xl md:text-4xl font-black mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className={`text-3xl md:text-4xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Our Story
              </h2>
              <div className={`space-y-6 text-lg leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                <p>
                  Founded in 2015, Vistone started with a simple yet ambitious mission: to democratize access to powerful, enterprise-grade software tools for businesses of all sizes.
                </p>
                <p>
                  What began in a small garage with a team of three passionate developers has blossomed into a global technology partner serving over 9,000 customers across 80+ countries. We've weathered challenges, celebrated milestones, and constantly evolved.
                </p>
                <p>
                  Today, we stand at the forefront of the SaaS revolution, driven by the same core belief we started with: that technology should be an enabler, not a barrier, to success.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-6">
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Target className="w-8 h-8 text-blue-500 mb-4" />
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Mission</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>To empower businesses with innovative software solutions that drive growth.</p>
                </div>
                <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Zap className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Vision</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>To become the world's leading provider of transformative SaaS solutions.</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className={`aspect-square rounded-3xl overflow-hidden relative z-10 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                {/* Abstract visual representation instead of a stock photo */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-90" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8 w-full h-full opacity-20">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="bg-white rounded-2xl" />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                  <Award size={64} className="mb-6" />
                  <h3 className="text-3xl font-bold mb-2">Award Winning</h3>
                  <p className="text-white/80">Recognized for excellence in software design and customer satisfaction.</p>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500 rounded-full blur-3xl opacity-20" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-24 px-6 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Our Core Values
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              These principles guide every decision we make and every product we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${darkMode
                    ? 'bg-slate-800 hover:bg-slate-750 border border-slate-700'
                    : 'bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'
                  }`}
              >
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                  }`}>
                  <value.icon size={28} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {value.title}
                </h3>
                <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Meet The Team
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              The passionate individuals behind Vistone's success.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`group relative rounded-3xl overflow-hidden ${darkMode ? 'bg-slate-900' : 'bg-white shadow-lg'}`}
              >
                <div className={`aspect-[4/5] relative overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  {/* Abstract Avatar Placeholder */}
                  <div className={`absolute inset-0 flex items-center justify-center text-6xl font-black opacity-10 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-blue-400 font-medium text-sm mb-3">{member.role}</p>
                    <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {member.bio}
                    </p>
                    <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                      <a href={member.social.twitter} className="text-white/70 hover:text-white transition-colors"><Twitter size={18} /></a>
                      <a href={member.social.linkedin} className="text-white/70 hover:text-white transition-colors"><Linkedin size={18} /></a>
                      <a href={member.social.github} className="text-white/70 hover:text-white transition-colors"><Github size={18} /></a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={`relative rounded-[2.5rem] overflow-hidden p-12 md:p-20 text-center ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-600 to-indigo-600'}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                Ready to transform your business?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Join thousands of satisfied customers who are already using Vistone to scale their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-xl font-bold bg-white text-blue-600 hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 flex items-center justify-center gap-2"
                >
                  Explore Products <ArrowRight size={20} />
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-xl font-bold border-2 border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
