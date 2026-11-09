export const initialTasks = [
  { id: 'q1', title: 'Plan the day before opening socials', category: 'daily', done: false, xp: 10 },
  { id: 'q2', title: 'Drink water after waking up', category: 'daily', done: false, xp: 10 },
  { id: 'q3', title: 'Review this month’s main goal', category: 'weekly', done: false, xp: 15 },
  { id: 'q4', title: 'Move one important work task forward', category: 'work', done: false, xp: 15 },
  { id: 'q5', title: 'Log today’s workout or recovery', category: 'fitness', done: false, xp: 15 },
  { id: 'q6', title: 'Write a short daily journal entry', category: 'daily', done: false, xp: 10 },
];

export const questBooks = [
  { id: 'all', title: 'All Quests', countLabel: 'ALL', color: 'blue', icon: '📘', hint: 'Every mission in one place' },
  { id: 'weekly', title: 'Weekly Quests', countLabel: 'WEEK', color: 'rust', icon: '📙', hint: 'Build momentum' },
  { id: 'daily', title: 'Daily Routine', countLabel: 'DAILY', color: 'amber', icon: '📔', hint: 'Small wins count' },
  { id: 'work', title: 'Work Log', countLabel: 'WORK', color: 'violet', icon: '📕', hint: 'Move your craft forward' },
  { id: 'fitness', title: 'Fitness', countLabel: 'FIT', color: 'teal', icon: '📗', hint: 'Train, recover, repeat' },
  { id: 'life', title: 'Life Admin', countLabel: 'LIFE', color: 'peach', icon: '📒', hint: 'Bills and little chores' },
];

export const starterPokemon = [
  { id: 25, name: 'pikachu' },
  { id: 1, name: 'bulbasaur' },
  { id: 4, name: 'charmander' },
  { id: 7, name: 'squirtle' },
  { id: 133, name: 'eevee' },
  { id: 39, name: 'jigglypuff' },
  { id: 52, name: 'meowth' },
  { id: 143, name: 'snorlax' },
  { id: 6, name: 'charizard' },
  { id: 94, name: 'gengar' },
  { id: 150, name: 'mewtwo' },
  { id: 151, name: 'mew' },
  { id: 54, name: 'psyduck' },
  { id: 133, name: 'eevee' },
  { id: 16, name: 'pidgey' },
  { id: 58, name: 'growlithe' },
  { id: 63, name: 'abra' },
  { id: 104, name: 'cubone' },
];

export const initialFinance = { income: '50000', budget: '12000', expenses: [], bills: [], billPayments: {} };
