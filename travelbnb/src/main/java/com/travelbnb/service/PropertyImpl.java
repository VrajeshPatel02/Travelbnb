package com.travelbnb.service;
import com.travelbnb.entity.Country;
import com.travelbnb.entity.Image;
import com.travelbnb.entity.Location;
import com.travelbnb.entity.Property;
import com.travelbnb.payload.FormDto;
import com.travelbnb.payload.ImageDto;
import com.travelbnb.payload.PropertyDto;
import com.travelbnb.repository.CountryRepository;
import com.travelbnb.repository.ImageRepository;
import com.travelbnb.repository.LocationRepository;
import com.travelbnb.repository.PropertyRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PropertyImpl implements PropertyService{

    private PropertyRepository propertyRepository;
    private CountryRepository countryRepository;
    private LocationRepository locationRepository;
    private ImageRepository imageRepository;
    private ImageService imageService;

    public PropertyImpl(PropertyRepository propertyRepository, CountryRepository countryRepository, LocationRepository locationRepository, ImageRepository imageRepository, ImageService imageService) {
        this.propertyRepository = propertyRepository;
        this.countryRepository = countryRepository;
        this.locationRepository = locationRepository;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
    }

    @Override
    public List<PropertyDto> searchProperty(String name, int pageSize, int pageNo, String sortBy, String sortDir) {
        PageRequest pageable = null;
        if(sortDir.equalsIgnoreCase("asc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).ascending());
        }else if(sortDir.equalsIgnoreCase("desc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).descending());
        }
        Page<Property> allprop = propertyRepository.searchProperty(name,pageable);
        List<Property> pue = allprop.getContent();
        List<PropertyDto> pud =pue.stream().map( p-> EntityToDto(p)).collect(Collectors.toList());
        return pud;
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
    public PropertyDto EntityToDto(Property entity){
        PropertyDto pdto = new PropertyDto();
        pdto.setId(entity.getId());
        pdto.setName(entity.getName());
        pdto.setNoGuests(entity.getNoGuests());
        pdto.setNo_bedrooms(entity.getNo_bedrooms());
        pdto.setNo_bathrooms(entity.getNo_bathrooms());
        pdto.setPrice(entity.getPrice());
        pdto.setCountry(entity.getCountry().getId());
        pdto.setLocation(entity.getLocation().getId());

        Optional<Image> byId = imageRepository.findById(entity.getId());
        if (byId.isPresent()){
            pdto.setImage_url(byId.get().getImageUrl());
        }else {
            pdto.setImage_url("");
        }
        return pdto;
    }

    @Override
    public List<PropertyDto> getAll(int pageSize, int pageNo, String sortBy, String sortDir) {
        PageRequest pageable = null;
        if(sortDir.equalsIgnoreCase("asc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).ascending());
        }else if(sortDir.equalsIgnoreCase("desc")){
            pageable = PageRequest.of(pageNo,pageSize, Sort.by(sortBy).descending());
        }
        assert pageable != null;
        Page<Property> all = propertyRepository.findAll(pageable);
        List<Property> content = all.getContent();
        return all.stream().map(this::EntityToDto).collect(Collectors.toList());
    }

    @Override
    public FormDto addNewProperty(FormDto fdto, MultipartFile file) {
        if(verifyCountry(fdto.getCountry()) == null) {
            Country country = new Country();
            country.setName(fdto.getCountry());
            Country savedCountry = countryRepository.save(country);

        };
        if(verifyLocation(fdto.getLocation()) == null) {
            Location location = new Location();
            location.setName(fdto.getLocation());
            Location savedLocation = locationRepository.save(location);
        }
        FormDto formDto = new FormDto();


//        ImageDto imageDetails = imageService.uploadImageFile(file, "travelbnb123");
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

}
