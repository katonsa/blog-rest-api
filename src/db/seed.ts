import { prisma } from './prisma';

const posts = [
  {
    title: 'Why I Switched Back to Plain JavaScript',
    content:
      'I spent years chasing the newest frameworks, only to realize that plain JavaScript still solves most problems beautifully. Fewer dependencies, faster load times, and less mental overhead made development fun again.',
  },
  {
    title: 'The Myth of Overnight Success',
    content:
      'Every "overnight success" story hides years of invisible work. Consistency, boring routines, and showing up daily matter far more than sudden inspiration.',
  },
  {
    title: 'Debugging Is a Skill, Not a Talent',
    content:
      "Great developers aren't magic—they're systematic. Writing smaller functions, logging aggressively, and isolating variables saves more time than guessing ever will.",
  },
  {
    title: "Why Your App Doesn't Need Microservices",
    content:
      'Microservices shine at scale, but for most apps they add complexity without benefits. A well-structured monolith is often faster to build and easier to maintain.',
  },
  {
    title: 'The Art of Writing Clean Code',
    content:
      'Clean code is not about perfection—it is about clarity. Good naming, small functions, and consistent formatting make your code readable for yourself and others.',
  },
];

async function main() {
  console.log('Seeding posts...');

  const createdPosts = await prisma.post.createMany({
    data: posts,
  });

  console.log(`Created ${createdPosts.count} posts`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
