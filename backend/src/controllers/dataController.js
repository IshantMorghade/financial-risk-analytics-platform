const Dataset = require("../models/Dataset");
const { parse } = require("csv-parse/sync");
const fs = require("fs");

exports.listDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(datasets);
  } catch (err) {
    console.error("List datasets error:", err);
    res.status(500).json({ message: "Failed to load datasets" });
  }
};

exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    if (!req.body.name || !req.body.name.trim()) {
      return res.status(400).json({ message: "Dataset name required" });
    }

    let csvContent;
    if (req.file.buffer) {
      csvContent = req.file.buffer.toString("utf-8");
    } else if (req.file.path) {
      csvContent = fs.readFileSync(req.file.path, "utf-8");
    } else {
      return res.status(400).json({ message: "Unable to read uploaded file" });
    }

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (!records.length) {
      return res.status(400).json({ message: "CSV contains no rows" });
    }

    const columns = Object.keys(records[0] || {});
    const normalizedColumns = columns.map((c) => c.toLowerCase());

    if (!normalizedColumns.includes("date")) {
      return res.status(400).json({ message: "Missing required column: date" });
    }
    if (!normalizedColumns.includes("price")) {
      return res.status(400).json({ message: "Missing required column: price" });
    }

    const dateKey = columns.find((c) => c.toLowerCase() === "date");
    const priceKey = columns.find((c) => c.toLowerCase() === "price");
    const assetKey = columns.find((c) => c.toLowerCase() === "asset");

    const cleanedRecords = records.map((row) => ({
      date: row[dateKey] ? new Date(row[dateKey]) : null,
      asset: assetKey ? String(row[assetKey] || "") : "",
      price: row[priceKey] !== undefined && row[priceKey] !== "" ? Number(row[priceKey]) : null,
      return: null,
    }));

    for (let i = 1; i < cleanedRecords.length; i++) {
      const prev = Number(cleanedRecords[i - 1].price);
      const curr = Number(cleanedRecords[i].price);

      if (!isNaN(prev) && !isNaN(curr) && isFinite(prev) && isFinite(curr) && prev !== 0) {
        cleanedRecords[i].return = (curr - prev) / prev;
      } else {
        cleanedRecords[i].return = null;
      }
    }

    if (cleanedRecords.length > 0) {
      cleanedRecords[0].return = null;
    }

    const dataset = await Dataset.create({
      userId: req.user.id,
      name: req.body.name.trim(),
      rowCount: cleanedRecords.length,
      columns,
      data: cleanedRecords,
    });

    res.status(201).json(dataset);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};