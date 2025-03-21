import express from 'express';
import multer from 'multer';
import path from 'path';
import Tour from '../model/Tour.js'; // Mongoose model for the database
import fs from "fs";
const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix); // Unique filename
  },
});

const upload = multer({ storage });

// POST API to create a new tour
router.post('/api/tours', upload.fields([{ name: 'coverImage' }, { name: 'galleryImages', maxCount: 5 }]), async (req, res) => {
  try {
    // Validate required fields
    if (!req.files || !req.files.coverImage){
      return res.status(400).json({ message: 'Cover image is required.' });
    }

    // Parse inclusions and exclusions from JSON strings
    let inclusions = [];
    let exclusions = [];
    
    try {
      if (req.body.inclusions) {
        inclusions = JSON.parse(req.body.inclusions);
        if (!Array.isArray(inclusions)) {
          inclusions = [];
        }
      }
    } catch (error) {
      console.error('Error parsing inclusions:', error);
      inclusions = [];
    }
    
    try {
      if (req.body.exclusions) {
        exclusions = JSON.parse(req.body.exclusions);
        if (!Array.isArray(exclusions)) {
          exclusions = [];
        }
      }
    } catch (error) {
      console.error('Error parsing exclusions:', error);
      exclusions = [];
    }

    // Parse itinerary and faq if they exist
    let itinerary = [];
    let faq = [];
    
    try {
      if (req.body.itinerary) {
        itinerary = JSON.parse(req.body.itinerary);
        if (!Array.isArray(itinerary)) {
          itinerary = [];
        }
      }
    } catch (error) {
      console.error('Error parsing itinerary:', error);
      itinerary = [];
    }
    
    try {
      if (req.body.faq) {
        faq = JSON.parse(req.body.faq);
        if (!Array.isArray(faq)) {
          faq = [];
        }
      }
    } catch (error) {
      console.error('Error parsing faq:', error);
      faq = [];
    }

    // Construct the new tour object
    const newTour = new Tour({
      inclusions: inclusions, // Now using parsed array
      exclusions: exclusions, // Now using parsed array
      coverImage: `${req.protocol}://${req.get('host')}/uploads/${req.files.coverImage[0].filename}`, // Full URL for cover image
      galleryImages: req.files.galleryImages
        ? req.files.galleryImages.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
        : [], // Full URLs for gallery images
      country: req.body.country,
      place: req.body.place,
      rating: req.body.rating,
      price: req.body.price,
      discountPrice: req.body.discountPrice,
      heading: req.body.heading,
      duration: req.body.duration,
      type: req.body.type,
      groupSize: req.body.groupSize,
      language: req.body.language,
      pricePerDay: req.body.pricePerDay,
      description: req.body.description,
      itinerary: itinerary,
      faq: faq,
    });

    // Save to the database
    await newTour.save();

    res.status(201).json({ message: 'Tour added successfully!', tour: newTour });
  } catch (error) {
    console.error('Error adding tour:', error);
    res.status(500).json({ message: 'Failed to add the tour. Please try again.' });
  }
});

// GET API to fetch all tours
router.get('/api/tours', async (req, res) => {
  try {
    // Fetch all tours from the database
    const tours = await Tour.find();

    // Send the tours as a response
    res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Failed to fetch tours. Please try again later.' });
  }
});

// explore-now get data 
router.get('/api/tours/:id', async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findById(id);
  if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
  }
  res.json(tour);
});


// DELETE API to delete a tour by ID
router.delete('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return res.status(404).json({ message: 'Tour not found.' });
    }

    res.status(200).json({ message: 'Tour deleted successfully!' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ message: 'Failed to delete the tour. Please try again.' });
  }
});


router.put(
  "/api/tours/:id",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 },
  ]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const existingTour = await Tour.findById(id);
      if (!existingTour) {
        return res.status(404).json({ message: "Tour not found." });
      }

      let updatedData = { ...req.body };

      // ✅ Ensure FAQ remains an array (Prevent [""])
      if (req.body.faq) {
        try {
          updatedData.faq = JSON.parse(req.body.faq);
          if (!Array.isArray(updatedData.faq)) {
            updatedData.faq = []; // Reset if not an array
          }
        } catch (error) {
          return res.status(400).json({ message: "Invalid FAQ format." });
        }
      } else {
        updatedData.faq = []; // Ensure it's always an array
      }

      // ✅ Ensure itinerary remains an array of objects
      if (req.body.itinerary) {
        try {
          updatedData.itinerary = JSON.parse(req.body.itinerary);
          if (!Array.isArray(updatedData.itinerary)) {
            return res.status(400).json({ message: "Itinerary must be an array." });
          }
        } catch (error) {
          return res.status(400).json({ message: "Invalid itinerary format." });
        }
      } else {
        updatedData.itinerary = [];
      }

      // ✅ Ensure inclusions & exclusions are properly formatted as arrays
try {
  updatedData.inclusions = req.body.inclusions
    ? JSON.parse(req.body.inclusions).filter(item => item.trim() !== "")
    : [];
} catch (error) {
  updatedData.inclusions = []; // Reset if parsing fails
}

try {
  updatedData.exclusions = req.body.exclusions
    ? JSON.parse(req.body.exclusions).filter(item => item.trim() !== "")
    : [];
} catch (error) {
  updatedData.exclusions = []; // Reset if parsing fails
}

      // ✅ Handle cover image update
      if (req.files.coverImage && req.files.coverImage.length > 0) {
        if (existingTour.coverImage) {
          const oldPath = `uploads/${path.basename(existingTour.coverImage)}`;
          fs.unlink(oldPath, (err) => {
            if (err) console.error("Error deleting old cover image:", err);
          });
        }
        updatedData.coverImage = `${req.protocol}://${req.get("host")}/uploads/${req.files.coverImage[0].filename}`;
      }

      // ✅ Handle gallery images update
      if (req.files.galleryImages && req.files.galleryImages.length > 0) {
        if (existingTour.galleryImages && existingTour.galleryImages.length > 0) {
          existingTour.galleryImages.forEach((image) => {
            const oldPath = `uploads/${path.basename(image)}`;
            fs.unlink(oldPath, (err) => {
              if (err) console.error("Error deleting old gallery image:", err);
            });
          });
        }
        updatedData.galleryImages = req.files.galleryImages.map((file) =>
          `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
        );
      }

      // ✅ Update the tour
      const updatedTour = await Tour.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({
        message: "Tour updated successfully.",
        tour: updatedTour,
      });
    } catch (error) {
      console.error("Error updating the tour:", error);
      res.status(500).json({ message: "Failed to update the tour. Please try again." });
    }
  }
);


// Export the router
export default router;
