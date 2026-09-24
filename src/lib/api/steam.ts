import { UnifiedMediaItem } from "@/types";

const STEAM_API_KEY = process.env.STEAM_API_KEY || "863F709CF92301BE2D4E42F8CBFC4C1B";

export const PRIMARY_STEAM_GAMES: UnifiedMediaItem[] = [
  {
    id: "GAME-STEAM-730",
    externalId: "steam-730",
    type: "GAME",
    title: "Counter-Strike 2",
    originalTitle: "Counter-Strike 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_616x353.jpg",
    releaseDate: "2023-09-27",
    overview: "For over two decades, Counter-Strike has offered an elite competitive experience, one shaped by millions of players from across the globe. Now the next chapter in the CS story is here. This is Counter-Strike 2, built on the Source 2 engine.",
    genres: ["FPS", "Shooter", "Competitive", "Multiplayer", "Tactical"],
    score: 8.8,
    votes: 7900000,
    livePlayers: 1250000,
    avgPlaytime: "500+ hrs (Competitive)",
    price: "Free to Play",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "Linux"],
    studioOrDeveloper: "Valve",
    trailerUrl: "https://www.youtube.com/watch?v=c80dVYcL69E",
    sourceUrl: "https://store.steampowered.com/app/730",
    statusText: "1.25M Playing Right Now"
  },
  {
    id: "GAME-STEAM-1086940",
    externalId: "steam-1086940",
    type: "GAME",
    title: "Baldur's Gate 3",
    originalTitle: "Baldur's Gate 3",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1086940/capsule_616x353.jpg",
    releaseDate: "2023-08-03",
    overview: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power. Mysterious abilities are awakening inside you, drawn from a mind flayer parasite planted in your brain.",
    genres: ["RPG", "Story Rich", "Turn-Based Combat", "Choices Matter", "Fantasy"],
    score: 9.6,
    votes: 560000,
    livePlayers: 95000,
    avgPlaytime: "75 - 150 hrs",
    price: "$59.99",
    country: "Belgium",
    platforms: ["PC (Windows)", "Steam Deck", "macOS"],
    studioOrDeveloper: "Larian Studios",
    trailerUrl: "https://www.youtube.com/watch?v=1T22wNlUiNh",
    sourceUrl: "https://store.steampowered.com/app/1086940",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-1245620",
    externalId: "steam-1245620",
    type: "GAME",
    title: "Elden Ring",
    originalTitle: "ELDEN RING",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg",
    releaseDate: "2022-02-25",
    overview: "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between. A vast world where open fields with a variety of situations and huge dungeons seamlessly connect.",
    genres: ["Souls-like", "Open World", "Dark Fantasy", "Action RPG", "Difficult"],
    score: 9.5,
    votes: 620000,
    livePlayers: 68000,
    avgPlaytime: "60 - 130 hrs",
    price: "$59.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "FromSoftware Inc. / Bandai Namco",
    trailerUrl: "https://www.youtube.com/watch?v=E3Huy2cdih0",
    sourceUrl: "https://store.steampowered.com/app/1245620",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-2358720",
    externalId: "steam-2358720",
    type: "GAME",
    title: "Black Myth: Wukong",
    originalTitle: "Black Myth: Wukong",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2358720/capsule_616x353.jpg",
    releaseDate: "2024-08-20",
    overview: "Black Myth: Wukong is an action RPG rooted in Chinese mythology. You shall set out as the Destined One to venture into the challenges and marvels ahead, to uncover the obscured truth beneath the veil of a glorious legend from the past.",
    genres: ["Action RPG", "Mythology", "Souls-like", "Singleplayer", "Great Soundtrack"],
    score: 9.3,
    votes: 720000,
    livePlayers: 180000,
    avgPlaytime: "35 - 55 hrs",
    price: "$59.99",
    country: "China",
    platforms: ["PC (Windows)"],
    studioOrDeveloper: "Game Science",
    trailerUrl: "https://www.youtube.com/watch?v=pnSsgRJmsCc",
    sourceUrl: "https://store.steampowered.com/app/2358720",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-1091500",
    externalId: "steam-1091500",
    type: "GAME",
    title: "Cyberpunk 2077",
    originalTitle: "Cyberpunk 2077",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1091500/capsule_616x353.jpg",
    releaseDate: "2020-12-10",
    overview: "Cyberpunk 2077 is an open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival. Upgraded with next-gen in mind and featuring free additional content.",
    genres: ["Cyberpunk", "Open World", "RPG", "Sci-Fi", "Action"],
    score: 9.1,
    votes: 650000,
    livePlayers: 52000,
    avgPlaytime: "40 - 100 hrs",
    price: "$59.99",
    country: "Poland",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "CD PROJEKT RED",
    trailerUrl: "https://www.youtube.com/watch?v=qIcTM8WXFjk",
    sourceUrl: "https://store.steampowered.com/app/1091500",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-271590",
    externalId: "steam-271590",
    type: "GAME",
    title: "Grand Theft Auto V",
    originalTitle: "Grand Theft Auto V",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/271590/capsule_616x353.jpg",
    releaseDate: "2015-04-14",
    overview: "When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld, the U.S. government and the entertainment industry, they must pull off a series of dangerous heists.",
    genres: ["Open World", "Action", "Multiplayer", "Crime", "Automobile Sim"],
    score: 9.3,
    votes: 1600000,
    livePlayers: 140000,
    avgPlaytime: "40 - 120+ hrs",
    price: "$29.99",
    country: "UK",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Rockstar North / Rockstar Games",
    trailerUrl: "https://www.youtube.com/watch?v=QkkoHAzjnUs",
    sourceUrl: "https://store.steampowered.com/app/271590",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-1174180",
    externalId: "steam-1174180",
    type: "GAME",
    title: "Red Dead Redemption 2",
    originalTitle: "Red Dead Redemption 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1174180/capsule_616x353.jpg",
    releaseDate: "2019-12-05",
    overview: "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across the vast and rugged heartland of America at the dawn of the modern age.",
    genres: ["Open World", "Story Rich", "Western", "Adventure", "Atmospheric"],
    score: 9.7,
    votes: 530000,
    livePlayers: 45000,
    avgPlaytime: "60 - 140 hrs",
    price: "$59.99",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Rockstar Games",
    trailerUrl: "https://www.youtube.com/watch?v=eaW0tYpxyp0",
    sourceUrl: "https://store.steampowered.com/app/1174180",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-292030",
    externalId: "steam-292030",
    type: "GAME",
    title: "The Witcher 3: Wild Hunt",
    originalTitle: "The Witcher 3: Wild Hunt",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/292030/capsule_616x353.jpg",
    releaseDate: "2015-05-18",
    overview: "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.",
    genres: ["RPG", "Open World", "Story Rich", "Atmospheric", "Dark Fantasy"],
    score: 9.6,
    votes: 720000,
    livePlayers: 38000,
    avgPlaytime: "55 - 150 hrs",
    price: "$39.99",
    country: "Poland",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "CD PROJEKT RED",
    trailerUrl: "https://www.youtube.com/watch?v=XHrskkHf958",
    sourceUrl: "https://store.steampowered.com/app/292030",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-570",
    externalId: "steam-570",
    type: "GAME",
    title: "Dota 2",
    originalTitle: "Dota 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/570/capsule_616x353.jpg",
    releaseDate: "2013-07-09",
    overview: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. And no matter if it's their 10th hour of play or 1,000th, there's always something new to discover. With regular updates that ensure a constant evolution of gameplay.",
    genres: ["Free to Play", "MOBA", "Strategy", "Multiplayer", "Team-Based"],
    score: 8.9,
    votes: 2200000,
    livePlayers: 650000,
    avgPlaytime: "1000+ hrs (Competitive MOBA)",
    price: "Free to Play",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "Linux", "macOS"],
    studioOrDeveloper: "Valve",
    trailerUrl: "https://www.youtube.com/watch?v=-cSFPIwMEq4",
    sourceUrl: "https://store.steampowered.com/app/570",
    statusText: "650K Playing Right Now"
  },
  {
    id: "GAME-STEAM-553850",
    externalId: "steam-553850",
    type: "GAME",
    title: "HELLDIVERS™ 2",
    originalTitle: "HELLDIVERS™ 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/553850/capsule_616x353.jpg",
    releaseDate: "2024-02-08",
    overview: "The Galaxy's Last Line of Offence. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in a fast, frantic, and ferocious third-person shooter.",
    genres: ["Online Co-Op", "Shooter", "Action", "Third-Person Shooter", "Sci-Fi"],
    score: 8.7,
    votes: 650000,
    livePlayers: 42000,
    avgPlaytime: "35 - 80 hrs",
    price: "$39.99",
    country: "Sweden",
    platforms: ["PC (Windows)"],
    studioOrDeveloper: "Arrowhead Game Studios / PlayStation PC",
    trailerUrl: "https://www.youtube.com/watch?v=l_tN4Kq4V_U",
    sourceUrl: "https://store.steampowered.com/app/553850",
    statusText: "Mostly Positive"
  },
  {
    id: "GAME-STEAM-1623730",
    externalId: "steam-1623730",
    type: "GAME",
    title: "Palworld",
    originalTitle: "Palworld",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1623730/capsule_616x353.jpg",
    releaseDate: "2024-01-19",
    overview: "Fight, farm, build and work alongside mysterious creatures called 'Pals' in this completely new multiplayer, open world survival crafting game! Journey through diverse biomes and discover over 100 unique pals.",
    genres: ["Open World Survival Craft", "Creature Collector", "Multiplayer", "Crafting"],
    score: 8.6,
    votes: 320000,
    livePlayers: 35000,
    avgPlaytime: "35 - 90 hrs",
    price: "$29.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Pocketpair",
    trailerUrl: "https://www.youtube.com/watch?v=kYJvYg_eY6k",
    sourceUrl: "https://store.steampowered.com/app/1623730",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-1172470",
    externalId: "steam-1172470",
    type: "GAME",
    title: "Apex Legends",
    originalTitle: "Apex Legends",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1172470/capsule_616x353.jpg",
    releaseDate: "2020-11-04",
    overview: "Apex Legends is the award-winning, free-to-play Hero Shooter from Respawn Entertainment. Master an ever-growing roster of legendary characters with powerful abilities, and experience strategic squad play and innovative gameplay in the next evolution of Hero Shooter and Battle Royale.",
    genres: ["Free to Play", "Battle Royale", "Multiplayer", "First-Person Shooter", "Hero Shooter"],
    score: 8.5,
    votes: 810000,
    livePlayers: 110000,
    avgPlaytime: "200+ hrs",
    price: "Free to Play",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Respawn Entertainment / Electronic Arts",
    trailerUrl: "https://www.youtube.com/watch?v=innmNewjkuk",
    sourceUrl: "https://store.steampowered.com/app/1172470",
    statusText: "110K Playing Right Now"
  },
  {
    id: "GAME-STEAM-367520",
    externalId: "steam-367520",
    type: "GAME",
    title: "Hollow Knight",
    originalTitle: "Hollow Knight",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg",
    releaseDate: "2017-02-24",
    overview: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures and befriend bizarre bugs, all in a classic, hand-drawn 2D style.",
    genres: ["Metroidvania", "Souls-like", "Atmospheric", "Great Soundtrack", "2D"],
    score: 9.7,
    votes: 310000,
    livePlayers: 12000,
    avgPlaytime: "30 - 65 hrs",
    price: "$14.99",
    country: "Australia",
    platforms: ["PC (Windows)", "Steam Deck", "Linux", "macOS"],
    studioOrDeveloper: "Team Cherry",
    trailerUrl: "https://www.youtube.com/watch?v=UAO2urG23S4",
    sourceUrl: "https://store.steampowered.com/app/367520",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-1145350",
    externalId: "steam-1145350",
    type: "GAME",
    title: "Hades II",
    originalTitle: "Hades II",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1145350/capsule_616x353.jpg",
    releaseDate: "2024-05-06",
    overview: "Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this bewitching sequel to the award-winning rogue-like dungeon crawler. As Melinoë, the Princess of the Underworld, you'll explore a bigger, deeper mythic world.",
    genres: ["Action Roguelike", "Dungeon Crawler", "Mythology", "Action RPG", "Indie"],
    score: 9.5,
    votes: 55000,
    livePlayers: 18000,
    avgPlaytime: "30 - 75 hrs",
    price: "$29.99",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Supergiant Games",
    trailerUrl: "https://www.youtube.com/watch?v=1uR10f2R4Y8",
    sourceUrl: "https://store.steampowered.com/app/1145350",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-582010",
    externalId: "steam-582010",
    type: "GAME",
    title: "Monster Hunter: World",
    originalTitle: "Monster Hunter: World",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/582010/capsule_616x353.jpg",
    releaseDate: "2018-08-09",
    overview: "Welcome to a new world! In Monster Hunter: World, the latest installment in the series, you can enjoy the ultimate hunting experience, using everything at your disposal to hunt monsters in a new world teeming with surprises and excitement.",
    genres: ["Hunting", "Action RPG", "Co-Op", "Multiplayer", "Open World"],
    score: 9.2,
    votes: 270000,
    livePlayers: 50000,
    avgPlaytime: "50 - 150+ hrs",
    price: "$29.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "CAPCOM Co., Ltd.",
    trailerUrl: "https://www.youtube.com/watch?v=O_a2a-eY85w",
    sourceUrl: "https://store.steampowered.com/app/582010",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-252490",
    externalId: "steam-252490",
    type: "GAME",
    title: "Rust",
    originalTitle: "Rust",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/252490/capsule_616x353.jpg",
    releaseDate: "2018-02-08",
    overview: "The only aim in Rust is to survive. Everything wants you to die - the island's wildlife and other inhabitants, the environment, other survivors. Do whatever it takes to last another night.",
    genres: ["Survival", "Open World", "Multiplayer", "Crafting", "Sandbox"],
    score: 8.8,
    votes: 880000,
    livePlayers: 85000,
    avgPlaytime: "200+ hrs (Survival Sandbox)",
    price: "$39.99",
    country: "UK",
    platforms: ["PC (Windows)", "macOS"],
    studioOrDeveloper: "Facepunch Studios",
    trailerUrl: "https://www.youtube.com/watch?v=LGcECozNXEw",
    sourceUrl: "https://store.steampowered.com/app/252490",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-1551360",
    externalId: "steam-1551360",
    type: "GAME",
    title: "Forza Horizon 5",
    originalTitle: "Forza Horizon 5",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1551360/capsule_616x353.jpg",
    releaseDate: "2021-11-09",
    overview: "Your Ultimate Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico with limitless, fun driving action in hundreds of the world’s greatest cars.",
    genres: ["Racing", "Open World", "Driving", "Multiplayer", "Sports"],
    score: 9.1,
    votes: 180000,
    livePlayers: 32000,
    avgPlaytime: "40 - 100+ hrs",
    price: "$59.99",
    country: "UK",
    platforms: ["PC (Windows)"],
    studioOrDeveloper: "Playground Games / Xbox Game Studios",
    trailerUrl: "https://www.youtube.com/watch?v=FYH9n37B7Yw",
    sourceUrl: "https://store.steampowered.com/app/1551360",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-105600",
    externalId: "steam-105600",
    type: "GAME",
    title: "Terraria",
    originalTitle: "Terraria",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/105600/capsule_616x353.jpg",
    releaseDate: "2011-05-16",
    overview: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game. Four player co-op, rich boss battles, crafting, and infinite exploration.",
    genres: ["Open World Survival Craft", "Sandbox", "2D", "Adventure", "Multiplayer"],
    score: 9.7,
    votes: 1200000,
    livePlayers: 48000,
    avgPlaytime: "100+ hrs",
    price: "$9.99",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "macOS", "Linux"],
    studioOrDeveloper: "Re-Logic",
    trailerUrl: "https://www.youtube.com/watch?v=w7uOhFTrrq0",
    sourceUrl: "https://store.steampowered.com/app/105600",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-413150",
    externalId: "steam-413150",
    type: "GAME",
    title: "Stardew Valley",
    originalTitle: "Stardew Valley",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg",
    releaseDate: "2016-02-26",
    overview: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land?",
    genres: ["Farming Sim", "RPG", "Relaxing", "Multiplayer", "Pixel Graphics"],
    score: 9.8,
    votes: 680000,
    livePlayers: 72000,
    avgPlaytime: "80 - 200+ hrs",
    price: "$14.99",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "macOS", "Linux"],
    studioOrDeveloper: "ConcernedApe",
    trailerUrl: "https://www.youtube.com/watch?v=ot7uXGQskNo",
    sourceUrl: "https://store.steampowered.com/app/413150",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-814380",
    externalId: "steam-814380",
    type: "GAME",
    title: "Sekiro: Shadows Die Twice",
    originalTitle: "Sekiro: Shadows Die Twice",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/814380/capsule_616x353.jpg",
    releaseDate: "2019-03-22",
    overview: "Game of the Year - The Game Awards 2019. Carve your own clever path to vengeance in the award-winning adventure from developer FromSoftware, creators of Dark Souls.",
    genres: ["Souls-like", "Difficult", "Action", "Ninja", "Singleplayer"],
    score: 9.5,
    votes: 310000,
    livePlayers: 18000,
    avgPlaytime: "35 - 70 hrs",
    price: "$59.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "FromSoftware / Activision",
    trailerUrl: "https://www.youtube.com/watch?v=rXMX4YSTWFw",
    sourceUrl: "https://store.steampowered.com/app/814380",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-381210",
    externalId: "steam-381210",
    type: "GAME",
    title: "Dead by Daylight",
    originalTitle: "Dead by Daylight",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/381210/capsule_616x353.jpg",
    releaseDate: "2016-06-14",
    overview: "Dead by Daylight is a multiplayer (4vs1) horror game where one player takes on the role of the savage Killer, and the other four players play as Survivors, trying to escape the Killer and avoid being caught.",
    genres: ["Horror", "Survival", "Multiplayer", "Online Co-Op", "Action"],
    score: 8.4,
    votes: 540000,
    livePlayers: 42000,
    avgPlaytime: "200+ hrs",
    price: "$19.99",
    country: "Canada",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "Behaviour Interactive Inc.",
    trailerUrl: "https://www.youtube.com/watch?v=JGhIXLO3G80",
    sourceUrl: "https://store.steampowered.com/app/381210",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-1687950",
    externalId: "steam-1687950",
    type: "GAME",
    title: "Persona 5 Royal",
    originalTitle: "Persona 5 Royal",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1687950/capsule_616x353.jpg",
    releaseDate: "2022-10-21",
    overview: "Don the mask of Joker and join the Phantom Thieves of Hearts as they stage grand heists, infiltrate the minds of the corrupt, and make them change their ways!",
    genres: ["JRPG", "Turn-Based Combat", "Anime", "Story Rich", "Great Soundtrack"],
    score: 9.6,
    votes: 75000,
    livePlayers: 14000,
    avgPlaytime: "100 - 130 hrs",
    price: "$59.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "ATLUS / SEGA",
    trailerUrl: "https://www.youtube.com/watch?v=842nN5wR4m4",
    sourceUrl: "https://store.steampowered.com/app/1687950",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-550",
    externalId: "steam-550",
    type: "GAME",
    title: "Left 4 Dead 2",
    originalTitle: "Left 4 Dead 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/550/capsule_616x353.jpg",
    releaseDate: "2009-11-17",
    overview: "Set in the zombie apocalypse, Left 4 Dead 2 is the highly anticipated sequel to the award-winning Left 4 Dead, the #1 co-op game of 2008.",
    genres: ["Zombies", "Co-Op", "FPS", "Action", "Multiplayer"],
    score: 9.7,
    votes: 780000,
    livePlayers: 28000,
    avgPlaytime: "50 - 150 hrs",
    price: "$9.99",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "Linux"],
    studioOrDeveloper: "Valve",
    trailerUrl: "https://www.youtube.com/watch?v=9XIle_ebtnc",
    sourceUrl: "https://store.steampowered.com/app/550",
    statusText: "Overwhelmingly Positive"
  },
  {
    id: "GAME-STEAM-440",
    externalId: "steam-440",
    type: "GAME",
    title: "Team Fortress 2",
    originalTitle: "Team Fortress 2",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/440/capsule_616x353.jpg",
    releaseDate: "2007-10-10",
    overview: "Nine distinct classes provide a broad range of tactical abilities and personalities. Constantly updated with new game modes, maps, equipment and, most importantly, hats!",
    genres: ["Free to Play", "Hero Shooter", "Multiplayer", "FPS", "Funny"],
    score: 9.3,
    votes: 1100000,
    livePlayers: 65000,
    avgPlaytime: "300+ hrs",
    price: "Free to Play",
    country: "USA",
    platforms: ["PC (Windows)", "Steam Deck", "Linux"],
    studioOrDeveloper: "Valve",
    trailerUrl: "https://www.youtube.com/watch?v=h_c3XjeMWQC",
    sourceUrl: "https://store.steampowered.com/app/440",
    statusText: "Very Positive"
  },
  {
    id: "GAME-STEAM-2050650",
    externalId: "steam-2050650",
    type: "GAME",
    title: "Resident Evil 4",
    originalTitle: "Resident Evil 4",
    posterUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900.jpg",
    backdropUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/capsule_616x353.jpg",
    releaseDate: "2023-03-24",
    overview: "Survival is only the beginning. Six years have passed since the biological disaster in Raccoon City. Leon S. Kennedy, one of the survivors, tracks the president's kidnapped daughter to a secluded European village.",
    genres: ["Action", "Horror", "Survival Horror", "Third-Person Shooter"],
    score: 9.6,
    votes: 120000,
    livePlayers: 12000,
    avgPlaytime: "15 - 35 hrs",
    price: "$39.99",
    country: "Japan",
    platforms: ["PC (Windows)", "Steam Deck"],
    studioOrDeveloper: "CAPCOM Co., Ltd.",
    trailerUrl: "https://www.youtube.com/watch?v=j5Ic2z3b1QU",
    sourceUrl: "https://store.steampowered.com/app/2050650",
    statusText: "Overwhelmingly Positive"
  }
];

export function transformSteamGame(item: any): UnifiedMediaItem {
  const appId = item.id;
  const libraryPoster = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${appId}/library_600x900.jpg`;
  const headerPoster = item.header_image || item.large_capsule_image || item.tiny_image;

  return {
    id: `GAME-STEAM-${appId}`,
    externalId: `steam-${appId}`,
    type: "GAME",
    title: item.name || "Steam Game",
    originalTitle: item.name,
    posterUrl: libraryPoster || headerPoster,
    backdropUrl: item.large_capsule_image || item.header_image,
    overview: `Official Steam title available on PC and Steam Deck. ${
      item.final_price === 0
        ? "Free to Play"
        : item.final_price
        ? `Price: $${(item.final_price / 100).toFixed(2)}`
        : "Available on Steam Store"
    }`,
    genres: ["PC Gaming", "Steam", "Action", "RPG"],
    score: 9.0,
    country: "Global",
    platforms: ["PC", "Steam Deck", "Mac", "Linux"],
    studioOrDeveloper: "Valve / Steam Store",
    sourceUrl: `https://store.steampowered.com/app/${appId}`,
    statusText: item.final_price === 0 ? "Free to Play" : "Steam Store",
    avgPlaytime: "40 - 80 hrs",
    price: item.final_price === 0 ? "Free to Play" : item.final_price ? `$${(item.final_price / 100).toFixed(2)}` : "Steam Store",
  };
}

export async function fetchSteamFeaturedGames(): Promise<UnifiedMediaItem[]> {
  try {
    const res = await fetch("https://store.steampowered.com/api/featured/", {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) {
      return PRIMARY_STEAM_GAMES;
    }
    const data = await res.json();
    const featured = [
      ...(data.featured_win || []),
      ...(data.top_sellers || []),
    ];

    const seen = new Set<number>();
    const unique = featured.filter((item: any) => {
      if (seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });

    const transformed = unique.map(transformSteamGame);
    // Combine with PRIMARY_STEAM_GAMES so curated titles are always rich
    const combined = [...PRIMARY_STEAM_GAMES, ...transformed];
    const finalSeen = new Set<string>();
    return combined.filter(g => {
      if (finalSeen.has(g.title.toLowerCase())) return false;
      finalSeen.add(g.title.toLowerCase());
      return true;
    });
  } catch (err) {
    return PRIMARY_STEAM_GAMES;
  }
}

export async function getSteamCurrentPlayers(appId: number | string): Promise<number | null> {
  try {
    const numericId = String(appId).replace(/\D/g, "");
    if (!numericId) return null;

    const res = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${STEAM_API_KEY}&appid=${numericId}`,
      { 
        next: { revalidate: 300 },
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.response?.player_count ?? null;
  } catch (err) {
    return null;
  }
}

export async function searchSteamGames(query: string): Promise<UnifiedMediaItem[]> {
  if (!query.trim()) return PRIMARY_STEAM_GAMES;

  const q = query.toLowerCase().trim();
  const localMatches = PRIMARY_STEAM_GAMES.filter(
    g =>
      g.title.toLowerCase().includes(q) ||
      g.originalTitle?.toLowerCase().includes(q) ||
      g.overview.toLowerCase().includes(q) ||
      g.genres.some(genre => genre.toLowerCase().includes(q))
  );

  try {
    const res = await fetch(
      `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(
        query
      )}&l=english&cc=US`,
      { 
        next: { revalidate: 300 },
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      }
    );
    if (!res.ok) return localMatches.length > 0 ? localMatches : PRIMARY_STEAM_GAMES;
    const data = await res.json();
    const remoteItems = (data.items || []).map(transformSteamGame);
    const combined = [...localMatches, ...remoteItems];
    const seen = new Set<string>();
    return combined.filter(g => {
      if (seen.has(g.title.toLowerCase())) return false;
      seen.add(g.title.toLowerCase());
      return true;
    });
  } catch (err) {
    return localMatches.length > 0 ? localMatches : PRIMARY_STEAM_GAMES;
  }
}

export async function getSteamAppDetails(appId: string): Promise<UnifiedMediaItem | null> {
  const numericId = appId.replace(/\D/g, "");
  
  // First check primary curated list for immediate high-fidelity result
  const localMatch = PRIMARY_STEAM_GAMES.find(
    g => g.externalId === `steam-${numericId}` || g.id === `GAME-STEAM-${numericId}` || g.externalId === appId || g.id === appId
  );
  if (localMatch) {
    // Optionally augment with live player count if possible
    try {
      const live = await getSteamCurrentPlayers(numericId);
      if (live) {
        return {
          ...localMatch,
          livePlayers: live,
          statusText: `${live.toLocaleString()} Playing Right Now`
        };
      }
    } catch (_) {}
    return localMatch;
  }

  if (!numericId) return null;

  try {
    const res = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${numericId}&l=english`,
      { 
        next: { revalidate: 3600 },
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const appData = data[numericId];
    if (!appData || !appData.success || !appData.data) return null;

    const game = appData.data;
    const libraryPoster = `https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${numericId}/library_600x900.jpg`;
    const livePlayers = await getSteamCurrentPlayers(numericId);

    const priceText = game.is_free ? "Free to Play" : game.price_overview?.final_formatted || "$29.99";

    return {
      id: `GAME-STEAM-${numericId}`,
      externalId: `steam-${numericId}`,
      type: "GAME",
      title: game.name || "Steam Game",
      originalTitle: game.name,
      posterUrl: libraryPoster || game.header_image,
      backdropUrl: game.screenshots?.[0]?.path_full || game.background_raw || game.header_image,
      releaseDate: game.release_date?.date,
      overview: game.short_description || game.about_the_game?.replace(/<[^>]*>/g, "") || "Steam title",
      genres: (game.genres || []).map((g: any) => g.description),
      score: game.metacritic?.score ? Math.round((game.metacritic.score / 10) * 10) / 10 : 9.0,
      votes: game.recommendations?.total || (livePlayers ? livePlayers : 10000),
      country: "Global",
      platforms: [
        ...(game.platforms?.windows ? ["PC (Windows)"] : []),
        ...(game.platforms?.mac ? ["macOS"] : []),
        ...(game.platforms?.linux ? ["Linux", "Steam Deck"] : []),
      ],
      studioOrDeveloper: game.developers?.[0] || game.publishers?.[0] || "Valve",
      trailerUrl: game.movies?.[0]?.webm?.max || undefined,
      sourceUrl: `https://store.steampowered.com/app/${numericId}`,
      statusText: livePlayers ? `${livePlayers.toLocaleString()} Playing Right Now` : "On Steam Store",
      livePlayers: livePlayers || undefined,
      avgPlaytime: "30 - 80 hrs",
      price: priceText,
    };
  } catch (err) {
    return null;
  }
}
