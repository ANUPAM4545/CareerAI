import { getEnglishCoachStream } from './lib/ai';

async function main() {
  const result = await getEnglishCoachStream([{ role: 'user', content: 'hello' }]);
  console.log(Object.keys(result));
}

main();
