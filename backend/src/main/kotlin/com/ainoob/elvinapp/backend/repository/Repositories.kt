package com.ainoob.elvinapp.backend.repository

import com.ainoob.elvinapp.backend.model.*
import org.springframework.data.jpa.repository.JpaRepository

interface SolarTermRepository : JpaRepository<SolarTerm, String>

interface TraditionalHolidayRepository : JpaRepository<TraditionalHoliday, String>

interface GreetingTemplateRepository : JpaRepository<GreetingTemplate, String>

interface GeneratedGreetingRepository : JpaRepository<GeneratedGreeting, String>
