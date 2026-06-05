package com.yourorg.service.service;

import com.yourorg.service.entity.Banner;
import com.yourorg.service.repository.BannerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BannerService {

    private final BannerRepository bannerRepository;

    public BannerService(BannerRepository bannerRepository) {
        this.bannerRepository = bannerRepository;
    }

    public List<Banner> getAllBanners() {
        return bannerRepository.findAll();
    }

    @Transactional
    public List<Banner> saveBanners(List<Banner> banners) {
        // Delete all existing banners to replace them with the new order/list
        bannerRepository.deleteAll();
        
        // Clear IDs so they are treated as new inserts (prevents OptimisticLockingFailureException)
        if (banners != null) {
            for (Banner banner : banners) {
                banner.setId(null);
            }
        }
        
        // Save the new list
        return bannerRepository.saveAll(banners);
    }
}
