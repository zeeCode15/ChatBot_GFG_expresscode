const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoUrl = 'mongodb+srv://xpresscode:zf4U82o4K40lRPQW@products.a6t4sqa.mongodb.net/?retryWrites=true&w=majority&appName=Products';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

const vcourseDetailSchema = new mongoose.Schema({
    phoneno: Number,
    courseId: Number
});
const VcourseDetail = mongoose.model('VcourseDetail', vcourseDetailSchema);

app.post('/webhook', async (req, res) => {
    try {
        const payload = req.body;
        const intent = payload.queryResult.intent.displayName;
        const parameters = payload.queryResult.parameters;

        console.log(parameters);

        if (intent === 'ordercomplete') {
            const purchaseData = new VcourseDetail({
                email: parameters.phoneno,
                courseId: parameters.courseId
            });
            await purchaseData.save();
            console.log('Data saved to MongoDB:', purchaseData);
        }

        res.send('Webhook received and processed successfully.');
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal server error.');
    }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});