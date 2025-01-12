package com.ainoob.elvinapp.backend.controller.impl

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.service.CalendarService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/calendar")
class CalendarControllerImpl(
    private val calendarService: CalendarService
) {
    
    @GetMapping("/today")
    fun getToday(): Map<String, Any?> {
        val (solarTerm, holiday) = calendarService.getTodaySpecialDates()
        return mapOf(
            "solar_term" to solarTerm,
            "traditional_holiday" to holiday
        )
    }
    
    @GetMapping("/solar-terms")
    fun getSolarTerms(): List<SolarTerm> =
        calendarService.getAllSolarTerms()
    
    @GetMapping("/traditional-holidays")
    fun getTraditionalHolidays(): List<TraditionalHoliday> =
        calendarService.getAllTraditionalHolidays()
}
