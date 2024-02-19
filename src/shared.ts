const getRandomColors = (n: number) => {
  const colors = [
    { name: 'green', hex: '#34eb7d' },
    { name: 'red', hex: '#eb3434' },
    { name: 'yellow', hex: '#f5e322' },
    { name: 'sky', hex: '#34cdeb' },
    { name: 'blue', hex: '#0062ff' },
    { name: 'purple', hex: '#5c18c9' },
    { name: 'pink', hex: '#e66ae6' },
    { name: 'orange', hex: '#e68f32' },
    { name: 'teal', hex: '#2debc5' },
    { name: 'brown', hex: '#825116' },
  ];

  const result: { name: string; hex: string }[] = [];

  for (let i = 0; i < n; i++) {
    result.push(colors[Math.ceil(Math.random() * n)]);
  }

  return result;
};
