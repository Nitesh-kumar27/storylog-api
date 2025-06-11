exports.healthCheck = (req, res) => {
    res.json({ status: 'OK', message: 'StoryLog API is running smoothly!' });
};