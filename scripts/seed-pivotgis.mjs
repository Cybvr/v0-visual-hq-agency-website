import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const project = {
  title: "Pivot GIS",
  slug: "pivotgis",
  excerpt: "A Nigerian engineering company providing EPCOM services primarily to the oil and gas sector.",
  description: "Pivot GIS is a Nigerian engineering company that provides Engineering, Procurement, Construction, Operation, and Maintenance (EPCOM) services primarily to the oil and gas sector. They specialize in equipment design and drafting, fabrication and material management, and project management support.",
  category: ["Website"],
  imageUrl: "/placeholder.svg",
  logoUrl: "/placeholder.svg",
  gallery: [],
  client: "Pivot GIS Limited",
  clientValuation: "",
  earnings: "",
  founders: "",
  industry: "Oil & Gas / Engineering",
  projectUrl: "http://www.pivotgis.com",
  status: "published",
  featured: false,
  order: 13,
  tags: ["Engineering", "Oil & Gas", "EPCOM"],
  technologies: ["WordPress"]
};

async function seed() {
  console.log("Seeding started...");
  const colRef = collection(db, "portfolio");
  try {
    const docRef = await addDoc(colRef, {
      ...project,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    console.log(`Successfully added ${project.title} with ID: ${docRef.id}`);
  } catch (e) {
    console.error(`Failed to add ${project.title}:`, e);
  }
  process.exit(0);
}

seed();
