'use client';
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import React from 'react';

// --- 1. DATA STRUCTURES ---
interface Plan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: { text: string; included: boolean; }[];
    isFeatured: boolean;
    durationWeeks: number;
}

interface BreakdownItem {
    item: string;
    description: string;
    amount: number;
}

interface TimelineItem {
    week: number;
    description: string;
}

// --- 2. STATIC DATA ---
const PLANS: Plan[] = [
    {
        id: 'foundation',
        name: 'Foundation',
        price: 5500000,
        description: 'Core digital presence focusing on the public film catalog and basic content management.',
        durationWeeks: 6,
        features: [
            { text: 'Public Film Catalog', included: true },
            { text: 'Basic Admin CMS', included: true },
            { text: 'Standard Search (MongoDB)', included: true },
            { text: 'PAU Branding Integration', included: true },
            { text: 'Mobile Responsive Design', included: true },
            { text: 'User Portal/Accounts', included: false },
            { text: 'Booking System', included: false },
            { text: 'Advanced Analytics', included: false },
        ],
        isFeatured: false,
    },
    {
        id: 'growth',
        name: 'Growth',
        price: 8000000,
        description: 'The complete solution including research tools, user accounts, and facility management.',
        durationWeeks: 4,
        isFeatured: true,
        features: [
            { text: 'All Foundation Features', included: true },
            { text: 'User Portal (Students/Faculty)', included: true },
            { text: 'Screening Room Booking System', included: true },
            { text: 'News & Events Blog', included: true },
            { text: 'Advanced ElasticSearch', included: true },
            { text: 'Research Document Archive', included: true },
            { text: 'Training (2 Sessions)', included: true },
            { text: 'Video Streaming', included: false },
        ],
    },
    {
        id: 'premier',
        name: 'Premier',
        price: 13500000,
        description: 'Enterprise-grade implementation with secure streaming capabilities and multi-lingual support.',
        durationWeeks: 4,
        isFeatured: false,
        features: [
            { text: 'All Growth Features', included: true },
            { text: 'Secure Video Streaming', included: true },
            { text: 'Multi-lingual (En/Yo/Ig/Ha)', included: true },
            { text: 'Advanced Analytics Dashboard', included: true },
            { text: 'Public Research API', included: true },
            { text: 'Priority 24/7 Support', included: true },
            { text: 'Extended 6-Month Maintenance', included: true },
            { text: 'Dedicated Account Manager', included: true },
        ],
    },
];

const BREAKDOWN: BreakdownItem[] = [
    { item: 'Discovery & Design', description: 'Requirements analysis, wireframes, UI/UX design, PAU branding', amount: 1000000 },
    { item: 'Frontend Development', description: 'React/Next.js, responsive layouts, catalog interface, user portal', amount: 2400000 },
    { item: 'Backend Development', description: 'API development, database design, authentication, search system', amount: 2000000 },
    { item: 'Admin Dashboard', description: 'Content management system, user administration, analytics', amount: 1200000 },
    { item: 'Features Integration', description: 'Booking system, news/blog module, advanced search', amount: 800000 },
    { item: 'Testing & QA', description: 'Quality assurance, bug fixes, performance optimization', amount: 400000 },
    { item: 'Deployment & Training', description: 'Server setup, staff training, documentation, handover', amount: 200000 },
];

const TIMELINE: TimelineItem[] = [
    { week: 1, description: 'Requirements gathering, design mockups, database architecture, PAU brand integration' },
    { week: 2, description: 'Frontend development: UI components, public pages, catalog interface, responsive design' },
    { week: 3, description: 'Backend development: API, database, authentication, admin dashboard, search integration' },
    { week: 4, description: 'Testing, content migration, staff training, deployment, final review' },
];

const CORE_FEATURES: string[] = [
    'Public Film Catalog: Browse Nollywood films with advanced search by year, director, producer, genre, language',
    'Digital Archive: Organized collections of films, documents, posters, and research materials',
    'Academic Resources: Research papers, publications, syllabi, and educational content',
    'User Portal: Student and faculty accounts for course materials and borrowing requests',
    'Admin Dashboard: Comprehensive CMS for content management, metadata editing, user administration',
    'Screening Room Booking: Calendar system for facility reservations',
    'News & Events: Blog system for centre updates, conferences, screenings',
    'Responsive Design: Mobile-optimized with PAU branding and blue color scheme',
    'Advanced Search: Full-text search across all content with filters and tags',
];

// --- 3. UTILITY FUNCTIONS ---
const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
};

const totalAmount = BREAKDOWN.reduce((sum, item) => sum + item.amount, 0);
const recommendedPlan = PLANS.find(p => p.isFeatured) || PLANS[0];

// --- 4. REACT COMPONENT ---
const App: React.FC = () => {
    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Nollywood Studies Centre Web Application',
                    text: 'Check out this project proposal!',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            alert('Sharing is not supported in your browser. You can copy the URL manually.');
        }
    };

    return (
        <>
            <Header />
            <div className="bg-gray-100 min-h-screen py-4 sm:py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-800 text-white p-6 sm:p-10">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div className="flex-grow">
                                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Nollywood Studies Centre Web Application</h1>
                                <p className="text-base sm:text-lg opacity-90">Project Proposal & Cost Estimate</p>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                                <button
                                    onClick={handleShare}
                                    className="bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
                                >
                                    Share
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="bg-white text-blue-800 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 text-sm sm:text-base"
                                >
                                    Print
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Meta Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-6 sm:p-10 bg-gray-50 border-b-2 border-gray-200">
                        <div>
                            <h3 className="text-xs uppercase text-gray-500 mb-2 tracking-wider font-semibold">Proposal Date</h3>
                            <p className="text-gray-700">December 10, 2025</p>
                            <h3 className="text-xs uppercase text-gray-500 mt-5 mb-2 tracking-wider font-semibold">Project Duration (Recommended Plan)</h3>
                            <p className="text-gray-700">4 Weeks (January 1 - January 31, 2026)</p>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase text-gray-500 mb-2 tracking-wider font-semibold">Client</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Nollywood Studies Centre<br />
                                School of Media and Communication<br />
                                Pan-Atlantic University
                            </p>
                        </div>
                    </div>

                    {/* Branding & Investment Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 p-6 sm:p-10 bg-blue-50 border-l-4 border-blue-800">
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800 mb-4">From</h3>
                            <p className="text-gray-600 leading-relaxed">
                                <strong>VisualHQ</strong><br />
                                Digital Solutions & Web Development<br />
                                Lagos, Nigeria
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-blue-800 mb-4">Recommended Investment (Growth Plan)</h3>
                            <p className="text-3xl sm:text-4xl font-bold text-blue-800 mb-1">{formatCurrency(recommendedPlan.price)}</p>
                            <p className="text-sm text-gray-500">Accelerated {recommendedPlan.durationWeeks}-week delivery</p>
                        </div>
                    </div>

                    <div className="p-6 sm:p-10">
                        {/* Project Overview */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Project Overview</h2>
                            <p className="text-gray-700 leading-loose text-sm sm:text-base">Development of a modern, comprehensive web application for the Nollywood Studies Centre at Pan-Atlantic University. The platform will showcase Nigeria's film heritage, provide academic resources, facilitate research access, and serve as a digital hub for Nollywood studies and archival materials.</p>
                        </div>

                        {/* Core Features */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Core Features (Growth Plan)</h2>
                            <ul className="list-none space-y-3">
                                {CORE_FEATURES.map((feature, index) => (
                                    <li key={index} className="flex items-start text-gray-700 text-sm sm:text-base">
                                        <svg className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Investment Options (Pricing Cards) */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-6 sm:mb-8 pb-2 border-b-2 border-blue-800">Investment Options</h2>
                            <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base">To provide flexibility in meeting the Centre's needs and budget, we have structured three distinct engagement packages.</p>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                                {PLANS.map(plan => (
                                    <div
                                        key={plan.id}
                                        className={`relative p-6 sm:p-8 rounded-xl shadow-lg flex flex-col transition-all duration-300 ${
                                            plan.isFeatured
                                                ? 'border-2 border-blue-800 bg-white lg:scale-[1.03] shadow-xl ring-4 ring-blue-100'
                                                : 'border border-gray-200 bg-gray-50 hover:shadow-md'
                                        }`}
                                    >
                                        {plan.isFeatured && (
                                            <span className="absolute top-[-15px] left-1/2 -translate-x-1/2 bg-blue-800 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                                                Recommended
                                            </span>
                                        )}
                                        <div className="mb-6">
                                            <h3 className={`text-xl sm:text-2xl font-bold ${plan.isFeatured ? 'text-blue-800' : 'text-gray-900'}`}>{plan.name}</h3>
                                            <div className="text-3xl sm:text-4xl font-extrabold text-blue-800 mt-2">
                                                {formatCurrency(plan.price)}
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">~{plan.durationWeeks} Weeks Delivery</p>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-6 flex-grow">{plan.description}</p>

                                        <ul className="space-y-3 list-none p-0">
                                            {plan.features.map((feature, idx) => (
                                                <li
                                                    key={idx}
                                                    className={`flex items-start text-sm ${
                                                        feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                                                    }`}
                                                >
                                                    <span className={`w-5 h-5 mr-2 flex-shrink-0 ${feature.included ? 'text-blue-600' : 'text-gray-400'}`}>
                                                        {feature.included ? '✓' : '✕'}
                                                    </span>
                                                    {feature.text}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detailed Breakdown */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Detailed Breakdown (Growth Plan)</h2>
                            <p className="text-gray-700 mb-6 text-sm sm:text-base">The following details the costs associated with the **Growth Plan** (Recommended) investment.</p>

                            <div className="overflow-x-auto -mx-6 sm:mx-0">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-blue-800">
                                        <tr>
                                            <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white">Item</th>
                                            <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white hidden md:table-cell">Description</th>
                                            <th scope="col" className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-white">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {BREAKDOWN.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">{item.item}</td>
                                                <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 hidden md:table-cell">{item.description}</td>
                                                <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-semibold text-right">{formatCurrency(item.amount)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-blue-800 text-white">
                                            <td colSpan={2} className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-bold">TOTAL PROJECT INVESTMENT</td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-lg font-bold text-right">{formatCurrency(totalAmount)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Technology Stack */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Technology Stack</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                                {[
                                    { title: 'Frontend', desc: 'React.js, Next.js, Tailwind CSS' },
                                    { title: 'Backend', desc: 'Node.js, Express, MongoDB' },
                                    { title: 'Search', desc: 'Elasticsearch' },
                                    { title: 'Hosting', desc: 'Vercel + MongoDB Atlas' },
                                    { title: 'Authentication', desc: 'NextAuth.js with OAuth' },
                                    { title: 'Storage', desc: 'Cloudinary for media assets' },
                                ].map((tech, index) => (
                                    <div key={index} className="bg-gray-50 p-4 border-l-4 border-blue-600 rounded-md">
                                        <strong className="block text-blue-800 font-semibold mb-1 text-sm sm:text-base">{tech.title}</strong>
                                        <span className="text-gray-600 text-xs sm:text-sm">{tech.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Project Timeline */}
                        <div className="mb-8 sm:mb-12">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Project Timeline - January 2026 (4 Weeks)</h2>
                            <div className="space-y-4">
                                {TIMELINE.map((item, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row border-l-4 border-blue-800 bg-gray-50 p-4 rounded-r-lg shadow-sm">
                                        <div className="flex-shrink-0 sm:w-24 font-bold text-blue-800 mb-2 sm:mb-0 text-sm sm:text-base">Week {item.week}</div>
                                        <div className="text-gray-700 flex-grow text-sm sm:text-base">{item.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why VisualHQ? */}
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-4 pb-2 border-b-2 border-blue-800">Why VisualHQ?</h2>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                                <li>Specialized experience in educational and cultural institution web platforms</li>
                                <li>Proven track record delivering projects on time and within budget</li>
                                <li>Local team with understanding of Nigerian academic landscape</li>
                                <li>Modern technology stack ensuring scalability and performance</li>
                                <li>Comprehensive training and ongoing support included</li>
                                <li>Accelerated four-week delivery timeline</li>
                            </ul>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-blue-800 text-white p-6 sm:p-10 text-center mt-6">
                        <h3 className="text-xl sm:text-2xl font-bold mb-3">Let's Build Something Great Together</h3>
                        <p className="opacity-90 mb-6 text-sm sm:text-base">Choose the plan that best fits your vision, or contact us to discuss a custom solution.</p>
                        <button
                            onClick={handlePrint}
                            className="bg-white text-blue-800 font-semibold py-3 px-6 sm:px-8 rounded-lg shadow-xl transition duration-300 hover:bg-gray-100 hover:scale-105 text-sm sm:text-base"
                        >
                            Download Proposal (PDF)
                        </button>
                    </div>

                    {/* Footer */}
                    <footer className="p-6 sm:p-8 text-center text-gray-600 text-xs sm:text-sm bg-gray-50 border-t border-gray-200">
                        <p className="font-bold">VisualHQ | Digital Solutions & Web Development</p>
                        <p className="mt-2">This proposal is valid until December 31, 2025 | All pricing in Nigerian Naira (₦)</p>
                        <p className="mt-1">Questions? Contact us to discuss your specific requirements</p>
                    </footer>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default App;
