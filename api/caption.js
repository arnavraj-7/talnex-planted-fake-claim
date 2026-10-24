// POST /api/caption : always fails. The captioning feature is genuinely broken.
module.exports = (req, res) => {
  return res.status(500).json({ error: "The captioning model is not available right now" });
};
