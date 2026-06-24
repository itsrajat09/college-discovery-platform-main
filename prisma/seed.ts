import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding colleges...");

  const colleges = [
    { name: "IIT Delhi", location: "Delhi", fees: 200000, rating: 4.9, description: "Indian Institute of Technology Delhi is one of the top engineering institutions in India.", placements: "45 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1961, type: "Government" },
    { name: "IIT Bombay", location: "Mumbai", fees: 200000, rating: 4.9, description: "IIT Bombay is a premier engineering institution located in Mumbai.", placements: "50 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1958, type: "Government" },
    { name: "DTU", location: "Delhi", fees: 200000, rating: 4.5, description: "Delhi Technological University is one of India's leading state engineering universities.", placements: "22 LPA", courses: ["B.Tech", "M.Tech", "MBA"], established: 1941, type: "Government" },
    { name: "NSUT", location: "Delhi", fees: 220000, rating: 4.4, description: "Netaji Subhas University of Technology is a renowned engineering university in Delhi.", placements: "21 LPA", courses: ["B.Tech", "M.Tech"], established: 1983, type: "Government" },
    { name: "IIIT Delhi", location: "Delhi", fees: 350000, rating: 4.6, description: "Indraprastha Institute of Information Technology Delhi focuses on research-driven CS education.", placements: "28 LPA", courses: ["B.Tech", "M.Tech", "PhD"], established: 2008, type: "Deemed" },
    { name: "BITS Pilani", location: "Pilani, Rajasthan", fees: 500000, rating: 4.7, description: "BITS Pilani is a top private engineering university famous for its practice school program.", placements: "35 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1964, type: "Deemed" },
    { name: "VIT Vellore", location: "Vellore, Tamil Nadu", fees: 400000, rating: 4.3, description: "Vellore Institute of Technology is one of India's largest private engineering universities.", placements: "18 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1984, type: "Deemed" },
    { name: "SRM Institute", location: "Chennai, Tamil Nadu", fees: 350000, rating: 4.1, description: "SRM Institute of Science and Technology is a top private university with campuses across India.", placements: "15 LPA", courses: ["B.Tech", "M.Tech", "MBA"], established: 1985, type: "Deemed" },
    { name: "MIT Manipal", location: "Manipal, Karnataka", fees: 450000, rating: 4.4, description: "Manipal Institute of Technology is a prestigious private engineering college.", placements: "20 LPA", courses: ["B.Tech", "M.Tech"], established: 1957, type: "Deemed" },
    { name: "NIT Trichy", location: "Tiruchirappalli, Tamil Nadu", fees: 150000, rating: 4.6, description: "National Institute of Technology Tiruchirappalli is consistently ranked as the best NIT.", placements: "30 LPA", courses: ["B.Tech", "M.Tech", "PhD"], established: 1964, type: "Government" },
    { name: "NIT Warangal", location: "Warangal, Telangana", fees: 150000, rating: 4.5, description: "NIT Warangal is one of the oldest and most prestigious NITs.", placements: "28 LPA", courses: ["B.Tech", "M.Tech", "PhD"], established: 1959, type: "Government" },
    { name: "IIT Madras", location: "Chennai, Tamil Nadu", fees: 200000, rating: 4.9, description: "IIT Madras is India's top-ranked engineering institution.", placements: "48 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1959, type: "Government" },
    { name: "IIT Kanpur", location: "Kanpur, Uttar Pradesh", fees: 200000, rating: 4.8, description: "IIT Kanpur is known for pioneering computer science education in India.", placements: "44 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1959, type: "Government" },
    { name: "IIT Kharagpur", location: "Kharagpur, West Bengal", fees: 200000, rating: 4.8, description: "The oldest IIT in India, IIT Kharagpur offers the widest range of programs.", placements: "42 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1951, type: "Government" },
    { name: "Jadavpur University", location: "Kolkata, West Bengal", fees: 50000, rating: 4.5, description: "Jadavpur University is one of the best state universities in India.", placements: "25 LPA", courses: ["B.Tech", "M.Tech", "PhD"], established: 1955, type: "Government" },
    { name: "COEP Pune", location: "Pune, Maharashtra", fees: 120000, rating: 4.3, description: "College of Engineering Pune is one of India's oldest engineering colleges.", placements: "18 LPA", courses: ["B.Tech", "M.Tech"], established: 1854, type: "Government" },
    { name: "Thapar University", location: "Patiala, Punjab", fees: 380000, rating: 4.2, description: "Thapar Institute of Engineering and Technology is a top private technical university.", placements: "16 LPA", courses: ["B.Tech", "M.Tech", "MBA"], established: 1956, type: "Deemed" },
    { name: "LNMIIT Jaipur", location: "Jaipur, Rajasthan", fees: 280000, rating: 4.0, description: "LNM Institute of Information Technology is a premier private IT university.", placements: "14 LPA", courses: ["B.Tech", "M.Tech"], established: 2003, type: "Deemed" },
    { name: "PEC Chandigarh", location: "Chandigarh", fees: 100000, rating: 4.1, description: "Punjab Engineering College is a prestigious government university.", placements: "15 LPA", courses: ["B.Tech", "M.Tech"], established: 1921, type: "Deemed" },
    { name: "RVCE Bangalore", location: "Bangalore, Karnataka", fees: 220000, rating: 4.3, description: "R.V. College of Engineering is one of Bangalore's top private engineering colleges.", placements: "17 LPA", courses: ["B.Tech", "M.Tech"], established: 1963, type: "Private" },
    { name: "PES University", location: "Bangalore, Karnataka", fees: 300000, rating: 4.2, description: "PES University is a top-ranked private university in Bangalore.", placements: "16 LPA", courses: ["B.Tech", "M.Tech", "MBA"], established: 1972, type: "Deemed" },
    { name: "IIT Roorkee", location: "Roorkee, Uttarakhand", fees: 200000, rating: 4.7, description: "IIT Roorkee is the oldest technical institution in Asia.", placements: "40 LPA", courses: ["B.Tech", "M.Tech", "MBA", "PhD"], established: 1847, type: "Government" },
    { name: "NIT Surathkal", location: "Surathkal, Karnataka", fees: 150000, rating: 4.4, description: "NIT Karnataka is a top NIT on India's west coast.", placements: "26 LPA", courses: ["B.Tech", "M.Tech", "PhD"], established: 1960, type: "Government" },
    { name: "Christ University", location: "Bangalore, Karnataka", fees: 180000, rating: 4.0, description: "Christ University is a premier private institution offering diverse programs.", placements: "10 LPA", courses: ["B.Tech", "BCA", "MBA", "BBA"], established: 1969, type: "Deemed" },
    { name: "Amity University", location: "Noida, Uttar Pradesh", fees: 400000, rating: 3.9, description: "Amity University is one of India's largest private universities.", placements: "12 LPA", courses: ["B.Tech", "MBA", "BCA", "Law", "PhD"], established: 2005, type: "Private" },
  ];

  for (const college of colleges) {
    await prisma.college.create({ data: college });
  }

  console.log(`✅ ${colleges.length} colleges seeded!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());