let queue = Promise.resolve();

export function enqueueDatabaseOperation(operation) {
  const result = queue.then(() => operation());
  queue = result.catch(() => {});
}
