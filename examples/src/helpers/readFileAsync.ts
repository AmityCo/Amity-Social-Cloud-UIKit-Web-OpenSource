const readFileAsync = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result == null) return reject();
      if (typeof reader.result === 'string') return resolve(reader.result);
      const decoder = new TextDecoder();
      resolve(decoder.decode(reader.result));
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};

export default readFileAsync;
