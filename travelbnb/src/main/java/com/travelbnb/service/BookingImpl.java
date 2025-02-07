package com.travelbnb.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.travelbnb.entity.Booking;
import com.travelbnb.entity.Property;
import com.travelbnb.entity.User;
import com.travelbnb.payload.BookingDto;
import com.travelbnb.repository.BookingRepository;
import com.travelbnb.repository.PropertyRepository;
import com.travelbnb.repository.UserEntityRepository;

@Service
public class BookingImpl implements BookingService{
    private static final Logger logger = LoggerFactory.getLogger(BookingImpl.class);

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserEntityRepository userRepository;
    private final PDFService pdfService;
    private final BucketService bucketService;
    private final SmsService smsService;
    private final WhatsappService whatsappService;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @Value("${pdf.storage.path}")
    private String pdfFilePath;

    public BookingImpl(
        BookingRepository bookingRepository,
        PropertyRepository propertyRepository,
        UserEntityRepository userRepository,
        PDFService pdfService,
        BucketService bucketService,
        SmsService smsService,
        WhatsappService whatsappService
    ) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
        this.userRepository = userRepository;
        this.pdfService = pdfService;
        this.bucketService = bucketService;
        this.smsService = smsService;
        this.whatsappService = whatsappService;
    }

    @Override
    @Transactional
    public BookingDto addBooking(BookingDto dto, Long propertyId, User user) {
        // Add detailed logging
        logger.info("Attempting to create booking for property {} by user {}", propertyId, user.getId());
        logger.debug("Booking details: {}", dto);

        try {
            // Check if property exists
            Optional<Property> propertyOptional = propertyRepository.findById(propertyId);
            
            if (propertyOptional.isEmpty()) {
                logger.error("Property not found with ID: {}", propertyId);
                throw new RuntimeException("Property not found");
            }

            // Check for overlapping bookings
            long overlappingBookings = bookingRepository.countOverlappingBookings(
                propertyId, 
                dto.getCheckIn(), 
                dto.getCheckOut()
            );

            if (overlappingBookings > 0) {
                logger.error("Property is already booked for the selected dates");
                throw new RuntimeException("Property is already booked for the selected dates");
            }

            // Create booking
            Booking booking = new Booking();
            booking.setName(dto.getName());
            booking.setEmail(dto.getEmail());
            booking.setMobile(dto.getMobile());
            booking.setProperty(propertyOptional.get());
            booking.setUser(user);
            booking.setPrice(dto.getPrice());
            booking.setTotalNights(dto.getTotalNight());
            booking.setTotalCost(dto.getTotalCost());
            booking.setCheckIn(dto.getCheckIn());
            booking.setCheckOut(dto.getCheckOut());

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);

            // Attempt to generate PDF and send notifications
            try {
                boolean pdfGenerated = pdfService.generatePDF(
                    savedBooking.getId().toString(), 
                    savedBooking
                );

                if (pdfGenerated) {
                    String pdfPath = pdfFilePath + "Booking-Confirmation-id" + savedBooking.getId() + ".pdf";
                    MultipartFile pdfFile = convertToMultipartFile(pdfPath);
                    
                    // Upload PDF to S3
                    String uploadedFileUrl = bucketService.uploadFile(pdfFile, bucketName);
                    logger.info("PDF uploaded to S3: {}", uploadedFileUrl);

                    // Send SMS (with error handling)
                    try {
                        String smsId = smsService.sendSms(
                            savedBooking.getMobile(), 
                            "Your booking has been confirmed. View details: " + uploadedFileUrl
                        );
                        logger.info("SMS sent with ID: {}", smsId);
                    } catch (Exception e) {
                        logger.error("Failed to send SMS", e);
                    }

                    // Send WhatsApp message (with error handling)
                    try {
                        String whatsappId = whatsappService.sendWhatsappMessage(
                            savedBooking.getMobile(), 
                            "Your booking has been confirmed. View details: " + uploadedFileUrl
                        );
                        logger.info("WhatsApp message sent with ID: {}", whatsappId);
                    } catch (Exception e) {
                        logger.error("Failed to send WhatsApp message", e);
                    }
                } else {
                    logger.warn("PDF generation failed for booking ID: {}", savedBooking.getId());
                }
            } catch (Exception e) {
                logger.error("Error during post-booking processing", e);
                // Continue with booking even if notifications fail
            }

            // Convert to DTO for response
            BookingDto savedDto = new BookingDto();
            savedDto.setId(savedBooking.getId());
            savedDto.setName(savedBooking.getName());
            savedDto.setEmail(savedBooking.getEmail());
            savedDto.setMobile(savedBooking.getMobile());
            savedDto.setProperty_id(savedBooking.getProperty().getId());
            savedDto.setUser_id(savedBooking.getUser().getId());
            savedDto.setPrice(savedBooking.getPrice());
            savedDto.setTotalNight(savedBooking.getTotalNights());
            savedDto.setTotalCost(savedBooking.getTotalCost());
            savedDto.setCheckIn(savedBooking.getCheckIn());
            savedDto.setCheckOut(savedBooking.getCheckOut());

            return savedDto;
        } catch (Exception e) {
            logger.error("Booking creation failed", e);
            throw e;
        }
    }

    // Utility method to convert file to MultipartFile
    private MultipartFile convertToMultipartFile(String filePath) throws IOException {
        File file = new File(filePath);
        FileInputStream input = new FileInputStream(file);
        MultipartFile multipartFile = new MockMultipartFile(
            "file", 
            file.getName(), 
            "application/pdf", 
            input
        );
        input.close();
        return multipartFile;
    }

    public Booking DtoToEntity(BookingDto dto) {
        Booking booking = new Booking();
        booking.setName(dto.getName());
        booking.setEmail(dto.getEmail());
        booking.setMobile(dto.getMobile());
        booking.setPrice(dto.getPrice());
        booking.setTotalNights(dto.getTotalNight());
        booking.setTotalCost(dto.getTotalCost());

        return booking;
    }

    public BookingDto EntityToDto(Booking entity){
        BookingDto dto = new BookingDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        dto.setMobile(entity.getMobile());
        dto.setProperty_id(entity.getProperty().getId());
        dto.setUser_id(entity.getUser().getId());
        dto.setPrice(entity.getPrice());
        dto.setTotalNight(entity.getTotalNights());
        dto.setTotalCost(entity.getTotalCost());
        dto.setCheckIn(entity.getCheckIn());
        dto.setCheckOut(entity.getCheckOut());

        if (entity.getProperty() != null && !entity.getProperty().getImages().isEmpty()) {
            dto.setImageUrl(entity.getProperty().getImages().get(0).getImageUrl()); // Assuming the first image is the main one
        }
        return dto;
    }
    @Override
    public List<BookingDto> getUserBookings(User user) {
        List<Booking> bookings = bookingRepository.findByUser(user);
        return bookings.stream().map(this::EntityToDto).collect(Collectors.toList());
    }
}
