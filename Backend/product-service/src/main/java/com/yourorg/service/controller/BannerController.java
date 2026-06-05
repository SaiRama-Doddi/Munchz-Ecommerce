package com.yourorg.service.controller;

import com.yourorg.service.entity.Banner;
import com.yourorg.service.service.BannerService;
import com.yourorg.service.util.NotificationUtil;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
public class BannerController {

    private final BannerService bannerService;
    private final NotificationUtil notificationUtil;

    public BannerController(BannerService bannerService, NotificationUtil notificationUtil) {
        this.bannerService = bannerService;
        this.notificationUtil = notificationUtil;
    }

    @GetMapping
    public List<Banner> getAll() {
        return bannerService.getAllBanners();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public List<Banner> save(@RequestBody List<Banner> banners) {
        List<Banner> result = bannerService.saveBanners(banners);
        notificationUtil.sendNotification("BANNER_UPDATE");
        return result;
    }
}
