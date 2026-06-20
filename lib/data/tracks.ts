export const tracks = {
  // --- TECH HUB ---
  "software-engineer": {
    title: "Software Engineer",
    interviewer: {
      name: "Ravi",
      role: "Senior Engineering Manager",
      personaId: "swe-manager"
    },
    skills: ["Data Structures", "Algorithms", "System Design", "Scalability", "API Design", "Behavioral"],
    rounds: [
      { id: "dsa", title: "Round 1: Data Structures & Algorithms", desc: "Solve algorithmic challenges focusing on time/space complexity.", time: "45 mins", questions: 2, type: "coding" },
      { id: "system-design", title: "Round 2: System Design", desc: "Architect a highly scalable distributed system.", time: "60 mins", questions: 2 },
      { id: "behavioral", title: "Round 3: Behavioral & Culture Fit", desc: "Discuss past projects, conflict resolution, and leadership.", time: "30 mins", questions: 3 }
    ]
  },
  "web-developer": {
    title: "Web Developer",
    interviewer: {
      name: "Vikram",
      role: "Principal Frontend Architect",
      personaId: "system-design"
    },
    skills: ["React", "JavaScript", "TypeScript", "CSS", "Performance"],
    rounds: [
      { id: "frontend-coding", title: "Round 1: UI Component Coding", desc: "Build a responsive React component from scratch with state.", time: "45 mins", questions: 2, type: "coding" },
      { id: "js-fundamentals", title: "Round 2: JS/TS Fundamentals", desc: "Deep dive into closures, event loop, and DOM manipulation.", time: "45 mins", questions: 3, type: "coding" },
      { id: "system-design", title: "Round 3: Frontend System Design", desc: "Architect a complex web application like Netflix or Trello.", time: "60 mins", questions: 2 }
    ]
  },
  "ai-ml-engineer": {
    title: "AI / ML Engineer",
    interviewer: {
      name: "Dr. Rao",
      role: "Lead Machine Learning Engineer",
      personaId: "data-scientist"
    },
    skills: ["Deep Learning", "PyTorch", "TensorFlow", "Math", "MLOps"],
    rounds: [
      { id: "ml-coding", title: "Round 1: Applied ML Coding", desc: "Implement a neural network layer or loss function from scratch.", time: "45 mins", questions: 2, type: "coding" },
      { id: "theory", title: "Round 2: ML Theory & Math", desc: "Backpropagation, gradient descent, and optimization techniques.", time: "45 mins", questions: 3 },
      { id: "system-design", title: "Round 3: ML System Design", desc: "Design a real-time fraud detection ML pipeline.", time: "60 mins", questions: 2 }
    ]
  },
  "gen-ai-engineer": {
    title: "GenAI Engineer",
    interviewer: {
      name: "Ravi",
      role: "Director of Generative AI",
      personaId: "swe-manager"
    },
    skills: ["LLMs", "RAG", "Prompt Engineering", "Vector DBs", "LangChain"],
    rounds: [
      { id: "rag-coding", title: "Round 1: RAG Implementation", desc: "Build a semantic search and retrieval chain.", time: "45 mins", questions: 2, type: "coding" },
      { id: "llm-theory", title: "Round 2: LLM Architecture", desc: "Attention mechanisms, transformers, and fine-tuning (LoRA/QLoRA).", time: "45 mins", questions: 3 },
      { id: "evals", title: "Round 3: Evals & Guardrails", desc: "Design an evaluation framework to prevent prompt injection.", time: "45 mins", questions: 2 }
    ]
  },
  "swe-intern": {
    title: "Software Engineering Intern",
    interviewer: {
      name: "Riya",
      role: "University Technical Recruiter",
      personaId: "intern-recruiter"
    },
    skills: ["CS Fundamentals", "Basic Algorithms", "OOP", "Communication", "Problem Solving"],
    rounds: [
      { id: "cs-fundamentals", title: "Round 1: CS Fundamentals", desc: "Object-oriented programming, databases, and OS concepts.", time: "30 mins", questions: 4 },
      { id: "basic-dsa", title: "Round 2: Basic Algorithms", desc: "Arrays, Strings, and basic tree traversals.", time: "45 mins", questions: 3, type: "coding" },
      { id: "projects", title: "Round 3: Past Projects Review", desc: "Deep dive into your resume and personal projects.", time: "30 mins", questions: 3 }
    ]
  },
  "product-manager": {
    title: "Product Manager",
    interviewer: {
      name: "Ananya",
      role: "VP of Product Management",
      personaId: "product-manager"
    },
    skills: ["Product Sense", "Metric Design", "A/B Testing", "Prioritization", "Stakeholder Management"],
    rounds: [
      { id: "product-sense", title: "Round 1: Product Design & Sense", desc: "Design a new product from scratch for a specific user persona.", time: "45 mins", questions: 3 },
      { id: "execution", title: "Round 2: Execution & Metrics", desc: "Define success metrics and handle a sudden drop in engagement.", time: "45 mins", questions: 3 },
      { id: "behavioral", title: "Round 3: Behavioral", desc: "Handling difficult stakeholders and engineering pushback.", time: "30 mins", questions: 3 }
    ]
  },
  "data-scientist": {
    title: "Data Scientist",
    interviewer: {
      name: "Dr. Rao",
      role: "Lead Data Scientist",
      personaId: "data-scientist"
    },
    skills: ["Machine Learning", "Statistics", "SQL", "Python", "Business Acumen"],
    rounds: [
      { id: "stats-ml", title: "Round 1: Stats & ML Theory", desc: "Explain bias-variance tradeoff, p-values, and model selection.", time: "45 mins", questions: 4, type: "coding" },
      { id: "case-study", title: "Round 2: Data Case Study", desc: "Design a recommendation engine for a streaming service.", time: "60 mins", questions: 2 }
    ]
  },
  "security-engineer": {
    title: "Security Engineer",
    interviewer: {
      name: "Aisha",
      role: "Chief Information Security Officer",
      personaId: "cyber"
    },
    skills: ["AppSec", "Cryptography", "Network Security", "Penetration Testing", "Incident Response"],
    rounds: [
      { id: "threat-modeling", title: "Round 1: Threat Modeling", desc: "Identify vulnerabilities in a modern microservices architecture.", time: "45 mins", questions: 3 },
      { id: "incident", title: "Round 2: Incident Response", desc: "Simulate a live data breach and mitigate the damage.", time: "60 mins", questions: 2 }
    ]
  },

  // --- GOVERNMENT SERVICES ---
  "civil-services": {
    title: "Civil Services Board",
    interviewer: {
      name: "Mr. Sharma",
      role: "UPSC Board Chairman",
      personaId: "upsc-board"
    },
    skills: ["Current Affairs", "Policy Analysis", "Constitutional Law", "Ethics", "Diplomacy"],
    rounds: [
      { id: "daf", title: "Round 1: DAF Analysis", desc: "Questions based strictly on your Detailed Application Form.", time: "15 mins", questions: 4 },
      { id: "current-affairs", title: "Round 2: Policy & Current Affairs", desc: "Analytical questions on recent national and international events.", time: "20 mins", questions: 3 },
      { id: "situational", title: "Round 3: Situational & Ethics", desc: "High-pressure ethical dilemmas and administrative scenarios.", time: "20 mins", questions: 3 }
    ]
  },
  "public-sector": {
    title: "Public Sector (PSU)",
    interviewer: {
      name: "Mrs. Gupta",
      role: "Public Sector Technical Director",
      personaId: "psu-board"
    },
    skills: ["Core Engineering", "General Awareness", "Administrative Aptitude", "Ethics"],
    rounds: [
      { id: "core-tech", title: "Round 1: Core Technical", desc: "Deep dive into your engineering discipline fundamentals.", time: "30 mins", questions: 5 },
      { id: "hr", title: "Round 2: HR & Admin", desc: "Assessing your fit for a government enterprise environment.", time: "30 mins", questions: 3 }
    ]
  },

  // --- BUSINESS & CONSULTING ---
  "management-consultant": {
    title: "Management Consultant",
    interviewer: {
      name: "Raj",
      role: "Senior Partner at McKinsey",
      personaId: "consultant"
    },
    skills: ["Market Sizing", "Profitability Frameworks", "Mental Math", "Business Strategy"],
    rounds: [
      { id: "market-sizing", title: "Round 1: Market Sizing", desc: "Estimate the market size for a bizarre new product.", time: "30 mins", questions: 2 },
      { id: "profitability", title: "Round 2: Profitability Case", desc: "Analyze why a Fortune 500 company is losing money.", time: "45 mins", questions: 2 }
    ]
  },
  "investment-banker": {
    title: "Investment Banker",
    interviewer: {
      name: "Neha",
      role: "Managing Director of Investment Banking",
      personaId: "banker"
    },
    skills: ["Financial Modeling", "Valuation", "Accounting", "M&A", "LBO"],
    rounds: [
      { id: "technicals", title: "Round 1: Financial Technicals", desc: "Accounting questions, DCF, and enterprise value calculations.", time: "45 mins", questions: 5 },
      { id: "deal-pitch", title: "Round 2: Deal Pitch", desc: "Pitch a potential M&A target in a specific industry.", time: "30 mins", questions: 2 }
    ]
  },
  "enterprise-sales": {
    title: "B2B Enterprise Sales",
    interviewer: {
      name: "Arjun",
      role: "VP of Global Enterprise Sales",
      personaId: "sales"
    },
    skills: ["Objection Handling", "Cold Calling", "Discovery", "Closing", "Negotiation"],
    rounds: [
      { id: "discovery", title: "Round 1: Discovery Call", desc: "Run a discovery call with a skeptical CTO.", time: "30 mins", questions: 3 },
      { id: "closing", title: "Round 2: Closing & Negotiation", desc: "Handle budget objections and close a 6-figure SaaS deal.", time: "30 mins", questions: 3 }
    ]
  },

  // --- HEALTHCARE ---
  "medical-residency": {
    title: "Medical Residency",
    interviewer: {
      name: "Dr. Patel",
      role: "Chief of Surgery",
      personaId: "medical-board"
    },
    skills: ["Medical Ethics", "Empathy", "Crisis Management", "Teamwork", "Clinical Judgment"],
    rounds: [
      { id: "mmi-1", title: "Station 1: Breaking Bad News", desc: "Simulated conversation delivering difficult news to a patient.", time: "10 mins", questions: 2 },
      { id: "mmi-2", title: "Station 2: Ethical Dilemma", desc: "Handle a colleague who is impaired during a shift.", time: "10 mins", questions: 2 }
    ]
  },
  "patient-care": {
    title: "Patient Care Coordinator",
    interviewer: {
      name: "Nurse Kavya",
      role: "Head of Patient Care Operations",
      personaId: "nursing-board"
    },
    skills: ["Patient Empathy", "Conflict Resolution", "Triage", "Communication"],
    rounds: [
      { id: "angry-patient", title: "Round 1: Conflict Resolution", desc: "De-escalate a situation with an angry family member.", time: "20 mins", questions: 3 },
      { id: "prioritization", title: "Round 2: Shift Prioritization", desc: "Manage multiple conflicting patient requests simultaneously.", time: "20 mins", questions: 2 }
    ]
  },

  // --- BEHAVIORAL & COMMUNICATION ---
  "hr-culture-fit": {
    title: "HR Culture Fit",
    interviewer: {
      name: "Sneha",
      role: "Global Head of Talent Acquisition",
      personaId: "hr-behavioral"
    },
    skills: ["STAR Method", "Conflict Resolution", "Leadership", "Adaptability", "Teamwork"],
    rounds: [
      { id: "star-method", title: "Round 1: Experience Dive", desc: "Tell me about a time you failed and how you recovered.", time: "30 mins", questions: 3 },
      { id: "culture-fit", title: "Round 2: Alignment", desc: "Assess alignment with core company values and mission.", time: "20 mins", questions: 3 }
    ]
  },
  "salary-negotiation": {
    title: "Salary Negotiation",
    interviewer: {
      name: "Sneha",
      role: "Global Head of Talent Acquisition",
      personaId: "hr-behavioral"
    },
    skills: ["Market Research", "Value Proposition", "Confidence", "Compromise"],
    rounds: [
      { id: "lowball", title: "Round 1: The Lowball Offer", desc: "Respond to an offer that is 20% below your market rate.", time: "15 mins", questions: 2 },
      { id: "comp-package", title: "Round 2: Total Compensation", desc: "Negotiate equity, signing bonus, and PTO.", time: "15 mins", questions: 3 }
    ]
  },
  "professional-english": {
    title: "Professional English",
    interviewer: {
      name: "Priya",
      role: "Executive Communication Coach",
      personaId: "hr-behavioral"
    },
    skills: ["Grammar", "Fluency", "Vocabulary", "Business Idioms", "Confidence"],
    rounds: [
      { id: "watercooler", title: "Round 1: Watercooler Chat", desc: "Make small talk with a senior executive in the elevator.", time: "10 mins", questions: 3 },
      { id: "presentation", title: "Round 2: Project Update", desc: "Deliver a concise status update in a daily standup.", time: "15 mins", questions: 2 }
    ]
  }
};
