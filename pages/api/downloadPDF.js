// pages/api/downloadPDF.js

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

export default async function handler(req, res) {
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { pdfUrl } = req.body;
    
    try {
        // Validate URL format
        if (!isValidUrl(pdfUrl)) {
            throw new Error('Please provide a valid PDF URL.');
        }

        // Download PDF file
        const response = await axios.get(pdfUrl, { responseType: 'blob' });

        if (response.statusText !== 'OK') {
            throw new Error('Failed to download PDF file.');
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/pdf')) {
            throw new Error('The provided URL does not point to a PDF file.');
        }

        const contentLength = Number(response.headers.get('content-length'));
        if (contentLength > 5242880) { // 5MB limit
            throw new Error('File size exceeds the maximum limit.');
        }

        // Initialize Supabase client
        const supabase = createClient(
            process.env.DB_URL,
            process.env.DB_SECRET_KEY
        );

        // Extract file name from URL
        const fileName = pdfUrl.split('/').pop();
        
        // Create Blob object
        const fileBlob = new Blob([response.data], { type: 'application/pdf' });

        // Upload PDF file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('pdfs')
            .upload(fileName, fileBlob);

        if (error) {
            throw new Error(error.message);
        }
        console.log("Data: ", data);

        res.status(200).json({ fileUrl: data.Key });
    } catch (error) {

        res.status(400).json({ error: error.message });
    }
}

const isValidUrl = (url) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

