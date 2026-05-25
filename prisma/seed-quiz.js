require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const initialQuestions = [
  {
    question: "What does NLP stand for in Artificial Intelligence?",
    options: [
      "Natural Language Processing",
      "Network Link Protocol",
      "Neural Logical Program",
      "Numerical Linear Processing"
    ],
    correctOption: 0,
    topic: "NLP",
    timeLimit: 25,
    points: 10
  },
  {
    question: "Which of the following is a type of machine learning where the model learns from labeled training data?",
    options: [
      "Unsupervised Learning",
      "Reinforcement Learning",
      "Supervised Learning",
      "Semi-unsupervised Learning"
    ],
    correctOption: 2,
    topic: "ML",
    timeLimit: 30,
    points: 10
  },
  {
    question: "Which prompting technique involves asking the AI to 'think step by step' to improve reasoning accuracy?",
    options: [
      "Zero-Shot Prompting",
      "Few-Shot Prompting",
      "Chain-of-Thought Prompting",
      "Role Prompting"
    ],
    correctOption: 2,
    topic: "Prompting",
    timeLimit: 30,
    points: 15
  },
  {
    question: "Which neural network architecture, introduced in 2017, is the foundation for modern Large Language Models (LLMs)?",
    options: [
      "Recurrent Neural Network (RNN)",
      "Transformer",
      "Convolutional Neural Network (CNN)",
      "Generative Adversarial Network (GAN)"
    ],
    correctOption: 1,
    topic: "Models",
    timeLimit: 25,
    points: 15
  },
  {
    question: "What is 'Few-Shot Prompting'?",
    options: [
      "Providing the model with a few examples of input and output before asking it to solve a new task",
      "Asking the model to answer within a few words",
      "Giving the model a few attempts to guess the answer",
      "Using a small model to generate the prompt"
    ],
    correctOption: 0,
    topic: "Prompting",
    timeLimit: 30,
    points: 10
  },
  {
    question: "What technique is used in NLP to break down a long sentence into individual words or smaller sub-units?",
    options: [
      "Vectorization",
      "Tokenization",
      "Lemmatization",
      "Syntax Parsing"
    ],
    correctOption: 1,
    topic: "NLP",
    timeLimit: 20,
    points: 10
  },
  {
    question: "What is the primary goal of Unsupervised Learning?",
    options: [
      "To predict numerical values from labeled data",
      "To find hidden patterns or groupings in unlabeled data",
      "To learn the best action to take based on feedback and rewards",
      "To classify images into predefined categories"
    ],
    correctOption: 1,
    topic: "ML",
    timeLimit: 30,
    points: 10
  },
  {
    question: "Which large-scale AI model was created by Google and natively supports multimodal inputs like text, code, audio, image, and video?",
    options: [
      "GPT-4",
      "Gemini",
      "Claude 3",
      "LLaMA 3"
    ],
    correctOption: 1,
    topic: "Models",
    timeLimit: 20,
    points: 10
  }
];

async function main() {
  console.log("Seeding quiz questions...");
  let count = 0;
  for (const q of initialQuestions) {
    const existing = await prisma.quizQuestion.findFirst({
      where: { question: q.question }
    });
    if (!existing) {
      await prisma.quizQuestion.create({ data: q });
      count++;
    }
  }
  console.log(`Seeding complete. Added ${count} new questions.`);
}

main()
  .catch((e) => {
    console.error("Error seeding questions:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
