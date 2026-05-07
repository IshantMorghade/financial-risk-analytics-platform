function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function calculateMean(returns) {
  if (!returns.length) return 0;
  return returns.reduce((a, b) => a + b, 0) / returns.length;
}

function calculateStdDev(returns) {
  if (!returns.length) return 0;
  const mean = calculateMean(returns);
  const variance =
    returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / returns.length;
  return Math.sqrt(variance);
}

function calculateMaxDrawdown(returns) {
  if (!returns.length) return 0;

  let peak = 1;
  let value = 1;
  let maxDD = 0;

  returns.forEach((r) => {
    value *= 1 + r;
    peak = Math.max(peak, value);
    const dd = (value - peak) / peak;
    maxDD = Math.min(maxDD, dd);
  });

  return Math.abs(maxDD);
}

function calculateHistoricalVaR(returns, confidenceLevel = 0.95) {
  if (!returns.length) return 0;
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.max(0, Math.floor((1 - confidenceLevel) * sorted.length));
  return Math.abs(sorted[index] ?? 0);
}

function calculateSharpeRatio(returns, riskFreeRate = 0) {
  if (!returns.length) return 0;
  const mean = calculateMean(returns);
  const volatility = calculateStdDev(returns);
  if (!volatility) return 0;
  return (mean - riskFreeRate) / volatility;
}

function calculateRollingVolatility(returns, dates = [], window = 5) {
  if (!returns.length) return [];

  const result = [];
  for (let i = 0; i < returns.length; i++) {
    if (i < window - 1) continue;
    const slice = returns.slice(i - window + 1, i + 1);
    result.push({
      date: dates[i] || `Point ${i + 1}`,
      rollingVolatility: calculateStdDev(slice),
    });
  }
  return result;
}

function calculateDrawdownSeries(returns, dates = []) {
  if (!returns.length) return [];

  let peak = 1;
  let value = 1;

  return returns.map((r, idx) => {
    value *= 1 + r;
    peak = Math.max(peak, value);
    const drawdown = Math.abs((value - peak) / peak);

    return {
      date: dates[idx] || `Point ${idx + 1}`,
      portfolioValue: value,
      drawdown,
    };
  });
}

function stressTestReturns(returns, shock = -0.1) {
  return returns.map((r) => r + shock);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateRiskScore({ volatility, maxDrawdown, var95 }) {
  const volScore = volatility * 100;
  const ddScore = maxDrawdown * 100 * 0.6;
  const varScore = var95 * 100 * 0.5;
  return clamp((volScore + ddScore + varScore) / 10, 0, 10);
}

function calculateRiskMetrics(returns, dates = []) {
  const mean = calculateMean(returns);
  const volatility = calculateStdDev(returns);
  const maxDrawdown = calculateMaxDrawdown(returns);
  const var95 = calculateHistoricalVaR(returns);
  const sharpeRatio = calculateSharpeRatio(returns);
  const rollingVolatility = calculateRollingVolatility(returns, dates, 5);
  const drawdownSeries = calculateDrawdownSeries(returns, dates);

  const stressedReturns = stressTestReturns(returns, -0.1);
  const stressedVar95 = calculateHistoricalVaR(stressedReturns);

  return {
    mean,
    volatility,
    maxDrawdown,
    var95,
    sharpeRatio,
    stressedVar95,
    riskScore: calculateRiskScore({ volatility, maxDrawdown, var95 }),
    rollingVolatility,
    drawdownSeries,
  };
}

module.exports = {
  calculateRiskMetrics,
  calculateMean,
  calculateStdDev,
  calculateMaxDrawdown,
  calculateHistoricalVaR,
  calculateSharpeRatio,
  calculateRollingVolatility,
  calculateDrawdownSeries,
  stressTestReturns,
};