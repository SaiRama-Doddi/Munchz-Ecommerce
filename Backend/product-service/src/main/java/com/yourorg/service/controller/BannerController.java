package com.yourorg.service.controller;

import com.yourorg.service.entity.Banner;
import com.yourorg.service.service.BannerService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;

    public BannerController(BannerService bannerService) {
        this.bannerService = bannerService;
    }

    @GetMapping
    public List<Banner> getAll() {
        return bannerService.getAllBanners();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<Banner> save(@RequestBody List<Banner> banners) {
        return bannerService.saveBanners(banners);
    }
}
