import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. Define payload
const projects = [
  {
    title: "Million Classics",
    slug: "million-classics",
    excerpt:
      "A complete learning experience for Nigerian secondary school students, built around reading, reflection, writing, recognition, and reporting.",
    description:
      "Million Classics is a literacy and civic learning programme built for Nigerian secondary school students. The Launch Cycle runs across five public secondary schools in Lagos State from 15 June 2026, pairing classic literature with guided discussion, essay writing, independent judging, scholarships, and sponsor-facing impact reporting. VisualHQ's portfolio entry highlights the programme's editorial storytelling, social campaign system, and Impact Atlas dashboard experience.",
    category: ["Web Development", "Presentation Design"],
    imageUrl: "/images/screenshots/million-classics-impact-atlas.png",
    logoUrl: "/images/logo.png.png",
    gallery: [
      "/images/screenshots/million-classics-impact-atlas.png",
      "/social/were-live.jpg",
      "/social/the-mission.jpg",
      "/social/five-schools.jpg",
      "/social/become-a-sponsor.jpg"
    ],
    client: "Million Classics",
    clientValuation: "",
    earnings: "",
    founders: "",
    industry: "Education",
    projectUrl: "https://www.millionclassics.org",
    status: "published",
    featured: true,
    order: 9,
    tags: ["2026", "Education", "Literacy", "Lagos", "Impact"],
    technologies: ["Next.js", "Firebase", "Figma", "Social Content"]
  },
  {
    title: "Lagos Biennial",
    slug: "lagos-biennial",
    description: "A prominent contemporary art exhibition held in Lagos (2026 Edition: The Museum of Things Unseen), engaging with urban, social, and political landscapes.",
    category: ["Growth", "Marketing", "Strategy"],
    imageUrl: "/placeholder.svg",
    logoUrl: "/placeholder.svg",
    gallery: [],
    client: "Lagos Biennial",
    clientValuation: "",
    earnings: "",
    founders: "",
    industry: "Art & Culture",
    projectUrl: "https://www.lagos-biennial.org",
    status: "published",
    featured: false,
    order: 10,
    tags: ["2026", "Exhibition", "Art", "Lagos"],
    technologies: ["Notion", "Meta Business", "Figma"]
  },
  {
    title: "Urban Yam Festival",
    slug: "urban-yam-festival",
    description: "A 2019 contemporary, youth-oriented event reimagining the traditional New Yam Festival with food, music, and modern lifestyle elements.",
    category: ["Growth", "Marketing", "Strategy", "Technology"],
    imageUrl: "/placeholder.svg",
    logoUrl: "/placeholder.svg",
    gallery: [],
    client: "Urban Yam Festival",
    clientValuation: "",
    earnings: "",
    founders: "",
    industry: "Events & Lifestyle",
    projectUrl: "",
    status: "published",
    featured: false,
    order: 11,
    tags: ["2019", "Festival", "Culture"],
    technologies: ["Canva", "Notion", "Figma"]
  },
  {
    title: "Ekenua",
    slug: "ekenua",
    description: "A London-headquartered strategic advisory and financing firm focused on corporate advisory, capital raising, and institutional partnerships (Founded 2026).",
    category: ["Website", "Marketing"],
    imageUrl: "/placeholder.svg",
    logoUrl: "/placeholder.svg",
    gallery: [],
    client: "Ekenua",
    clientValuation: "",
    earnings: "",
    founders: "Osamede Okhomina",
    industry: "Finance & Advisory",
    projectUrl: "https://ekenua.com",
    status: "published",
    featured: false,
    order: 12,
    tags: ["2026", "Finance", "Advisory"],
    technologies: ["NextJS", "Codex"]
  }
];

async function seed() {
  console.log("Seeding started...");
  const colRef = collection(db, "portfolio");
  
  for (const proj of projects) {
    try {
      const existingQuery = query(colRef, where("slug", "==", proj.slug));
      const existingSnapshot = await getDocs(existingQuery);

      if (!existingSnapshot.empty) {
        const existingDoc = existingSnapshot.docs[0];
        await updateDoc(existingDoc.ref, {
          ...proj,
          updatedAt: Timestamp.now()
        });
        console.log(`Updated ${proj.title} with ID: ${existingDoc.id}`);
        continue;
      }

      const docRef = await addDoc(colRef, {
        ...proj,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      console.log(`Successfully added ${proj.title} with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Failed to add ${proj.title}:`, e);
    }
  }
  console.log("Seeding finished.");
  process.exit(0);
}

seed();
