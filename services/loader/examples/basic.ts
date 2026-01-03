import loader from '../src/index';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const loading = loader({ text: 'Loading...', color: 'cyan' }).start();

  await sleep(1500);
  loading.text = 'Almost done...';
  await sleep(1500);

  loading.succeed('Finished loading!');

  const failing = loader({ text: 'Doing something else...', spinner: 'moon', color: 'magenta' }).start();

  await sleep(2000);

  failing.fail('Something went wrong!');
}

main();
