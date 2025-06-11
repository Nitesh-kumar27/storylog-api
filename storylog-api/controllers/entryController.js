const Entry = require('../models/Entry');
const mongoose = require('mongoose');

// CREATE
exports.createEntry = async (req, res) => {
  try {
    const { title, body, moodTags, moodScore } = req.body;

    if (!title || !body || body.trim().split(/\s+/).length < 10 || !Array.isArray(moodTags) || moodTags.length === 0) {
      return res.status(400).json({ status: false, message: 'Entry must have at least 10 words and one mood tag', code: 400 });
    }

    if (typeof moodScore !== 'number' || moodScore < -5 || moodScore > 5) {
      return res.status(400).json({ status: false, message: 'Mood score must be between -5 and 5', code: 400 });
    }

    const wordCount = body.trim().split(/\s+/).length;

    const entry = await Entry.create({
      title,
      body,
      moodTags,
      moodScore,
      wordCount,
      createdBy: req.user.userId
    });

    res.json({ status: true, entry });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};

// READ ALL (with filtering)
exports.getEntries = async (req, res) => {
  try {
    const { tag, start, end, keyword } = req.query;
    let filter = { createdBy: req.user.userId };

    if (tag) filter.moodTags = tag;
    if (start && end) filter.date = { $gte: new Date(start), $lte: new Date(end) };
    if (keyword) filter.$or = [
      { title: new RegExp(keyword, 'i') },
      { body: new RegExp(keyword, 'i') }
    ];

    const entries = await Entry.find(filter);
    res.json({ status: true, entries });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};

// READ BY ID
exports.getEntryById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: false, message: 'Invalid entry ID', code: 400 });
    }

    const entry = await Entry.findById(req.params.id);
    if (!entry || entry.createdBy.toString() !== req.user.userId) {
      return res.status(404).json({ status: false, message: 'Entry not found', code: 404 });
    }

    res.json({ status: true, entry });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};

// UPDATE
exports.updateEntry = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: false, message: 'Invalid entry ID', code: 400 });
    }

    const entry = await Entry.findById(req.params.id);
    if (!entry || entry.createdBy.toString() !== req.user.userId) {
      return res.status(404).json({ status: false, message: 'Entry not found', code: 404 });
    }

    const { title, body, moodTags, moodScore } = req.body;

    if (body && body.trim().split(/\s+/).length < 10) {
      return res.status(400).json({ status: false, message: 'Body must have at least 10 words', code: 400 });
    }

    if (moodTags && (!Array.isArray(moodTags) || moodTags.length === 0)) {
      return res.status(400).json({ status: false, message: 'At least one mood tag is required', code: 400 });
    }

    if (moodScore !== undefined && (typeof moodScore !== 'number' || moodScore < -5 || moodScore > 5)) {
      return res.status(400).json({ status: false, message: 'Mood score must be between -5 and 5', code: 400 });
    }

    // Archive old version (bonus feature)
    entry.archive = entry.archive || [];
    entry.archive.push({
      title: entry.title,
      body: entry.body,
      moodTags: entry.moodTags,
      moodScore: entry.moodScore,
      wordCount: entry.wordCount,
      updatedAt: new Date()
    });

    // Update fields
    if (title) entry.title = title;
    if (body) {
      entry.body = body;
      entry.wordCount = body.trim().split(/\s+/).length;
    }
    if (moodTags) entry.moodTags = moodTags;
    if (moodScore !== undefined) entry.moodScore = moodScore;

    await entry.save();

    res.json({ status: true, entry });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};

// DELETE
exports.deleteEntry = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ status: false, message: 'Invalid entry ID', code: 400 });
    }

    const entry = await Entry.findById(req.params.id);
    if (!entry || entry.createdBy.toString() !== req.user.userId) {
      return res.status(404).json({ status: false, message: 'Entry not found', code: 404 });
    }

    await entry.deleteOne();
    res.json({ status: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};

// STATS SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const entries = await Entry.find({ createdBy: req.user.userId });

    if (!entries.length) {
      return res.json({ status: true, summary: 'No entries found' });
    }

    const totalEntries = entries.length;
    const totalWordCount = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);
    const avgMoodScore = (
      entries.reduce((sum, e) => sum + (e.moodScore || 0), 0) / totalEntries
    ).toFixed(2);

    const moodFrequency = entries.flatMap(e => e.moodTags).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const mostCommonMood = Object.entries(moodFrequency).reduce((a, b) => (b[1] > a[1] ? b : a), [null, 0])[0];

    res.json({
      status: true,
      summary: {
        totalEntries,
        totalWordCount,
        avgMoodScore,
        mostCommonMood
      }
    });
  } catch (err) {
    res.status(500).json({ status: false, message: err.message, code: 500 });
  }
};
