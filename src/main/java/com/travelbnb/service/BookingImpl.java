package com.travelbnb.service;

import com.travelbnb.entity.Booking;
import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import com.travelbnb.payload.BookingDto;
import com.travelbnb.repository.BookingRepository;
import com.travelbnb.repository.PropertyRepository;
import com.travelbnb.repository.UserEntityRepository;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Optional;

@Service
public class BookingImpl implements BookingService{
    private BookingRepository bookingRepository;
    private PropertyRepository propertyRepository;
    private UserEntityRepository userRepository;
    private PDFService pdfService;
    private BucketService bucketService;
    private SmsService smsService;

    public BookingImpl(BookingRepository bookingRepository, PropertyRepository propertyRepository, UserEntityRepository userRepository, PDFService pdfService, BucketService bucketService, SmsService smsService) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.pdfService = pdfService;
        this.bucketService = bucketService;
        this.smsService = smsService;
    }


    @Override
    public BookingDto addBooking(BookingDto dto, Long propertyId, User user) {
        Optional<Property> property = propertyRepository.findById(propertyId);
        if(property.isPresent()) {
            Property pro = property.get();
            Booking booking = DtoToEntity(dto);
            booking.setProperty(pro);
            booking.setUser(user);
            booking.setPrice(pro.getPrice());
            Integer totalNightlyPrice = booking.getPrice() * booking.getTotalNights();
            booking.setTotalCost(totalNightlyPrice);
            bookingRepository.save(booking);
            try {
                boolean b = pdfService.generatePDF(booking.getId().toString(), booking);
                if(b) {
                    MultipartFile file = BookingConverter("C://Users//Keval//pdf_example//"+"Booking-Confirmation-id"+ booking.getId().toString() +".pdf");
                    String uploadedFileUrl = bucketService.uploadFile(file,"travelbnb123");
                    String smsId = smsService.sendSms(booking.getMobile(), "Your booking has been confirmed with the confirmation link: " + uploadedFileUrl);
                    System.out.println(smsId);
                    return EntityToDto(booking);
                } else {
                    System.out.println("Failed to generate PDF");
                }
            } catch (FileNotFoundException e) {
                throw new RuntimeException(e);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
        return null;
    }

    private MultipartFile BookingConverter(String filePath) throws IOException {
        File file = new File(filePath);
        FileInputStream input = new FileInputStream(file);
        MultipartFile multipartFile = new MockMultipartFile("file", file.getName(), "application/pdf", input);
        input.close();
        return multipartFile;
    }

    public Booking DtoToEntity(BookingDto dto) {
        Booking booking = new Booking();
        booking.setId(dto.getId());
        booking.setName(dto.getName());
        booking.setEmail(dto.getEmail());
        booking.setMobile(dto.getMobile());
            booking.setTotalNights(dto.getTotalNight());
        return booking;
    }

    public BookingDto EntityToDto(Booking entity){
        BookingDto dto = new BookingDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setMobile(entity.getMobile());
        dto.setPrice(entity.getPrice());
        dto.setTotalNight(entity.getTotalNights());
        dto.setProperty_id(entity.getProperty().getId());
        dto.setUser_id(entity.getUser().getId());
        dto.setTotalCost(entity.getTotalCost());
        return dto;
    }
}
