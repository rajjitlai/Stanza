import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { RiQuillPenLine, RiGroupLine, RiCompass3Line, RiHeartFill } from "react-icons/ri"
import PageAnimation from "../common/PageAnimation"

const LandingPage = () => {
    return (
        <PageAnimation>
            <div className="pt-20 pb-32 overflow-hidden">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 text-center relative">
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-accent/5 blur-[120px] rounded-full -z-10" />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-glass border border-glass-border text-accent text-sm font-medium tracking-wide">
                            <RiQuillPenLine />
                            <span>Unleash your inner poet</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-text-primary leading-tight max-w-4xl mx-auto">
                            Where every verse finds <br />
                            <span className="text-accent italic">its eternal rhythm.</span>
                        </h1>
                        
                        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-serif italic leading-relaxed">
                            Join a global community of writers and dreamers. Share your stanzas, 
                            discover new perspectives, and keep the art of poetry alive.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-8">
                            <Link to="/signup" className="btn-primary w-full sm:w-auto !py-4 !px-10 text-lg shadow-2xl justify-center">
                                Start Your Journey
                            </Link>
                            <Link to="/feed" className="btn-secondary w-full sm:w-auto !py-4 !px-10 text-lg justify-center">
                                Explore Feed
                            </Link>
                        </div>
                    </motion.div>

                    {/* Floating Decorative Elements */}
                    <motion.div 
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-10 right-[10%] hidden lg:block glass-card p-4 rotate-12"
                    >
                        <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                            <RiHeartFill size={24} />
                        </div>
                    </motion.div>
                    
                    <motion.div 
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-10 left-[10%] hidden lg:block glass-card p-4 -rotate-12"
                    >
                        <div className="w-12 h-12 bg-glass-border rounded-lg flex items-center justify-center text-text-secondary">
                            <RiQuillPenLine size={24} />
                        </div>
                    </motion.div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto px-4 mt-40">
                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                                <RiCompass3Line size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-text-primary">Discover</h3>
                            <p className="text-text-secondary">Explore thousands of poems across various themes, from nature to reflection.</p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                                <RiQuillPenLine size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-text-primary">Create</h3>
                            <p className="text-text-secondary">A minimal, distraction-free workshop to draft and publish your creative stanzas.</p>
                        </motion.div>

                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="glass-card p-10 text-center space-y-4"
                        >
                            <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mx-auto mb-6">
                                <RiGroupLine size={32} />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-text-primary">Connect</h3>
                            <p className="text-text-secondary">Engage with other poets through reflections, likes, and follows.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="max-w-5xl mx-auto px-4 mt-40">
                    <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] rounded-full" />
                        <div className="relative z-10 space-y-8">
                            <h2 className="text-4xl md:text-5xl font-serif font-bold text-text-primary leading-tight">
                                Ready to share your first <br /> <span className="text-accent italic">masterpiece?</span>
                            </h2>
                            <p className="text-lg text-text-secondary max-w-xl mx-auto italic">
                                "A poet is a nightingale, who sits in darkness and sings to cheer its own solitude with sweet sounds."
                            </p>
                            <Link to="/signup" className="btn-primary !py-4 !px-12 inline-flex">
                                Create Your Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </PageAnimation>
    )
}

export default LandingPage
