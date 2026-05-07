const Dataset = require("../models/Dataset");
const { calculateRiskMetrics } = require("../utils/analytics");

exports.exportCsv = async (req, res) => {
  try {
    const { datasetId } = req.query;
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
    const metrics = returns.length ? calculateRiskMetrics(returns, dates) : null;

    const rows = [
      ["Metric", "Value"],
      ["Mean Return", metrics ? metrics.mean : 0],
      ["Volatility", metrics ? metrics.volatility : 0],
      ["VaR 95%", metrics ? metrics.var95 : 0],
      ["Max Drawdown", metrics ? metrics.maxDrawdown : 0],
      ["Sharpe Ratio", metrics ? metrics.sharpeRatio : 0],
      ["Stressed VaR 95%", metrics ? metrics.stressedVar95 : 0],
      ["Risk Score (0-10)", metrics ? metrics.riskScore : 0],
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="risk_report_${datasetId}.csv"`
    );
    res.send(csv);
  } catch (err) {
    console.error("Export CSV error:", err);
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
};