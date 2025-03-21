import Tour from '../model/Tour.js';

// Create a new tour
export const createTour = async (req, res) => {
  try {
    const {
      country,
      place,
      rating,
      price,
      discountPrice,
      heading,
      duration,
      type,
      groupSize,
      language,
      pricePerDay,
      description,
     itinerary,
     inclusions,
     exclusions,
     faq,
    } = req.body;

    const coverImage = req.files['coverImage'][0].path;
    const galleryImages = req.files['galleryImages'].map((file) => file.path);

    const newTour = new Tour({
      coverImage,
      galleryImages,
      country,
      place,
      rating,
      price,
      discountPrice,
      heading,
      duration,
      type,
      groupSize,
      language,
      pricePerDay,
      description,
      itinerary,
      inclusions,
      exclusions,
      faq,
    });

    await newTour.save();
    // Send a success response
    res.status(201).json({ message: 'Tour added successfully!' });
  } catch (error) {
    console.error('Error adding tour:', error);
    res.status(500).json({ message: 'Failed to add the tour. Please try again.' });
  }
};


// Get all tours
export const getTours = async (req, res) => {
  try {
    // Fetch all tours from the database
    const tours = await Tour.find();

    // Send the fetched tours as a response
    res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Failed to fetch tours. Please try again later.' });
  }
};

