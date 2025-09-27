import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Heart, 
  Zap, 
  Flame,
  Phone, 
  Clock, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import heroImage from '@/assets/hero-emergency.jpg';
import medicalImage from '@/assets/medical-hero.jpg';
import policeImage from '@/assets/police-hero.jpg';
import electricityImage from '@/assets/electricity-hero.jpg';
import fireImage from '@/assets/fire-hero.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: 'Instant Response',
      description: 'Get connected to emergency responders within seconds of reporting your situation.',
    },
    {
      icon: Users,
      title: 'Expert Agents',
      description: 'Specialized AI agents trained to handle medical, police, fire, and utility emergencies.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your emergency reports are handled with the highest security and reliability standards.',
    },
  ];

  const agents = [
    {
      icon: Heart,
      title: 'Medical Emergency',
      description: 'Immediate assistance for health emergencies, injuries, and medical situations.',
      image: medicalImage,
      gradient: 'bg-gradient-medical',
      color: 'text-medical-primary',
    },
    {
      icon: Shield,
      title: 'Police Emergency',
      description: 'Quick response for crimes, security threats, and law enforcement needs.',
      image: policeImage,
      gradient: 'bg-gradient-police',
      color: 'text-police-primary',
    },
    {
      icon: Zap,
      title: 'Electricity Issues',
      description: 'Expert help for power outages, electrical hazards, and utility problems.',
      image: electricityImage,
      gradient: 'bg-gradient-electricity',
      color: 'text-electricity-primary',
    },
    {
      icon: Flame,
      title: 'Fire Emergency',
      description: 'Immediate response for fire emergencies, building evacuations, and fire safety.',
      image: fireImage,
      gradient: 'bg-gradient-fire',
      color: 'text-fire-primary',
    },
  ];

  const benefits = [
    'No registration required - instant access',
    'AI-powered emergency classification',
    'Direct connection to frontline responders',
    'Available 24/7 for all emergency types',
    'Secure and confidential reporting',
    'Multi-language support available',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-emergency rounded-lg flex items-center justify-center">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">EmergencyLink</span>
            </div>
            <Button
              onClick={() => navigate('/frontdesk')}
              variant="emergency"
              className="animate-pulse-emergency"
            >
              Emergency Help
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Fast, Clear, Reliable
                <span className="text-transparent bg-clip-text bg-gradient-emergency"> Emergency Help</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connecting Citizens with Frontline Responders through intelligent AI-powered emergency support system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/frontdesk')}
                  variant="hero"
                  size="lg"
                  className="animate-slide-up"
                >
                  Get Emergency Help Now
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <img
                src={heroImage}
                alt="Emergency responders helping citizens"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-support">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose EmergencyLink?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our advanced AI system ensures you get the right help, from the right responder, at the right time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Agents Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Specialized Emergency Agents
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI agents are specifically trained to handle different types of emergencies with precision and care.
            </p>
          </div>
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {agents.map((agent, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`h-48 ${agent.gradient} relative overflow-hidden`}>
                  <img
                    src={agent.image}
                    alt={agent.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4">
                    <agent.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className={`text-xl font-semibold mb-3 ${agent.color}`}>
                    {agent.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {agent.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-support">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-8">
                Everything You Need in an Emergency
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-emergency rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Ready to Get Help?</h3>
                <p className="text-white/90 mb-6 leading-relaxed">
                  Don't wait in an emergency. Our FrontDesk Agent will quickly assess your situation 
                  and connect you with the right specialist in seconds.
                </p>
                <Button
                  onClick={() => navigate('/frontdesk')}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Start Emergency Chat
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Emergency? Don't Wait.
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get immediate assistance from our emergency support system. Every second counts.
          </p>
          <Button
            onClick={() => navigate('/frontdesk')}
            variant="secondary"
            size="lg"
            className="animate-pulse-emergency"
          >
            Get Help Now
            <Phone className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emergency rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EmergencyLink</span>
            </div>
            <p className="text-primary-foreground/80 mb-4">
              Fast, Clear, Reliable Emergency Help – Connecting Citizens with Frontline Responders.
            </p>
            <p className="text-sm text-primary-foreground/60">
              Available 24/7 for all emergency situations. Your safety is our priority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;