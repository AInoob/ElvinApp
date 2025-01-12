package com.ainoob.elvinapp.backend.controller.impl

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.service.GreetingService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/greetings")
class GreetingControllerImpl(
    private val greetingService: GreetingService
) {
    
    @GetMapping("/today")
    fun getTodayGreeting(): GeneratedGreeting? =
        greetingService.getTodayGreeting()
    
    @PostMapping("/generate")
    fun generateGreeting(
        @RequestParam type: String,
        @RequestParam occasionType: String
    ): GeneratedGreeting =
        greetingService.generateGreeting(type, occasionType)
    
    @GetMapping("/templates")
    fun getTemplates(): List<GreetingTemplate> =
        greetingService.getTemplates()
}
