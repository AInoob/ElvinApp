package com.ainoob.elvinapp.backend.service.impl

import com.ainoob.elvinapp.backend.model.*
import com.ainoob.elvinapp.backend.repository.*
import com.ainoob.elvinapp.backend.service.GreetingService
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID
import org.json.JSONObject

@Service
class GreetingServiceImpl(
    private val greetingTemplateRepository: GreetingTemplateRepository,
    private val generatedGreetingRepository: GeneratedGreetingRepository,
    private val solarTermRepository: SolarTermRepository,
    private val traditionalHolidayRepository: TraditionalHolidayRepository
) : GreetingService {

    private val dateFormatter = DateTimeFormatter.ofPattern("MMdd")

    override fun getTodayGreeting(): GeneratedGreeting? {
        val today = LocalDate.now().format(dateFormatter)
        return generatedGreetingRepository.findAll().find { it.date == today }
    }

    override fun generateGreeting(type: String, occasionType: String): GeneratedGreeting {
        val today = LocalDate.now().format(dateFormatter)
        
        // Find today's special occasion
        val occasion = when (occasionType) {
            "solar-term" -> solarTermRepository.findAll().find { it.date == today }
            "traditional-holiday" -> traditionalHolidayRepository.findAll().find { it.date == today }
            else -> throw IllegalArgumentException("Invalid occasion type")
        } ?: throw IllegalStateException("No $occasionType found for today")

        // Find appropriate template
        val template = greetingTemplateRepository.findAll()
            .find { it.type == type && it.occasionType == occasionType }
            ?: throw IllegalStateException("No template found for type: $type and occasion: $occasionType")

        // Generate greeting content
        val variables = JSONObject(template.variables ?: "{}")
        when (occasionType) {
            "solar-term" -> variables.put("solar_term", occasion.name)
            "traditional-holiday" -> variables.put("holiday", occasion.name)
        }
        
        val content = template.templateContent.format(variables)

        // Create and save greeting
        return GeneratedGreeting(
            id = UUID.randomUUID().toString(),
            date = today,
            occasionId = occasion.id,
            occasionType = occasionType,
            content = content,
            type = type
        ).also { generatedGreetingRepository.save(it) }
    }

    override fun getTemplates(): List<GreetingTemplate> =
        greetingTemplateRepository.findAll()
}
