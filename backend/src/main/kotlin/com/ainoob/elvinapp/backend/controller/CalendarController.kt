package com.ainoob.elvinapp.backend.controller

import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/calendar")
class CalendarController {
    
    @GetMapping("/today")
    fun getToday() = TODO("Implement getting today's special dates")
    
    @GetMapping("/solar-terms")
    fun getSolarTerms() = TODO("Implement getting all solar terms")
    
    @GetMapping("/traditional-holidays")
    fun getTraditionalHolidays() = TODO("Implement getting all traditional holidays")
}
