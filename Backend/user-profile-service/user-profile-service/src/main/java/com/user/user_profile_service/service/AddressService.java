package com.user.user_profile_service.service;

import com.user.user_profile_service.dto.CreateAddressRequest;
import com.user.user_profile_service.entity.Address;
import com.user.user_profile_service.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AddressService {

    @Autowired
    AddressRepository addressRepository;

    public Address addAddress(UUID userId, CreateAddressRequest req) {
        // If default address requested, unset current default
        if (req.isDefault()) {
            addressRepository.findByUserIdAndDefaultAddress(userId, true)
                    .ifPresent(addr -> {
                        addr.setDefaultAddress(false);
                        addressRepository.save(addr);
                    });
        }

        Address addr = new Address();
        addr.setUserId(userId);
        addr.setLabel(req.label());
        addr.setAddressLine1(req.addressLine1());
        addr.setAddressLine2(req.addressLine2());
        addr.setCity(req.city());
        addr.setState(req.state());
        addr.setCountry(req.country());
        addr.setPincode(req.pincode());
        addr.setPhone(req.phone());
        addr.setDefaultAddress(req.isDefault());

        return addressRepository.save(addr);
    }

    public List<Address> listAddresses(UUID userId) {
        return addressRepository.findByUserId(userId);
    }


    /* UPDATE */
    public Address updateAddress(
            UUID userId,
            UUID addressId,
            CreateAddressRequest req
    ) {
        Address existing = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Ownership check
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        // Handle default address logic
        if (req.isDefault()) {
            addressRepository.findByUserIdAndDefaultAddress(userId, true)
                    .ifPresent(addr -> {
                        if (!addr.getId().equals(addressId)) {
                            addr.setDefaultAddress(false);
                            addressRepository.save(addr);
                        }
                    });
        }

        existing.setLabel(req.label());
        existing.setAddressLine1(req.addressLine1());
        existing.setAddressLine2(req.addressLine2());
        existing.setCity(req.city());
        existing.setState(req.state());
        existing.setCountry(req.country());
        existing.setPincode(req.pincode());
        existing.setPhone(req.phone());

        existing.setDefaultAddress(req.isDefault());
        System.out.println("PHONE = " + req.phone());


        return addressRepository.save(existing);
    }

    /* DELETE */
    public void deleteAddress(UUID userId, UUID addressId) {
        Address existing = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        // Ownership check
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        addressRepository.delete(existing);
    }






}
