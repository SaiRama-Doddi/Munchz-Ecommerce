package com.munchz.notification.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notify")
public class NotifyController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/order")
    public void sendOrderNotification(@RequestBody String message) {
        messagingTemplate.convertAndSend("/topic/orders", message);
    }

    @PostMapping("/broadcast")
    public void broadcast(@RequestBody String message) {
        messagingTemplate.convertAndSend("/topic/updates", message);
    }
}
