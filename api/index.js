import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());

app.get("/get-pdf", async (req, res) => {
    try {
        const pdfUrl =
          'https://www.irs.gov/pub/irs-pdf/f1040.pdf';
    
        const response = await fetch(pdfUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
    
          res.setHeader('Content-Type', 'application/pdf');
    
          res.status(200).send(Buffer.from(buffer));
        } else {
          res.status(response.status).send('Error fetching PDF');
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
        res.status(500).send('Internal Server Error');
      }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
