import { EventInput } from '@fullcalendar/react'

const todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of tod

export interface Organizer {
  name: string,
  website: string,
  location: string
}

export interface Game {
  name: string
}

export const GAMES: Game[] = [
  {
    "name": "Riftbound"
  },
  {
    "name": "Pokemon"
  },
  {
    "name": "Yu-gi-oh"
  }
]

export const STORES: Organizer[] = [
  {
    "name": "Duck Duck Games",
    "website": "http://localhost:8080",
    "location": "450 Bloor Street"
  },
  {
    "name": "Anime Alley",
    "website": "http://localhost:8080",
    "location": "450 Bloor Street"
  }
]

export const INITIAL_EVENTS: EventInput[] = [
  {
    id: "0",
    title: 'Riftbound Locals',
    start: todayStr,
    store: STORES[0],
    game: GAMES[0],
    format: "Standard"
  },
  {
    id: "1",
    title: 'Riftbound Play for Packs',
    start: todayStr + 'T20:00:00',
    store: STORES[0],
    game: GAMES[0],
    format: "Draft"
  },
    {
    id: "2",
    title: 'Riftbound AA Play for Packs',
    start: todayStr + 'T50:00:00',
    store: STORES[1],
    game: GAMES[0],
    format: "Draft"
  }
]


