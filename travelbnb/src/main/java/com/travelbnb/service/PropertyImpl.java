package com.travelbnb.service;
import com.travelbnb.entity.*;
import com.travelbnb.payload.*;
import com.travelbnb.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyImpl implements PropertyService{

    final private PropertyRepository propertyRepository;
    final private CountryRepository countryRepository;
    final private LocationRepository locationRepository;
    final private ImageRepository imageRepository;
    final private ImageService imageService;
    final private FavouriteRepository favouriteRepository;
    final private UserEntityRepository userRepository;
    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    public PropertyImpl(PropertyRepository propertyRepository, CountryRepository countryRepository, LocationRepository locationRepository, ImageRepository imageRepository, ImageService imageService, FavouriteRepository favouriteRepository, UserEntityRepository userRepository) {
        this.propertyRepository = propertyRepository;
        this.countryRepository = countryRepository;
        this.locationRepository = locationRepository;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
        this.favouriteRepository = favouriteRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PropertyDto> searchProperty(String name) {
        List<Property> properties = propertyRepository.searchProperty(name);
        return properties.stream().map(this::EntityToDto).collect(Collectors.toList());
    }
    @Override
    public PropertyDto addProperty(PropertyDto pdto, long countryId, long locationId) {
        Optional<Country> c = countryRepository.findById(countryId);
        Optional<Location> l = locationRepository.findById(locationId);
        Country country = null;
        if (c.isPresent()) {
            country = c.get();
        }
        Location location = null;
        if (l.isPresent()) {
            location = l.get();
        }
        Property entity = DtoToEntity(pdto);
        entity.setCountry(country);
        entity.setLocation(location);
        Property save = propertyRepository.save(entity);
        PropertyDto dto = EntityToDto(entity);
        return dto;
    }

    @Override
    public boolean deleteProperty(Long id) {
        Optional<Property> opprpperty = propertyRepository.findById(id);
        if(opprpperty.isPresent()){
            propertyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public PropertyDto updatePropertyDetails(PropertyDto pdto) {
        Optional<Property> byId = propertyRepository.findById(pdto.getId());
        if(byId.isPresent()){
            Property saved = propertyRepository.save(DtoToEntity(pdto));
            return EntityToDto(saved);
        }
        return null;
    }


    public Property DtoToEntity(PropertyDto pdto) {
        Property entity = new Property();
        entity.setId(pdto.getId());
        entity.setName(pdto.getName());
        entity.setNoGuests(pdto.getNoGuests());
        entity.setNo_bedrooms(pdto.getNo_bedrooms());
        entity.setNo_bathrooms(pdto.getNo_bathrooms());
        entity.setPrice(pdto.getPrice());
        return entity;
    }
    public PropertyDto EntityToDto(Property entity,User user) {
        PropertyDto pdto = new PropertyDto();
        pdto.setId(entity.getId());
        pdto.setName(entity.getName());
        pdto.setNoGuests(entity.getNoGuests());
        pdto.setNo_bedrooms(entity.getNo_bedrooms());
        pdto.setNo_bathrooms(entity.getNo_bathrooms());
        pdto.setPrice(entity.getPrice());
        pdto.setCountry(entity.getCountry().getName());
        pdto.setLocation(entity.getLocation().getName());
        pdto.setDescription(entity.getDescription());
        pdto.setAvgRating(5);
        List<Image> images = imageRepository.findAllByPropertyId(entity.getId());
        if (!images.isEmpty()) {
            List<String> imageUrls = images.stream()
                    .map(Image::getImageUrl) // Extract URLs from the Image entity
                    .collect(Collectors.toList());
            pdto.setImageUrl(imageUrls); // Set the list of URLs
        } else {
            pdto.setImageUrl(Collections.emptyList()); // Set an empty list if no images are found
        }
        if(user != null) {
            Optional<Favourite> favourites = favouriteRepository.findFavourites(user.getId(), entity.getId());
            if(favourites.isPresent()){
                pdto.setIsFavorite(favourites.get().getStatus());
            }else {
                pdto.setIsFavorite(false);
            }
        } else {
            pdto.setIsFavorite(false); // Set the favorite status as false if the user is not logged in
        }
        return pdto;
    }

    public PropertyDto EntityToDto(Property entity) {
        PropertyDto pdto = new PropertyDto();
        pdto.setId(entity.getId());
        pdto.setName(entity.getName());
        pdto.setNoGuests(entity.getNoGuests());
        pdto.setNo_bedrooms(entity.getNo_bedrooms());
        pdto.setNo_bathrooms(entity.getNo_bathrooms());
        pdto.setPrice(entity.getPrice());
        pdto.setCountry(entity.getCountry().getName());
        pdto.setLocation(entity.getLocation().getName());
        pdto.setDescription(entity.getDescription());
        pdto.setAvgRating(5);
        List<Image> images = imageRepository.findAllByPropertyId(entity.getId());
        if (!images.isEmpty()) {
            List<String> imageUrls = images.stream()
                    .map(Image::getImageUrl) // Extract URLs from the Image entity
                    .collect(Collectors.toList());
            pdto.setImageUrl(imageUrls); // Set the list of URLs
        } else {
            pdto.setImageUrl(Collections.emptyList()); // Set an empty list if no images are found
        }
        pdto.setIsFavorite(false); // Set the favorite status as false if the user is not logged in
        return pdto;
    }


    @Override
    public Page<PropertyDto> getAll(int pageSize, int pageNo, String sortBy, String sortDir, User user) {
        PageRequest pageable = null;
        if(sortDir.equalsIgnoreCase("asc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).ascending());
        }else if(sortDir.equalsIgnoreCase("desc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).descending());
        }
        assert pageable != null;
        Page<Property> all = propertyRepository.findAll(pageable);
        List<Property> content = all.getContent();
        return all.map(p->EntityToDto(p, user));
    }

    @Override
    public FormDto addNewProperty(FormDto fdto, MultipartFile[] files, User user) {
        // Verify and save the country if it does not exist
        if (verifyCountry(fdto.getCountry()) == null) {
            Country country = new Country();
            country.setName(fdto.getCountry());
            countryRepository.save(country);
        }

        // Verify and save the location if it does not exist
        if (verifyLocation(fdto.getLocation()) == null) {
            Location location = new Location();
            location.setName(fdto.getLocation());
            locationRepository.save(location);
        }

        // Create and save a new property
        Property property = new Property();
        property.setName(fdto.getName());
        property.setNoGuests(fdto.getNoGuests());
        property.setNo_bedrooms(fdto.getNo_bedrooms());
        property.setNo_bathrooms(fdto.getNo_bathrooms());
        property.setPrice(fdto.getPrice());
        property.setCountry(verifyCountry(fdto.getCountry()));
        property.setLocation(verifyLocation(fdto.getLocation()));
        property.setDescription(fdto.getDescription());
        property.setUser(user);

        if (fdto.getFacilities() != null){
            property.setFacilities(new HashSet<>(fdto.getFacilities()));
        }

        Property savedProperty = propertyRepository.save(property);

        // Create a DTO to return
        FormDto formDto = new FormDto();
        formDto.setId(savedProperty.getId());
        formDto.setName(savedProperty.getName());
        formDto.setNoGuests(savedProperty.getNoGuests());
        formDto.setNo_bedrooms(savedProperty.getNo_bedrooms());
        formDto.setNo_bathrooms(savedProperty.getNo_bathrooms());
        formDto.setPrice(savedProperty.getPrice());
        formDto.setCountry(savedProperty.getCountry().getName());
        formDto.setLocation(savedProperty.getLocation().getName());
        formDto.setDescription(savedProperty.getDescription());
        formDto.setFacilities(savedProperty.getFacilities());
        formDto.setUser(new UserDto(user.getId(), user.getName(), user.getUsername(), user.getEmail(), user.getRole())); // Map only required fields

        // Handle file uploads and map to image DTOs
        if (files != null && files.length > 0) {
            List<ImageDto> imageDtos = new ArrayList<>();
            for (MultipartFile file : files) {
                ImageDto imageDto = imageService.uploadImageFile(file, bucketName, savedProperty.getId());
                imageDtos.add(imageDto);
            }
            formDto.setImage_url(imageDtos);
        }

        return formDto;
    }


    public Country verifyCountry(String country_name){
        Optional<Country> byName = countryRepository.findByName(country_name);
        return byName.orElse(null);
    }

    public Location verifyLocation(String location_name){
        Optional<Location> byName = locationRepository.findByName(location_name);
        return byName.orElse(null);
    }
    public PropertyDto getPropertyById(Long id) {
        Optional<Property> property = propertyRepository.findById(id);
        if(property.isPresent()){
            PropertyDto propertyDto = EntityToDto(property.get());
            User user = property.get().getUser();
            propertyDto.setUser(new UserDto(user.getId(), user.getName(),user.getUsername(),user.getEmail(),user.getRole()));
            return propertyDto;
        }else{
            throw( new RuntimeException("Property not found with ID: " + id));
        }
    }


}