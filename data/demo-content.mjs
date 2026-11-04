/**
 * DEMO DATA — single source of truth.
 * Used by `npm run seed` (writes into MongoDB Atlas) and as the
 * offline fallback when the database is unreachable.
 * Edit freely: replace names, prices and numbers with your own.
 */

export const demoContent = {
  stats: [
    { label: "Patients treated", value: "3,400+" },
    { label: "Years of practice", value: "12" },
    { label: "Sessions delivered", value: "18,000+" },
    { label: "Google rating", value: "4.9" },
  ],

  services: [
    {
      slug: "orthopedic-rehabilitation",
      icon: "spine",
      title: "Orthopaedic Rehabilitation",
      short:
        "Back pain, neck pain, slipped disc, frozen shoulder and post-fracture stiffness — rebuilt with graded manual therapy and strength work.",
      description:
        "We start with a movement screen and posture assessment, then combine hands-on manual therapy, dry needling where indicated, and a progressive loading plan you can actually follow at home.",
      duration: 45,
      points: [
        "Spine, shoulder, knee and hip conditions",
        "Post-fracture and post-slim disc recovery",
        "Ergonomic review for desk jobs",
      ],
    },
    {
      slug: "sports-injury",
      icon: "bolt",
      title: "Sports Injury Physiotherapy",
      short:
        "Sprains, strains, tendon overload and return-to-play programmes for runners, gym-goers and club athletes.",
      description:
        "Objective strength testing, load management and sport-specific drills so you return to the field stronger, not just pain-free.",
      duration: 60,
      points: [
        "Return-to-play testing and clearance",
        "ACL, hamstring and rotator-cuff protocols",
        "Running gait analysis",
      ],
    },
    {
      slug: "neuro-physiotherapy",
      icon: "brain",
      title: "Neuro Physiotherapy",
      short:
        "Stroke, Parkinson's, Bell's palsy and spinal-cord injury rehab focused on balance, gait and independence.",
      description:
        "Task-specific retraining, balance work and family coaching, with measurable milestones recorded every session.",
      duration: 60,
      points: [
        "Gait and balance retraining",
        "Spasticity management",
        "Caregiver training for home practice",
      ],
    },
    {
      slug: "post-surgical-recovery",
      icon: "shield",
      title: "Post-Surgical Recovery",
      short:
        "ACL reconstruction, replacement and spine surgery — structured week-by-week protocols from day one.",
      description:
        "We coordinate with your surgeon, protect the repair early on, and progress range of motion, swelling control and strength on a clear timeline.",
      duration: 45,
      points: [
        "Protocol aligned with your surgeon",
        "Swelling and scar-tissue management",
        "Range-of-motion and strength milestones",
      ],
    },
    {
      slug: "womens-health",
      icon: "heart",
      title: "Women's Health",
      short:
        "Pre and post-natal conditioning, diastasis repair, pelvic floor rehab and posture care during pregnancy.",
      description:
        "Private, female-therapist-led sessions covering core reconnection, pelvic floor strength and safe return to exercise.",
      duration: 45,
      points: [
        "Diastasis abdominis assessment",
        "Pelvic floor physiotherapy",
        "Trimester-safe exercise plans",
      ],
    },
    {
      slug: "geriatric-mobility",
      icon: "walk",
      title: "Geriatric Mobility",
      short:
        "Fall-risk assessment, strength and balance for seniors, plus home-visit sessions where travel is hard.",
      description:
        "Slow, safe progression with a focus on independence in daily tasks — stairs, getting up from a chair, and walking tolerance.",
      duration: 45,
      points: [
        "Fall-risk and balance screening",
        "Home-exercise plan with big print",
        "Home visits available",
      ],
    },
  ],

  packages: [
    {
      name: "Single Session",
      price: 1200,
      sessions: 1,
      perSession: 1200,
      tagline: "Assessment + first treatment",
      features: [
        "60-minute initial assessment",
        "Personalised treatment plan",
        "Home exercise PDF",
      ],
      highlighted: false,
    },
    {
      name: "Recovery 5",
      price: 5400,
      sessions: 5,
      perSession: 1080,
      tagline: "Most booked for acute pain",
      features: [
        "5 hands-on sessions",
        "Weekly progress review",
        "WhatsApp support between sessions",
        "Free posture assessment",
      ],
      highlighted: true,
    },
    {
      name: "Total Rehab 12",
      price: 11400,
      sessions: 12,
      perSession: 950,
      tagline: "Best value for long-term recovery",
      features: [
        "12 sessions, no expiry for 12 months",
        "Strength testing at week 1, 6 and 12",
        "Gym transition programme",
        "Priority booking",
      ],
      highlighted: false,
    },
    {
      name: "Home Visit",
      price: 1800,
      sessions: 1,
      perSession: 1800,
      tagline: "Within 15 km of the clinic",
      features: [
        "Full session at your home",
        "Equipment-free exercise plan",
        "Caregiver coaching included",
      ],
      highlighted: false,
    },
  ],

  team: [
    {
      name: "Dr. Amit Kumar",
      role: "Chief Physiotherapist",
      qualification: "MPT (Orthopaedics)",
      years: 12,
      focus: ["Spine", "Post-surgical", "Sports"],
      bio: "Leads the clinic's orthopaedic and post-surgical programmes. Trained in McKenzie method and dry needling.",
    },
    {
      name: "Dr. Priya Nair",
      role: "Senior Physiotherapist",
      qualification: "MPT (Women's Health)",
      years: 8,
      focus: ["Pre-natal", "Pelvic floor"],
      bio: "Runs the women's health track and antenatal exercise classes.",
    },
    {
      name: "Dr. Rahul Sethi",
      role: "Neurophysiotherapist",
      qualification: "MPT (Neurology)",
      years: 9,
      focus: ["Stroke", "Parkinson's"],
      bio: "Specialises in gait retraining and long-term stroke recovery plans.",
    },
  ],

  testimonials: [
    {
      name: "Sneha R.",
      city: "Bengaluru",
      condition: "Lower back pain",
      rating: 5,
      text: "Six weeks of desk-job back pain gone. They explained every exercise instead of just handing me a sheet.",
    },
    {
      name: "Imran K.",
      city: "Bengaluru",
      condition: "ACL reconstruction",
      rating: 5,
      text: "Back to playing Sunday league football nine months after surgery. The return-to-play testing gave me real confidence.",
    },
    {
      name: "Lakshmi N.",
      city: "Whitefield",
      condition: "Frozen shoulder",
      rating: 5,
      text: "I could not lift my arm to comb my hair. After twelve sessions my movement is almost normal.",
    },
    {
      name: "Devika S.",
      city: "Indiranagar",
      condition: "Post-natal core",
      rating: 5,
      text: "Private, patient and never rushed. The diastasis programme worked better than anything I tried on my own.",
    },
    {
      name: "Mohan L.",
      city: "Jayanagar",
      condition: "Stroke recovery",
      rating: 5,
      text: "Home visits for my father made all the difference. He walks to the bathroom on his own now.",
    },
  ],

  faqs: [
    {
      q: "Do I need a doctor's referral?",
      a: "No. Physiotherapy is a direct-access specialty in India — you can book an assessment yourself. If we spot something that needs a doctor, we will tell you in the first session.",
    },
    {
      q: "How many sessions will I need?",
      a: "Most acute cases settle in 5–8 sessions. Post-surgical rehab runs 12 weeks or more. We give you an honest estimate after the first assessment, with a package option that saves money.",
    },
    {
      q: "What should I wear and bring?",
      a: "Wear clothes you can move in and bring any scans, MRI reports or surgeon's notes. Shorts are useful for knee and hip assessments.",
    },
    {
      q: "Is it painful?",
      a: "Some tender areas may ache mildly for a day after hands-on work. Tell the therapist at any point and they will change technique — treatment should never be something you endure.",
    },
    {
      q: "Can I do sessions at home?",
      a: "Yes. Home visits are available within 15 km, and after your first clinic visit we can move part of the plan to supervised video calls.",
    },
    {
      q: "How do I pay, and do you cancel easily?",
      a: "UPI, card or cash at the clinic. Free rescheduling up to 4 hours before your slot; package sessions never expire inside their window.",
    },
  ],

  process: [
    {
      title: "Book in 30 seconds",
      text: "Use the WhatsApp or call button, or send the booking form. You get a confirmation with your slot and therapist.",
    },
    {
      title: "Full assessment",
      text: "45–60 minutes of movement, strength and posture testing plus a review of your scans and history.",
    },
    {
      title: "Hands-on treatment",
      text: "Manual therapy, needling or modalities as appropriate — chosen for your condition, not from a fixed menu.",
    },
    {
      title: "Home plan + review",
      text: "A printed exercise plan with photos, then measured progress reviews so you can see the change, not just feel it.",
    },
  ],

  articles: [
    {
      slug: "back-pain-desk-job",
      title: "Desk-job back pain: 5 fixes that actually hold",
      category: "Spine",
      readTime: "6 min read",
      date: "2026-09-18",
      excerpt:
        "Most office back pain is a load problem, not a chair problem. Here is what we change first with patients who sit eight hours a day.",
      body: [
        "Sitting itself is not the villain — sitting in one position without moving is. Your discs and joints want variation, not a perfect posture held for six hours.",
        "Start with a movement every 40 minutes. Not a stretch, just standing and walking to refill water. Then add hip-flexor and hamstring work twice a week, because tight fronts pull your pelvis into the position that hurts your low back.",
        "Third, build glute strength. Most desk backs are under-used glutes forcing the lower spine to do the work. Bridge, split-squat and dead-bug progressions cover it. Fourth, check your lifting habit: hinge at the hips, keep the load close, exhale on effort.",
        "Finally, sleep and stress matter more than patients expect — pain sensitivity rises sharply after two bad nights. If pain shoots below the knee, comes with numbness, or wakes you at night, get assessed rather than self-treating.",
      ],
    },
    {
      slug: "frozen-shoulder-stages",
      title: "Frozen shoulder: what each stage really feels like",
      category: "Shoulder",
      readTime: "5 min read",
      date: "2026-08-30",
      excerpt:
        "Knowing which stage you are in changes what treatment should look like — pushing hard early is the classic mistake.",
      body: [
        "Stage one is the painful phase: ache at night, no real stiffness yet. The goal here is pain control and gentle movement, not forcing range. Pushing into pain at this stage usually makes it worse and longer.",
        "Stage two is freezing: movement drops fast, especially reaching behind you and overhead. Manual therapy plus frequent gentle end-range work helps most, and sleeping positions need adjusting.",
        "Stage three is frozen: pain settles but stiffness plateaus. Now we can be more aggressive with stretch and strength. Stage four is thawing, where range returns over months.",
        "Total course is commonly 12–18 months untreated. Good physiotherapy does not delete that timeline, but it protects your sleep, your shoulder blade mechanics, and your confidence along the way.",
      ],
    },
    {
      slug: "acl-return-to-running",
      title: "After ACL surgery: the checklist before you run again",
      category: "Sports",
      readTime: "8 min read",
      date: "2026-08-12",
      excerpt:
        "Time since surgery is the weakest predictor of a successful return. Strength and symmetry are the ones worth chasing.",
      body: [
        "Do not return to running on a calendar date alone. We want full extension first — a knee that stops short is a knee that will compensate. ThenQuad strength: a single-leg press or hop test showing at least 90 percent symmetry with the other side.",
        "Swelling matters. If the knee puffs up after a session, you loaded too much and the tissue is telling you so. Drop back a step for a week rather than pushing through.",
        "Straight-line running comes before change of direction. Start with walk-run intervals on flat ground, three times a week, and add volume no faster than about ten percent a week.",
        "Cutting, pivoting and hopping need their own phase, usually after month four or five, and only once you can control the landing. Re-injury in year one mostly happens on unprepared pivoting, not on jogging.",
      ],
    },
    {
      slug: "knee-pain-in-50s",
      title: "Knee pain after 50: osteoarthritis, muscle or both?",
      category: "Knees",
      readTime: "6 min read",
      date: "2026-07-25",
      excerpt:
        "Scan findings and symptoms often disagree. What you can do about it is more hopeful than the X-ray suggests.",
      body: [
        "Plenty of people with 'wear and tear' on X-ray have no pain, and plenty of painful knees look tidy on film. That is why treatment targets function, not the picture.",
        "Strength is the best-evidenced intervention for knee osteoarthritis. Quadriceps, hip abductors and calf capacity all reduce load through the joint. Two or three resistance sessions a week, sustained for three months, beats any brace or supplement.",
        "Keep the knee moving: stationary cycling with low resistance is ideal on flare days. Weight matters where it exists — even five kilos off reduces joint load several-fold per step.",
        "See a physiotherapist promptly if the knee locks, gives way, swells suddenly, or you cannot fully straighten it. Those need assessment before a home programme.",
      ],
    },
  ],

  // Records that demo what gets stored in MongoDB when someone books.
  sampleAppointments: [
    {
      fullName: "Ananya Ghosh",
      phone: "+91 98123 45670",
      email: "ananya.demo@example.com",
      service: "Orthopaedic Rehabilitation",
      preferredDate: "2026-11-09",
      preferredTime: "10:00",
      notes: "Low back pain for 3 weeks, worse after driving.",
      status: "confirmed",
    },
    {
      fullName: "Vikram Shetty",
      phone: "+91 98123 45671",
      email: "vikram.demo@example.com",
      service: "Sports Injury Physiotherapy",
      preferredDate: "2026-11-10",
      preferredTime: "17:30",
      notes: "Grade 2 hamstring strain, wants return-to-play plan.",
      status: "new",
    },
    {
      fullName: "Fatima Sheikh",
      phone: "+91 98123 45672",
      email: "fatima.demo@example.com",
      service: "Women's Health",
      preferredDate: "2026-11-11",
      preferredTime: "09:30",
      notes: "8 months post-natal, core and diastasis check.",
      status: "completed",
    },
  ],

  sampleMessages: [
    {
      fullName: "Rakesh Menon",
      phone: "+91 98123 45673",
      email: "rakesh.demo@example.com",
      subject: "Home visit for my mother",
      message:
        "My mother is 74 and recovering from a hip fracture. Do you cover home visits in Jayanagar on Sundays?",
      status: "new",
    },
    {
      fullName: "Tanvi Desai",
      phone: "+91 98123 45674",
      email: "tanvi.demo@example.com",
      subject: "Package pricing",
      message:
        "Is the Recovery 5 package transferable to my husband? He has a shoulder issue too.",
      status: "read",
    },
  ],
};

/** Collections written by the seed script. */
export const collections = {
  services: "services",
  packages: "packages",
  team: "team",
  testimonials: "testimonials",
  faqs: "faqs",
  articles: "articles",
  appointments: "appointments",
  messages: "messages",
};

export const seedDemo = {
  appointments: demoContent.sampleAppointments.map((a, i) => ({
    ...a,
    createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
  })),
  messages: demoContent.sampleMessages.map((m, i) => ({
    ...m,
    createdAt: new Date(Date.now() - (i + 1) * 43200000).toISOString(),
  })),
};

export default demoContent;
