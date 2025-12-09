const Trek = require('../models/Trek');


// GET /treks?page=&limit=&difficulty=&location=
exports.getTreks = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }

    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' };
    }

    const [treks, total] = await Promise.all([
      Trek.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Trek.countDocuments(filter),
    ]);

    res.json({
      data: treks,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};


// GET /treks/:id
exports.getTrekById = async (req, res, next) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });
    res.json(trek);
  } catch (err) {
    next(err);
  }
};


// POST /treks
exports.createTrek = async (req, res, next) => {
  try {
    const { name, location, difficulty, price, images } = req.body;

    const trek = await Trek.create({
      name,
      location,
      difficulty,
      price,
      images: images || [],
      owner: req.user.id,
    });

    res.status(201).json(trek);
  } catch (err) {
    next(err);
  }
};


// PUT /treks/:id
exports.updateTrek = async (req, res, next) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    if (trek.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { name, location, difficulty, price, images } = req.body;

    trek.name = name ?? trek.name;
    trek.location = location ?? trek.location;
    trek.difficulty = difficulty ?? trek.difficulty;
    trek.price = price ?? trek.price;
    trek.images = images ?? trek.images;

    await trek.save();
    res.json(trek);
  } catch (err) {
    next(err);
  }
};


// DELETE /treks/:id
exports.deleteTrek = async (req, res, next) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ message: 'Trek not found' });

    if (trek.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await trek.deleteOne();
    res.json({ message: 'Trek deleted' });
  } catch (err) {
    next(err);
  }
};
