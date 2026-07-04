export type InstagramComment = {
  username: string;
  avatar: string;
  text: string;
  timeAgo: string;
  likes: number;
};

export type InstagramPost = {
  slug: string;
  image: string;
  imageAlt: string;
  location: string;
  caption: string;
  hashtags: string[];
  likes: number;
  shares: number;
  bookmarks: number;
  timeAgo: string;
  comments: InstagramComment[];
};

export const instagramPosts: InstagramPost[] = [
  {
    slug: "were-launching",
    image: "/social/were-launching.jpg",
    imageAlt: "Million Classics launch announcement",
    location: "Lagos, Nigeria",
    caption:
      "It's official - Million Classics is launching in Lagos this June. One book, five schools, one cohort of students who will read, write and be recognised together.",
    hashtags: ["MillionClassics", "LagosPilot", "ReadingCulture"],
    likes: 214,
    shares: 34,
    bookmarks: 58,
    timeAgo: "2d",
    comments: [
      {
        username: "amina.bello",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "This is exactly what our schools need. Counting down to June!",
        timeAgo: "2d",
        likes: 12,
      },
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "Proud to be a partner on this one.",
        timeAgo: "1d",
        likes: 6,
      },
      {
        username: "ngozi.reads",
        avatar: "linear-gradient(135deg,#4AABB0,#321A42)",
        text: "Finally, a programme that takes essay writing seriously.",
        timeAgo: "18h",
        likes: 3,
      },
    ],
  },
  {
    slug: "more-than-books",
    image: "/social/the-mission.jpg",
    imageAlt: "Million Classics mission graphic showing the four programme pillars",
    location: "Million Classics HQ",
    caption:
      "The Launch Cycle isn't just a reading list. It's reading, reflection, writing and recognition - one full cycle, built around a single classic text.",
    hashtags: ["TheProgramme", "CriticalThinking"],
    likes: 176,
    shares: 21,
    bookmarks: 40,
    timeAgo: "3d",
    comments: [
      {
        username: "teacher.folake",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "The four-stage cycle is such a smart structure for secondary schools.",
        timeAgo: "3d",
        likes: 9,
      },
      {
        username: "chuka_writes",
        avatar: "linear-gradient(135deg,#AA7836,#E07030)",
        text: "Essay competitions + civic education in one programme. Love this.",
        timeAgo: "2d",
        likes: 4,
      },
    ],
  },
  {
    slug: "animal-farm",
    image: "/social/animal-farm-question.jpg",
    imageAlt: "Animal Farm reading post with the full Launch Cycle essay question",
    location: "The Reading List",
    caption:
      "Cycle one's classic: Animal Farm by George Orwell. A study of power, propaganda and how easily language is bent to control - the students' first close read.",
    hashtags: ["AnimalFarm", "GeorgeOrwell", "NowReading"],
    likes: 331,
    shares: 47,
    bookmarks: 96,
    timeAgo: "4d",
    comments: [
      {
        username: "bookwormlagos",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "Perfect first title - dense enough to discuss, short enough to finish.",
        timeAgo: "4d",
        likes: 15,
      },
      {
        username: "amina.bello",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "\"All animals are equal\" is going to spark some great essays.",
        timeAgo: "3d",
        likes: 11,
      },
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "Which title is Cycle 2?",
        timeAgo: "3d",
        likes: 2,
      },
    ],
  },
  {
    slug: "five-schools",
    image: "/social/five-schools.jpg",
    imageAlt: "Five Lagos State pilot schools listed with their area tags",
    location: "Lagos State",
    caption:
      "Five schools. One cohort. The Launch Cycle goes live across Lagos State this June, reaching students who've never had a structured reading programme before.",
    hashtags: ["LagosState", "LaunchCycle", "June2026"],
    likes: 189,
    shares: 19,
    bookmarks: 33,
    timeAgo: "5d",
    comments: [
      {
        username: "teacher.folake",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "So excited for my school to be part of this cohort.",
        timeAgo: "5d",
        likes: 8,
      },
      {
        username: "ngozi.reads",
        avatar: "linear-gradient(135deg,#4AABB0,#321A42)",
        text: "Which schools made the pilot list?",
        timeAgo: "4d",
        likes: 1,
      },
    ],
  },
  {
    slug: "backed-on-day-one",
    image: "/social/partners.jpg",
    imageAlt: "Million Classics partners post featuring Ekenua, Academy Press, and the Ministry of Education",
    location: "Million Classics HQ",
    caption:
      "Grateful to our first delivery partners for backing the Launch Cycle before a single book was printed. Sponsorship is what makes the first cohort possible.",
    hashtags: ["DeliveryPartners", "Sponsorship"],
    likes: 142,
    shares: 26,
    bookmarks: 22,
    timeAgo: "6d",
    comments: [
      {
        username: "chuka_writes",
        avatar: "linear-gradient(135deg,#AA7836,#E07030)",
        text: "Great to see local partners stepping up early.",
        timeAgo: "6d",
        likes: 5,
      },
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "Honoured to be on this list.",
        timeAgo: "5d",
        likes: 10,
      },
    ],
  },
  {
    slug: "were-live",
    image: "/social/were-live.jpg",
    imageAlt: "Million Classics Launch Cycle going live in Lagos",
    location: "Lagos, Nigeria",
    caption:
      "We're live. As of today, the Launch Cycle is officially running in five Lagos State schools. Thank you to everyone who backed the first cohort.",
    hashtags: ["WereLive", "LagosPilot"],
    likes: 402,
    shares: 61,
    bookmarks: 88,
    timeAgo: "1w",
    comments: [
      {
        username: "amina.bello",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "What a milestone. Congratulations to the whole team!",
        timeAgo: "1w",
        likes: 22,
      },
      {
        username: "bookwormlagos",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "Following this journey closely - good luck to the students.",
        timeAgo: "6d",
        likes: 14,
      },
      {
        username: "teacher.folake",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "Day one went so well. The students were buzzing.",
        timeAgo: "6d",
        likes: 9,
      },
    ],
  },
  {
    slug: "back-the-first-cycle",
    image: "/social/become-a-sponsor.jpg",
    imageAlt: "Become a Sponsor post with Million Classics sponsorship tiers",
    location: "millionclassics.org",
    caption:
      "Sponsorship for the next cohort is open. Back the first cycle and help put a classic text - and a real shot at recognition - into a student's hands.",
    hashtags: ["BecomeASponsor", "SupportEducation"],
    likes: 267,
    shares: 53,
    bookmarks: 71,
    timeAgo: "1w",
    comments: [
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "DMing you about a corporate sponsorship.",
        timeAgo: "1w",
        likes: 7,
      },
      {
        username: "chuka_writes",
        avatar: "linear-gradient(135deg,#AA7836,#E07030)",
        text: "Shared with my company's CSR team.",
        timeAgo: "5d",
        likes: 5,
      },
    ],
  },
  {
    slug: "cohort-1-underway",
    image: "/social/cohort-1-underway.jpg",
    imageAlt: "Million Classics Cohort 1 underway social post",
    location: "Lagos, Nigeria",
    caption:
      "Cohort 1 is underway. Across five schools in Lagos, 240 learners are already reading, discussing, and growing with Million Classics.",
    hashtags: ["MillionClassics", "Cohort1", "LagosSchools"],
    likes: 238,
    shares: 29,
    bookmarks: 44,
    timeAgo: "8h",
    comments: [
      {
        username: "teacher.folake",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "Love seeing this move from idea to real classrooms.",
        timeAgo: "7h",
        likes: 10,
      },
      {
        username: "bookwormlagos",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "Five schools at once is such a strong start.",
        timeAgo: "6h",
        likes: 6,
      },
    ],
  },
  {
    slug: "powered-by-partners",
    image: "/social/powered-by-partners.jpg",
    imageAlt: "Million Classics partners support social post",
    location: "Million Classics HQ",
    caption:
      "Powered by strong partners. Million Classics is supported by the Ekenua Foundation, Academy Press, and the Lagos State Ministry of Education.",
    hashtags: ["MillionClassics", "Partners", "EducationSupport"],
    likes: 184,
    shares: 18,
    bookmarks: 27,
    timeAgo: "10h",
    comments: [
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "Partnerships like this are what help programmes last.",
        timeAgo: "9h",
        likes: 8,
      },
      {
        username: "amina.bello",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "Strong backing from day one.",
        timeAgo: "8h",
        likes: 4,
      },
    ],
  },
  {
    slug: "bigger-impact",
    image: "/social/bigger-impact.jpg",
    imageAlt: "Million Classics literacy access impact social post",
    location: "Million Classics HQ",
    caption:
      "Built for bigger impact. This is about making quality literacy access possible for more young readers, one school at a time.",
    hashtags: ["LiteracyAccess", "ReadingCulture", "MillionClassics"],
    likes: 161,
    shares: 16,
    bookmarks: 31,
    timeAgo: "12h",
    comments: [
      {
        username: "ngozi.reads",
        avatar: "linear-gradient(135deg,#4AABB0,#321A42)",
        text: "This line is the heart of the whole project.",
        timeAgo: "11h",
        likes: 7,
      },
    ],
  },
  {
    slug: "lagos-is-the-beginning",
    image: "/social/lagos-is-the-beginning.jpg",
    imageAlt: "Million Classics expansion from Lagos to Ogun social post",
    location: "Lagos, Nigeria",
    caption:
      "Lagos is just the beginning. Million Classics is running in Lagos now, with Ogun State next in early 2027.",
    hashtags: ["Lagos", "OgunState", "EducationExpansion"],
    likes: 206,
    shares: 24,
    bookmarks: 36,
    timeAgo: "14h",
    comments: [
      {
        username: "chuka_writes",
        avatar: "linear-gradient(135deg,#AA7836,#E07030)",
        text: "Already excited for the next state launch.",
        timeAgo: "13h",
        likes: 5,
      },
    ],
  },
  {
    slug: "safe-spaces-matter",
    image: "/social/safe-spaces-matter.jpg",
    imageAlt: "Million Classics safeguarding social post",
    location: "millionclassics.org",
    caption:
      "Safe spaces matter. Every learner deserves a programme built on trust, care, and clear safeguarding standards.",
    hashtags: ["Safeguarding", "SafeSpaces", "MillionClassics"],
    likes: 149,
    shares: 12,
    bookmarks: 25,
    timeAgo: "16h",
    comments: [
      {
        username: "teacher.folake",
        avatar: "linear-gradient(135deg,#4880B8,#B070B0)",
        text: "Really glad this is being said clearly and publicly.",
        timeAgo: "15h",
        likes: 6,
      },
    ],
  },
  {
    slug: "confident-readers",
    image: "/social/confident-readers.jpg",
    imageAlt: "Million Classics confident readers goal social post",
    location: "Yaba, Lagos",
    caption:
      "The goal is simple: confident readers. In Yaba, facilitator Amaka Obi is leading a cohort with a bold target for December.",
    hashtags: ["ConfidentReaders", "Yaba", "ReadingGoals"],
    likes: 223,
    shares: 21,
    bookmarks: 39,
    timeAgo: "18h",
    comments: [
      {
        username: "amina.bello",
        avatar: "linear-gradient(135deg,#7a4de0,#c93a86)",
        text: "That December goal is so strong.",
        timeAgo: "17h",
        likes: 9,
      },
    ],
  },
  {
    slug: "journey-week-8",
    image: "/social/journey-week-8.jpg",
    imageAlt: "Million Classics comprehension growth target social post",
    location: "Lagos, Nigeria",
    caption:
      "This is the journey we're on. Learners are starting the term at 32% comprehension, with a Week 8 goal of 75%.",
    hashtags: ["ReadingGrowth", "Week8", "MillionClassics"],
    likes: 197,
    shares: 19,
    bookmarks: 34,
    timeAgo: "20h",
    comments: [
      {
        username: "bookwormlagos",
        avatar: "linear-gradient(135deg,#321A42,#656794)",
        text: "Love seeing the ambition stated this clearly.",
        timeAgo: "19h",
        likes: 5,
      },
    ],
  },
  {
    slug: "working-with-schools",
    image: "/social/working-with-schools.jpg",
    imageAlt: "Million Classics school partnership social post",
    location: "Lagos State",
    caption:
      "Working hand in hand with schools. This partnership supports curriculum alignment, school access, and shared progress tracking.",
    hashtags: ["SchoolPartnerships", "LagosEducation", "MillionClassics"],
    likes: 175,
    shares: 17,
    bookmarks: 28,
    timeAgo: "22h",
    comments: [
      {
        username: "davidokafor",
        avatar: "linear-gradient(135deg,#e0863a,#c93a86)",
        text: "The collaboration angle is coming through really well here.",
        timeAgo: "21h",
        likes: 4,
      },
    ],
  },
];
