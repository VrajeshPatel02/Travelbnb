package com.travelbnb.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.travelbnb.entity.Booking;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

@Service
public class PDFService {

    private BucketService  bucketService;

    public PDFService(BucketService bucketService) {
        this.bucketService = bucketService;
    }

    public boolean generatePDF(String filename, Booking booking) throws FileNotFoundException{
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream("C://Users//Keval//pdf_example//"+"Booking-Confirmation-id"+ filename+".pdf"));

            document.open();
            Font font = FontFactory.getFont(FontFactory.COURIER, 16, BaseColor.BLACK);
            Chunk bookingConfirmation = new Chunk("Booking Confirmation", font);
            Chunk GuestName =  new Chunk("Guest Name : " + booking.getName(), font);
            Chunk totalnights = new Chunk("Total Nights : " + booking.getTotalNights().toString(), font);
            Chunk price = new Chunk("Price : " + booking.getPrice().toString(), font);
            Chunk totalCost = new Chunk("Total Cost : " + booking.getTotalCost().toString(), font);

            document.add(bookingConfirmation);
            document.add(new Paragraph("\n"));
            document.add(GuestName);
            document.add(new Paragraph("\n"));
            document.add(totalnights);
            document.add(new Paragraph("\n"));
            document.add(price);
            document.add(new Paragraph("\n"));
            document.add(totalCost);
            document.close();
            return true;
        }catch(Exception e){
            e.printStackTrace();

        }
        return false;
    }
}
