const calculatePercentage = (votes, total) => {
  if (!total) return 0;
  return Math.round((votes / total) * 100);
};

export default calculatePercentage;
