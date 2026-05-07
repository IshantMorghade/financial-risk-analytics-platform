const Dataset = require("../models/Dataset");
const { calculateRiskMetrics } = require("../utils/analytics");

exports.runAnalytics = async (req, res) => {
  try {
    const { datasetId } = req.body;

    if (!datasetId) {
      return res.status(400).json({ message: "datasetId is required" });
    }

    const dataset = await Dataset.findById(datasetId);
    if (!dataset) {
      return res.status(404).json({ message: "Dataset not found" });
    }

    const returns = dataset.data
      .map((d) => Number(d.return))
      .filter((v) => !isNaN(v) && isFinite(v));

    const dates = dataset.data.map((d) =>
      d.date ? new Date(d.date).toISOString().slice(0, 10) : ""
    );

    if (returns.length === 0) {
      return res.json({
        mean: 0,
        volatility: 0,
        maxDrawdown: 0,
        var95: 0,
        sharpeRatio: 0,
        stressedVar95: 0,
        riskScore: 0,
        rollingVolatility: [],
        drawdownSeries: [],
        alerts: [],
        message: "No valid return values in dataset",
      });
    }

    const metrics = calculateRiskMetrics(returns, dates);
    const alerts = [];

    if ((metrics.riskScore ?? 0) >= 7) {
      alerts.push("High overall risk score detected.");
    }
    if ((metrics.var95 ?? 0) >= 0.05) {
      alerts.push("VaR 95% exceeds preferred threshold.");
    }
    if ((metrics.maxDrawdown ?? 0) >= 0.2) {
      alerts.push("Severe drawdown detected in return path.");
    }
    if ((metrics.sharpeRatio ?? 0) < 0) {
      alerts.push("Negative Sharpe ratio indicates weak risk-adjusted performance.");
    }

    res.json({
      mean: metrics.mean ?? 0,
      volatility: metrics.volatility ?? 0,
      maxDrawdown: metrics.maxDrawdown ?? 0,
      var95: metrics.var95 ?? 0,
      sharpeRatio: metrics.sharpeRatio ?? 0,
      stressedVar95: metrics.stressedVar95 ?? 0,
      riskScore: metrics.riskScore ?? 0,
      rollingVolatility: metrics.rollingVolatility ?? [],
      drawdownSeries: metrics.drawdownSeries ?? [],
      alerts,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: "Analytics failed", error: err.message });
  }
};