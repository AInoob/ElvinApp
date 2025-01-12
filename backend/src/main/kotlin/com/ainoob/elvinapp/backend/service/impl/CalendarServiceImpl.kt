package com.ainoob.elvinapp.backend.service.impl

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.repository.*
import com.ainoob.elvinapp.backend.service.CalendarService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Service
class CalendarServiceImpl(
    private val solarTermRepository: SolarTermRepository,
    private val traditionalHolidayRepository: TraditionalHolidayRepository
) : CalendarService {

    private val dateFormatter = DateTimeFormatter.ofPattern("MMdd")

    override fun getTodaySpecialDates(): Pair<SolarTerm?, TraditionalHoliday?> {
        val today = LocalDate.now().format(dateFormatter)
        val solarTerm = solarTermRepository.findAll().find { it.date == today }
        val holiday = traditionalHolidayRepository.findAll().find { it.date == today }
        return Pair(solarTerm, holiday)
    }

    override fun getAllSolarTerms(): List<SolarTerm> = 
        solarTermRepository.findAll()

    override fun getAllTraditionalHolidays(): List<TraditionalHoliday> = 
        traditionalHolidayRepository.findAll()
}
