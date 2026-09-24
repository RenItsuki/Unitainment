import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial community threads and sample user data...");

  // 1. Create a community creator user
  const adminUser = await prisma.user.upsert({
    where: { email: "joy.karmakar@unitainment.demo" },
    update: {},
    create: {
      name: "Joy Karmakar",
      email: "joy.karmakar@unitainment.demo",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=JoyKarmakar",
      bio: "Creator & Entertainment curator on Unitainment.",
    },
  });

  const memberUser = await prisma.user.upsert({
    where: { email: "alex.gamer@unitainment.demo" },
    update: {},
    create: {
      name: "Alex Vance",
      email: "alex.gamer@unitainment.demo",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexVance",
      bio: "Anime binge-watcher and Souls-like veteran.",
    },
  });

  // 2. Create sample forum threads
  const thread1 = await prisma.forumThread.create({
    data: {
      userId: adminUser.id,
      category: "ANIME",
      title: "Why Frieren: Beyond Journey's End is the peak fantasy of this decade",
      content:
        "Frieren takes the traditional 'defeat the demon king' trope and flips it on its head. Instead of the journey to the end, it explores what happens AFTER the adventure is won. The portrayal of time passing, elven perception of human lifespans, and Himmel's quiet influence is nothing short of breathtaking. What was your favorite scene?",
      tags: "frieren, fantasy, mal, madhouse",
      views: 142,
    },
  });

  await prisma.forumReply.create({
    data: {
      threadId: thread1.id,
      userId: memberUser.id,
      content:
        "Couldn't agree more! The dance scene with Fern and Stark, along with the first-class mage exam arc, showed that the show could transition between serene melancholy and god-tier animation effortlessly.",
    },
  });

  const thread2 = await prisma.forumThread.create({
    data: {
      userId: memberUser.id,
      category: "MOVIES",
      title: "Oppenheimer vs Dune 2: Which IMAX experience blew you away more?",
      content:
        "Both Christopher Nolan and Denis Villeneuve delivered phenomenal theatrical experiences in the last 2 years. Nolan's Trinity test scene with absolute silence followed by visceral sonic waves, versus Villeneuve's worm-riding and Harkonnen arena scenes. How do they compare for you?",
      tags: "oppenheimer, dune2, imax, cinema",
      views: 98,
    },
  });

  await prisma.forumReply.create({
    data: {
      threadId: thread2.id,
      userId: adminUser.id,
      content:
        "Both are modern masterpieces, but Hans Zimmer's score paired with the Giedi Prime black-and-white infrared camera sequence in Dune 2 was something I'll never forget.",
    },
  });

  const thread3 = await prisma.forumThread.create({
    data: {
      userId: adminUser.id,
      category: "GAMES",
      title: "Elden Ring: Shadow of the Erdtree boss design discussions",
      content:
        "FromSoftware raised the bar with Messmer and the Scadutree fragment progression. Who was your hardest boss fight in the Realm of Shadow?",
      tags: "eldenring, souls, fromsoftware, dlc",
      views: 230,
    },
  });

  // 3. Seed welcome live chat messages
  await prisma.chatMessage.createMany({
    data: [
      {
        userId: adminUser.id,
        channel: "global",
        message: "Welcome to Unitainment! Enjoy tracking your movies, anime, and games all in one place 🚀",
      },
      {
        userId: memberUser.id,
        channel: "global",
        message: "Finally an app where I don't have to juggle between MAL and IMDb tabs!",
      },
      {
        userId: adminUser.id,
        channel: "anime",
        message: "What seasonal anime are you watching this season?",
      },
      {
        userId: memberUser.id,
        channel: "games",
        message: "Anyone down for co-op later tonight?",
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
