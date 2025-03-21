import Form from '../model/Form.js'; // Correct path to your Form model

export const submitForm = async (req, res) => {
  try {
    console.log(req.body); // Log the received data

    const { name, countryCode, phone, email, subject, number, departureMonth, inquiryPage } = req.body;

    if (!name || !countryCode || !phone || !email || !subject || !departureMonth || !inquiryPage) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const formData = new Form({
      name,
      countryCode,
      phone,
      email,
      subject,
      number,
      departureMonth,
      inquiryPage,
    });

    const savedData = await formData.save();
    return res.status(201).json({
      message: 'Form submitted successfully',
      data: savedData,
    });
  } catch (error) {
    console.error('Error submitting form:', error.message);
    return res.status(500).json({
      message: 'Server error',
      error: error.message || 'An unexpected error occurred',
    });
  }
};



// Get all form submissions
export const getFormData = async (req, res) => {
  try {
    const data = await Form.find(); // Retrieve all form data from MongoDB
    return res.status(200).json({ message: 'Data fetched successfully', data });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({
      message: 'Server error while fetching data',
      error: error.message || 'An unexpected error occurred',
    });
  }
};
