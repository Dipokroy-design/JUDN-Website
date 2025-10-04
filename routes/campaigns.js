const express = require("express");
const { isAuthenticated } = require("../middleware/auth");
const Campaign = require("../models/Campaign");

const router = express.Router();

// Get all campaigns
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaigns",
      error: error.message,
    });
  }
});

// Get single campaign
router.get("/:id", async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }
    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching campaign",
      error: error.message,
    });
  }
});

module.exports = router;
