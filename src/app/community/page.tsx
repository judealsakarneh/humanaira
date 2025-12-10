'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showNewThreadModal, setShowNewThreadModal] = useState(false)
  const [showGuidelines, setShowGuidelines] = useState(false)

  return (
    <main className="min-h-screen bg-[#030712] text-slate-200 font-sans relative overflow-hidden">
      {/* Animated background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-[#35BFFF]/20 to-[#a855f7]/15 rounded-full blur-[160px] animate-float-slow" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/15 rounded-full blur-[160px] animate-float-medium" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-[#60a5fa]/15 to-[#a855f7]/12 rounded-full blur-[140px] animate-float-fast" />
      </div>

      {/* Grid overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#35BFFF22 1px, transparent 1px), linear-gradient(90deg, #a855f722 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <HeroSection setShowNewThreadModal={setShowNewThreadModal} setShowGuidelines={setShowGuidelines} />
      <StatsSection />
      <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <ForumThreads selectedCategory={selectedCategory} />
      <TopContributors />
      {showNewThreadModal && <NewThreadModal onClose={() => setShowNewThreadModal(false)} />}
      {showGuidelines && <GuidelinesModal onClose={() => setShowGuidelines(false)} />}
    </main>
  )
}

/* ========== Hero Section ========== */
function HeroSection({ setShowNewThreadModal, setShowGuidelines }: any) {
  return (
    <section className="relative pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-[#35BFFF] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent animate-gradient">
            Community Forum
          </h1>
          <p className="text-2xl text-slate-400 max-w-3xl mx-auto mb-8">
            Connect with thousands of freelancers and clients. Share experiences, get advice, and grow together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowNewThreadModal(true)}
              className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#35BFFF] via-[#60a5fa] to-[#a855f7] text-white hover:scale-105 transition-all duration-300 shadow-lg"
            >
              ✍️ Start a Discussion
            </button>
            <button 
              onClick={() => setShowGuidelines(true)}
              className="px-8 py-4 rounded-xl font-bold border-2 border-[#a855f7]/50 text-white hover:bg-[#a855f7]/20 hover:border-[#a855f7] transition-all duration-300">
              📖 Community Guidelines
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========== Stats Section ========== */
function StatsSection() {
  const stats = [
    { label: 'Active Members', value: '3,247', icon: '👥' },
    { label: 'Discussions', value: '1,856', icon: '💬' },
    { label: 'Solutions Found', value: '4,123', icon: '✓' },
    { label: 'Daily Posts', value: '127', icon: '📝' },
  ]

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#35BFFF]/30 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#35BFFF]/10 to-[#a855f7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========== Category Filter ========== */
function CategoryFilter({ selectedCategory, setSelectedCategory }: any) {
  const categories = [
    { id: 'all', label: 'All Topics', icon: '🌐', color: '#35BFFF' },
    { id: 'getting-started', label: 'Getting Started', icon: '🚀', color: '#10b981' },
    { id: 'seller-tips', label: 'Seller Tips', icon: '💡', color: '#a855f7' },
    { id: 'buyer-advice', label: 'Buyer Advice', icon: '🛒', color: '#60a5fa' },
    { id: 'success-stories', label: 'Success Stories', icon: '🏆', color: '#f59e0b' },
    { id: 'tech-help', label: 'Tech Help', icon: '⚙️', color: '#ec4899' },
  ]

  return (
    <section className="py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-xl font-bold border-2 transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'text-white scale-105'
                  : 'text-slate-400 border-slate-700/50 hover:border-[#a855f7]/50'
              }`}
              style={selectedCategory === cat.id ? {
                backgroundColor: cat.color,
                borderColor: cat.color,
                boxShadow: `0 8px 24px ${cat.color}66`
              } : {}}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========== Forum Threads ========== */
function ForumThreads({ selectedCategory }: any) {
  const [threads, setThreads] = useState([
    {
      id: 1,
      category: 'success-stories',
      title: 'How I reached Level 2 seller in just 3 months - Complete Strategy Guide',
      excerpt: "After countless hours of learning and optimizing my gigs, I finally made it to Level 2! Here's my complete journey...",
      fullContent: `Hey everyone! I'm beyond excited to share that I just hit Level 2 seller status, and I wanted to share everything I learned along the way because this community helped me so much when I was starting out.

**My Background:**
I started on this platform with zero experience in freelancing. I had skills in graphic design from my day job, but I'd never worked as a freelancer before. The first month was honestly brutal - I got maybe 2 orders total.

**What Changed Everything:**

1. **Gig Optimization is EVERYTHING**
   - I rewrote my gig titles to focus on what buyers actually search for. Instead of "Creative Logo Design", I used "Professional Business Logo Design + Unlimited Revisions + Fast Delivery"
   - Added a VIDEO to my gig. This increased my conversion rate by 40%. Even a simple 30-second intro talking about what you do makes a huge difference.
   - Portfolio is crucial - I created 8-10 mock projects specifically for my portfolio. Real client work is great, but if you don't have it yet, create your own examples.

2. **Response Time = Game Changer**
   - I set up notifications on my phone and responded to EVERY message within 2 hours, even if just to say "Thanks for reaching out, I'll send you a detailed proposal in X hours"
   - This alone improved my conversion from inquiry to order by like 60%

3. **Under-promise, Over-deliver**
   - If I could finish in 2 days, I'd set delivery to 3 days and deliver early
   - I always threw in a small bonus - an extra file format, a quick revision, anything to exceed expectations
   - This led to amazing reviews which fed into more orders

4. **Pricing Strategy**
   - Started at $15 for basic packages to build reviews (I know, I know, but hear me out)
   - After 10 five-star reviews, raised to $35
   - After 25 reviews, raised to $75
   - Now I charge $150 for my standard package and still get daily orders

5. **Communication is a Skill**
   - I created templates for common questions but ALWAYS personalized them
   - I asked questions to really understand what the client needed, not just what they said they wanted
   - I sent progress updates every day, even if just "Making great progress, will send preview tomorrow!"

**The Numbers:**
- Month 1: 2 orders, $30 total
- Month 2: 15 orders, $425 total  
- Month 3: 34 orders, $2,180 total
- Month 4 (current): Already at 28 orders, $4,200 total

**Biggest Mistakes I Made:**
- Not raising prices sooner. Don't undervalue yourself once you have reviews.
- Accepting every order even when my queue was full. Led to late deliveries and stress.
- Not having clear boundaries in my gig description. Now I'm very specific about what's included.

**My Advice:**
Don't compare your beginning to someone else's middle. Everyone starts at zero. Focus on delivering incredible value to your first 20 clients, get those 5-star reviews, then start optimizing for profit.

The platform rewards consistency. Show up every day, respond fast, deliver quality work, and the algorithm will start pushing your gigs.

You've got this! Happy to answer any questions. 🚀`,
      author: {
        name: 'Sarah Martinez',
        avatar: '👩‍💼',
        badge: 'Level 2 Seller',
        badgeColor: '#a855f7'
      },
      stats: { replies: 89, views: 5234, likes: 312 },
      timeAgo: '2 hours ago',
      isPinned: true,
      tags: ['success-story', 'leveling-up', 'tips']
    },
    {
      id: 2,
      category: 'seller-tips',
      title: 'The pricing psychology that tripled my order rate',
      excerpt: "I completely restructured my pricing last month and went from 2-3 orders per week to 15-20. Here's the exact strategy...",
      fullContent: `Okay, so I need to share this because it literally transformed my freelancing income overnight.

**The Problem I Had:**
I was offering three packages: $25, $50, $100. Seems logical, right? Wrong. I was getting maybe 2-3 orders a week, almost always the cheapest package.

**What I Changed:**
I restructured to: $75 (Basic), $150 (Standard), $275 (Premium)

"Wait, you RAISED your prices and got MORE orders??" 

Yes. Here's why it works:

**The Psychology:**

1. **Anchoring Effect**
   - When buyers see $25 as your cheapest option, they anchor to "this person's work is worth $25"
   - When they see $75 as the cheapest, they anchor to "this person's work is worth $75+"
   - You've automatically increased your perceived value

2. **The Goldilocks Principle**
   - Most people don't want the cheapest (seems low quality) or most expensive (seems excessive)
   - They want the middle option
   - My $150 package is now my bestseller, whereas before my $50 package got maybe 1 in 10 orders

3. **Premium Positioning**
   - Having a $275 option makes $150 seem reasonable
   - Even if only 1 in 20 buyers choose it, that one order equals 11 of my old $25 orders
   - The premium option makes you look established and professional

**What I Include in Each Tier:**

BASIC ($75):
- Core deliverable
- 2 revisions  
- 3-day delivery
- Source files

STANDARD ($150): ⭐ Most Popular
- Everything in Basic
- 4 revisions
- 2-day delivery  
- Premium support
- Commercial license
- One bonus asset

PREMIUM ($275):
- Everything in Standard
- Unlimited revisions
- 24-hour delivery
- Priority support
- Full ownership rights
- 3 bonus assets
- 30-day post-delivery support

**The Results:**
- Week 1: 8 orders (5 Standard, 2 Basic, 1 Premium) = $1,175
- Week 2: 12 orders (8 Standard, 3 Basic, 1 Premium) = $1,725  
- Week 3: 15 orders (10 Standard, 4 Basic, 1 Premium) = $2,175
- Week 4: 18 orders (13 Standard, 4 Basic, 1 Premium) = $2,525

Compare that to my old pricing where I'd make maybe $150-200/week.

**Important Notes:**
- This only works if your gig and reviews justify it. Get to 20+ five-star reviews first.
- Your gig description and portfolio need to LOOK like premium work
- Respond fast and professionally - you're charging premium prices, provide premium service
- Don't do this if you're brand new. Build your reputation first at moderate prices.

**The Confidence Factor:**
Here's the thing nobody talks about - charging more made me BETTER at my work. When someone pays $275, I bring my A++ game. The work is better, the client is happier, the reviews are more detailed and positive. It's a virtuous cycle.

Stop competing on price. Start competing on value. There will always be someone cheaper. There won't always be someone better.

Questions? I'm an open book! 💰`,
      author: {
        name: 'Marcus Johnson',
        avatar: '👨‍💼',
        badge: 'Top Rated Seller',
        badgeColor: '#f59e0b'
      },
      stats: { replies: 76, views: 4891, likes: 287 },
      timeAgo: '5 hours ago',
      isPinned: true,
      tags: ['pricing', 'strategy', 'psychology']
    },
    {
      id: 3,
      category: 'getting-started',
      title: 'Complete beginner guide: Your first 30 days on the platform',
      excerpt: "Just hit my first $1,000 month! Here's exactly what I did in my first 30 days, day by day breakdown...",
      fullContent: `I remember feeling completely overwhelmed when I first signed up. So I'm creating the guide I wish I had. This is literally everything I did, day by day.

**WEEK 1: Profile & Gig Setup**

Day 1-2: Profile Optimization
- Professional profile photo (not a selfie - use natural lighting, plain background)
- Bio that focuses on CLIENT benefits, not your credentials
- Connected all my social media and portfolio sites
- Set up availability calendar

Day 3-5: Research Phase  
- Analyzed top sellers in my category
- Noted common elements: video intros, detailed FAQs, package structures
- Read through 100+ buyer reviews to understand what clients value
- Made a list of common client pain points

Day 6-7: First Gig Creation
- Chose ONE specific service (biggest mistake = being too broad)
- Created 3 mock projects for my portfolio
- Wrote gig description focusing on outcomes, not features
- Recorded 45-second intro video on my phone (I did 12 takes lol)
- Created three packages with clear value differences

**WEEK 2: Getting First Orders**

Day 8-10: Buyer Request Strategy
- Set alarm for 6 AM to check buyer requests
- Sent 10 custom proposals per day (not copy-paste)
- Included relevant portfolio samples
- Kept proposals under 100 words - short and specific

Day 11-14: The First Order!
- Got my first order on day 11 (from a buyer request)
- $20 order - I treated it like a $2,000 project
- Delivered in 36 hours (promised 3 days)  
- Added small extra as bonus
- Followed up politely asking for review
- Client left 5-star review and ordered again!

**WEEK 3: Building Momentum**

Day 15-17: Consistency
- 2 more orders came in organically
- Kept sending buyer request proposals
- Started getting messages asking about my service
- Response time under 1 hour for every message

Day 18-21: Social Proof Matters
- With 3 five-star reviews, orders picked up
- Got 4 orders this week
- Raised prices by $5 (from $20 to $25)

**WEEK 4: Optimization**

Day 22-24: Analyzing What Works
- Looked at my gig analytics - 3% conversion rate
- A/B tested my gig image (added text overlay showing benefit)
- Conversion jumped to 5%

Day 25-28: Scaling Up
- 8 orders came in this week
- Added FAQ section addressing top 5 questions I kept getting
- Updated packages based on what clients actually asked for

Day 29-30: First Month Review
- Total orders: 17
- Total earnings: $425
- Average rating: 4.9 stars
- Inbox response rate: 98%

**KEY LESSONS:**

1. **Start Narrow, Expand Later**
   Don't offer "I'll do anything". Pick ONE thing you're great at and build reputation there first.

2. **Buyer Requests Are Gold**
   Yes, they're competitive. But 10 great custom proposals per day WILL get you orders.

3. **Under-promise, Over-deliver**
   This cliche is a cliche because it WORKS.

4. **Every Client is Your Marketing**
   Treat every order like they're your biggest client. Reviews compound.

5. **Speed Matters**
   Fast responses show you're professional and committed.

**What NOT to Do:**

❌ Copy successful gigs word-for-word (you'll get flagged)
❌ Promise unrealistic delivery times
❌ Undercharge to the point you resent the work  
❌ Argue with clients (even if they're wrong, stay professional)
❌ Ignore your analytics (check them weekly)

**My Month 2 Goal:**
$1,000 in earnings (I hit $1,100!)

**My Month 3 Goal:**  
Level 1 seller status (I got it on day 87!)

You don't need to be perfect. You need to start and iterate. Every top seller started at zero. Your first gig won't be perfect - that's okay. Publish it, learn from real client feedback, improve.

Feel free to ask questions! We all started exactly where you are. 🚀`,
      author: {
        name: 'Jennifer Wu',
        avatar: '👩‍💻',
        badge: 'Level 1 Seller',
        badgeColor: '#10b981'
      },
      stats: { replies: 124, views: 7823, likes: 445 },
      timeAgo: '1 day ago',
      isPinned: true,
      tags: ['getting-started', 'guide', 'beginners']
    },
    {
      id: 4,
      category: 'success-stories',
      title: 'From unemployed to $8K/month in 10 months - my complete story',
      excerpt: "Lost my job in March 2024. Started freelancing out of desperation. Just crossed $8,000 this month. Here's everything...",
      fullContent: `I'm writing this at 2 AM because I just crossed $8,000 in monthly earnings and I literally can't sleep from excitement. A year ago I was applying to hundreds of jobs and getting nowhere. Here's my complete journey.

**The Background (The Ugly Part):**

March 2024: Lost my job as a marketing coordinator. Company downsized.
Sent out 200+ job applications over 3 months. Got 4 interviews. Zero offers.
Had $2,400 in savings. Rent was $1,100/month. I was terrified.

**April 2024: Desperation Decision**

Week 1: Signed up on this platform
- Figured I'd try freelancing while job hunting
- Created gig for social media management (my old job)
- Charged $30 for basic package (I know, way too low, but I needed ANY income)

Week 2-4: Reality Check
- Got 2 orders total
- Made $60
- Almost gave up
- Friend convinced me to give it one more month

**May 2024: The Shift**

Changed my entire approach:

1. Watched 20+ hours of YouTube videos on freelancing
2. Completely rewrote my gig focusing on RESULTS not SERVICES  
3. Added before/after examples to portfolio
4. Started treating this like a real business, not a side gig

Results:
- 8 orders
- $320 total
- Not great, but trending up
- Got my first repeat client

**June 2024: Building Momentum**

- Raised prices to $50 basic  
- Added video testimonial from repeat client to gig
- Started a simple content calendar: posted portfolio examples on LinkedIn
- Responded to every message in under 30 minutes

Results:
- 15 orders
- $925 total  
- Got my first $150 order
- Started to believe this could work

**July 2024: The Breakthrough**

One client left an incredibly detailed 5-star review. Algorithm pushed my gig hard.

- 27 orders
- $1,840 total
- Raised prices again ($75 basic)
- Hired a VA for $5/hour to handle admin tasks
- Hit Level 1 status

**August 2024: Stopped Job Hunting**

Realized I was making more than my old job would pay.

- 31 orders  
- $2,675 total
- Added Premium package at $200
- Got first Premium order - client became long-term retainer

**September 2024: First $3K Month**

- 28 orders
- $3,280 total
- Raised prices again ($100 basic, $175 standard, $300 premium)  
- 3 retainer clients (monthly recurring)

**October 2024: Scaling Systems**

- Hired second VA
- Created SOPs for everything
- Raised prices again ($150/$250/$450)
- Started saying no to small projects

Results:
- 24 orders + 3 retainers
- $4,950 total

**November 2024: Hit Level 2**

- 22 orders + 4 retainers  
- $6,200 total
- Added extra premium tier at $750
- Got first $750 order (!!!)

**December 2024: $8K Month (This Month!)**

- 19 orders + 5 retainers
- $8,150 total (so far, still 10 days left)
- Average order value: $315
- Finally making more than my old job EVER paid me

**What Actually Worked:**

1. **Specialization**
   Started offering "everything marketing". Now I ONLY do Instagram growth strategies for e-commerce brands. Narrow = higher prices.

2. **Raise Prices Regularly**
   Every 20-25 reviews, I raised prices 20-30%. Demand barely changed, income skyrocketed.

3. **Portfolio > Everything**  
   I spent hours creating case studies showing actual results. Numbers, graphs, before/after.

4. **Client Selection**
   I started declining cheap clients. Sounds harsh but my time became valuable. One $500 client > ten $50 clients.

5. **Invest in Help**
   Hiring VAs was scary but freed up 15 hours/week to focus on high-value work.

6. **Communication**
   I send update messages even when not required. Clients LOVE knowing you're on top of things.

**Mistakes I Made:**

- Undercharging for WAY too long (cost me probably $10K)
- Saying yes to every project (led to burnout)
- Not documenting my process earlier (could've scaled faster)
- Waiting to raise prices out of fear

**Real Talk:**

Months 1-3 SUCKED. I was making below minimum wage if you count hours worked.
Months 4-6 were OK. Made rent and some savings.
Months 7-10 changed everything. Compound effect of reviews + raised prices.

This wasn't a "get rich quick" thing. It was a "work your ass off and build something real" thing.

**Current Status:**

- 5 retainer clients (guaranteed $3,200/month)
- 15-20 one-off projects per month
- Working 35 hours/week (vs 50+ at old job)
- Building actual savings for first time ever
- Zero job applications sent in 6 months

**If You're Starting Out:**

Don't compare month 1 you to month 10 me. Compare month 1 you to week 4 you. Small progress compounds.

The best time to start was a year ago. Second best time is today.

You got this. I believe in you because I was you. 💪`,
      author: {
        name: 'David Chen',
        avatar: '👨‍💼',
        badge: 'Level 2 Seller',
        badgeColor: '#a855f7'
      },
      stats: { replies: 167, views: 12453, likes: 891 },
      timeAgo: '6 hours ago',
      isPinned: false,
      tags: ['success-story', 'journey', 'motivation']
    },
    {
      id: 5,
      category: 'seller-tips',
      title: 'Response templates that convert 70% of inquiries to orders',
      excerpt: "I tracked 200 inquiries and found these exact message templates convert 3x better than generic responses...",
      fullContent: `I'm a data nerd, so I tracked every single inquiry I got for 3 months (204 total). Tested different response approaches. Found templates that convert 70%+ of inquiries to actual orders.

**The Baseline:**
My original response rate: inquiry to order was 24%. Not terrible, but not great.

After optimization: 68% conversion rate.

**TEMPLATE 1: The Quick Response**
(Use for simple, straightforward inquiries)

"Hi [Name]! 👋

Thanks for reaching out! Yes, I can definitely help you with [their specific need].

Based on what you've described, my [Package Name] would be perfect - it includes [key benefit 1], [key benefit 2], and [key benefit 3].

I have availability to start immediately and can deliver by [specific date].

Any questions? Happy to jump on this today!

Best,
[Your Name]"

**Why it works:**
- Friendly but professional
- Directly addresses their need
- Specific timeline (not vague)
- Clear call to action
- Shows availability

**Conversion rate: 72%**

**TEMPLATE 2: The Consultant Approach**
(Use for complex projects or vague inquiries)

"Hi [Name],

Thanks for your message! I'd love to help with your [project type].

To make sure I give you the exact solution you need, quick question:

[Specific clarifying question based on their message]

This helps me recommend the right package and timeline. I've worked on [similar project type] for [similar client type] and got great results.

Looking forward to your reply!

[Your Name]"

**Why it works:**
- Positions you as expert, not order-taker
- Shows you care about doing it right
- Social proof (similar projects)
- Engaging, not pushy

**Conversion rate: 66%**

**TEMPLATE 3: The Premium Play**
(Use when you sense they might want Premium package)

"Hi [Name]!

This sounds like an exciting project! I actually just completed something similar for [industry/niche] and the results were [specific result].

For a project like yours, I'd recommend my Premium package because it includes:

✓ [Premium feature 1 - explain why it matters for THEIR project]
✓ [Premium feature 2 - explain benefit]  
✓ [Premium feature 3 - explain outcome]

Plus [bonus that's relevant to what they mentioned].

I can start [timeframe] and have this done by [specific date].

Want to discuss the details? I'm available now.

[Your Name]"

**Why it works:**
- Establishes authority (just did similar project)
- Sells outcome, not features
- Specific to their needs
- Urgency (available now)

**Conversion rate: 71%**
**Average order value: 2.8x higher than Template 1**

**TEMPLATE 4: The Budget-Conscious Buyer**
(When they ask "what's your best price?")

"Hi [Name],

I totally understand working within a budget! Here's what I can do:

My pricing is:
- Basic: $[X] - [what's included]
- Standard: $[Y] - [what's included] ← Most popular
- Premium: $[Z] - [what's included]

The right fit depends on [factor related to their project]. If you share [specific detail about their needs], I can recommend the best option.

All packages include [universal benefit], so you're getting quality work either way!

[Your Name]"

**Why it works:**
- Doesn't immediately offer discount
- Shows value across all tiers  
- Asks question to keep conversation going
- Professional, not defensive

**Conversion rate: 58%** (lower, but these buyers often become repeat clients)

**TEMPLATE 5: The Revival Message**
(For inquiries that went cold after 1-2 days)

"Hi [Name],

Just wanted to follow up on your [project type] - I know things get busy!

I still have space this week if you'd like to move forward. After [specific date] my queue fills up, so wanted to give you first option.

Let me know - happy to answer any questions!

[Your Name]"

**Why it works:**
- Non-pushy follow-up
- Creates soft urgency
- Opens door for questions
- Shows you value their business

**Conversion rate: 41%** (of cold leads - this is actually amazing)

**RULES I LEARNED:**

1. **Respond in Under 1 Hour**
   My conversion rate drops 15% if I respond after 2+ hours. Buyers are often messaging multiple sellers.

2. **Use Their Name**
   Literally adds 8% to conversion. Such a simple thing.

3. **Be Specific**
   Vague = unprofessional. "I can deliver quality work" vs "I can deliver 10 Instagram posts with captions and hashtags by Friday 3 PM"

4. **Ask ONE Question Max**
   Too many questions = friction. One specific question = shows you care.

5. **Match Their Energy**
   Casual buyer = casual tone. Corporate buyer = professional tone.

6. **Never Apologize for Prices**
   "Sorry, my prices are..." = looks weak. Be confident.

**WHAT NOT TO SAY:**

❌ "I'm new but I'll do my best" (undermines confidence)
❌ "I can give you a discount" (before they even ask)
❌ "I'm available anytime" (looks desperate)
❌ "Let me know if you're interested" (weak CTA)

**The Template I Use 80% of the Time:**

Honestly? Template 1 (The Quick Response) gets used most because most inquiries are straightforward. It's fast, friendly, and converts like crazy.

**My System:**

1. Read inquiry
2. Pick template based on vibe/complexity
3. Personalize key parts (30 seconds)
4. Send within 15 minutes
5. Track if it converts

**Results After 3 Months:**

- Response time: Average 12 minutes
- Inquiry to order: 68% (was 24%)
- Time saved: ~2 hours per day (templates = fast)  
- Revenue increase: 3.2x

Templates aren't about being fake or robotic. They're about having a proven framework you can personalize quickly.

Save these. Adjust to your voice. Watch your conversions soar. 📈`,
      author: {
        name: 'Amanda Foster',
        avatar: '👩‍💼',
        badge: 'Level 2 Seller',
        badgeColor: '#a855f7'
      },
      stats: { replies: 93, views: 6234, likes: 378 },
      timeAgo: '3 hours ago',
      isPinned: false,
      tags: ['templates', 'conversion', 'communication']
    },
  ])

  const handleLike = (threadId: number) => {
    setThreads(threads.map(t => 
      t.id === threadId 
        ? { ...t, stats: { ...t.stats, likes: t.stats.likes + 1 } }
        : t
    ))
  }

  const filteredThreads = selectedCategory === 'all' 
    ? threads 
    : threads.filter(t => t.category === selectedCategory)

  return (
    <section className="py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <ThreadCard key={thread.id} thread={thread} onLike={handleLike} />
          ))}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No threads in this category yet</h3>
            <p className="text-slate-500">Be the first to start a discussion!</p>
          </div>
        )}
      </div>
    </section>
  )
}

function ThreadCard({ thread, onLike }: any) {
  const [showFullContent, setShowFullContent] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState<any[]>([])
  const [hasLiked, setHasLiked] = useState(false)

  const handleLikeClick = () => {
    if (!hasLiked) {
      onLike(thread.id)
      setHasLiked(true)
    }
  }

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      const newReply = {
        id: replies.length + 1,
        author: { name: 'You', avatar: '👤' },
        text: replyText,
        timeAgo: 'Just now',
        likes: 0
      }
      setReplies([...replies, newReply])
      setReplyText('')
    }
  }

  const toggleContent = () => {
    setShowFullContent(!showFullContent)
  }

  return (
    <div
      className={`relative p-6 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 transition-all duration-300 group overflow-hidden ${
        thread.isPinned ? 'border-[#f59e0b]/50' : 'border-slate-700/50 hover:border-[#35BFFF]/50'
      }`}
      style={{
        boxShadow: thread.isPinned ? '0 8px 32px rgba(245,158,11,0.3)' : '0 4px 16px rgba(0,0,0,0.5)'
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#35BFFF]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-4xl">{thread.author.avatar}</div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-white">{thread.author.name}</span>
                <span className="px-2 py-1 rounded-full text-xs font-semibold border" style={{ 
                  borderColor: `${thread.author.badgeColor}50`,
                  backgroundColor: `${thread.author.badgeColor}20`,
                  color: thread.author.badgeColor
                }}>
                  {thread.author.badge}
                </span>
                {thread.isPinned && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/50">
                    📌 Pinned
                  </span>
                )}
              </div>
              <div className="text-sm text-slate-500">{thread.timeAgo}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#35BFFF] transition-colors cursor-pointer" onClick={toggleContent}>
          {thread.title}
        </h3>
        
        {!showFullContent ? (
          <p className="text-slate-400 mb-4">{thread.excerpt}</p>
        ) : (
          <div className="text-slate-300 mb-4 leading-relaxed whitespace-pre-line max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            {thread.fullContent}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {thread.tags.map((tag: string, idx: number) => (
            <span key={idx} className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/60 text-slate-300 border border-slate-700/50">
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <button 
              onClick={toggleContent}
              className="flex items-center gap-1 hover:text-[#35BFFF] transition-colors"
            >
              <span>💬</span>
              <span className="font-semibold">{thread.stats.replies + replies.length}</span>
              <span>replies</span>
            </button>
            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span className="font-semibold">{thread.stats.views.toLocaleString()}</span>
              <span>views</span>
            </div>
            <button 
              onClick={handleLikeClick}
              className={`flex items-center gap-1 transition-colors ${hasLiked ? 'text-red-500' : 'hover:text-red-400'}`}
              disabled={hasLiked}
            >
              <span>{hasLiked ? '❤️' : '🤍'}</span>
              <span className="font-semibold">{thread.stats.likes}</span>
              <span>likes</span>
            </button>
          </div>
          
          <button 
            onClick={toggleContent}
            className="px-4 py-2 rounded-lg bg-[#35BFFF]/20 border border-[#35BFFF]/40 text-[#35BFFF] font-semibold hover:bg-[#35BFFF]/30 transition-all duration-300"
          >
            {showFullContent ? 'Hide Discussion' : 'Read Full Post'}
          </button>
        </div>

        {/* Replies Section */}
        {showFullContent && (
          <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
            {/* Sample Replies */}
            <ReplyCard 
              author={{ name: 'Alex Rodriguez', avatar: '🧑‍💻' }}
              text="This is incredibly helpful! Thanks for sharing your experience in such detail. I'm going to implement these strategies starting today."
              timeAgo="1 hour ago"
            />
            <ReplyCard 
              author={{ name: 'Maria Garcia', avatar: '👩‍🔧' }}
              text="Wow, this really opened my eyes. I've been making some of these mistakes. Time to change my approach!"
              timeAgo="30 minutes ago"
            />
            
            {/* User replies */}
            {replies.map((reply) => (
              <ReplyCard key={reply.id} {...reply} />
            ))}

            {/* Reply Input */}
            <div className="flex gap-3 items-start mt-6">
              <div className="text-3xl">👤</div>
              <div className="flex-1">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#35BFFF]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#35BFFF] to-[#60a5fa] text-white font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ReplyCard({ author, text, timeAgo }: any) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)

  const handleLike = () => {
    if (!hasLiked) {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  return (
    <div className="flex gap-3 p-4 rounded-xl bg-[#0a0f1e]/40 border border-slate-700/30">
      <div className="text-3xl">{author.avatar}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-bold text-white text-sm">{author.name}</span>
          <span className="text-xs text-slate-500">{timeAgo}</span>
        </div>
        <p className="text-slate-300 text-sm mb-3">{text}</p>
        <button 
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs transition-colors ${hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'}`}
        >
          <span>{hasLiked ? '❤️' : '🤍'}</span>
          <span className="font-semibold">{likes}</span>
        </button>
      </div>
    </div>
  )
}

/* ========== Top Contributors ========== */
function TopContributors() {
  const contributors = [
    { name: 'Sarah Martinez', avatar: '👩‍💼', posts: 247, reputation: 15834, badge: 'Expert Contributor', color: '#f59e0b' },
    { name: 'James Wilson', avatar: '👨‍🏫', posts: 189, reputation: 12456, badge: 'Community Helper', color: '#10b981' },
    { name: 'Jennifer Williams', avatar: '👩‍🎨', posts: 156, reputation: 10923, badge: 'Top Contributor', color: '#a855f7' },
    { name: 'Robert Kim', avatar: '👨‍🎤', posts: 134, reputation: 9745, badge: 'Rising Star', color: '#35BFFF' },
    { name: 'Emily Parker', avatar: '👩‍🔬', posts: 98, reputation: 7632, badge: 'Active Member', color: '#ec4899' },
  ]

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#f59e0b] via-[#ec4899] to-[#a855f7] bg-clip-text text-transparent">
            Top Contributors
          </h2>
          <p className="text-xl text-slate-400">Our most helpful community members this month</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {contributors.map((contributor, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 hover:scale-105 transition-all duration-300 group overflow-hidden"
              style={{ borderColor: `${contributor.color}50` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-10" style={{ background: `linear-gradient(135deg, ${contributor.color}40, transparent)` }} />
              
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-3">{contributor.avatar}</div>
                <h3 className="text-lg font-bold text-white mb-1">{contributor.name}</h3>
                <div className="px-3 py-1 rounded-full text-xs font-semibold mb-3 inline-block" style={{ 
                  backgroundColor: `${contributor.color}20`,
                  color: contributor.color,
                  border: `1px solid ${contributor.color}50`
                }}>
                  {contributor.badge}
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-slate-400">
                    <span className="font-bold text-white">{contributor.posts}</span> posts
                  </div>
                  <div className="text-sm text-slate-400">
                    <span className="font-bold" style={{ color: contributor.color }}>{contributor.reputation.toLocaleString()}</span> reputation
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========== New Thread Modal ========== */
function NewThreadModal({ onClose }: any) {
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    content: '',
    tags: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative max-w-3xl w-full p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#35BFFF]/40 animate-scale-up overflow-y-auto max-h-[90vh]" 
        style={{ boxShadow: '0 20px 60px rgba(53,191,255,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-2xl flex items-center justify-center transition-colors z-10"
        >
          ×
        </button>

        {!isSubmitted ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">✍️</div>
              <h3 className="text-3xl font-black mb-2 bg-gradient-to-r from-[#35BFFF] to-[#a855f7] bg-clip-text text-transparent">
                Start a New Discussion
              </h3>
              <p className="text-slate-400">Share your thoughts with the community</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Category</label>
                <select 
                  className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#35BFFF]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                >
                  <option value="">Select a category</option>
                  <option value="getting-started">🚀 Getting Started</option>
                  <option value="seller-tips">💡 Seller Tips</option>
                  <option value="buyer-advice">🛒 Buyer Advice</option>
                  <option value="success-stories">🏆 Success Stories</option>
                  <option value="tech-help">⚙️ Tech Help</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="What's your discussion about?"
                  className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#35BFFF]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Content</label>
                <textarea
                  rows={8}
                  placeholder="Share your thoughts, questions, or experiences..."
                  className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#35BFFF]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., tips, help, advice"
                  className="w-full px-5 py-4 rounded-xl bg-[#0a0f1e]/60 border-2 border-slate-700/60 focus:border-[#35BFFF]/70 text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#35BFFF]/30"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-4 rounded-xl font-bold border-2 border-slate-700 text-white hover:bg-slate-800 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl font-bold bg-gradient-to-r from-[#35BFFF] via-[#60a5fa] to-[#a855f7] text-white hover:scale-105 transition-all duration-300 shadow-lg"
                  style={{ boxShadow: '0 8px 32px rgba(53,191,255,0.4)' }}
                >
                  Post Discussion
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-8xl mb-6 animate-bounce">✓</div>
            <h3 className="text-3xl font-bold text-white mb-4">Discussion Posted!</h3>
            <p className="text-slate-400 text-lg">Your thread has been published to the community</p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ========== Guidelines Modal ========== */
function GuidelinesModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative max-w-4xl w-full p-8 rounded-3xl bg-gradient-to-br from-[#0f172a]/95 via-[#1a1f35]/90 to-[#1e293b]/95 border-2 border-[#a855f7]/40 animate-scale-up overflow-y-auto max-h-[90vh]" 
        style={{ boxShadow: '0 20px 60px rgba(168,85,247,0.4)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white text-2xl flex items-center justify-center transition-colors z-10"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-4xl font-black mb-2 bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
            Community Guidelines
          </h3>
          <p className="text-slate-400 text-lg">Let's keep our community helpful, respectful, and inspiring</p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#35BFFF]">✓</span> Be Respectful & Supportive
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li>Treat everyone with kindness - we're all here to help each other grow</li>
              <li>Constructive criticism is welcome, personal attacks are not</li>
              <li>Celebrate others' successes - their win doesn't diminish yours</li>
              <li>Remember: everyone started as a beginner</li>
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#10b981]">💡</span> Share Real Value
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li>Post genuine experiences, tips, and lessons learned</li>
              <li>Be specific - "I increased my orders by doing X, Y, Z" is more helpful than vague advice</li>
              <li>Share both successes AND failures - we learn from both</li>
              <li>If recommending tools or strategies, explain WHY they worked for you</li>
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#f59e0b]">🚫</span> What's Not Allowed
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li><strong>No spam or self-promotion</strong> - Don't post links to your gigs or external services</li>
              <li><strong>No hate speech or discrimination</strong> - Zero tolerance policy</li>
              <li><strong>No misleading information</strong> - Don't exaggerate earnings or make false claims</li>
              <li><strong>No asking for upvotes/likes</strong> - Let quality content speak for itself</li>
              <li><strong>No sharing client information</strong> - Respect privacy and confidentiality</li>
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#ec4899]">💬</span> Communication Best Practices
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li>Use clear, descriptive titles for your posts</li>
              <li>Break up long posts with headers and bullet points (like this!)</li>
              <li>Respond to comments and questions on your posts</li>
              <li>Say thank you when someone helps you</li>
              <li>Use appropriate categories and tags to help others find your content</li>
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#60a5fa]">🏆</span> Contribute & Earn Recognition
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li>Top contributors get special badges and recognition</li>
              <li>Helpful answers can be marked as "solution" by the original poster</li>
              <li>Consistent, valuable contributions may lead to "Community Helper" status</li>
              <li>Quality matters more than quantity - one great post beats ten mediocre ones</li>
            </ul>
          </section>

          <section>
            <h4 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-[#a855f7]">⚖️</span> Reporting & Moderation
            </h4>
            <ul className="space-y-2 ml-6 list-disc text-slate-400">
              <li>If you see guideline violations, report them - don't engage in arguments</li>
              <li>Moderators review all reports within 24 hours</li>
              <li>First violation: Warning. Repeated violations: Temporary or permanent ban</li>
              <li>We're all adults - let's self-moderate through upvotes and downvotes</li>
            </ul>
          </section>

          <section className="bg-gradient-to-br from-[#35BFFF]/10 to-[#a855f7]/10 p-6 rounded-2xl border border-[#35BFFF]/30 mt-8">
            <h4 className="text-xl font-bold text-white mb-3">Remember:</h4>
            <p className="text-slate-300 leading-relaxed">
              This community exists to help freelancers and clients succeed. Every post, comment, and interaction should add value. 
              Be the community member you'd want to interact with. Share generously, learn humbly, and celebrate collectively.
            </p>
            <p className="text-[#35BFFF] font-semibold mt-4">
              Together, we rise. 🚀
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#ec4899] text-white hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Got It! Let's Contribute
          </button>
        </div>
      </div>
    </div>
  )
}

<style jsx global>{`
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(53, 191, 255, 0.5);
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(53, 191, 255, 0.7);
  }
`}</style>
