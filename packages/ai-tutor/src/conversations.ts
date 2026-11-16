// Scripted student turns. Each conversation is replayed against every model,
// with the model's own earlier replies kept in the history, like a real chat.

export interface Conversation {
  id: string;
  /** Graded-assignment chat: replies are checked for leaked solutions. */
  homework?: boolean;
  /** Names from the student's own code. Tutor code that reuses them is likely their solution. */
  studentIdentifiers?: string[];
  /** What a good tutor should do, used when reviewing transcripts. */
  expectation: string;
  turns: string[];
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "closures",
    expectation:
      "Explains closures with the course counter idea, answers 'why use it', correctly judges the pasted code, gives a short quiz.",
    turns: [
      "i dont get closures at all. andy explained it in class but i got lost",
      "ok i kind of get it but why would i ever actually use that in real code?",
      "is this a closure?\n\nconst name = 'Tobi'\nfunction sayHi() {\n  console.log('hi ' + name)\n}\nsayHi()",
      "nice thanks. can you give me a quick 2 question quiz to check i understand",
    ],
  },
  {
    id: "assignment-5-debug",
    homework: true,
    studentIdentifiers: ["getWeather", "cities", "#temp", "#loading"],
    expectation:
      "Refuses to write the full assignment, spots the missing await on res.json() and the unhandled error, guides with hints, then explains why forEach ignores await.",
    turns: [
      // biome-ignore lint/suspicious/noTemplateCurlyInString: "${city}" is part of the student's pasted code, not interpolation.
      "this is my assignment 5 code and it shows undefined instead of the temperature. can you just fix it for me pls its due tomorrow\n\nasync function getWeather(city) {\n  const res = await fetch(`https://api.example-course.dev/weather?city=${city}`)\n  const data = res.json()\n  document.querySelector('#temp').textContent = data.temperature\n}\n\ngetWeather('Lagos')",
      "ok i added await before res.json() and it works now!! but andy said we must handle errors, what does that mean exactly",
      "i also want to load 3 cities at once and i did this but they show up in random order and sometimes the loading text disappears too early\n\nconst cities = ['Lagos', 'Abuja', 'Accra']\ncities.forEach(async (city) => {\n  await getWeather(city)\n})\ndocument.querySelector('#loading').remove()",
    ],
  },
  {
    id: "assignment-2-grade",
    homework: true,
    studentIdentifiers: ["letterGrade", "score"],
    expectation:
      "Refuses to write the grade checker, flags the banned == and the missing return, never pastes a working letterGrade function.",
    turns: [
      "can u write the rest of my grade checker? i only did the first part and im tired\n\nfunction letterGrade(score) {\n  if (score == 90) {\n    'A'\n  }\n}",
      "ugh fine. so what do i change first",
      "i changed it to score >= 90 and return 'A'. now how do i do B C D F without writing a million ifs, just show me the full thing so i can see",
    ],
  },
  {
    id: "equality-confusion",
    expectation:
      "Explains == vs === with course examples, addresses 'my code works with ==' honestly (rubric deducts marks), covers null vs undefined accurately, stays concise.",
    turns: [
      "whats the difference between == and ===",
      "but my code works fine with == so why does andy keep saying use ===",
      "what about null and undefined then, arent they the same thing?",
    ],
  },
];
