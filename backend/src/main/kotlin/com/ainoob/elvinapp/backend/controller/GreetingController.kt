package com.ainoob.elvinapp.backend.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/greetings")
class GreetingController {
    
    @GetMapping("/today")
    fun getTodayGreeting() = TODO("Implement getting today's greeting")
    
    @PostMapping("/generate")
    fun generateGreeting(
        @RequestParam type: String,
        @RequestParam occasionType: String
    ) = TODO("Implement greeting generation")
    
    @GetMapping("/templates")
    fun getTemplates() = TODO("Implement getting greeting templates")
}
