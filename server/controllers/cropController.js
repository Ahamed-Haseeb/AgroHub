import CropListing from "../models/Crop.js";

/**
 * @route   GET /api/crops
 * @access  Public
 */
export const getCrops = async (req, res) => {
  try {
    const { category, origin, grade, organic, price_min, price_max, sort } =
      req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (origin) {
      // Support comma-separated origins: "Dambulla,Nuwara Eliya"
      const origins = origin.split(",").map((o) => o.trim());
      filter.origin = { $regex: origins.join("|"), $options: "i" };
    }

    if (grade) {
      const grades = grade.split(",").map((g) => g.trim());
      filter.grade = { $in: grades };
    }

    if (organic !== undefined) {
      filter.organic = organic === "true";
    }

    if (price_min || price_max) {
      filter.price_per_kg = {};
      if (price_min) filter.price_per_kg.$gte = Number(price_min);
      if (price_max) filter.price_per_kg.$lte = Number(price_max);
    }

    let sortObj = {};
    switch (sort) {
      case "price-asc":
        sortObj = { price_per_kg: 1 };
        break;
      case "price-desc":
        sortObj = { price_per_kg: -1 };
        break;
      case "qty":
        sortObj = { available_kg: -1 };
        break;
      case "rating":
        sortObj = { rating: -1 };
        break;
      default:
        sortObj = { createdAt: -1 }; // "featured" = newest first
    }

    const crops = await CropListing.find(filter).sort(sortObj);

    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @route   GET /api/crops/:id
 * @access  Public
 */
export const getCropById = async (req, res) => {
  try {
    const crop = await CropListing.findOne({ listing_id: req.params.id });

    if (!crop) {
      return res.status(404).json({ message: "Crop listing not found" });
    }

    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
