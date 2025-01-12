package com.ainoob.elvinapp.backend.service

import com.ainoob.elvinapp.backend.model.*
import java.time.LocalDate

interface CalendarService {
    fun getTodaySpecialDates(): Pair<SolarTerm?, TraditionalHoliday?>
    fun getAllSolarTerms(): List<SolarTerm>
    fun getAllTraditionalHolidays(): List<TraditionalHoliday>
}
