const mongoose = require("mongoose");

const dataPointSchema = new mongoose.Schema(
  {
    date: { type: Date, default: null },
    asset: { type: String, default: "" },
    price: { type: Number, default: null },
    return: { type: Number, default: null },
  },
  { _id: false }
);

const datasetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    rowCount: { type: Number, default: 0 },
    columns: { type: [String], default: [] },
    data: { type: [dataPointSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dataset", datasetSchema);