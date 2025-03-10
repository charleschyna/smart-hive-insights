
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Smart Beekeeping for the Modern Apiarist
                </h1>
                <p className="text-xl text-gray-700 mb-8">
                  Monitor your beehives in real-time. Get insights on hive health, colony activity, and honey production with Smart Nyuki.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {user ? (
                    <Button
                      asChild
                      className="bg-honey-500 hover:bg-honey-600 text-black font-medium h-12 px-8"
                    >
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button
                        asChild
                        className="bg-honey-500 hover:bg-honey-600 text-black font-medium h-12 px-8"
                      >
                        <Link to="/signup">Get Started</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-honey-500 text-honey-500 hover:bg-honey-50 font-medium h-12 px-8"
                      >
                        <Link to="/login">Log In</Link>
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <motion.img
                src="/placeholder.svg"
                alt="Smart beehive monitoring"
                className="w-full h-auto rounded-lg shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-amber-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Beekeepers Choose Smart Nyuki</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our intelligent monitoring system provides everything you need to maintain healthy and productive hives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Smart Nyuki Works</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our system is designed to be simple to set up and use, providing valuable insights with minimal effort.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-honey-500">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-black mb-6">
              Ready to revolutionize your beekeeping?
            </h2>
            <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
              Join thousands of beekeepers who are using Smart Nyuki to monitor and improve their apiaries.
            </p>
            {user ? (
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white font-medium h-12 px-8"
              >
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white font-medium h-12 px-8"
              >
                <Link to="/signup">Get Started Today</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Smart Nyuki</h3>
              <p className="text-gray-400">
                Intelligent beehive monitoring for modern beekeepers.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© {new Date().getFullYear()} Smart Nyuki. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

const FeatureCard = ({ title, description, icon, index }: FeatureProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="bg-white p-6 rounded-lg shadow-md"
  >
    <div className="w-14 h-14 bg-honey-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-honey-500 text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

interface StepProps {
  title: string;
  description: string;
  number: number;
  index: number;
}

const StepCard = ({ title, description, number, index }: StepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="text-center"
  >
    <div className="w-16 h-16 bg-honey-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-black text-2xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </motion.div>
);

const features = [
  {
    title: "Real-time Monitoring",
    description: "Get instant updates on temperature, humidity, weight, and activity of your hives.",
    icon: "📊"
  },
  {
    title: "Health Alerts",
    description: "Receive notifications when your hive parameters indicate potential issues.",
    icon: "🔔"
  },
  {
    title: "Data Analytics",
    description: "Review historical data to optimize your beekeeping practices.",
    icon: "📈"
  }
];

const steps = [
  {
    title: "Install Sensors",
    description: "Place our smart sensors in your hives.",
    number: 1
  },
  {
    title: "Connect",
    description: "Link sensors to your Smart Nyuki account.",
    number: 2
  },
  {
    title: "Monitor",
    description: "View real-time data on your dashboard.",
    number: 3
  },
  {
    title: "Optimize",
    description: "Use insights to improve hive management.",
    number: 4
  }
];

export default Index;
